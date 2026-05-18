'use client';

import { useGenerateStore } from '@/store/generate';
import { i18n } from '@/lib/i18n';
import { createThread, generatePresentation } from '@/lib/api';
import { cn } from '@/lib/utils';

export function GenerateButton() {
  const {
    topic,
    style,
    language,
    slideCount,
    selectedModelId,
    status,
    setStatus,
    setThreadId,
    appendContent,
    setArtifactUrl,
    setError,
  } = useGenerateStore();
  const t = i18n[language];

  const isGenerating = !['idle', 'completed', 'error'].includes(status);

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return;

    try {
      setStatus('connecting');
      const threadId = await createThread();
      setThreadId(threadId);

      await generatePresentation(
        threadId,
        { topic: topic.trim(), style, language, slideCount, modelId: selectedModelId },
        (event) => {
          switch (event.type) {
            case 'status':
              setStatus(event.data as 'researching' | 'generating_images' | 'generating_content' | 'assembling');
              break;
            case 'content':
              appendContent(event.data);
              break;
            case 'done':
              setStatus('completed');
              break;
            case 'error':
              setError(event.data);
              break;
          }
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={!topic.trim() || isGenerating}
      className={cn(
        'w-full py-4 px-8 text-base font-semibold rounded-2xl transition-all active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d5cff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        topic.trim() && !isGenerating
          ? 'bg-gradient-to-r from-[#6d5cff] to-[#06b6d4] text-white shadow-lg shadow-[#6d5cff]/20 hover:shadow-xl hover:shadow-[#6d5cff]/30 hover:brightness-110 animate-pulse-glow'
          : 'bg-muted text-muted-foreground/40 cursor-not-allowed border border-border'
      )}
    >
      {isGenerating ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.generating}
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t.generate}
        </span>
      )}
    </button>
  );
}
