#!/bin/bash

# AI Travel Planner - 快速验证脚本
# 用于验证 Docker 镜像是否可以正常运行

echo "🔍 AI Travel Planner - 快速验证"
echo "=================================="

# 检查 Docker 是否可用
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

echo "✅ Docker 已安装: $(docker --version | head -1)"

# 镜像信息
IMAGE_NAME="crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest"
CONTAINER_NAME="ai-travel-planner-verify"
PORT=3001

echo ""
echo "📦 验证镜像: $IMAGE_NAME"
echo "🔗 验证端口: $PORT"
echo ""

# 清理可能存在的验证容器
docker rm -f $CONTAINER_NAME 2>/dev/null || true

echo "🚀 启动验证容器..."

# 运行容器进行验证
if docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    --platform linux/amd64 \
    $IMAGE_NAME > /dev/null 2>&1; then
    
    echo "✅ 容器启动成功"
    
    # 等待应用启动
    echo "⏳ 等待应用就绪..."
    sleep 5
    
    # 检查应用是否响应
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT | grep -q "200"; then
        echo "✅ 应用响应正常"
        echo ""
        echo "🎉 验证成功！"
        echo "=================================="
        echo "📱 验证地址: http://localhost:$PORT"
        echo "📊 容器状态: docker logs $CONTAINER_NAME"
        echo "🛑 停止验证: docker rm -f $CONTAINER_NAME"
        echo "=================================="
        echo ""
        
        # 询问是否打开浏览器
        read -p "是否在浏览器中打开验证页面? (y/N): " -t 10 open_browser
        if [[ $open_browser =~ ^[Yy]$ ]]; then
            if command -v open &> /dev/null; then
                open "http://localhost:$PORT"
            elif command -v xdg-open &> /dev/null; then
                xdg-open "http://localhost:$PORT"
            else
                echo "请手动打开: http://localhost:$PORT"
            fi
        fi
        
        # 询问是否保持运行
        echo ""
        read -p "是否保持验证容器运行? (y/N): " -t 10 keep_running
        if [[ ! $keep_running =~ ^[Yy]$ ]]; then
            echo "🧹 清理验证容器..."
            docker rm -f $CONTAINER_NAME > /dev/null
            echo "✅ 验证完成并清理"
        else
            echo "✅ 验证容器保持运行"
        fi
        
    else
        echo "❌ 应用无响应"
        echo "📊 容器日志:"
        docker logs $CONTAINER_NAME | tail -10
        docker rm -f $CONTAINER_NAME > /dev/null
        exit 1
    fi
else
    echo "❌ 容器启动失败"
    echo "请检查 Docker 状态和网络连接"
    exit 1
fi

echo ""
echo "🏆 AI Travel Planner Docker 镜像验证完成！"