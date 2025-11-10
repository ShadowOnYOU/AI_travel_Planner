# 🌍 AI Travel Planner - 智能旅行规划助手

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](https://hub.docker.com)
[![Next.js](https://img.shields.io/badge/Next.js-13.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

基于 AI 的智能旅行规划系统，集成阿里云百炼 AI、高德地图 API，提供个性化旅行行程生成、地图可视化、预算管理等功能。

## 📋 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
  - [方式一：Docker 运行（推荐）](#方式一docker-运行推荐)
  - [方式二：本地开发](#方式二本地开发)
- [API Keys 配置](#api-keys-配置)
- [环境变量](#环境变量)
- [项目结构](#项目结构)
- [部署](#部署)
- [常见问题](#常见问题)
- [License](#license)

## ✨ 功能特性

- 🤖 **AI 智能生成行程**：基于阿里云百炼平台，根据目的地、天数、预算等智能生成个性化旅行计划
- 🗺️ **地图可视化**：集成高德地图 API，展示行程路线、景点位置、路径规划
- 💰 **预算管理**：详细的预算分析和费用追踪
- 🎨 **现代化 UI**：基于 Tailwind CSS 的响应式设计，支持深色模式
- 📱 **移动端适配**：完美支持移动设备访问
- 🔧 **灵活配置**：支持通过 UI 界面配置 API Keys，无需重启服务
- 💾 **数据持久化**：支持 Supabase 数据库或本地存储
- 🐳 **Docker 支持**：一键部署，开箱即用

## 🛠️ 技术栈

- **前端框架**: Next.js 13.5 (App Router)
- **开发语言**: TypeScript 5.0
- **样式方案**: Tailwind CSS 3.3
- **AI 服务**: 阿里云百炼平台 (DashScope API)
- **地图服务**: 高德地图 Web API 2.0
- **数据库**: Supabase (可选)
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 🚀 快速开始

### 方式一：Docker 运行（推荐）

#### 前置要求
- 安装 [Docker](https://www.docker.com/get-started) (20.10+)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

#### 1. 拉取 Docker 镜像

```bash
# 从阿里云镜像仓库拉取（国内用户推荐）
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 或从 Docker Hub 拉取
docker pull shadowonyou/ai-travel-planner:latest
```

#### 2. 创建配置文件

创建 `.env` 文件，添加必要的 API Keys：

```bash
# 高德地图 API Key（必需）
NEXT_PUBLIC_AMAP_KEY=1e967f9e5d863f52e8e76a8b7c381669

# 阿里云百炼 AI API Key（必需，有效期至 2025-03-10）
NEXT_PUBLIC_BAILIAN_API_KEY=sk-7b2ff1814ecb499d89d56e86af030b19
NEXT_PUBLIC_BAILIAN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
NEXT_PUBLIC_BAILIAN_MODEL_ID=qwen-plus

# Supabase 配置（可选，不配置时使用本地存储）
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### 3. 启动容器

```bash
# 方法1: 使用 docker-compose（推荐）
docker-compose up -d

# 方法2: 使用自动化脚本
./docker-start.sh

# 方法3: 手动构建和运行
DOCKER_BUILDKIT=0 docker build -t ai-travel-planner:latest .
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -e NEXT_PUBLIC_AMAP_KEY=1e967f9e5d863f52e8e76a8b7c381669 \
  -e NEXT_PUBLIC_BAILIAN_API_KEY=sk-7b2ff1814ecb499d89d56e86af030b19 \
  -e NEXT_PUBLIC_BAILIAN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1 \
  -e NEXT_PUBLIC_BAILIAN_MODEL_ID=qwen-plus \
  -e NEXT_PUBLIC_SUPABASE_URL=https://untvtsdpychqwikqdkgg.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudHZ0c2RweWNocXdpa3Fka2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjM4NjQsImV4cCI6MjA3NjEzOTg2NH0.3lTm4PFwCxxKWgjE5YFP90I0oQgNKn-scOKCOqitIWs \
  ai-travel-planner:latest
```

> **💡 提示**: 项目已预配置所有必需的 API 密钥，包括 Supabase 数据库，可直接运行无需额外配置。

#### 4. 访问应用

打开浏览器访问：http://localhost:3000

#### 停止和清理

```bash
# 停止容器
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 查看日志
docker-compose logs -f
```

### 方式二：本地开发

#### 前置要求
- Node.js 18.0+ (推荐使用 20.x)
- npm 9.0+ 或 yarn 1.22+

#### 1. 克隆项目

```bash
git clone https://github.com/ShadowOnYOU/AI_travel_Planner.git
cd AI_travel_Planner
```

#### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

#### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入 API Keys（见下方配置说明）。

#### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000

#### 5. 构建生产版本

```bash
npm run build
npm run start
```

## 🔑 API Keys 配置

### 教学/演示用 API Keys（已包含在镜像中）

以下 API Keys 已配置在 Docker 镜像中，**有效期至 2025-03-10**，供助教批改作业使用：

```bash
# 高德地图 API Key
NEXT_PUBLIC_AMAP_KEY=1e967f9e5d863f52e8e76a8b7c381669

# 阿里云百炼 AI API Key
NEXT_PUBLIC_BAILIAN_API_KEY=sk-7b2ff1814ecb499d89d56e86af030b19
```

**⚠️ 注意事项：**
- 这些是有限额度的测试 Key，仅供演示和评估使用
- 请勿在生产环境或大规模使用中使用
- 如需长期使用，请申请自己的 API Keys

### 申请自己的 API Keys

#### 1. 高德地图 API Key

1. 访问 [高德开放平台](https://console.amap.com)
2. 注册并登录账号
3. 进入"应用管理" → "我的应用"
4. 创建新应用，选择 "Web端（JS API）"
5. 复制生成的 Key

#### 2. 阿里云百炼 AI API Key

1. 访问 [阿里云百炼平台](https://www.aliyun.com/product/bailian)
2. 开通百炼服务并创建应用
3. 在"API-KEY 管理"中创建或查看 API Key
4. 复制 API Key 和 Workspace ID（如有）

#### 3. Supabase（可选）

1. 访问 [Supabase](https://supabase.com) 创建项目
2. 在项目设置中找到 API 配置
3. 复制 Project URL 和 anon public key

### 在应用中配置 API Keys

方式 1：通过配置页面（推荐）

1. 访问 http://localhost:3000/config
2. 在相应标签页输入 API Keys
3. 点击"🧪 测试连接"验证配置
4. 点击"💾 保存配置"

方式 2：通过环境变量

编辑 `.env` 或 `.env.local` 文件，添加 API Keys 后重启服务。

## 📦 环境变量

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `NEXT_PUBLIC_AMAP_KEY` | 高德地图 API Key | 是 | - |
| `NEXT_PUBLIC_BAILIAN_API_KEY` | 阿里云百炼 API Key | 是 | - |
| `NEXT_PUBLIC_BAILIAN_BASE_URL` | 百炼 API 基础 URL | 否 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `NEXT_PUBLIC_BAILIAN_MODEL_ID` | 百炼使用的模型 | 否 | `qwen-plus` |
| `NEXT_PUBLIC_BAILIAN_WORKSPACE_ID` | 百炼工作空间 ID | 否 | - |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 否 | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名访问 Key | 否 | - |
| `NODE_ENV` | Node 环境 | 否 | `production` |
| `PORT` | 服务端口 | 否 | `3000` |

## 📁 项目结构

```
AI_travel_Planner/
├── .github/
│   └── workflows/
│       └── docker-build.yml      # GitHub Actions 配置
├── src/
│   ├── app/                      # Next.js App Router 页面
│   │   ├── api/                  # API 路由
│   │   ├── auth/                 # 认证页面
│   │   ├── config/               # 配置管理页面
│   │   ├── itinerary/            # 行程管理
│   │   ├── plan/                 # 行程规划
│   │   └── ...
│   ├── components/               # React 组件
│   │   ├── MapComponent.tsx      # 地图组件
│   │   ├── TravelForm.tsx        # 行程表单
│   │   └── ...
│   ├── lib/                      # 核心库
│   │   ├── bailian-api.ts        # 百炼 AI API
│   │   ├── itinerary-service.ts  # 行程服务
│   │   ├── supabase.ts           # Supabase 客户端
│   │   └── ...
│   ├── types/                    # TypeScript 类型定义
│   └── utils/                    # 工具函数
├── public/                       # 静态资源
├── database/                     # 数据库 Schema
├── Dockerfile                    # Docker 镜像配置
├── docker-compose.yml            # Docker Compose 配置
├── next.config.js                # Next.js 配置
├── tailwind.config.js            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

## 🌐 部署

### 部署到阿里云容器服务

1. **推送镜像到阿里云镜像仓库**

```bash
# 登录阿里云镜像仓库
docker login --username=your-username registry.cn-hangzhou.aliyuncs.com

# 构建并推送
docker build -t registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest .
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

2. **使用 GitHub Actions 自动部署**

在 GitHub 仓库设置中添加以下 Secrets：

- `ALIYUN_REGISTRY`: 阿里云镜像仓库地址（如 `registry.cn-hangzhou.aliyuncs.com`）
- `ALIYUN_NAMESPACE`: 命名空间
- `ALIYUN_USERNAME`: 阿里云账号
- `ALIYUN_PASSWORD`: 阿里云密码或访问令牌
- `DOCKERHUB_USERNAME`: Docker Hub 用户名（可选）
- `DOCKERHUB_TOKEN`: Docker Hub 访问令牌（可选）

推送代码到 `main` 分支即可自动构建和部署。

### 部署到其他平台

- **Vercel**: 直接连接 GitHub 仓库部署
- **Railway**: 支持 Docker 部署
- **AWS ECS**: 使用 Docker 镜像部署
- **Azure Container Instances**: 支持 Docker 容器

## ❓ 常见问题

### 1. Docker 镜像拉取失败

**问题**: `Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: TLS handshake timeout`

**解决方案**:
- 使用阿里云镜像仓库：`registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest`
- 配置 Docker 镜像加速器

### 2. API Key 无效

**问题**: 提示 "API Key 验证失败"

**解决方案**:
1. 访问配置页面：http://localhost:3000/config
2. 使用"🧪 测试连接"功能验证 API Key
3. 确认 Key 未过期且有足够配额
4. 重新保存配置

### 3. 地图无法显示

**问题**: 地图区域显示空白

**解决方案**:
1. 检查高德地图 API Key 是否正确
2. 确认 API Key 的服务平台类型为 "Web端（JS API）"
3. 检查浏览器控制台是否有错误信息
4. 确认网络可以访问 `webapi.amap.com`

### 4. 行程生成失败

**问题**: AI 生成行程时出错

**解决方案**:
1. 检查百炼 API Key 是否有效
2. 确认账号有足够的调用配额
3. 检查网络是否能访问阿里云 API
4. 查看浏览器控制台的详细错误信息

### 5. 端口被占用

**问题**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用其他端口
docker run -p 8080:3000 ...
```

## 📝 开发日志

详细的开发过程和提交记录请查看：
- [GitHub Commits](https://github.com/ShadowOnYOU/AI_travel_Planner/commits/main)
- [Pull Requests](https://github.com/ShadowOnYOU/AI_travel_Planner/pulls)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

本项目采用 [MIT License](LICENSE)

## 👤 作者

**ShadowOnYOU**
- GitHub: [@ShadowOnYOU](https://github.com/ShadowOnYOU)
- 项目地址: https://github.com/ShadowOnYOU/AI_travel_Planner

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [阿里云百炼](https://www.aliyun.com/product/bailian) - AI 服务
- [高德开放平台](https://lbs.amap.com/) - 地图服务
- [Supabase](https://supabase.com/) - 后端服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
