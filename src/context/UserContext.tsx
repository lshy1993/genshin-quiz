import { Skeleton } from '@mui/material';
import { createContext, useContext, useEffect, useState } from 'react';
import type { UserPrivate } from '@/api/dto';
import { setGlobalLogoutCallback } from '@/api/fetcher/fetcher';
import { useGetCurrentUser } from '@/api/genshinQuizAPI';
import {
  endSession,
  initAuth,
  setAccessToken,
  subscribeAccessToken,
  syncSession,
} from '@/util/auth';
import { navigateTo } from '@/util/navigation';
import { LanguageProvider } from './LanguageContext';

interface UserContextType {
  user: UserPrivate | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  forceLogout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 登录态由 HttpOnly 会话 Cookie 承载：启动时先换取短期 access token，之后在内存里自动续期
  useEffect(() => {
    const unsubscribe = subscribeAccessToken((next) => setToken(next || null));
    let cancelled = false;
    initAuth()
      .catch((error) => console.error('Failed to restore session:', error))
      .finally(() => {
        if (cancelled) return;
        // 第三方登录回跳时 hash 里只有成功标记，凭证已在 Cookie 中
        const callbackParams = new URLSearchParams(window.location.hash.slice(1));
        if (callbackParams.get('oauth_login')) {
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search,
          );
        }
        setIsInitialized(true);
      });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // 使用 API 获取用户信息
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    mutate: refreshUser,
  } = useGetCurrentUser({
    swr: {
      enabled: !!token && isInitialized, // 只有当有token且已初始化时才请求
      shouldRetryOnError: false, // 避免无限重试
      revalidateOnReconnect: true, // 网络重连时重新请求
    },
  });

  // 如果token存在但获取用户信息失败，说明会话可能已失效
  useEffect(() => {
    if (token && isInitialized && !isUserLoading && userError) {
      console.warn('Session may be invalid, logging out:', userError);
      logout();
    }
  }, [token, isInitialized, isUserLoading, userError]);

  const login = (newToken: string) => {
    // 登录接口已经下发会话 Cookie，这里只需要把 access token 放进内存
    setAccessToken(newToken);
  };

  const logout = () => {
    void endSession();
  };

  // 回到本页时与会话对账，使 MoeLink 的登录 / 登出 / 换账号及时生效
  useEffect(() => {
    const sync = async () => {
      if (document.visibilityState === 'hidden') return;
      if (await syncSession()) refreshUser();
    };
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [refreshUser]);

  const forceLogout = () => {
    logout();
    navigateTo('/login', { replace: true });
  };

  // 设置全局登出回调
  useEffect(() => {
    setGlobalLogoutCallback(forceLogout);
  }, []);

  // 如果还在初始化或加载用户信息，显示骨架屏
  if (!isInitialized || (token && isUserLoading)) {
    return <Skeleton />;
  }

  const value: UserContextType = {
    user: user || null,
    token,
    login,
    logout,
    forceLogout,
    isAuthenticated: !!user && !!token,
    isLoading: !isInitialized || (!!token && isUserLoading),
  };

  return (
    <UserContext.Provider value={value}>
      <LanguageProvider userLanguage={user?.language}>{children}</LanguageProvider>
    </UserContext.Provider>
  );
}

// hook
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
