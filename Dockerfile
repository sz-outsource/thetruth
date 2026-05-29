# thetruth —— 两段式：Next.js 静态导出 → nginx 托管
# 站点为纯静态导出(next.config 里 output: 'export')，产物在 out/，无需 Node 运行时。

# Stage 1: build static assets
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # next build + output:'export' → 产物输出到 /app/out

# Stage 2: serve via nginx
FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 容器仅监听 80、裸 HTTP，无 TLS / 无认证 —— 由外层反向代理接管。
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
