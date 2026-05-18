import { create } from 'zustand';
import type { Language } from '@/lib/i18n';

export type GenerateStatus =
  | 'idle'
  | 'connecting'
  | 'researching'
  | 'generating_content'
  | 'generating_images'
  | 'assembling'
  | 'completed'
  | 'error';

interface GenerateState {
  topic: string;
  style: string;
  language: Language;
  slideCount: number;
  selectedModelId: string;
  status: GenerateStatus;
  threadId: string | null;
  outputContent: string;
  artifactUrl: string | null;
  error: string | null;

  setTopic: (topic: string) => void;
  setStyle: (style: string) => void;
  setLanguage: (language: Language) => void;
  setSlideCount: (count: number) => void;
  setSelectedModelId: (id: string) => void;
  setStatus: (status: GenerateStatus) => void;
  setThreadId: (threadId: string) => void;
  appendContent: (content: string) => void;
  setArtifactUrl: (url: string) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  topic: '',
  style: 'glassmorphism',
  language: 'zh' as Language,
  slideCount: 10,
  selectedModelId: '',
  status: 'idle' as GenerateStatus,
  threadId: null,
  outputContent: '',
  artifactUrl: null,
  error: null,
};

export const useGenerateStore = create<GenerateState>((set) => ({
  ...initialState,

  setTopic: (topic) => set({ topic }),
  setStyle: (style) => set({ style }),
  setLanguage: (language) => set({ language }),
  setSlideCount: (slideCount) => set({ slideCount }),
  setSelectedModelId: (selectedModelId) => set({ selectedModelId }),
  setStatus: (status) => set({ status }),
  setThreadId: (threadId) => set({ threadId }),
  appendContent: (content) =>
    set((state) => ({ outputContent: state.outputContent + content })),
  setArtifactUrl: (artifactUrl) => set({ artifactUrl }),
  setError: (error) => set({ error, status: 'error' }),
  reset: () => set(initialState),
}));
