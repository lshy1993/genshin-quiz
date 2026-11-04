// MoeLink 是统一账号中心：资料修改、密码、第三方账号绑定都在那里完成。
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

export function getMoeLinkOrigin(): string {
  const configured = import.meta.env.VITE_MOELINK_URL as string | undefined;
  if (configured) return configured.replace(/\/+$/, '');
  return LOCAL_HOSTS.includes(window.location.hostname)
    ? 'http://localhost:5173'
    : 'https://moelink.site';
}

// 同一套 JWT 在两个站点通用；通过 URL hash 传递，hash 不会发送给服务器，MoeLink 读取后立即清除。
export function getMoeLinkAccountUrl(token: string | null): string {
  const url = `${getMoeLinkOrigin()}/profile`;
  return token ? `${url}#oauth_token=${encodeURIComponent(token)}` : url;
}
