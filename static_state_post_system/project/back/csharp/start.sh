#!/bin/bash

# SSPS C# 后端启动脚本

echo "正在启动 SSPS C# ASP.NET 后端..."

# 检查 .NET SDK 是否已安装
if ! command -v dotnet &> /dev/null; then
    echo "错误: 未找到 .NET SDK。请先安装 .NET 8.0 SDK。"
    exit 1
fi

# 进入项目目录
cd /home/pecmen/git/github/pecmens/projects/static_state_post_system/project/back/csharp/SSPS.Api

echo "还原 NuGet 包..."
dotnet restore

echo "应用数据库迁移..."
dotnet ef database update

echo "启动应用程序..."
dotnet run