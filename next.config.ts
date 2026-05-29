import type { NextConfig } from "next";

// 纯静态导出:全客户端 + mock 数据,无 SSR/后端 → 产物为 out/,由 nginx 托管。
// 与现有 DEPLOYMENT.md 的两段式 Dockerfile(COPY --from=build /app/out)对齐。
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
