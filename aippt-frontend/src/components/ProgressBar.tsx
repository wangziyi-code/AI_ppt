'use client';

import { useGenerateStore, type GenerateStatus } from '@/store/generate';
import { i18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const STATUS_ORDER: GenerateStatus[] = [
  'connecting',
  'researching',
  'generating_content',
  'generating_images',
  'assembling',
  'completed',
];

const STATUS_LABELS: Record<GenerateStatus, { icon: string }> = {
  idle: { icon: '○' },
  connecting: { icon: '◎' },
  researching: { icon: '◉' },
  generating_content: { icon: '⬡' },
  generating_images: { icon: '◈' },
  assembling: { icon: '◇' },
  completed: { icon: '✦' },
  error: { icon: '✕' },
};

export function ProgressBar() {
  const { status, language } = useGenerateStore();
  const t = i18n[language];

  if (status === 'idle') return null;

  const currentIndex = STATUS_ORDER.indexOf(status);
  const progress = status === 'error' ? 0 : ((currentIndex + 1) / STATUS_ORDER.length) * 100;

  return (
    <div className="w-full space-y-5 animate-fade-in-up">
      {/* Progress bar */}
      <div className="relative">
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              status === 'error'
                ? 'bg-[var(--error)]'
                : 'bg-gradient-to-r from-[#6d5cff] to-[#06b6d4]'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Glow effect on progress bar */}
        {status !== 'error' && (
          <div
            className="absolute top-0 h-1.5 rounded-full bg-gradient-to-r from-[#6d5cff]/50 to-[#06b6d4]/50 blur-sm transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>

      {/* Status steps */}
      <div className="flex flex-wrap justify-center gap-2">
        {STATUS_ORDER.map((s) => {
          const isActive = s === status;
          const isPast = currentIndex > STATUS_ORDER.indexOf(s);
          const isError = status === 'error' && isActive;

          return (
            <div
              key={s}
              className={cn(
                'flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all duration-300',
                isActive && !isError && 'glass-card-elevated text-[#8b7fff] border-[#6d5cff]/20',
                isPast && 'text-muted-foreground/50',
                isError && 'bg-[var(--error-muted)] text-[var(--error)] border border-[var(--error)]/20',
                !isActive && !isPast && 'text-muted-foreground/40'
              )}
            >
              <span className={cn('text-xs', isActive && !isError && 'animate-pulse')}>
                {STATUS_LABELS[s].icon}
              </span>
              <span>{t[s]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
