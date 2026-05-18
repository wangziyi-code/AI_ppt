'use client';

import { useGenerateStore } from '@/store/generate';
import type { Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function LanguageSwitch() {
  const { language, setLanguage } = useGenerateStore();

  const options: { value: Language; label: string }[] = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'EN' },
  ];

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-xl glass-card">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          className={cn(
            'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 tracking-wide',
            language === opt.value
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'text-muted-foreground/60 hover:text-muted-foreground'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
