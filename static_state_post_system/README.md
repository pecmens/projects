# 静态状态发布系统 (Static State Post System, SSPS)

## 项目概述

静态状态发布系统（Static State Post System, SSPS）是一个轻量级的博客生成与管理系统，旨在为用户提供一个本地开发环境，用于创建、管理和发布静态博客内容。

## 项目结构

```
project/
├── front/              # 前端代码 (Next.js)
│   ├── src/            # 源代码
│   ├── public/         # 静态资源
│   └── package.json    # 前端依赖配置
└── back/               # 后端代码
    ├── python/         # Python (Django) 实现
    ├── go/             # Go (Gin) 实现
    └── csharp/         # C# (ASP.NET Core) 实现
```

## 快速开始

### 初始化项目

```bash
npm run init
```

### 安装依赖

1. 安装前端依赖：
```bash
cd project/front
npm install
```

2. 安装后端依赖：
```bash
cd project/back/python
pip install django djangorestframework
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

## 技术栈

- 前端：Next.js 14+, React 18+, TypeScript, Tailwind CSS
- 后端：Python (Django), Go (Gin), C# (ASP.NET Core)
- 数据库：SQLite (本地开发)
- 部署：静态文件生成，支持 GitHub Pages

## 功能特性

- 本地开发环境，前后端一体化
- 支持多语言后端实现
- 静态博客生成
- GitHub 部署支持
- Markdown 内容编辑
- 轻量级，易于部署