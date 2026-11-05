// MoeLink 是统一账号中心：资料修改、密码、第三方账号绑定都在那里完成。
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

export function getMoeLinkOrigin(): string {
  const configured = import.meta.env.VITE_MOELINK_URL as string | undefined;
  if (configured) return configured.replace(/\/+$/, '');
  return LOCAL_HOSTS.includes(window.location.hostname)
    ? 'http://localhost:5173'
    : 'https://moelink.site';
}

// 两个站共用同一个 HttpOnly 会话 Cookie，打开 MoeLink 即处于登录状态，不需要在 URL 里传递 token。
export function getMoeLinkAccountUrl(): string {
  return `${getMoeLinkOrigin()}/profile`;
}
