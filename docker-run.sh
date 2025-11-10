#!/bin/bash

# AI Travel Planner - Docker 构建和运行脚本

set -e

echo "🚀 开始构建 AI Travel Planner Docker 镜像..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 清理旧容器
echo -e "${BLUE}📦 清理旧容器...${NC}"
docker stop ai-travel-planner 2>/dev/null || true
docker rm ai-travel-planner 2>/dev/null || true

# 构建镜像
echo -e "${BLUE}🔨 构建 Docker 镜像...${NC}"
docker build -t ai-travel-planner:latest .

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 镜像构建成功！${NC}"
else
    echo -e "${RED}❌ 镜像构建失败${NC}"
    exit 1
fi

# 运行容器
echo -e "${BLUE}🚀 启动容器...${NC}"
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -e NEXT_PUBLIC_AMAP_KEY="${NEXT_PUBLIC_AMAP_KEY:-1e967f9e5d863f52e8e76a8b7c381669}" \
  -e NEXT_PUBLIC_BAILIAN_API_KEY="${NEXT_PUBLIC_BAILIAN_API_KEY:-sk-7b2ff1814ecb499d89d56e86af030b19}" \
  -e NEXT_PUBLIC_BAILIAN_BASE_URL="${NEXT_PUBLIC_BAILIAN_BASE_URL:-https://dashscope.aliyuncs.com/compatible-mode/v1}" \
  -e NEXT_PUBLIC_BAILIAN_MODEL_ID="${NEXT_PUBLIC_BAILIAN_MODEL_ID:-qwen-plus}" \
  ai-travel-planner:latest

# 检查容器状态
echo -e "${BLUE}⏳ 等待容器启动...${NC}"
sleep 5

if docker ps | grep -q ai-travel-planner; then
    echo -e "${GREEN}✅ 容器启动成功！${NC}"
    echo -e "${GREEN}🌐 访问地址: http://localhost:3000${NC}"
    echo ""
    echo "📋 常用命令:"
    echo "  查看日志: docker logs -f ai-travel-planner"
    echo "  停止容器: docker stop ai-travel-planner"
    echo "  重启容器: docker restart ai-travel-planner"
    echo "  删除容器: docker rm -f ai-travel-planner"
else
    echo -e "${RED}❌ 容器启动失败${NC}"
    echo "查看日志: docker logs ai-travel-planner"
    exit 1
fi
