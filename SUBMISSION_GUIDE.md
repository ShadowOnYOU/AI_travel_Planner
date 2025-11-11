# 📚 AI Travel Planner - 作业提交说明

## 🎯 项目概述

本项目是一个基于 Next.js + AI 的智能旅行规划系统，集成了阿里云百炼 AI 和高德地图 API，提供个性化旅行行程生成、地图可视化、预算管理等功能。

## 📦 Docker 镜像信息

### 镜像地址
```bash
crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 镜像详情
- **镜像大小**: ~500MB
- **基础镜像**: Node.js 20-slim
- **构建时间**: 2025年11月10日
- **镜像摘要**: sha256:22046657b0f75dc72e04fb167fa9e1be6428d79803b760744edc75b65e46a550

## 🚀 快速运行指南

### 方式一：一键运行（推荐）⭐

```bash
# 直接拉取并运行镜像
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 方式二：分步运行

```bash
# 1. 拉取镜像
docker pull crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest

# 2. 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 方式三：使用短名称（需要先拉取）

```bash
# 先拉取并重新标记
docker pull crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
docker tag crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest ai-travel-planner:latest

# 然后运行
docker run -d --name ai-travel-planner -p 3000:3000 ai-travel-planner:latest
```

## 🌐 访问应用

启动成功后，打开浏览器访问：

```
http://localhost:3000
```

## 🔧 容器管理命令

### 查看运行状态
```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs ai-travel-planner

# 实时查看日志
docker logs -f ai-travel-planner
```

### 停止和清理
```bash
# 停止容器
docker stop ai-travel-planner

# 删除容器
docker rm ai-travel-planner

# 删除镜像（可选）
docker rmi crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 重启容器
```bash
# 重启已存在的容器
docker restart ai-travel-planner

# 或者删除后重新运行
docker rm -f ai-travel-planner
docker run -d --name ai-travel-planner -p 3000:3000 \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

## 🔑 预配置信息

### API Keys（已内置）
镜像已预配置以下 API Keys，无需额外配置：

```bash
# 高德地图 API Key
NEXT_PUBLIC_AMAP_KEY=1e967f9e5d863f52e8e76a8b7c381669

# 阿里云百炼 AI API Key  
NEXT_PUBLIC_BAILIAN_API_KEY=sk-7b2ff1814ecb499d89d56e86af030b19

# Supabase 数据库配置
NEXT_PUBLIC_SUPABASE_URL=https://untvtsdpychqwikqdkgg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudHZ0c2RweWNocXdpa3Fka2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjM4NjQsImV4cCI6MjA3NjEzOTg2NH0.3lTm4PFwCxxKWgjE5YFP90I0oQgNKn-scOKCOqitIWs
```

**⚠️ 注意**: 这些是测试用的有限额度 API Keys，有效期至 **2025年3月10日**。

## ✨ 功能演示

### 1. 用户注册/登录
- 访问 http://localhost:3000/auth/signin
- 可以注册新用户或使用测试账号

### 2. 智能行程规划
- 访问 http://localhost:3000/plan
- 输入目的地、天数、预算等信息
- AI 自动生成个性化旅行行程

### 3. 地图可视化
- 在行程详情页面查看地图
- 显示景点位置和路线规划
- 支持路线优化和导航

### 4. 预算管理
- 访问 http://localhost:3000/budget
- 查看详细预算分析
- 追踪实际花费

### 5. 配置管理
- 访问 http://localhost:3000/config
- 可以测试和更新 API Keys（如需要）

## 🐛 常见问题排查

### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :3000

# 使用其他端口
docker run -d --name ai-travel-planner -p 8080:3000 \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest

# 然后访问 http://localhost:8080
```

### 2. 容器启动失败
```bash
# 查看详细错误信息
docker logs ai-travel-planner

# 查看容器状态
docker ps -a
```

### 3. 镜像拉取速度慢
```bash
# 如果拉取慢，可以尝试配置 Docker 镜像加速器
# 或者直接运行，Docker 会自动拉取
docker run -d --name ai-travel-planner -p 3000:3000 \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

## 📊 系统要求

### 最低要求
- **Docker**: 20.10+
- **内存**: 512MB 可用内存
- **磁盘**: 1GB 可用空间
- **网络**: 需要访问外网（阿里云 API、高德地图 API）

### 推荐配置
- **Docker**: 最新版本
- **内存**: 1GB+ 可用内存
- **磁盘**: 2GB+ 可用空间
- **CPU**: 双核以上

## 📁 项目文件结构

```
AI_travel_Planner/
├── 📁 src/                    # 源代码目录
│   ├── 📁 app/               # Next.js 页面路由
│   ├── 📁 components/        # React 组件
│   ├── 📁 lib/              # 核心服务库
│   └── 📁 types/            # TypeScript 类型定义
├── 📁 public/               # 静态资源
├── 📁 database/             # 数据库 Schema
├── 🐳 Dockerfile            # Docker 镜像配置
├── 🐳 docker-compose.yml    # Docker Compose 配置  
├── 📋 README.md             # 项目说明文档
└── 📋 SUBMISSION_GUIDE.md   # 本文件（作业提交说明）
```

## 🎓 项目技术亮点

1. **🤖 AI 集成**: 使用阿里云百炼平台实现智能行程规划
2. **🗺️ 地图可视化**: 集成高德地图 API，提供路线规划和导航
3. **💾 数据持久化**: 支持 Supabase 云数据库
4. **🎨 现代化 UI**: 基于 Tailwind CSS 的响应式设计
5. **🐳 容器化部署**: Docker 容器化，一键部署
6. **🔧 配置管理**: 灵活的 API Key 配置系统
7. **📱 移动端适配**: 完美支持移动设备访问

## 📞 技术支持

如遇到问题，请检查：
1. Docker 是否正常运行：`docker --version`
2. 端口是否被占用：`lsof -i :3000`
3. 容器日志信息：`docker logs ai-travel-planner`
4. 网络连接是否正常

## 📝 提交信息

- **提交时间**: 2025年11月10日
- **项目版本**: v1.0.0
- **Git 提交**: 6e488ba
- **Docker 镜像**: crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest

---

**🌟 快速体验命令（复制粘贴即可）**:

```bash
docker run -d --name ai-travel-planner -p 3000:3000 crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest && echo "🎉 应用启动成功！请访问 http://localhost:3000"
```