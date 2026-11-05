/**
 * MoeLink 统一登录（会话 + 短期 access token）。
 *
 * - 长期凭证是 auth-service 下发的 HttpOnly 会话 Cookie，页面脚本读不到；
 * - 页面只在内存里持有 15 分钟有效的 access token（不落 localStorage），到期前自动用 Cookie 续期；
 * - 与 MoeLink 等子站共用同一个会话 Cookie，任一站登录 / 登出都会在另一站下次续期时体现。
 */

const LEGACY_KEYS = ['genshin_quiz_token', 'moelink_sso_synced'];
const REFRESH_EARLY_MS = 60 * 1000;
const RETRY_MS = 30 * 1000;

export type RefreshResult = 'ok' | 'none' | 'error';

let accessToken = '';
let expiresAtMs = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let inflight: Promise<RefreshResult> | null = null;
let tokenSink: (token: string) => void = () => {};
const listeners = new Set<(token: string) => void>();

function payloadOf(token: string): { user_id?: number; exp?: number } {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(part));
  } catch {
    return {};
  }
}

function publish(): void {
  tokenSink(accessToken);
  for (const listener of listeners) listener(accessToken);
}

function schedule(): void {
  if (timer) clearTimeout(timer);
  if (!accessToken) return;
  const delay = Math.max(10_000, expiresAtMs - Date.now() - REFRESH_EARLY_MS);
  timer = setTimeout(() => {
    void refreshAccessToken();
  }, delay);
}

/** 注册把 token 应用到 HTTP 客户端的函数（避免与 fetcher 循环依赖）。 */
export function setTokenSink(sink: (token: string) => void): void {
  tokenSink = sink;
  sink(accessToken);
}

/** 订阅 token 变化（登录、续期、登出）。返回取消订阅函数。 */
export function subscribeAccessToken(listener: (token: string) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAccessToken(): string {
  return accessToken;
}

export function currentUserId(): number {
  return payloadOf(accessToken).user_id ?? 0;
}

export function setAccessToken(token: string): void {
  accessToken = token;
  const exp = payloadOf(token).exp;
  expiresAtMs = exp ? exp * 1000 : Date.now() + 15 * 60 * 1000;
  schedule();
  publish();
}

export function clearAccessToken(): void {
  accessToken = '';
  expiresAtMs = 0;
  if (timer) clearTimeout(timer);
  publish();
}

function removeLegacyKeys(): void {
  for (const key of LEGACY_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/** 用会话 Cookie 换取新的 access token。'none' 表示没有有效会话（已登出）。 */
export function refreshAccessToken(): Promise<RefreshResult> {
  if (inflight) return inflight;
  inflight = (async (): Promise<RefreshResult> => {
    try {
      const res = await fetch('/api/auth/session/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.status === 401 || res.status === 403) {
        clearAccessToken();
        return 'none';
      }
      if (!res.ok) throw new Error(`refresh failed: ${res.status}`);
      const data = await res.json();
      setAccessToken(data.token);
      return 'ok';
    } catch {
      // 网络波动：保留现有状态，稍后重试
      if (accessToken) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => void refreshAccessToken(), RETRY_MS);
      }
      return 'error';
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** 清理旧版（JS 可读）的共享登录 Cookie，避免残留凭证。 */
function removeLegacyCookie(): void {
  const host = window.location.hostname;
  const domains = ['', host.endsWith('moelink.site') ? '; Domain=.moelink.site' : ''];
  for (const domain of domains) {
    document.cookie = `moelink_sso=; Path=/; Max-Age=0${domain}`;
  }
}

/** 页面启动时调用：清理旧版 localStorage 凭证，并尝试用会话 Cookie 恢复登录。 */
export async function initAuth(): Promise<void> {
  removeLegacyKeys();
  removeLegacyCookie();
  await refreshAccessToken();
}

/** 回到页面时与服务端会话对账；登录状态或账号变化时返回 true。 */
export async function syncSession(): Promise<boolean> {
  const before = currentUserId();
  await refreshAccessToken();
  return currentUserId() !== before;
}

/** 登出：撤销服务端会话并清除 Cookie。 */
export async function endSession(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch {
    /* 网络失败时仍然清掉本地状态 */
  }
  clearAccessToken();
}
