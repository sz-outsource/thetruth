// thetruth 部署流水线 —— 仅负责把已构建好的镜像部署到 jtti_hk。
// 镜像由 GitHub Actions 构建并推送到 Docker Hub (wangshuyi2018/thetruth)，
// 随后 Actions 调用 buildWithParameters 触发本任务进行部署。
pipeline {
    agent any

    options {
        // 关闭分支扫描自动触发；本任务只由 GitHub Actions 经 API 触发
        // （这是 Multibranch Pipeline 才有的开关，因此 Jenkins 上必须建 Multibranch）
        overrideIndexTriggers(false)
        // 禁止并发部署，避免两次部署互相覆盖
        disableConcurrentBuilds()
        timestamps()
    }

    parameters {
        // 这三个 defaultValue 是 Jenkins UI 「Build with Parameters」手动回滚时用的，
        // 必须与 deploy.yml 里 curl 传入的字段保持同步。
        string(name: 'IMAGE_TAG',      defaultValue: 'latest',     description: 'Docker 镜像 tag（Actions 自动传入 commit SHA）')
        string(name: 'CONTAINER_NAME', defaultValue: 'thetruth',   description: 'Docker 容器名称')
        string(name: 'HOST_PORT',      defaultValue: '8604',       description: '宿主机端口')
    }

    environment {
        DOCKER_IMAGE_NAME = 'wangshuyi2018/thetruth'
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
