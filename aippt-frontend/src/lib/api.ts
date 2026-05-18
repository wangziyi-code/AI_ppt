// All API calls go through Next.js proxy (/api/* → DeerFlow localhost:8001)
// This ensures same-origin cookies work for auth + CSRF.

let authPromise: Promise<void> | null = null;

function getCsrfToken(): string {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

async function ensureAuth(): Promise<void> {
  if (authPromise) return authPromise;
  authPromise = (async () => {
    // Check if already logged in
    const statusRes = await fetch('/api/v1/auth/me', { credentials: 'include' });
    if (statusRes.ok) return;

    // Auto-login with default admin account
    const res = await fetch('/api/v1/auth/login/local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=admin@example.com&password=Admin%402026!',
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Auto-login failed. Please check DeerFlow backend.');
    }
  })();
  return authPromise;
}

async function authedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  await ensureAuth();
  const headers = new Headers(init.headers);
  // Add CSRF token for state-changing requests
  if (init.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(init.method.toUpperCase())) {
    headers.set('X-CSRF-Token', getCsrfToken());
  }
  return fetch(url, { ...init, headers, credentials: 'include' });
}

export interface GenerateRequest {
  topic: string;
  style: string;
  language: 'zh' | 'en';
  slideCount: number;
  modelId?: string;
}

export interface StreamEvent {
  type: 'status' | 'content' | 'error' | 'done';
  data: string;
  artifactUrl?: string;
}

export async function createThread(): Promise<string> {
  const res = await authedFetch('/api/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create thread');
  const data = await res.json();
  return data.thread_id;
}

export async function generatePresentation(
  threadId: string,
  request: GenerateRequest,
  onEvent: (event: StreamEvent) => void
): Promise<void> {
  const { topic, style, language, slideCount, modelId } = request;

  const prompt =
    language === 'zh'
      ? `请使用"${style}"风格，生成一个关于"${topic}"的PPT演示文稿，包含${slideCount}页幻灯片。请使用ppt-generation技能来完成。`
      : `Using the "${style}" style, generate a presentation about "${topic}" with ${slideCount} slides. Please use the ppt-generation skill.`;

  const res = await authedFetch(`/api/threads/${threadId}/runs/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: prompt,
      context: {
        thinking_enabled: false,
        subagent_enabled: false,
        ...(modelId ? { model_name: modelId } : {}),
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.event === 'on_chat_model_stream') {
            const content = data.data?.chunk?.content;
            if (content) {
              onEvent({ type: 'content', data: content });
            }
          } else if (data.event === 'on_chain_start') {
            onEvent({ type: 'status', data: 'researching' });
          } else if (data.event === 'on_tool_start') {
            const toolName = data.name || '';
            if (toolName.includes('image') || toolName.includes('generate')) {
              onEvent({ type: 'status', data: 'generating_images' });
            }
          }
        } catch {
          // Skip non-JSON lines
        }
      }
    }
  }

  onEvent({ type: 'done', data: 'completed' });
}

export async function getArtifactUrl(threadId: string, path: string): Promise<string> {
  return `/api/threads/${threadId}/artifacts/${encodeURIComponent(path)}`;
}
