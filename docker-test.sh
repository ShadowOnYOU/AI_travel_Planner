#!/bin/bash

echo "🔍 AI Travel Planner Docker 测试脚本"
echo "====================================="

# 检查容器状态
echo "📦 检查容器状态..."
docker-compose ps

# 检查应用健康状态
echo ""
echo "🏥 检查应用健康状态..."
curl -s http://localhost:3000/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ 主页访问正常"
else
    echo "❌ 主页访问失败"
    exit 1
fi

# 检查配置页面
curl -s http://localhost:3000/config > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ 配置页面访问正常"
else
    echo "❌ 配置页面访问失败"
    exit 1
fi

# 检查环境变量
echo ""
echo "🔧 检查环境变量配置..."
docker exec ai-travel-planner env | grep -E "(SUPABASE|AMAP|BAILIAN)" | sort

echo ""
echo "📊 容器资源使用情况..."
docker stats ai-travel-planner --no-stream

echo ""
echo "📄 最近日志..."
docker-compose logs --tail=5

echo ""
echo "🎉 测试完成！"
echo "🌐 访问地址: http://localhost:3000"
echo "🛑 停止服务: docker-compose down"