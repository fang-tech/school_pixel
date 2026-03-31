#!/bin/bash
set -e

echo "========================================="
echo "  SWJTU 像素形象工坊 - 一键启动脚本"
echo "========================================="

# 创建数据目录
mkdir -p appdata

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 未检测到 Docker，请先安装 Docker Desktop"
    echo "   https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info &> /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

echo "✅ Docker 已就绪"

# 构建并启动
echo "🔨 构建镜像..."
docker compose build --quiet

echo "🚀 启动服务..."
docker compose up -d

echo ""
echo "========================================="
echo "  启动成功！"
echo "  捏人页面: http://localhost"
echo "  管理后台: http://localhost/admin"
echo "  数据目录: ./appdata/"
echo "========================================="
echo ""
echo "常用命令："
echo "  停止服务:   docker compose down"
echo "  查看日志:   docker compose logs -f"
echo "  重启服务:   docker compose restart"
echo "  升级重建:   docker compose down && docker compose build && docker compose up -d"
