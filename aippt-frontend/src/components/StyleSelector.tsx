'use client';

import { useGenerateStore } from '@/store/generate';
import { i18n } from '@/lib/i18n';
import { PPT_STYLES } from '@/lib/styles';
import { cn } from '@/lib/utils';

export function StyleSelector() {
  const { style, setStyle, language } = useGenerateStore();
  const t = i18n[language];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-foreground/60">
          {t.selectStyle}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PPT_STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={cn(
              'group relative flex flex-col items-center gap-2.5 p-3.5 rounded-2xl transition-all duration-300',
              style === s.id
                ? 'glass-card-elevated border-[#6d5cff]/30 shadow-lg shadow-[#6d5cff]/10'
                : 'glass-card hover:border-border-bright'
            )}
          >
            {/* Preview card */}
            <div
              className={cn(
                'w-full aspect-[16/10] rounded-xl flex items-center justify-center text-xs font-bold overflow-hidden transition-transform duration-300',
                s.previewBg,
                style === s.id ? 'scale-[1.02]' : 'group-hover:scale-[1.01]'
              )}
            >
              <div className={cn('flex flex-col items-center gap-0.5', s.textColor)}>
                <div className="w-8 h-1 bg-current rounded opacity-60" />
                <div className="w-12 h-1 bg-current rounded opacity-40" />
                <div className="w-6 h-1 bg-current rounded opacity-30" />
              </div>
            </div>
            {/* Label */}
            <span className={cn(
              'text-xs font-medium transition-colors duration-200',
              style === s.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/80'
            )}>
              {t[s.nameKey as keyof typeof t]}
            </span>
            {/* Selected indicator */}
            {style === s.id && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#6d5cff] to-[#06b6d4] flex items-center justify-center shadow-md shadow-[#6d5cff]/30">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
