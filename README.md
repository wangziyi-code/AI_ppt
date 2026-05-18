# AIPPT - AI-Powered Presentation Generator

English | [中文](./README_zh.md)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

AIPPT is an AI-powered presentation generator that combines a modern Next.js frontend with the [DeerFlow](https://github.com/bytedance/deer-flow) super agent backend. Users simply enter a topic, choose a visual style, and the AI automatically generates a professional PPT presentation — complete with content, images, and polished design.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Set Up the Backend (DeerFlow)](#2-set-up-the-backend-deerflow)
  - [3. Set Up the Frontend](#3-set-up-the-frontend)
  - [4. Access the Application](#4-access-the-application)
- [Configuration](#configuration)
  - [Model Configuration](#model-configuration)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [PPT Styles](#ppt-styles)
- [Supported Models](#supported-models)
- [API Reference](#api-reference)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **AI-Driven Content Generation** — Enter a topic and get a complete, structured presentation with well-organized slides
- **8 Visual Styles** — Choose from Glassmorphism, Dark Premium, Gradient Modern, Neo Brutalist, 3D Isometric, Editorial, Minimal Swiss, and Keynote styles
- **Multi-Language Support** — Full Chinese and English interface with i18n
- **Multiple LLM Providers** — Supports DeepSeek, GLM-4, Tongyi Qianwen, GPT-4o, Claude, and any OpenAI-compatible API
- **Customizable Slide Count** — Generate presentations with 5 to 30 slides
- **Real-Time Progress Tracking** — Live status updates showing research, content generation, image generation, and assembly stages
- **Streaming Response** — SSE-based streaming for real-time content delivery
- **DeerFlow Agent Backend** — Powered by ByteDance's DeerFlow 2.0 super agent harness with sub-agents, sandbox execution, and extensible skills
- **Modern UI** — Glassmorphism design with animated floating lines, gradient mesh orbs, and smooth transitions

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AIPPT Frontend                        │
│              Next.js 16 + React 19 + Zustand             │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │TopicInput│  │StyleSel. │  │ModelSel. │  │Progress │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       └──────────────┴─────────────┴─────────────┘      │
│                         │ SSE Stream                     │
└─────────────────────────┼───────────────────────────────┘
                          │ /api proxy
┌─────────────────────────┼───────────────────────────────┐
│                    DeerFlow Backend                      │
│                 Python + LangGraph + FastAPI              │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Gateway  │  │  Agent   │  │ Sandbox  │  │ Skills  │ │
│  │  API     │  │ Runtime  │  │ (Docker) │  │         │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Memory  │  │  Tools   │  │  MCP     │              │
│  │          │  │ (search, │  │ Servers  │              │
│  │          │  │  fetch)  │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │   LLM Providers       │
              │  DeepSeek / GPT-4o /  │
              │  Claude / GLM / Qwen  │
              └───────────────────────┘
```

The frontend communicates with the DeerFlow backend via Next.js API proxy (`/api/*` → `localhost:8001`), which handles authentication, CSRF protection, and SSE streaming.

## Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Utility-first CSS |
| **Zustand** | Lightweight state management |
| **Three.js** | 3D floating line animations |
| **shadcn/ui** | UI component primitives |

### Backend

| Technology | Purpose |
|-----------|---------|
| **Python 3.12+** | Backend runtime |
| **LangGraph** | Multi-agent orchestration |
| **LangChain** | LLM integration framework |
| **FastAPI** | HTTP Gateway API |
| **Docker** | Sandbox execution environment |

## Project Structure

```
AIPPT/
├── README.md                     # This file
├── aippt-frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout with fonts
│   │   │   ├── page.tsx          # Main page component
│   │   │   ├── globals.css       # Global styles & design tokens
│   │   │   └── favicon.ico
│   │   ├── components/
│   │   │   ├── FloatingLines/    # 3D animated background
│   │   │   │   ├── FloatingLines.tsx
│   │   │   │   └── FloatingLines.css
│   │   │   ├── GenerateButton.tsx # Generate action button
│   │   │   ├── LanguageSwitch.tsx # EN/ZH language toggle
│   │   │   ├── ModelSelector.tsx  # LLM model picker
│   │   │   ├── ModelSettings.tsx  # Model config dialog
│   │   │   ├── ProgressBar.tsx    # Generation progress display
│   │   │   ├── SlideCountSelect.tsx # Slide count picker
│   │   │   ├── StyleSelector.tsx  # PPT style picker
│   │   │   └── TopicInput.tsx     # Topic text input
│   │   ├── lib/
│   │   │   ├── api.ts            # API client (auth, SSE, threads)
│   │   │   ├── i18n.ts           # Internationalization (zh/en)
│   │   │   ├── models.ts         # Model definitions & localStorage
│   │   │   ├── styles.ts         # PPT style definitions
│   │   │   └── utils.ts          # Utility functions
│   │   └── store/
│   │       └── generate.ts       # Zustand state store
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   └── eslint.config.mjs
│
└── deer-flow/                    # DeerFlow 2.0 backend (submodule)
    ├── backend/
    │   ├── app/
    │   │   ├── gateway/          # FastAPI Gateway (auth, routes, middleware)
    │   │   └── channels/         # IM channel integrations
    │   ├── packages/
    │   │   └── harness/          # Core agent harness
    │   ├── docs/                 # Backend documentation
    │   └── tests/                # Backend tests
    ├── skills/                   # Agent skills (PPT, research, etc.)
    ├── config.yaml               # DeerFlow configuration
    ├── Makefile                  # Build & run commands
    └── docker-compose*.yml       # Docker configurations
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 22+** and **pnpm** (or npm/yarn)
- **Python 3.12+** with **uv** package manager
- **Docker** (recommended for sandbox execution)
- **Git**
- An API key from at least one LLM provider (DeepSeek, OpenAI, Anthropic, etc.)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/AIPPT.git
cd AIPPT
```

### 2. Set Up the Backend (DeerFlow)

```bash
cd deer-flow

# Run the interactive setup wizard
make setup

# Or manually configure
make config        # Generate config files
# Edit config.yaml with your model settings
# Edit .env with your API keys

# Check dependencies
make check

# Install dependencies
make install

# Start the backend (Docker, recommended)
make docker-init
make docker-start

# Or start locally
make dev
```

The backend will be available at `http://localhost:2026` (Docker) or `http://localhost:8001` (local Gateway API).

See [deer-flow/README.md](./deer-flow/README.md) for detailed backend setup instructions.

### 3. Set Up the Frontend

```bash
cd aippt-frontend

# Install dependencies
pnpm install       # or npm install / yarn install

# Start development server
pnpm dev           # or npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 4. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser. The frontend proxies API requests to the DeerFlow backend automatically.

## Configuration

### Model Configuration

The frontend comes with pre-configured models. You can also add custom models via the UI (Model Settings dialog) which are persisted in `localStorage`.

**Default Models:**

| Model | Provider | Base URL |
|-------|----------|----------|
| DeepSeek V3 | DeepSeek | `https://api.deepseek.com/v1` |
| GLM-4 Plus | Zhipu AI | `https://open.bigmodel.cn/api/paas/v4` |
| Qwen Max | Alibaba Cloud | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| GPT-4o | OpenAI | `https://api.openai.com/v1` |
| Claude Sonnet 4 | Anthropic | `https://api.anthropic.com/v1` |

For backend model configuration, edit `deer-flow/config.yaml`:

```yaml
models:
  - name: deepseek-chat
    display_name: DeepSeek V3
    use: langchain_openai:ChatOpenAI
    model: deepseek-chat
    api_key: $DEEPSEEK_API_KEY
    max_tokens: 4096
    temperature: 0.7
```

### Environment Variables

Create a `.env` file in `deer-flow/` with your API keys:

```bash
# Required: LLM API key (use at least one)
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Optional: Web search
TAVILY_API_KEY=your-tavily-api-key

# Optional: Observability
LANGSMITH_TRACING=false
LANGSMITH_API_KEY=your-langsmith-api-key
```

## Usage

1. **Enter a Topic** — Type your presentation topic in the input field (e.g., "2024 AI Industry Trends")
2. **Choose a Style** — Select from 8 visual styles with live previews
3. **Select a Model** — Pick your preferred LLM from the model selector
4. **Set Slide Count** — Choose between 5 and 30 slides
5. **Generate** — Click "Generate" and watch the real-time progress
6. **Download** — Once complete, download your PPT file

The generation pipeline follows these stages:

```
Researching Topic → Generating Content → Generating Images → Assembling PPT → Complete
```

## PPT Styles

| Style | Description |
|-------|-------------|
| **Glassmorphism** | Frosted glass effects, blur, gradient backgrounds |
| **Dark Premium** | Rich black backgrounds with luminous accents |
| **Gradient Modern** | Bold mesh gradients, Stripe/Linear aesthetic |
| **Neo Brutalist** | Raw bold typography, high contrast, anti-design |
| **3D Isometric** | Clean isometric illustrations, soft shadows, depth |
| **Editorial** | Magazine layouts, Vogue/Bloomberg elegance |
| **Minimal Swiss** | Grid-based precision, Helvetica-inspired restraint |
| **Keynote** | Apple WWDC aesthetic, dramatic visual storytelling |

## Supported Models

AIPPT works with any LLM that implements the OpenAI-compatible API. Tested providers:

- **DeepSeek** — DeepSeek V3 (recommended for cost-effectiveness)
- **OpenAI** — GPT-4o, GPT-4, GPT-3.5-turbo
- **Anthropic** — Claude Sonnet 4, Claude 3.5 Sonnet
- **Zhipu AI** — GLM-4 Plus
- **Alibaba Cloud** — Qwen Max, Qwen Plus
- **OpenRouter** — Any model available on OpenRouter
- **vLLM** — Self-hosted open-source models

## API Reference

The frontend communicates with the DeerFlow Gateway API through Next.js proxy routes:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login/local` | POST | Auto-login with default credentials |
| `/api/v1/auth/me` | GET | Check authentication status |
| `/api/threads` | POST | Create a new conversation thread |
| `/api/threads/{id}/runs/stream` | POST | Stream agent execution (SSE) |
| `/api/threads/{id}/artifacts/{path}` | GET | Download generated artifacts |

### SSE Stream Events

The generation endpoint streams events in the following format:

```json
{"event": "on_chain_start", "data": {...}}      // Status: researching
{"event": "on_chat_model_stream", "data": {...}} // Content streaming
{"event": "on_tool_start", "name": "..."}        // Status: generating_images
```

## Development

### Frontend Development

```bash
cd aippt-frontend

# Development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

### Backend Development

```bash
cd deer-flow

# Local development with hot reload
make dev

# Docker development
make docker-start

# Run tests
make test

# Check setup
make doctor
```

### Key Development Notes

- The frontend uses Next.js API proxy to avoid CORS issues — all `/api/*` requests are forwarded to the DeerFlow backend
- Authentication is handled automatically via the `ensureAuth()` function in `src/lib/api.ts`
- CSRF tokens are included in state-changing requests via the `X-CSRF-Token` header
- Model configurations are stored in `localStorage` under `aippt-models` and `aippt-selected-model` keys
- The Zustand store (`src/store/generate.ts`) manages all generation state

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Auto-login failed"** | Ensure DeerFlow backend is running on `localhost:8001` |
| **"No response body"** | Check that the backend sandbox is properly initialized |
| **Generation hangs** | Check backend logs; ensure LLM API key is valid |
| **Build fails** | Run `pnpm install` to ensure all dependencies are installed |
| **CORS errors** | The frontend proxies through Next.js — ensure you access via `localhost:3000`, not a direct port |
| **Docker permission denied** | On Linux, add your user to the `docker` group: `sudo usermod -aG docker $USER` |

## License

This project is open source and available under the [MIT License](./LICENSE).

## Acknowledgments

- **[DeerFlow](https://github.com/bytedance/deer-flow)** — The super agent harness that powers the backend, developed by ByteDance
- **[LangChain](https://github.com/langchain-ai/langchain)** — LLM interaction framework
- **[LangGraph](https://github.com/langchain-ai/langgraph)** — Multi-agent orchestration
- **[Next.js](https://nextjs.org)** — React framework for the frontend
- **[shadcn/ui](https://ui.shadcn.com)** — UI component primitives
