# --- 第一阶段：构建阶段 (Bun) ---
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN bun run build:api && bun run build

# --- 第二阶段：运行阶段 (Nginx) ---
FROM nginx:alpine

# 1. 拷贝静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 2. 【重点】修改 Nginx 配置，使其监听 8080
# 并且处理 SPA 路由 (try_files)
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 3. 声明 8080 端口
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
