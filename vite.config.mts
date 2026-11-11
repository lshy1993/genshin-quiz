import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

function buildStamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join('');
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const now = new Date();
  const isDev = mode === 'development';
  const buildVersion = process.env.VITE_BUILD_VERSION?.trim() || (isDev ? 'dev' : buildStamp(now));

  return {
    define: {
      __BUILD_VERSION__: JSON.stringify(buildVersion),
      __BUILD_TIME__: JSON.stringify(now.toISOString()),
    },
    plugins: [react(), viteTsconfigPaths(), svgr()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: 3000, // 可以设置为你需要的端口
      host: true, // 使服务器在所有网络接口上可用
      proxy: {
        // auth-service 独立进程：/api/auth/* -> auth-service /auth/*
        '/api/auth': {
          target: process.env.AUTH_API_URL || 'http://localhost:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
