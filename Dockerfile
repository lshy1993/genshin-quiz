# --- 第一阶段：构建阶段 (Bun) ---
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_BUILD_VERSION=development
ENV VITE_BUILD_VERSION=$VITE_BUILD_VERSION

COPY . .
# RUN bun run build:api && bun run build
RUN sed "/return import/c\return import('../vite/dist/node/cli.js')" -i node_modules/.bin/vite && \
    bun run build

# --- 第二阶段：运行阶段 (Nginx) ---
FROM nginx:alpine

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_BUILD_VERSION=development
ENV VITE_BUILD_VERSION=$VITE_BUILD_VERSION

# 1. 拷贝静态文件
COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# 2. 安装 envsubst，用于在容器启动时替换 VITE_API_URL
RUN apk add --no-cache gettext

# 3. 声明 8080 端口
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "envsubst '$VITE_API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'" ]
