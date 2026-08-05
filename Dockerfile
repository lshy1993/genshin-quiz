# --- 第一阶段：构建阶段 (Bun) ---
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
# RUN bun run build:api && bun run build
RUN sed "/return import/c\return import('../vite/dist/node/cli.js')" -i node_modules/.bin/vite && \
    bun run build

# --- 第二阶段：运行阶段 (Nginx) ---
FROM nginx:alpine

# 1. 拷贝静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 2. 拷贝 Nginx 模板文件到官方指定的 templates 目录下
COPY default.conf.template /etc/nginx/templates/default.conf.template

# 3. 声明 8080 端口
EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
