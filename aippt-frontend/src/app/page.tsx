'use client';

import { useGenerateStore } from '@/store/generate';
import { i18n } from '@/lib/i18n';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { TopicInput } from '@/components/TopicInput';
import { StyleSelector } from '@/components/StyleSelector';
import { ModelSelector } from '@/components/ModelSelector';
import { SlideCountSelect } from '@/components/SlideCountSelect';
import { GenerateButton } from '@/components/GenerateButton';
import { ProgressBar } from '@/components/ProgressBar';
import FloatingLines from '@/components/FloatingLines/FloatingLines';

export default function Home() {
  const { language, status, outputContent, artifactUrl, error, reset } = useGenerateStore();
  const t = i18n[language];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient mesh orbs - 参考 Gamma/v0 的渐变光晕 */}
      <div className="absolute inset-0 h-[700px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-[10%] w-[500px] h-[500px] rounded-full bg-[#6d5cff]/[0.07] blur-[100px]" />
        <div className="absolute top-[-60px] right-[5%] w-[400px] h-[400px] rounded-full bg-[#06b6d4]/[0.06] blur-[100px]" />
        <div className="absolute top-[200px] left-[40%] w-[300px] h-[300px] rounded-full bg-[#8b7fff]/[0.05] blur-[80px]" />
      </div>

      {/* Floating lines */}
      <div className="absolute inset-0 h-[700px] z-0">
        <FloatingLines
          linesGradient={['#8b7fff', '#6d5cff', '#a5b4fc', '#67e8f9', '#22d3ee']}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[5, 8, 12]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          parallaxStrength={0.15}
          animationSpeed={0.6}
          mixBlendMode="normal"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6d5cff] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#6d5cff]/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-9 h-9 rounded-xl bg-[#6d5cff]/20 blur-xl -z-10" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">{t.title}</span>
          </div>
          <LanguageSwitch />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Hero section */}
        <div className="text-center mb-16 pt-20 pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6d5cff]/15 bg-white/50 backdrop-blur-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6d5cff] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-[#6d5cff] uppercase">
              {language === 'zh' ? 'AI 驱动' : 'AI Powered'}
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] text-[#0f172a]">
            {t.subtitle}
          </h1>
          <p className="text-foreground-dim text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            {language === 'zh' ? '输入主题，AI 自动生成专业演示文稿' : 'Enter a topic, AI generates professional presentations automatically'}
          </p>
        </div>

        {/* Generation form */}
        <div className="space-y-10 stagger-children">
          {/* Topic input */}
          <section>
            <TopicInput />
          </section>

          {/* Style selector */}
          <section>
            <StyleSelector />
          </section>

          {/* Model selector */}
          <section>
            <ModelSelector />
          </section>

          {/* Options row */}
          <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <SlideCountSelect />
          </section>

          {/* Generate button */}
          <section>
            <GenerateButton />
          </section>

          {/* Progress */}
          <ProgressBar />

          {/* Error display */}
          {error && (
            <div className="p-5 rounded-2xl bg-[var(--error-muted)] border border-[var(--error)]/20 text-[var(--error)] animate-fade-in-up">
              <p className="font-semibold text-sm">{t.error}</p>
              <p className="text-sm mt-1.5 opacity-70 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Result */}
          {status === 'completed' && (
            <div className="p-6 rounded-2xl bg-[var(--success-muted)] border border-[var(--success)]/20 animate-fade-in-up">
              <div className="flex items-center gap-2.5 text-[var(--success)] mb-5">
                <div className="w-8 h-8 rounded-lg bg-[var(--success)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-base font-semibold">{t.completed}</span>
              </div>

              {/* Output preview */}
              {outputContent && (
                <div className="mb-5 p-4 rounded-xl bg-muted/50 border border-border max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-foreground/80 font-mono leading-relaxed">{outputContent}</pre>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {artifactUrl && (
                  <a
                    href={artifactUrl}
                    download
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-[#6d5cff] to-[#06b6d4] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#6d5cff]/20 transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t.download}
                  </a>
                )}
                <button
                  onClick={reset}
                  className="flex-1 py-3.5 px-6 glass-card text-foreground font-semibold rounded-xl hover:bg-muted active:scale-[0.98]"
                >
                  {t.regenerate}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/50 py-10 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-3">
          <div className="divider-glow w-24 mb-2" />
          <p className="text-xs text-muted-foreground/50 tracking-wide">
            Powered by <span className="text-muted-foreground/70">DeerFlow</span> + <span className="text-muted-foreground/70">AI</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
