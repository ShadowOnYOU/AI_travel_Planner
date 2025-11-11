# 🌍 AI Travel Planner - 智能旅行规划助手

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](https://hub.docker.com)

基于阿里云百炼 AI 和高德地图的智能旅行规划系统，一键生成个性化行程并提供地图可视化。

⚠️注：助教进行项目检查可以参考作业提交文件夹。内部有相关文档与演示视频。

## ✨ 功能特性

- 🤖 **AI 智能规划**：基于阿里云百炼，智能生成个性化旅行计划
- 🗺️ **地图可视化**：高德地图展示路线、景点位置
- ✏️ **行程管理**：支持编辑、保存、标签分类
- 🎨 **响应式设计**：完美适配桌面和移动端
- 🐳 **Docker 部署**：一键启动，开箱即用

## 🛠️ 技术栈

Next.js 13.5 + TypeScript + Tailwind CSS + 阿里云百炼 AI + 高德地图 + Supabase

## 🚀 快速开始

### Docker 一键启动（推荐）

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --platform linux/amd64 \
  -e NEXT_PUBLIC_AMAP_KEY=f47ba60794341f862ce2c49df4e2e14b \
  -e NEXT_PUBLIC_BAILIAN_API_KEY=sk-9404820cdc734865a5301c966c4ad016 \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

访问：http://localhost:3000

### 本地开发

```bash
git clone https://github.com/ShadowOnYOU/AI_travel_Planner.git
cd AI_travel_Planner
npm install --legacy-peer-deps
cp .env.example .env.local  # 编辑并填入API密钥
npm run dev
```

## 🔑 快速体验

### 测试账户
```
用户名：335933870@qq.com
密码：123321
```

### 使用步骤
1. 启动应用后访问 http://localhost:3000/config
2. 配置 API 密钥并测试连接（**必须步骤**）
3. 登录测试账户开始体验

### 获取 API 密钥
- **高德地图**：[console.amap.com](https://console.amap.com) (选择Web端JS API)
- **阿里云百炼**：[dashscope.console.aliyun.com](https://dashscope.console.aliyun.com)

##  项目结构

```
src/
├── app/              # Next.js 页面路由
├── components/       # React 组件
├── lib/             # 核心API库
├── types/           # TypeScript 类型
└── utils/           # 工具函数
```

## ❓ 常见问题

- **API配置**：访问 http://localhost:3000/config 配置并测试API密钥
- **地图不显示**：确认高德API密钥类型为"Web端(JS API)"
- **AI生成失败**：检查百炼API密钥和网络连接
- **端口占用**：使用 `docker run -p 8080:3000` 更换端口

## 📄 License

MIT License - 查看 [LICENSE](LICENSE) 文件

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
