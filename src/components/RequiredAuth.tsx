import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // 未登录，重定向到登录页，并记录当前页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
