// 全局导航工具
// 用于在非组件代码中进行路由跳转

let globalNavigate: ((to: string, options?: { replace?: boolean }) => void) | null = null;

export const setGlobalNavigate = (
  navigateFunction: (to: string, options?: { replace?: boolean }) => void,
) => {
  globalNavigate = navigateFunction;
};

export const navigateTo = (to: string, options?: { replace?: boolean }) => {
  if (globalNavigate) {
    globalNavigate(to, options);
  } else {
    // 回退到使用 window.location，但这会导致页面刷新
    console.warn('Global navigate function not set, falling back to window.location');
    if (options?.replace) {
      window.location.replace(to);
    } else {
      window.location.href = to;
    }
  }
};
