'use client';

import { useState, useEffect } from 'react';
import { useGenerateStore } from '@/store/generate';
import { i18n } from '@/lib/i18n';
import {
  getSavedModels,
  getSelectedModelId,
  saveSelectedModelId,
  type ModelConfig,
} from '@/lib/models';
import { cn } from '@/lib/utils';
import { ModelSettings } from './ModelSettings';

export function ModelSelector() {
  const { language, selectedModelId, setSelectedModelId } = useGenerateStore();
  const t = i18n[language];
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const loaded = getSavedModels();
    setModels(loaded);
    const savedId = getSelectedModelId();
    const exists = loaded.some((m) => m.id === savedId);
    if (exists) {
      setSelectedModelId(savedId);
    } else if (loaded.length > 0) {
      setSelectedModelId(loaded[0].id);
    }
  }, [setSelectedModelId]);

  const handleSelect = (id: string) => {
    setSelectedModelId(id);
    saveSelectedModelId(id);
  };

  const selectedModel = models.find((m) => m.id === selectedModelId);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-foreground/60">
          {language === 'zh' ? '模型' : 'Model'}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        <button
          onClick={() => setShowSettings(true)}
          className="text-xs text-[#6d5cff] hover:text-[#8b7fff] transition-colors font-medium"
        >
          {language === 'zh' ? '管理模型' : 'Manage Models'}
        </button>
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => handleSelect(model.id)}
            className={cn(
              'flex flex-col items-start gap-1.5 p-3.5 rounded-xl text-left transition-all duration-300',
              selectedModelId === model.id
                ? 'glass-card-elevated border-[#6d5cff]/30 shadow-md shadow-[#6d5cff]/10'
                : 'glass-card hover:border-border-bright'
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <span className={cn(
                'text-xs font-semibold truncate transition-colors',
                selectedModelId === model.id ? 'text-foreground' : 'text-foreground/70'
              )}>
                {model.name}
              </span>
              {model.apiKey ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] flex-shrink-0 shadow-sm shadow-[var(--success)]/50" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--error)]/60 flex-shrink-0" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground/70 font-medium">{model.provider}</span>
          </button>
        ))}
      </div>

      {/* Selected model info */}
      {selectedModel && !selectedModel.apiKey && (
        <div className="mt-3 p-3 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20 text-[var(--warning)] text-xs leading-relaxed">
          {language === 'zh'
            ? `${selectedModel.name} 未配置 API Key，请在「管理模型」中设置`
            : `${selectedModel.name} API Key not configured, please set it in "Manage Models"`}
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <ModelSettings
          models={models}
          onModelsChange={(updated) => {
            setModels(updated);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
