#!/bin/bash

# SSPS 项目启动脚本

echo "=================================="
echo "  静态状态发布系统 (SSPS) 启动脚本"
echo "=================================="

echo " "
echo "项目结构："
echo "- 前端：Next.js 应用 (project/front/)"
echo "- 后端：Python Django 应用 (project/back/python/)"
echo " "

# 检查 Node.js 是否已安装
if ! command -v node &> /dev/null; then
    echo "错误：Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 Python 是否已安装
if ! command -v python &> /dev/null; then
    echo "警告：Python 未安装，后端功能将不可用"
fi

# 安装前端依赖
echo "正在安装前端依赖..."
cd project/front
npm install
cd ../..

# 检查后端 Python 目录是否存在
if [ -d "project/back/python" ]; then
    echo "正在检查后端依赖..."
    cd project/back/python
    
    # 检查是否安装了 pip
    if command -v pip &> /dev/null; then
        echo "正在安装 Python 依赖..."
        pip install django djangorestframework
    else
        echo "警告：pip 未安装，无法安装 Python 依赖"
    fi
    
    # 运行 Django 数据库迁移
    echo "正在初始化数据库..."
    python manage.py migrate 2>/dev/null || echo "数据库迁移失败，可能需要先安装 Django"
    
    cd ../../..
fi

echo " "
echo "=================================="
echo "  SSPS 初始化完成！"
echo "=================================="
echo " "
echo "启动开发服务器："
echo "  npm run dev"
echo " "
echo "构建项目："
echo "  npm run build"
echo " "
echo "访问前端："
echo "  http://localhost:3000 (默认)"
echo " "
echo "访问后端管理："
echo "  http://localhost:8000/admin"
echo " "