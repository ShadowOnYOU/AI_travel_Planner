#!/bin/bash

# AI Travel Planner Docker 启动脚本
# 用于快速启动整个应用程序栈

echo "🚀 正在启动 AI Travel Planner..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 停止现有容器（如果存在）
echo "📦 停止现有容器..."
docker-compose down

# 构建镜像
echo "🔨 构建 Docker 镜像..."
DOCKER_BUILDKIT=0 docker build -t ai-travel-planner:latest .

# 启动服务
echo "⚡ 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查容器状态
echo "📊 容器状态:"
docker-compose ps

# 显示访问信息
echo ""
echo "✅ AI Travel Planner 已启动!"
echo "🌐 访问地址: http://localhost:3000"
echo "📱 移动端: http://你的IP地址:3000"
echo ""
echo "📄 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down"
echo ""
echo "💡 提示: 应用程序已预配置了演示 API 密钥"
echo "   - 高德地图 API"
echo "   - 阿里百炼 AI API" 
echo "   - Supabase 数据库"