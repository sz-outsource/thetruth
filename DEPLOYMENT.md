# DEPLOYMENT

> ⚠️ 本文档**同时是 cell-detector 自身的部署说明**，**也是**任何同类静态站点项目复用本套部署链路的现成模板。新项目里把整套配置 `cp` 过去 + 改两个占位符（`{{PROJECT_NAME}}`、`{{HOST_PORT}}`）即可。

## §1 概览

整条链路：

```
git push origin main
        │
        ▼
┌─────────────────────────────────────────────┐
│ GitHub Actions (Build & Deploy)             │
│   1. checkout                                │
│   2. docker login Docker Hub                 │
│   3. build & push image                      │ → wangshuyi2018/{{PROJECT_NAME}}:latest
│   4. POST Jenkins buildWithParameters        │   + :<commit-sha>
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ Jenkins  jenkins.wangshuyi.cn:8443           │
│   job: <gh-owner>/{{PROJECT_NAME}}/main      │
│   params: IMAGE_TAG, CONTAINER_NAME, HOST_PORT
│   Publish over SSH → jtti_hk                 │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ jtti_hk 宿主机                                │
│   docker pull <image>:<sha>                  │
│   docker stop/rm <old>                       │
│   docker run -d --restart=always \           │
│     -p {{HOST_PORT}}:80 --name <name> <img>  │
│   docker image prune -f                      │
│   curl localhost:{{HOST_PORT}}  (健康检查)    │
└─────────────────────────────────────────────┘
        │
        ▼
   外层反向代理 (TLS 终结) → https://<域名>
```

典型单次部署：Actions 约 25–40s + Jenkins 约 10–20s，**端到端不到 1 分钟**。

## §2 基建快查表（硬编码参数）

未来换 Docker Hub 账号、换 Jenkins、换部署机——只改这张表，再全局替换对应字符串即可。

| 名称              | 当前值                          | 出现位置                                                |
| ----------------- | ------------------------------- | ------------------------------------------------------- |
| `DOCKERHUB_NS`    | `wangshuyi2018`                 | `.github/workflows/deploy.yml`、`Jenkinsfile`           |
| `JENKINS_HOST`    | `jenkins.wangshuyi.cn:8443`     | `.github/workflows/deploy.yml`                          |
| `SSH_CONFIG_NAME` | `jtti_hk`                       | `Jenkinsfile`                                           |
| `ORG`             | 由 workflow 动态解析为 GitHub repo owner | Jenkins folder 名必须与 repo owner 严格一致（见 §3 步骤 3 与 §6.2） |
| `CONTAINER_PORT`  | `80`                            | `Jenkinsfile`（`${env.CONTAINER_PORT}`）；`nginx.conf` 与 `Dockerfile` 里是字面量 `80` |

### jtti_hk 上保留 / 已占用的 HOST_PORT

新项目挑端口请只在 **8600–8699 区间**内选，避开下面所有保留位与已占用：

| HOST_PORT | 项目 / 保留原因              |
| --------- | ---------------------------- |
| 22        | SSH（保留）                  |
| 80 / 443  | 对外反向代理（保留）         |
| 8443      | Jenkins controller（保留）   |
| 8603      | cell-detector                |
| 8604      | thetruth（明辨 / mingbian.ai）|

> 新项目部署成功后，回这里追加一行。

## §3 ▶ 在新项目里复用本套部署（粘给 LLM 用）

下面 `>>> COPY START <<<` 到 `>>> COPY END <<<` 之间整段，复制粘贴到新项目里 Claude Code（或任何 LLM 助手）的对话框，它就会按规则自动创建全部文件并提醒你手动配置。

---

>>> COPY START <<<

# 任务：在当前项目根目录搭建静态站点部署链路

这套部署链路（GitHub Actions → Docker Hub → Jenkins → SSH 到 jtti_hk）已在生产跑通；所有基建参数已固定。你只需要把以下两个占位符替换成具体值：

- `{{PROJECT_NAME}}` = GitHub repo 名（= Docker 镜像名 = 容器名，三者保持一致）
  - **强制约束**：必须全小写、只用 `[a-z0-9-]`、不能以 `-` 开头或结尾、长度 ≤ 30。例：`my-new-site` ✓，`MyNewSite` ✗（Docker Hub 拒绝大写），`my_site` ✗（下划线 GitHub 允许但 Docker Hub 不允许）。
- `{{HOST_PORT}}` = jtti_hk 宿主机端口
  - **强制约束**：只在 `8600–8699` 区间内挑，且不能与已占端口冲突。当前已占：**`8603`（cell-detector）**。

如果用户未提供这两个值，**先问，不要猜**。

## 0. 占位符与原生模板语法的区分（重要）

下面文件里出现的几种「双花括号」长得很像，但只有一种是占位符：

| 形式 | 含义 | 你该做什么 |
| --- | --- | --- |
| `{{PROJECT_NAME}}`、`{{HOST_PORT}}` | 本文档自定义的占位符 | **必须**按上面规则替换 |
| `${{ secrets.X }}`、`${{ github.X }}`、`${{ env.X }}` | GitHub Actions 真实语法 | **保持原样**，一个字符都不要动 |
| `${env.X}`、`${params.X}`（Groovy） | Jenkinsfile 里的 Groovy 字符串插值 | **保持原样** |

## 1. 写文件之前的预检（必做）

1. 看一下项目根目录是否有 `index.html`：
   - 有 → 继续
   - 无 → **停下来问用户**：「这是一个尚未编写的页面吗？要不要我先放一个最小占位 `index.html`？」不要自己默默写 hello-world 占位，可能覆盖用户在另一个分支正在改的稿。
2. 看一下项目根目录是否有 `assets/` 子目录：决定 Dockerfile 里要不要 `COPY assets/`（见下文规则）。
3. 看一下下面 6 个文件**是否已经存在**：
   - 不存在 → 直接按下面内容写。
   - 已存在且内容显著不同 → **停下来问用户**：「现有的 X 文件要 overwrite / merge / abort？」不要静默覆盖。
4. 项目里是否有 `package.json` + `build` 脚本（Vite / Next 静态导出 / Astro 等）？
   - 没有 → 用下面的「单阶段 Dockerfile」。
   - 有 → 用下面的「两阶段 Dockerfile」（替换单阶段那一份）。

## 2. 要创建的文件

### 2.1 `.github/workflows/deploy.yml`

```yaml
name: Build & Deploy {{PROJECT_NAME}}

# push 到 main 即触发：构建镜像 → 推 Docker Hub → 通知 Jenkins 部署
on:
  push:
    branches: [main]
  workflow_dispatch: {}

# 避免连续两次 push 产生 :latest 竞态；后到的优先，前一个被取消。
# group 里加 github.workflow 避免和仓库里其他 workflow 撞群名。
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build & push image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            wangshuyi2018/{{PROJECT_NAME}}:${{ github.sha }}
            wangshuyi2018/{{PROJECT_NAME}}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # -fsSL 让 4xx/5xx 直接让 step 红；显式传 IMAGE_TAG 走确定性部署 + 免费回滚链路
      - name: 通知 Jenkins
        run: |
          set -euo pipefail
          curl -fsSL -X POST \
            "https://jenkins.wangshuyi.cn:8443/job/${{ github.repository_owner }}/job/${{ github.event.repository.name }}/job/main/buildWithParameters" \
            -u "${{ secrets.JENKINS_USER }}:${{ secrets.JENKINS_TOKEN }}" \
            --data "IMAGE_TAG=${{ github.sha }}" \
            --data "CONTAINER_NAME={{PROJECT_NAME}}" \
            --data "HOST_PORT={{HOST_PORT}}" \
            -o /dev/null -w "Jenkins HTTP %{http_code}\n"
```

### 2.2 `Dockerfile`（单阶段 — 默认）

> 用于「无 build 步骤的纯静态站点」（cell-detector 本身就是这种）。

```dockerfile
# 单阶段：纯静态、由 nginx 托管。生产建议把 alpine 固定到具体小版本（如 nginx:1.27-alpine）
# 避免半年后 nginx 主版本 bump 引入意外行为。
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
# ↓ 如果项目根目录没有 assets/，**删掉下面这一行**（否则 build 会报 "/assets": not found）
COPY assets/ /usr/share/nginx/html/assets/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 容器仅监听 80 端口、裸 HTTP，无 TLS / 无认证 —— 由外层反向代理接管。
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.2-alt `Dockerfile`（两阶段 — 需要 build 步骤时用这一份替换上面）

> 用于 React / Vite / Next 静态导出 / Astro 等需要 `npm run build` 的项目。

```dockerfile
# Stage 1: build static assets
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # 视项目调整：输出目录可能是 dist/（Vite）、build/（CRA）、out/（Next 静态导出）

# Stage 2: serve via nginx
FROM nginx:alpine
# ↓ 若上面 build 的输出目录不是 dist/，把 /app/dist 改成 /app/build 或 /app/out
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.3 `nginx.conf`

```nginx
# {{PROJECT_NAME}} 落地页 —— 容器内 nginx 配置
# 仅裸 HTTP 监听 80；域名 / 证书由外层反向代理负责。

server {
    listen      80;
    server_name _;

    root  /usr/share/nginx/html;
    index index.html;

    # 压缩文本类资源（index.html 内联 CSS / JS 时受益明显）
    gzip            on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types      text/css application/javascript application/json image/svg+xml;
    gzip_vary       on;
    gzip_proxied    any;

    # index.html 禁缓存（避免外层反代/浏览器把旧版本缓存太久）；
    # 带 hash 的静态资源走长缓存。
    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate";
    }
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 单页落地页：未命中的路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 2.4 `Jenkinsfile`

```groovy
// {{PROJECT_NAME}} 部署流水线 —— 仅负责把已构建好的镜像部署到 jtti_hk。
// 镜像由 GitHub Actions 构建并推送到 Docker Hub (wangshuyi2018/{{PROJECT_NAME}})，
// 随后 Actions 调用 buildWithParameters 触发本任务进行部署。
pipeline {
    agent any

    options {
        // 关闭分支扫描自动触发；本任务只由 GitHub Actions 经 API 触发
        // （这是 Multibranch Pipeline 才有的开关，因此 §3 二「3」要求 Multibranch）
        overrideIndexTriggers(false)
        // 禁止并发部署，避免两次部署互相覆盖
        disableConcurrentBuilds()
        timestamps()
    }

    parameters {
        // 这三个 defaultValue 是 Jenkins UI 「Build with Parameters」手动回滚时用的，
        // 必须与 deploy.yml 里 curl 传入的字段保持同步。
        string(name: 'IMAGE_TAG',      defaultValue: 'latest',            description: 'Docker 镜像 tag（Actions 自动传入 commit SHA）')
        string(name: 'CONTAINER_NAME', defaultValue: '{{PROJECT_NAME}}',  description: 'Docker 容器名称')
        string(name: 'HOST_PORT',      defaultValue: '{{HOST_PORT}}',     description: '宿主机端口')
    }

    environment {
        DOCKER_IMAGE_NAME = 'wangshuyi2018/{{PROJECT_NAME}}'
        CONTAINER_PORT    = '80'
        // 对应 Jenkins -> Publish over SSH 里名为 "jtti_hk" 的配置
        SSH_CONFIG_NAME   = 'jtti_hk'
    }

    stages {
        stage('Deploy to jtti_hk') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: env.SSH_CONFIG_NAME,
                            verbose: true,
                            transfers: [
                                sshTransfer(
                                    // 不上传文件，只在远端执行命令
                                    sourceFiles: '',
                                    removePrefix: '',
                                    remoteDirectory: '',
                                    // 先 pull 再 stop/rm：拉取失败时不会先杀掉正在运行的旧容器
                                    execCommand: """
docker pull ${env.DOCKER_IMAGE_NAME}:${params.IMAGE_TAG}

docker stop ${params.CONTAINER_NAME} || true
docker rm ${params.CONTAINER_NAME} || true

docker run -d \\
  --restart=always \\
  -p ${params.HOST_PORT}:${env.CONTAINER_PORT} \\
  --name ${params.CONTAINER_NAME} \\
  ${env.DOCKER_IMAGE_NAME}:${params.IMAGE_TAG}

docker image prune -f
sleep 3
curl -fsS http://localhost:${params.HOST_PORT}/ >/dev/null && echo "${params.CONTAINER_NAME} is up on :${params.HOST_PORT}"
""",
                                    execTimeout: 300000,
                                    flatten: false,
                                    cleanRemote: false,
                                    makeEmptyDirs: false,
                                    noDefaultExcludes: false,
                                    patternSeparator: '[, ]+',
                                    remoteDirectorySDF: false
                                )
                            ],
                            useWorkspaceInPromotion: false,
                            usePromotionTimestamp: false
                        )
                    ]
                )
            }
        }
    }
}
```

### 2.5 `.dockerignore`

> `Jenkinsfile` 和 `.github/` 排除掉是安全的：Jenkins 通过 SCM 直接从 GitHub checkout Jenkinsfile，不经 Docker build context。

```
.git
.gitignore
.claude
.mcp.json
.github
Jenkinsfile
Dockerfile
.dockerignore
DEPLOYMENT.md
README.md
node_modules
.env
.env.*
.DS_Store
*.log
```

### 2.6 `.gitignore`

如果项目已有 `.gitignore`，**追加**下面两行；如果没有，**创建**并按项目栈补齐（node_modules、.env、dist、.DS_Store、IDE 配置等）：

```
# Claude Code local state
.claude/

# MCP config — contains local credentials, do not commit
.mcp.json
```

## 3. 创建文件之后，请明确提醒用户按下面顺序手动完成（必做）

> **0–4 必须在「第一次 `git push origin main`」之前全部做完**，否则首次 deploy 会失败。5 和 6 可以在 push 之后再做。

### 0. 创建 GitHub repo & 初始推送（如果还没有）

```bash
git init                                        # gh repo create --source=. 要求当前已经是 git 仓库
gh repo create <owner>/{{PROJECT_NAME}} --public --source=. --remote=origin
git branch -M main
git add -A && git commit -m "init"
# ⚠️ 先去做完下面 1–4 步再 push！否则首次 deploy 会因为缺 secrets / 缺 Jenkins job 失败。
```

`<owner>` 可以是组织（如 `sz-outsource`）或个人账号。**记住这个 owner 名**——后面 Jenkins folder 名必须与之严格一致（workflow 里 Jenkins URL 用 `${{ github.repository_owner }}` 动态解析）。

### 1. GitHub Secrets

repo Settings → Secrets and variables → Actions → New repository secret，加 4 条：

| Secret 名 | 值 |
| --- | --- |
| `DOCKERHUB_USERNAME` | Docker Hub 账号（通常 `wangshuyi2018`） |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token（hub.docker.com → Account Settings → Personal access tokens；**不是登录密码**） |
| `JENKINS_USER` | Jenkins 登录用户名 |
| `JENKINS_TOKEN` | Jenkins API Token（Jenkins → 用户 → Configure → API Token） |

自检：`gh secret list` 应返回 4 条。

> 漏这步 → Actions 在 docker login 步骤直接 401。

### 2. Docker Hub 仓库

登录 hub.docker.com，确认或创建仓库 `wangshuyi2018/{{PROJECT_NAME}}`。

**强烈建议 Public**。理由：
- 免匿名拉取限速。
- Docker Hub 免费账号**只允许 1 个 Private 仓库**，第二个 Private 项目会直接创建失败。
- Private repo 在 jtti_hk 上 pull 时会 `pull access denied`，除非提前在 jtti_hk 上做过 `docker login -u wangshuyi2018`。

> 漏这步 → Actions 在 push 镜像时报 `repository does not exist or may require 'docker login'`。

### 3. Jenkins job

在 https://jenkins.wangshuyi.cn:8443 创建一个 **Multibranch Pipeline**。**必须是 Multibranch**，理由：
- `overrideIndexTriggers(false)` 只在 Multibranch Pipeline 上下文有效，普通 Pipeline 会在 job 配置/运行时报错。
- workflow 里 curl 的 URL `.../job/main/buildWithParameters` 命中的是 Multibranch 自动发现的 `main` 分支子 job。

**job 路径必须严格等于** `<owner>/{{PROJECT_NAME}}/main`：

- 顶层 folder = step 0 里那个 GitHub `<owner>`（已存在直接复用；不存在先建 folder）。**这里如果错了，workflow 通知 Jenkins 会持续 404 而你不会察觉**。
- 下层 Multibranch Pipeline 名 = `{{PROJECT_NAME}}`。
- Branch source 指向新建的 GitHub repo。
- Scan 一次，确保识别到 `main` 分支。

自检：
```bash
curl -I -u "$JENKINS_USER:$JENKINS_TOKEN" \
  "https://jenkins.wangshuyi.cn:8443/job/<owner>/job/{{PROJECT_NAME}}/job/main/api/json"
# 期望 200。404 = 路径不对；401 = token 不对。
```

> 漏这步 / 路径不符 → Actions 通知 Jenkins 那条会失败（已经加了 `-fsSL`，step 会红，不再静默）。

### 4. SSH 凭证

Jenkins → Manage Jenkins → System（旧版叫 Configure System）→ Publish over SSH，确认已有名为 `jtti_hk` 的 SSH 配置。**本模板不创建它，跨所有项目共用**。

> 漏这步 → Jenkins build 在 sshPublisher 阶段直接报 `Failed to lookup SSH server`。

### 5. HOST_PORT 占用核对

你填的 `{{HOST_PORT}}` 不能与下面任何已占端口冲突。**当前已占清单（截至本模板生成时）**：

| HOST_PORT | 项目 / 保留原因 |
| --- | --- |
| 22 | SSH（保留） |
| 80 / 443 | 对外反向代理（保留） |
| 8443 | Jenkins controller（保留） |
| 8603 | cell-detector |

挑选规则：只在 `8600–8699` 区间内选；如不放心，SSH 到 jtti_hk 跑 `ss -tlnp | grep LISTEN` 验证一遍。

部署成功后，请回 DEPLOYMENT.md §2 那张表追加自己的端口。

> 撞反代/Jenkins 端口 → 可能让基础服务起不来；撞其他业务端口 → `docker run` 会报 `port is already allocated`。

### 6. 反向代理

在 jtti_hk 上的对外反代（nginx / caddy / traefik）加一条规则，把新域名指到 `localhost:{{HOST_PORT}}`。TLS 证书由反代签发；本容器只跑裸 HTTP。

> 漏这步 → 部署 OK 但公网访问不到。

## 4. 做完之后

```bash
git push origin main
gh run watch                   # 看 Actions（首次会跑 ~25–40s）
# 然后浏览器看 Jenkins UI：
#   https://jenkins.wangshuyi.cn:8443/job/<owner>/job/{{PROJECT_NAME}}/job/main/
# 日志末行应该出现：「{{PROJECT_NAME}} is up on :{{HOST_PORT}}」
curl -I https://<你的域名>/    # 反代配好后期望 200
```

>>> COPY END <<<

---

## §4 文件原文（供人类查阅）

§3 那段提示词里已包含所有文件的完整内容。这里再单独列一遍方便对照。下面所有占位符 `{{PROJECT_NAME}}` / `{{HOST_PORT}}` 在 cell-detector 这个项目里分别是 `cell-detector` / `8603`。

- `.github/workflows/deploy.yml` —— 见 §3 中 2.1
- `Dockerfile` —— 见 §3 中 2.2（单阶段）
- `nginx.conf` —— 见 §3 中 2.3
- `Jenkinsfile` —— 见 §3 中 2.4
- `.dockerignore` —— 见 §3 中 2.5
- `.gitignore` —— 见 §3 中 2.6

> 不再二次粘贴，避免两份内容漂移。新项目复刻部署，**只看 §3 即可**；本节只说明上面那些就是项目里实际存在的文件。

### §4.1 cell-detector 当前 live 文件与 §3 模板的差异（drift list）

§3 的模板是 review 过、补足了若干安全/正确性增强的"复用版"。cell-detector 仓库里**正在运行**的这几个文件仍是更早的历史版本，与 §3 在以下几点不同——下次顺手维护时一起拉齐即可，**不影响当前部署**：

| 文件 | live cell-detector 缺少的内容 | 后果 |
| --- | --- | --- |
| `.github/workflows/deploy.yml` | ① `concurrency` 段；② curl 没有 `-fsSL` / HTTP 码回显；③ `--data "IMAGE_TAG=${{ github.sha }}"`；④ 顶部注释里残留 `tcloud` 字样 | 连推两次可能产生 :latest 竞态；Jenkins 401/404 时 Actions 仍绿；rollback 只能手动指定 SHA |
| `Jenkinsfile` | ① 顶部注释 `部署到 tcloud 主机`；② SSH_CONFIG 注释 `名为 "tcloud" 的配置`；③ 末行 `echo "cell-detector is up ..."` 硬编码项目名；④ 缺 sshTransfer 内部 `// 不上传文件...` 注释 | 注释和现实不一致；改 CONTAINER_NAME 后日志会错乱 |
| `nginx.conf` | 没有 `location = /index.html` 的 `no-cache` 头，也没有 `/assets/` 的长缓存头 | 外层反代或浏览器可能把旧 index.html 缓存得偏长 |
| `.dockerignore` | 没有 `node_modules` / `.env*` / `*.log` / `DEPLOYMENT.md` / `README.md` 这些扩展条目 | cell-detector 是单文件站点，差别不会触发；新项目按 §3 写就好 |

## §5 首次跑通需手动做的 7 件事（步骤 0–6）

对照 §3 中「3. 创建文件之后」末段的 0–6 共 7 步操作。每个步骤都**必做**，缺一会 fail，每一项后面的"漏这步 →"已经写了对应故障表现，无需再赘述。

## §6 常见故障 & 排查

### 6.1 Actions 跑到 `Build & push image` 报 502 / `failed to parse error response 502: <Unicorn>`

GitHub Actions Cache 服务瞬时抖动，跟你的改动无关。

修复：`gh run rerun <run-id> --failed`（或 GitHub UI 点 Re-run failed jobs）。本项目 commit `74d51c8` 就遇到过一次。

### 6.2 Actions 跑到「通知 Jenkins」step 红，HTTP 401 或 404

模板已经加了 `-fsSL`，所以 Jenkins 这边失败 step 会直接红。看 step log 末尾 `Jenkins HTTP <code>`：
- `200` —— Jenkins 已收到，但你 Actions step 仍然红，那是别的环节。
- `401` —— `JENKINS_USER` / `JENKINS_TOKEN` secret 不对或已被 revoke；重新生成 token 后更新 GitHub secret。
- `404` —— Jenkins job 路径不存在。常见原因：
  - GitHub repo owner 与 Jenkins folder 名不一致（workflow 用 `github.repository_owner`，Jenkins 那边手建的 folder 名是别的）。
  - Multibranch Pipeline 没扫到 `main` 分支：Jenkins UI 上手动「Scan Multibranch Pipeline Now」。
  - PROJECT_NAME 大小写/连字符不匹配。

自检命令见 §3「3. Jenkins job」的 curl。

### 6.3 Actions 在 push 镜像时报 `repository name must be lowercase` / `invalid reference format`

`{{PROJECT_NAME}}` 含大写或非法字符。Docker Hub 镜像名只接受 `[a-z0-9_-]` 且不能以 `_` / `-` 开头。

修：`gh repo rename`（同时 Docker Hub 上把仓库也改名）→ 改 deploy.yml + Jenkinsfile 里的 `{{PROJECT_NAME}}` → 重 push。

### 6.4 Jenkins build 报 `pull access denied, repository does not exist or may require 'docker login'`

`wangshuyi2018/{{PROJECT_NAME}}` 是 Private repo 但 jtti_hk 上没 docker login。

两种修法：
- **首选**：到 hub.docker.com 把 repo 改成 Public。
- 必须 Private 时：SSH 到 jtti_hk，跑 `docker login -u wangshuyi2018`（输入 Access Token 作为密码）。

### 6.5 Jenkins build 报 `port is already allocated` / 健康检查 connection refused

`{{HOST_PORT}}` 撞了。
- 自检：`ssh jtti_hk 'ss -tlnp | grep :{{HOST_PORT}}'`
- 改：选一个新端口，更新 deploy.yml `--data "HOST_PORT=..."` + Jenkinsfile defaultValue + DEPLOYMENT.md §2 占用表，重 push。

### 6.6 公网访问看到的还是旧版本（curl localhost:{{HOST_PORT}} 是新的）

外层反代或浏览器缓存。诊断：

```bash
curl -I https://<域名>/index.html
# 看 Cache-Control / Age / X-Cache 头
```

修：模板 nginx.conf 已对 `/index.html` 设 `no-cache`；反代层如果还有自己的 cache，按反代规则刷一遍。favicon 单独再硬刷一次浏览器（Chrome：DevTools → Application → Clear storage）。

### 6.7 想回滚到指定 commit

模板已经让 Actions 把 `IMAGE_TAG=${{ github.sha }}` 传给 Jenkins，所以**每次 Actions 触发的部署都是确定性的**。手动回滚：

Jenkins UI → 找到该 multibranch job → 左边「Build with Parameters」→ `IMAGE_TAG=<那个旧 sha>` → Build。不走 Actions、不动 main 分支，安全。

### 6.8 连续两次 push 但线上是旧版本

模板已经加了 `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }`，正常情况下后到的会取消前一个。但**有一种边界情况**：如果 A1 已经跑完 build & push 并 POST 到 Jenkins 才被 A2 cancel，Jenkins 端 `disableConcurrentBuilds()` 只是串行队列、不会取消已入队的 A1。结果是线上短暂出现 A1 → A2 的顺序部署，最终态仍是 A2 但中间会闪一下 A1。

如果看到这种现象或直接看到旧版本：
- 检查 deploy.yml 里 concurrency 段没被改掉。
- 进 Jenkins UI 看 build 队列，必要时手动 Abort 老的 build。
- 用 §6.7 的方式手动指定 `IMAGE_TAG=<最新 sha>` 重部一次。

## §7 端到端验证（首次或日常）

```bash
# 1. 推送
git push origin main

# 2. 看 Actions
gh run list --limit 3 --branch main
gh run watch <run-id>     # 跟到 ✓
# 末尾应看到：「Jenkins HTTP 201」（或 200）

# 3. 看 Jenkins
#    https://jenkins.wangshuyi.cn:8443/job/<owner>/job/{{PROJECT_NAME}}/job/main/
#    末行应有：{{PROJECT_NAME}} is up on :{{HOST_PORT}}

# 4. 看公网
curl -I https://<你的域名>/
```

全绿即部署成功。
