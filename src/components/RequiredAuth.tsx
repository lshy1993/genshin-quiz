import { Skeleton } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    // 你可以返回一个 loading 组件
    return <Skeleton />;
  }

  if (!user) {
    console.log('User not authenticated, redirecting to login.');
    // 未登录，重定向到登录页，并记录当前页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
