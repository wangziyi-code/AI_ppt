'use client';

import { useGenerateStore } from '@/store/generate';
import { i18n, type Language } from '@/lib/i18n';

export function TopicInput() {
  const { topic, setTopic, language } = useGenerateStore();
  const t = i18n[language];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-foreground/60">
          {language === 'zh' ? '主题' : 'Topic'}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="relative group">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t.placeholder}
          className="w-full min-h-[160px] p-5 text-base rounded-2xl input-premium text-foreground placeholder:text-muted-foreground/60 resize-none leading-relaxed"
          maxLength={2000}
        />
        {/* Subtle glow on focus */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#6d5cff]/0 to-[#06b6d4]/0 group-focus-within:from-[#6d5cff]/10 group-focus-within:to-[#06b6d4]/10 pointer-events-none transition-all duration-500 -z-10 blur-sm" />
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-[11px] text-muted-foreground/60 tabular-nums tracking-wide">
          {topic.length}/2000
        </span>
      </div>
    </div>
  );
}
