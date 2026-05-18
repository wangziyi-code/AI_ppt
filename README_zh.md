# AIPPT - AI 驱动的演示文稿生成器

[English](./README.md) | 中文

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

AIPPT 是一款 AI 驱动的演示文稿生成器，将现代化的 Next.js 前端与 [DeerFlow](https://github.com/bytedance/deer-flow) 超级代理后端相结合。用户只需输入主题、选择视觉风格，AI 即可自动生成一份专业的 PPT 演示文稿——包含完整内容、配图和精美设计。

## 目录

- [功能特性](#功能特性)
- [系统架构](#系统架构)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
  - [1. 克隆仓库](#1-克隆仓库)
  - [2. 配置后端（DeerFlow）](#2-配置后端deerflow)
  - [3. 配置前端](#3-配置前端)
  - [4. 访问应用](#4-访问应用)
- [配置说明](#配置说明)
  - [模型配置](#模型配置)
  - [环境变量](#环境变量)
- [使用方法](#使用方法)
- [PPT 风格](#ppt-风格)
- [支持的模型](#支持的模型)
- [API 参考](#api-参考)
- [开发指南](#开发指南)
- [常见问题](#常见问题)
- [许可证](#许可证)
- [致谢](#致谢)

## 功能特性

- **AI 驱动内容生成** — 输入主题，自动生成结构完整、组织良好的演示文稿
- **8 种视觉风格** — 毛玻璃、深色奢华、渐变现代、新粗野主义、3D 等距、编辑风格、极简瑞士、主题演讲
- **多语言支持** — 完整的中英文界面，内置 i18n 国际化
- **多模型提供商** — 支持 DeepSeek、GLM-4、通义千问、GPT-4o、Claude 及任意 OpenAI 兼容 API
- **自定义页数** — 可生成 5 到 30 页的演示文稿
- **实时进度追踪** — 实时展示调研、内容生成、图片生成、组装等阶段状态
- **流式响应** — 基于 SSE 的实时内容推送
- **DeerFlow 代理后端** — 由字节跳动 DeerFlow 2.0 超级代理引擎驱动，支持子代理、沙箱执行和可扩展技能
- **现代化 UI** — 毛玻璃设计风格，配合动画浮动线条、渐变光晕和流畅过渡效果

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                   AIPPT 前端                              │
│             Next.js 16 + React 19 + Zustand              │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │主题输入   │  │风格选择   │  │模型选择   │  │进度显示  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       └──────────────┴─────────────┴─────────────┘      │
│                         │ SSE 流                         │
└─────────────────────────┼───────────────────────────────┘
                          │ /api 代理
┌─────────────────────────┼───────────────────────────────┐
│                  DeerFlow 后端                            │
│              Python + LangGraph + FastAPI                 │
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
              │    LLM 模型提供商      │
              │  DeepSeek / GPT-4o /  │
              │  Claude / GLM / Qwen  │
              └───────────────────────┘
```

前端通过 Next.js API 代理（`/api/*` → `localhost:8001`）与 DeerFlow 后端通信，代理层负责处理认证、CSRF 保护和 SSE 流式传输。

## 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| **Next.js 16** | React 框架，使用 App Router |
| **React 19** | UI 库 |
| **TypeScript 5** | 类型安全 |
| **Tailwind CSS 4** | 工具优先的 CSS 框架 |
| **Zustand** | 轻量级状态管理 |
| **Three.js** | 3D 浮动线条动画 |
| **shadcn/ui** | UI 组件基础库 |

### 后端

| 技术 | 用途 |
|------|------|
| **Python 3.12+** | 后端运行时 |
| **LangGraph** | 多代理编排 |
| **LangChain** | LLM 集成框架 |
| **FastAPI** | HTTP Gateway API |
| **Docker** | 沙箱执行环境 |

## 项目结构

```
AIPPT/
├── README.md                     # 英文文档
├── README_zh.md                  # 中文文档（本文件）
├── aippt-frontend/               # Next.js 前端应用
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # 根布局，配置字体
│   │   │   ├── page.tsx          # 主页面组件
│   │   │   ├── globals.css       # 全局样式 & 设计令牌
│   │   │   └── favicon.ico
│   │   ├── components/
│   │   │   ├── FloatingLines/    # 3D 动画背景
│   │   │   │   ├── FloatingLines.tsx
│   │   │   │   └── FloatingLines.css
│   │   │   ├── GenerateButton.tsx # 生成按钮
│   │   │   ├── LanguageSwitch.tsx # 中英文切换
│   │   │   ├── ModelSelector.tsx  # 模型选择器
│   │   │   ├── ModelSettings.tsx  # 模型配置对话框
│   │   │   ├── ProgressBar.tsx    # 生成进度显示
│   │   │   ├── SlideCountSelect.tsx # 幻灯片页数选择
│   │   │   ├── StyleSelector.tsx  # PPT 风格选择
│   │   │   └── TopicInput.tsx     # 主题输入框
│   │   ├── lib/
│   │   │   ├── api.ts            # API 客户端（认证、SSE、线程）
│   │   │   ├── i18n.ts           # 国际化（中文/英文）
│   │   │   ├── models.ts         # 模型定义 & localStorage 持久化
│   │   │   ├── styles.ts         # PPT 风格定义
│   │   │   └── utils.ts          # 工具函数
│   │   └── store/
│   │       └── generate.ts       # Zustand 状态管理
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   └── eslint.config.mjs
│
└── deer-flow/                    # DeerFlow 2.0 后端
    ├── backend/
    │   ├── app/
    │   │   ├── gateway/          # FastAPI Gateway（认证、路由、中间件）
    │   │   └── channels/         # IM 渠道集成
    │   ├── packages/
    │   │   └── harness/          # 核心代理引擎
    │   ├── docs/                 # 后端文档
    │   └── tests/                # 后端测试
    ├── skills/                   # 代理技能（PPT、调研等）
    ├── config.yaml               # DeerFlow 配置文件
    ├── Makefile                  # 构建 & 运行命令
    └── docker-compose*.yml       # Docker 配置
```

## 环境要求

在开始之前，请确保已安装以下工具：

- **Node.js 22+** 及 **pnpm**（或 npm/yarn）
- **Python 3.12+** 及 **uv** 包管理器
- **Docker**（推荐用于沙箱执行）
- **Git**
- 至少一个 LLM 提供商的 API Key（DeepSeek、OpenAI、Anthropic 等）

## 快速开始

### 1. 克隆仓库

```bash
git clone git@github.com:wangziyi-code/AI_ppt.git
cd AI_ppt
```

### 2. 配置后端（DeerFlow）

```bash
cd deer-flow

# 运行交互式配置向导
make setup

# 或手动配置
make config        # 生成配置文件
# 编辑 config.yaml 设置模型
# 编辑 .env 填入 API Key

# 检查依赖环境
make check

# 安装依赖
make install

# 启动后端（推荐 Docker 方式）
make docker-init
make docker-start

# 或本地启动
make dev
```

后端将在 `http://localhost:2026`（Docker）或 `http://localhost:8001`（本地 Gateway API）运行。

详细配置请参阅 [deer-flow/README.md](./deer-flow/README_zh.md)。

### 3. 配置前端

```bash
cd aippt-frontend

# 安装依赖
pnpm install       # 或 npm install / yarn install

# 启动开发服务器
pnpm dev           # 或 npm run dev
```

前端将在 `http://localhost:3000` 运行。

### 4. 访问应用

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。前端会自动将 API 请求代理到 DeerFlow 后端。

## 配置说明

### 模型配置

前端内置了预配置的模型，也可以通过 UI 界面（模型设置对话框）添加自定义模型，配置会持久化到 `localStorage`。

**默认模型：**

| 模型 | 提供商 | Base URL |
|------|--------|----------|
| DeepSeek V3 | DeepSeek | `https://api.deepseek.com/v1` |
| GLM-4 Plus | 智谱 AI | `https://open.bigmodel.cn/api/paas/v4` |
| 通义千问 Max | 阿里云 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| GPT-4o | OpenAI | `https://api.openai.com/v1` |
| Claude Sonnet 4 | Anthropic | `https://api.anthropic.com/v1` |

后端模型配置请编辑 `deer-flow/config.yaml`：

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

### 环境变量

在 `deer-flow/` 目录下创建 `.env` 文件，填入 API Key：

```bash
# 必需：至少配置一个 LLM API Key
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# 可选：网页搜索
TAVILY_API_KEY=your-tavily-api-key

# 可选：可观测性
LANGSMITH_TRACING=false
LANGSMITH_API_KEY=your-langsmith-api-key
```

## 使用方法

1. **输入主题** — 在输入框中输入演示主题（如"2024 人工智能发展趋势"）
2. **选择风格** — 从 8 种视觉风格中选择，支持实时预览
3. **选择模型** — 在模型选择器中选择偏好的 LLM
4. **设置页数** — 选择 5 到 30 页
5. **开始生成** — 点击"生成"按钮，实时查看生成进度
6. **下载 PPT** — 生成完成后下载 PPT 文件

生成流水线包含以下阶段：

```
调研主题 → 生成内容 → 生成图片 → 组装 PPT → 完成
```

## PPT 风格

| 风格 | 描述 |
|------|------|
| **毛玻璃** | 磨砂玻璃效果、模糊背景、渐变色彩 |
| **深色奢华** | 深黑背景搭配发光点缀，奢华质感 |
| **渐变现代** | 大胆的网格渐变，Stripe/Linear 风格 |
| **新粗野主义** | 粗体排版、高对比度、反设计美学 |
| **3D 等距** | 等距插图、柔和阴影、立体纵深感 |
| **编辑风格** | 杂志排版、Vogue/Bloomberg 风格、优雅大气 |
| **极简瑞士** | 网格精确、Helvetica 风格、简洁克制 |
| **主题演讲** | Apple WWDC 风格、戏剧性视觉效果 |

## 支持的模型

AIPPT 兼容任何实现了 OpenAI 兼容 API 的 LLM。已测试的提供商：

- **DeepSeek** — DeepSeek V3（性价比推荐）
- **OpenAI** — GPT-4o、GPT-4、GPT-3.5-turbo
- **Anthropic** — Claude Sonnet 4、Claude 3.5 Sonnet
- **智谱 AI** — GLM-4 Plus
- **阿里云** — 通义千问 Max、通义千问 Plus
- **OpenRouter** — OpenRouter 上的所有可用模型
- **vLLM** — 自托管开源模型

## API 参考

前端通过 Next.js 代理路由与 DeerFlow Gateway API 通信：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/auth/login/local` | POST | 使用默认凭据自动登录 |
| `/api/v1/auth/me` | GET | 检查认证状态 |
| `/api/threads` | POST | 创建新的对话线程 |
| `/api/threads/{id}/runs/stream` | POST | 流式执行代理（SSE） |
| `/api/threads/{id}/artifacts/{path}` | GET | 下载生成的产物 |

### SSE 流式事件

生成端点以以下格式流式推送事件：

```json
{"event": "on_chain_start", "data": {...}}      // 状态：正在调研
{"event": "on_chat_model_stream", "data": {...}} // 内容流式输出
{"event": "on_tool_start", "name": "..."}        // 状态：正在生成图片
```

## 开发指南

### 前端开发

```bash
cd aippt-frontend

# 开发服务器（热更新）
pnpm dev

# 生产构建
pnpm build

# 启动生产服务
pnpm start

# 代码检查
pnpm lint
```

### 后端开发

```bash
cd deer-flow

# 本地开发（热更新）
make dev

# Docker 开发
make docker-start

# 运行测试
make test

# 检查环境配置
make doctor
```

### 开发注意事项

- 前端使用 Next.js API 代理避免 CORS 问题 — 所有 `/api/*` 请求都被转发到 DeerFlow 后端
- 认证通过 `src/lib/api.ts` 中的 `ensureAuth()` 函数自动处理
- CSRF Token 通过 `X-CSRF-Token` 请求头附加到状态变更请求中
- 模型配置存储在 `localStorage`，键名为 `aippt-models` 和 `aippt-selected-model`
- Zustand store（`src/store/generate.ts`）管理所有生成状态

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| **"Auto-login failed"** | 确保 DeerFlow 后端正在 `localhost:8001` 运行 |
| **"No response body"** | 检查后端沙箱是否正确初始化 |
| **生成卡住** | 检查后端日志，确认 LLM API Key 有效 |
| **构建失败** | 运行 `pnpm install` 确保所有依赖已安装 |
| **CORS 错误** | 前端通过 Next.js 代理 — 确保通过 `localhost:3000` 访问，而非直接访问后端端口 |
| **Docker 权限不足** | Linux 上将用户添加到 `docker` 组：`sudo usermod -aG docker $USER` |

## 许可证

本项目基于 [MIT 许可证](./LICENSE) 开源发布。

## 致谢

- **[DeerFlow](https://github.com/bytedance/deer-flow)** — 驱动后端的超级代理引擎，由字节跳动开发
- **[LangChain](https://github.com/langchain-ai/langchain)** — LLM 交互框架
- **[LangGraph](https://github.com/langchain-ai/langgraph)** — 多代理编排框架
- **[Next.js](https://nextjs.org)** — 前端 React 框架
- **[shadcn/ui](https://ui.shadcn.com)** — UI 组件基础库
