'use client';

import { useState } from 'react';
import { useGenerateStore } from '@/store/generate';
import { i18n } from '@/lib/i18n';
import {
  saveModels,
  saveSelectedModelId,
  generateModelId,
  DEFAULT_MODELS,
  type ModelConfig,
} from '@/lib/models';
import { cn } from '@/lib/utils';

interface ModelSettingsProps {
  models: ModelConfig[];
  onModelsChange: (models: ModelConfig[]) => void;
  onClose: () => void;
}

export function ModelSettings({ models, onModelsChange, onClose }: ModelSettingsProps) {
  const { language, setSelectedModelId } = useGenerateStore();
  const t = i18n[language];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Partial<ModelConfig>>({});

  const handleSaveKey = (id: string, apiKey: string) => {
    const updated = models.map((m) =>
      m.id === id ? { ...m, apiKey } : m
    );
    onModelsChange(updated);
    saveModels(updated);
    setEditingId(null);
  };

  const handleAddModel = () => {
    if (!form.name || !form.baseUrl || !form.modelId || !form.apiKey) return;

    const newModel: ModelConfig = {
      id: generateModelId(),
      name: form.name,
      provider: form.provider || 'Custom',
      baseUrl: form.baseUrl,
      apiKey: form.apiKey,
      modelId: form.modelId,
      maxTokens: form.maxTokens || 4096,
      temperature: form.temperature || 0.7,
      isCustom: true,
    };

    const updated = [...models, newModel];
    onModelsChange(updated);
    saveModels(updated);
    setSelectedModelId(newModel.id);
    saveSelectedModelId(newModel.id);
    setShowAdd(false);
    setForm({});
  };

  const handleDelete = (id: string) => {
    const model = models.find((m) => m.id === id);
    if (!model?.isCustom) return;
    const updated = models.filter((m) => m.id !== id);
    onModelsChange(updated);
    saveModels(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in-up" style={{ animationDuration: '200ms' }}>
      <div className="w-full max-w-2xl max-h-[80vh] bg-[var(--card)] rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {language === 'zh' ? '模型管理' : 'Model Management'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <svg className="w-4.5 h-4.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-7 space-y-4">
          {/* Model list */}
          {models.map((model) => (
            <div
              key={model.id}
              className="flex items-center gap-3.5 p-4 rounded-2xl glass-card"
            >
              {/* Provider badge */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6d5cff]/15 to-[#06b6d4]/10 border border-[#6d5cff]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#8b7fff]">
                  {model.provider.slice(0, 2)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {model.name}
                  </span>
                  {model.isCustom && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#6d5cff]/10 text-[#8b7fff] font-medium border border-[#6d5cff]/10">
                      Custom
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground/70 font-mono">{model.modelId}</span>
              </div>

              {/* API Key status / edit */}
              {editingId === model.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    defaultValue={model.apiKey}
                    placeholder="API Key"
                    className="w-40 px-3 py-1.5 text-xs rounded-lg input-premium font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveKey(model.id, (e.target as HTMLInputElement).value);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement);
                      if (input) handleSaveKey(model.id, input.value);
                    }}
                    className="text-xs text-[#6d5cff] hover:text-[#8b7fff] font-medium transition-colors"
                  >
                    {language === 'zh' ? '保存' : 'Save'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      model.apiKey ? 'bg-[var(--success)] shadow-sm shadow-[var(--success)]/50' : 'bg-[var(--error)]/60'
                    )}
                  />
                  <button
                    onClick={() => setEditingId(model.id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {model.apiKey
                      ? language === 'zh'
                        ? '修改 Key'
                        : 'Edit Key'
                      : language === 'zh'
                        ? '设置 Key'
                        : 'Set Key'}
                  </button>
                  {model.isCustom && (
                    <button
                      onClick={() => handleDelete(model.id)}
                      className="text-xs text-[var(--error)]/60 hover:text-[var(--error)] transition-colors ml-1 font-medium"
                    >
                      {language === 'zh' ? '删除' : 'Delete'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add custom model */}
          {showAdd ? (
            <div className="p-5 rounded-2xl border-2 border-dashed border-[#6d5cff]/25 bg-[#6d5cff]/[0.04] space-y-4">
              <h4 className="text-sm font-semibold text-foreground">
                {language === 'zh' ? '添加自定义模型' : 'Add Custom Model'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder={language === 'zh' ? '模型名称' : 'Model Name'}
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-3.5 py-2.5 text-sm rounded-xl input-premium"
                />
                <input
                  placeholder={language === 'zh' ? '提供商' : 'Provider'}
                  value={form.provider || ''}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  className="px-3.5 py-2.5 text-sm rounded-xl input-premium"
                />
                <input
                  placeholder={language === 'zh' ? 'API 地址 (如 https://api.xxx.com/v1)' : 'Base URL'}
                  value={form.baseUrl || ''}
                  onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                  className="px-3.5 py-2.5 text-sm rounded-xl input-premium col-span-2"
                />
                <input
                  placeholder={language === 'zh' ? '模型 ID (如 deepseek-chat)' : 'Model ID'}
                  value={form.modelId || ''}
                  onChange={(e) => setForm({ ...form, modelId: e.target.value })}
                  className="px-3.5 py-2.5 text-sm rounded-xl input-premium"
                />
                <input
                  type="password"
                  placeholder="API Key"
                  value={form.apiKey || ''}
                  onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                  className="px-3.5 py-2.5 text-sm rounded-xl input-premium font-mono"
                />
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleAddModel}
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#6d5cff] to-[#06b6d4] text-white rounded-xl hover:shadow-lg hover:shadow-[#6d5cff]/20 transition-all active:scale-[0.98]"
                >
                  {language === 'zh' ? '添加' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setForm({});
                  }}
                  className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {language === 'zh' ? '取消' : 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-border hover:border-[#6d5cff]/30 text-muted-foreground hover:text-foreground text-sm transition-all duration-300 font-medium"
            >
              + {language === 'zh' ? '添加自定义模型 (OpenAI 兼容接口)' : 'Add Custom Model (OpenAI Compatible)'}
            </button>
          )}

          {/* Help text */}
          <div className="p-4 rounded-2xl glass-card text-xs text-muted-foreground/70 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-muted-foreground">
              {language === 'zh' ? '支持的接口格式：' : 'Supported API formats:'}
            </p>
            <p>
              {language === 'zh'
                ? '所有兼容 OpenAI /v1/chat/completions 的接口都可以使用，包括但不限于：DeepSeek、智谱 GLM、通义千问、豆包、Kimi、零一万物、Ollama 本地模型等。'
                : 'All OpenAI-compatible /v1/chat/completions endpoints are supported, including but not limited to: DeepSeek, Zhipu GLM, Qwen, Doubao, Kimi, Yi, Ollama local models, etc.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
