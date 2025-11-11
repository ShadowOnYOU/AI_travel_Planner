#!/bin/bash

# AI Travel Planner - 一键运行脚本
# 作者: ShadowOnYOU
# 日期: 2025年11月10日

echo "🌍 AI Travel Planner - 智能旅行规划系统"
echo "================================================"

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请先安装 Docker: https://www.docker.com/get-started"
    exit 1
fi

echo "✅ Docker 已安装: $(docker --version)"

# 设置镜像名称
IMAGE_NAME="crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest"
CONTAINER_NAME="ai-travel-planner"
PORT=3000

# 检查端口是否被占用
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  警告: 端口 $PORT 已被占用"
    read -p "是否使用端口 8080? (y/N): " use_alt_port
    if [[ $use_alt_port =~ ^[Yy]$ ]]; then
        PORT=8080
        echo "📍 将使用端口 $PORT"
    else
        echo "❌ 请先释放端口 $PORT 或选择其他端口"
        exit 1
    fi
fi

# 停止并删除已存在的容器（如果存在）
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "🗑️  清理已存在的容器..."
    docker rm -f $CONTAINER_NAME >/dev/null 2>&1
fi

echo "📥 拉取并启动 Docker 镜像..."
echo "镜像地址: $IMAGE_NAME"
echo ""

# 检测系统架构并选择合适的运行方式
ARCH=$(uname -m)
echo "🏗️  检测到系统架构: $ARCH"

if [[ "$ARCH" == "arm64" ]] || [[ "$ARCH" == "aarch64" ]]; then
    echo "🍎 检测到 ARM64 架构（Apple Silicon），使用兼容模式运行..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:3000 \
        --platform linux/amd64 \
        $IMAGE_NAME
else
    echo "💻 检测到 x86_64 架构，直接运行镜像..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:3000 \
        $IMAGE_NAME
fi

# 检查容器是否启动成功
sleep 3
if docker ps | grep -q $CONTAINER_NAME; then
    echo ""
    echo "🎉 启动成功！"
    echo "================================================"
    echo "📱 访问地址: http://localhost:$PORT"
    echo "🐳 容器名称: $CONTAINER_NAME"
    echo "📊 查看日志: docker logs $CONTAINER_NAME"
    echo "🛑 停止服务: docker stop $CONTAINER_NAME"
    echo "================================================"
    echo ""
    echo "🚀 主要功能："
    echo "  • 智能行程规划: http://localhost:$PORT/plan"
    echo "  • 用户登录注册: http://localhost:$PORT/auth/signin"
    echo "  • 地图可视化: http://localhost:$PORT/map"
    echo "  • 预算管理: http://localhost:$PORT/budget"
    echo "  • 配置管理: http://localhost:$PORT/config"
    echo ""
    
    # 自动打开浏览器（可选）
    read -p "是否自动打开浏览器? (Y/n): " open_browser
    if [[ ! $open_browser =~ ^[Nn]$ ]]; then
        echo "🌐 正在打开浏览器..."
        if command -v open &> /dev/null; then
            open "http://localhost:$PORT"  # macOS
        elif command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:$PORT"  # Linux
        elif command -v start &> /dev/null; then
            start "http://localhost:$PORT"  # Windows
        else
            echo "请手动访问: http://localhost:$PORT"
        fi
    fi
else
    echo ""
    echo "❌ 启动失败！"
    echo "请检查 Docker 日志: docker logs $CONTAINER_NAME"
    exit 1
fi