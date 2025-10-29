import { Skeleton } from '@mui/material';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/api/dto';
import { setGlobalLogoutCallback, setJWT } from '@/api/fetcher/fetcher';
import { useGetCurrentUser } from '@/api/genshinQuizAPI';
import { navigateTo } from '@/util/navigation';
import { LanguageProvider } from './LanguageContext';

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  forceLogout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'genshin_quiz_token';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 从 localStorage 恢复 token 并设置到 axios 请求头
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        console.log('token found and fetching user info...');
        setToken(storedToken);
        setJWT(storedToken); // 设置到 axios 请求头
        // ✅ 可选：延迟一帧确保 SWR 已经开始请求
        requestAnimationFrame(() => {
          refreshUser();
        });
      }
    } catch (error) {
      console.error('Failed to restore token:', error);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }
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

  // // 监听 token 变化，确保在 token 设置后立即获取用户信息
  // useEffect(() => {
  //   if (token && isInitialized) {
  //     console.log('Token available, fetching user info...');
  //     refreshUser();
  //   }
  // }, [token, isInitialized, refreshUser]);

  // 如果token存在但获取用户信息失败，说明token可能过期
  useEffect(() => {
    if (token && isInitialized && !isUserLoading && userError) {
      console.warn('Token may be expired, logging out:', userError);
      logout();
    }
  }, [token, isInitialized, isUserLoading, userError]);

  const login = (newToken: string) => {
    setToken(newToken);
    setJWT(newToken); // 设置到 axios 请求头
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
  };

  const logout = () => {
    setToken(null);
    setJWT(''); // 清除 axios 请求头
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

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
