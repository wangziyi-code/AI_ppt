export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  apiKey: string;
  modelId: string;
  maxTokens: number;
  temperature: number;
  isCustom?: boolean;
}

export const DEFAULT_MODELS: ModelConfig[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    modelId: 'deepseek-chat',
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: 'glm-4-plus',
    name: 'GLM-4 Plus',
    provider: '智谱 AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '',
    modelId: 'glm-4-plus',
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: 'qwen-max',
    name: '通义千问 Max',
    provider: '阿里云',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: '',
    modelId: 'qwen-max',
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    modelId: 'gpt-4o',
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: '',
    modelId: 'claude-sonnet-4-20250514',
    maxTokens: 4096,
    temperature: 0.7,
  },
];

const STORAGE_KEY = 'aippt-models';
const SELECTED_KEY = 'aippt-selected-model';

export function getSavedModels(): ModelConfig[] {
  if (typeof window === 'undefined') return DEFAULT_MODELS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const custom = JSON.parse(saved) as ModelConfig[];
      const defaultIds = DEFAULT_MODELS.map((m) => m.id);
      const customOnly = custom.filter((m) => m.isCustom || !defaultIds.includes(m.id));
      return [...DEFAULT_MODELS, ...customOnly];
    }
  } catch {
    // ignore
  }
  return DEFAULT_MODELS;
}

export function saveModels(models: ModelConfig[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

export function getSelectedModelId(): string {
  if (typeof window === 'undefined') return DEFAULT_MODELS[0].id;
  return localStorage.getItem(SELECTED_KEY) || DEFAULT_MODELS[0].id;
}

export function saveSelectedModelId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_KEY, id);
}

export function generateModelId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
