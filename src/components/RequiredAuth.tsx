import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const isLogin = false; /* 你的登录状态判断逻辑，比如从 context 或 redux 获取 */
  const location = useLocation();

  if (!isLogin) {
    // 未登录，重定向到登录页，并记录当前页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
