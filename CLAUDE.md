# thetruth（明辨 / TheTruth）

AI 驱动的「核查 + 思辨」工具的展示站:把藏在文字里的「钩子」(挑过的措辞、似是而非的逻辑、踩准情绪的节奏)摊到台面上,让独立判断重新回到普通人手边。

**技术栈**:Next.js (App Router, TS) + React + Tailwind CSS v4 + framer-motion。**纯静态导出**(`output: 'export'` → `out/`),全客户端 + 预置 mock 数据,无 SSR/后端,由 Nginx 托管。

部署域名 `mingbian.ai`(明辨)。仓库:`git@github.com:<owner>/thetruth.git`。

## 核心文件

- `app/layout.tsx` — next/font 注入(Fraunces / Newsreader / IBM Plex Mono / Noto Serif SC)、metadata(metadataBase = https://mingbian.ai)、`lang="zh-CN"`。
- `app/globals.css` — Tailwind v4 `@theme` 设计 token:纸/墨/朱红调色板、语义批注色、字体变量、批注笔法(马克笔高亮 / 引线 / 首字下沉)、纸张噪点。
- `app/page.tsx` — 组装各 section。
- `components/` — `SiteHeader`、`Hero`(加载时实时批改的开场)、`Editorial`(理念)、`MethodPillars`(识别/核查/还原)、`DemoWorkspace`(核心交互解剖台)、`SourceCheck`(多源核查卡)、`Colophon`(技术栈/推理链)、`Roadmap`、`Footer`;核心 `Dissection`(高亮 + 边栏批注 + SVG 引线)、`AnnotatedText`、`AnnotationCard`、`ui/{Section,LeaderLine}`。
- `lib/fixtures.ts` — 预置样本文本 + 分析数据(hook 片段、批注类型/解释、逐句推理链、多源核查结论)。**演示数据全在此**,无后端。
- `next.config.ts` — 静态导出(`output: 'export'`、`images.unoptimized`、`trailingSlash`)。
- `Dockerfile` — **两段式**:`node:lts-alpine` 跑 `npm ci && npm run build` 产出 `out/` → `nginx:alpine` 托管;`EXPOSE 80`。
- `nginx.conf` — 容器内 Nginx:监听 80、gzip、`/index.html` no-cache、`/_next/` 长缓存、未命中回退 `index.html`。
- `.github/workflows/deploy.yml` — push 到 `main` 触发:构建镜像 → 推 Docker Hub → 调 Jenkins API。
- `Jenkinsfile` — 只做部署:拉镜像 → 停旧容器 → 起新容器 → `docker image prune` → 本地 `curl` 健康检查。
- `DEPLOYMENT.md` — 完整部署链路与排查指南(同时是复用模板)。

## 部署链路

`本地 push → GitHub Actions 构建并推 wangshuyi2018/thetruth → 触发 Jenkins (<owner>/thetruth/main) → SSH 到 jtti_hk → 在目标机以容器 thetruth 运行,宿主机端口 8604 → 容器 80 → 反代 mingbian.ai`。

## 关键参数

| 项                | 值                                |
| ----------------- | --------------------------------- |
| Docker 镜像       | `wangshuyi2018/thetruth`          |
| 容器名            | `thetruth`                        |
| HOST_PORT         | `8604`                            |
| 容器内端口        | `80`                              |
| Jenkins SSH 配置  | `jtti_hk`                         |
| 部署域名          | `mingbian.ai`                     |
| 健康检查          | `curl -fsS http://localhost:8604/` |

## 注意事项

- 修改 `Dockerfile` / `nginx.conf` / `Jenkinsfile` / `.github/workflows/deploy.yml` 时,去 `DEPLOYMENT.md` 同步更新对应章节。
- 站点是**静态导出**:不能用 SSR、Route Handler、`next/image` 优化、Server Actions 等运行期特性;新增交互一律走客户端组件 + `lib/fixtures.ts` mock 数据。
- `.mcp.json` 与 `.claude/` 已在 `.gitignore` / `.dockerignore` 中忽略,**不要**提交进仓库或打进镜像。
- GitHub Actions 调 Jenkins 时不传 `IMAGE_TAG`?——实际**会**传 `IMAGE_TAG=${{ github.sha }}`,线上部署确定性;回滚在 Jenkins 上手动 buildWithParameters 传 `IMAGE_TAG=<sha>`。
- Workflow 用 `${{ github.repository_owner }}` / `${{ github.event.repository.name }}` 拼 Jenkins job 路径;Jenkins 上的 Multibranch Pipeline 必须按 `<owner>/thetruth/main` 命名才能匹配上。
- `Dockerfile` 用 `npm ci`,依赖 `package-lock.json`,确保它已提交进仓库。
