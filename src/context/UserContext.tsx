import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/api/dto';
import { setGlobalLogoutCallback } from '@/api/fetcher/fetcher';
import { navigateTo } from '@/util/navigation';

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  forceLogout: () => void; // 新增：用于服务器强制登出
  isAuthenticated: boolean;
  isLoading: boolean; // 新增
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'genshin_quiz_token';
const USER_STORAGE_KEY = 'genshin_quiz_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 新增

  // 从 localStorage 恢复认证状态
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error);
      // 清理无效数据
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false); // 恢复完成后设置为 false
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    // 持久化到 localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    // 清理 localStorage
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const forceLogout = () => {
    // 强制登出：清理状态并跳转到登录页
    logout();
    // 使用路由导航而不是直接修改 window.location
    navigateTo('/login', { replace: true });
  };

  // 设置全局登出回调
  useEffect(() => {
    setGlobalLogoutCallback(forceLogout);
  }, []);

  const value: UserContextType = {
    user,
    token,
    login,
    logout,
    forceLogout,
    isAuthenticated: !!user && !!token,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
