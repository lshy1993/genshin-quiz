import { useEffect } from 'react';
import { setJWT } from '@/api/fetcher/fetcher';
import { useUser } from '@/context/UserContext';

/**
 * 认证管理 Hook
 * 自动同步 UserContext 的 token 到 API fetcher
 */
export function useAuthManager() {
  const { token } = useUser();

  useEffect(() => {
    if (token) {
      // 设置 API 请求的 Authorization 头
      setJWT(token);
    } else {
      // 清除 Authorization 头
      setJWT('');
    }
  }, [token]);

  return null; // 这个 hook 只负责副作用，不返回数据
}
