<<<<<<< HEAD
# Static State Post System (SSPS)

A lightweight blog generation and management system that allows users to create, manage, and publish static blog content in a local development environment.

## Overview

Static State Post System (SSPS) is designed for developers who want to create blogs using a local development environment with Next.js + React for the frontend, while implementing content management features with various backend languages. The system ultimately generates static pages that can be deployed to GitHub.

## Key Features

### Local Development Environment
- Lightweight local environment with minimal dependencies
- Simultaneous frontend and backend visibility during local development
- Local environment simulates online server behavior with no environment discrepancies

### Multi-language Backend Support
- Default backends: Python (Django), Go (Gin), and C# (ASP.NET Core)
- Clear API interfaces supporting integration with other backend languages
- Backend management system for content management (posts, pages, categories, etc.)

### Static Blog Generation
- Automatically generates static HTML pages through the backend management system
- Markdown format support for content creation
- Image and attachment resource management
- Complete static file structure ready for GitHub Pages deployment

### GitHub Deployment
- Command-line tool for one-click upload to GitHub
- GitHub Pages automatic deployment support
- Direct upload of generated static files to GitHub repositories

## Technical Requirements

### Frontend
- Built with Next.js 14+
- React 18+ with TypeScript support
- Styled with Tailwind CSS
- Real-time preview functionality

### Backend
- RESTful API design
- JWT authentication support
- Data storage: SQLite (local development) with expandability to other databases

### Local Environment
- Minimal dependencies (Node.js and optionally Python)
- Docker Compose support for easy environment setup
- No need for additional databases or complex services
- Simple installation with zero complex configuration

## Product Vision

SSPS aims to provide users with a simple, lightweight, and versatile blog publishing platform that lets them focus on content creation without worrying about complex backend architectures or deployment processes. By combining local development environments with GitHub static page hosting, SSPS delivers an optimal blogging experience while maintaining the high performance and security of static websites.
=======
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
>>>>>>> 4dca69c7ed9b271721de9d484812e620361b3d56
