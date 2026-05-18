'use client';

import { useGenerateStore } from '@/store/generate';
import { i18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const SLIDE_COUNTS = [6, 8, 10, 12, 15];

export function SlideCountSelect() {
  const { slideCount, setSlideCount, language } = useGenerateStore();
  const t = i18n[language];

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground tracking-wide">{t.slideCount}</span>
      <div className="flex items-center gap-1.5">
        {SLIDE_COUNTS.map((count) => (
          <button
            key={count}
            onClick={() => setSlideCount(count)}
            className={cn(
              'w-10 h-9 text-sm font-semibold rounded-lg transition-all duration-200 tabular-nums',
              slideCount === count
                ? 'bg-gradient-to-br from-[#6d5cff] to-[#6d5cff]/80 text-white shadow-md shadow-[#6d5cff]/20'
                : 'glass-card text-foreground/70 hover:text-foreground hover:bg-muted'
            )}
          >
            {count}
          </button>
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground tracking-wide">{t.slides}</span>
    </div>
  );
}
