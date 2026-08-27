import { resolveStoryWebSocketCandidates } from '@/utils/storyBaseUrl';

export type MascotSocketHandlers = {
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (ws: WebSocket) => void;
  onError?: (err: any) => void;
  onClose?: () => void;
};

export async function connectMascotSocket(
  path: string,
  handlers: MascotSocketHandlers = {},
  timeoutMs = 650,
): Promise<WebSocket | null> {
  const candidates = resolveStoryWebSocketCandidates().map((base) => `${base}${path}`);

  for (const url of candidates) {
    const ws = new WebSocket(url);
    const opened = await new Promise<WebSocket | null>((resolve) => {
      let didOpen = false;
      const timeout = setTimeout(() => {
        if (!didOpen) {
          try { ws.close(); } catch {}
          resolve(null);
        }
      }, timeoutMs);

      ws.onopen = () => {
        didOpen = true;
        clearTimeout(timeout);
        handlers.onOpen?.(ws);
        resolve(ws);
      };

      ws.onmessage = (event) => handlers.onMessage?.(event);

      ws.onerror = (err) => {
        if (!didOpen) {
          clearTimeout(timeout);
          resolve(null);
          return;
        }
        handlers.onError?.(err);
      };

      ws.onclose = () => {
        if (!didOpen) {
          clearTimeout(timeout);
          resolve(null);
          return;
        }
        handlers.onClose?.();
      };
    });

    if (opened) return opened;
  }

  return null;
}
