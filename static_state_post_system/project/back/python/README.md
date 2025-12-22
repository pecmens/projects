# SSPS Django 后端管理系统

## 概述

SSPS (Static State Post System) Django 后端管理系统是一个基于Django和Django REST Framework构建的内容管理系统，用于管理博客文章、分类、标签等内容，并支持用户认证和权限管理。

## 主要功能

- **用户认证系统**: JWT Token认证，支持用户注册、登录、权限管理
- **文章管理**: 支持文章的创建、编辑、删除、发布/草稿状态管理
- **分类管理**: 文章分类的管理
- **标签管理**: 文章标签的管理
- **媒体管理**: 文件上传和管理功能
- **管理后台**: Django Admin 提供的可视化管理界面

## 技术栈

- Python 3.8+
- Django 4.2+
- Django REST Framework 3.14+
- Django REST Framework SimpleJWT
- SQLite (开发环境) / PostgreSQL (生产环境)

## API端点

### 认证相关
- `POST /api/auth/register/` - 用户注册
- `POST /api/auth/login/` - 用户登录
- `GET /api/auth/user/` - 获取当前用户信息

### 文章管理
- `GET /api/articles/` - 获取文章列表（支持分页、搜索、过滤）
- `POST /api/articles/` - 创建文章
- `GET /api/articles/<slug>/` - 获取文章详情
- `PUT /api/articles/<slug>/` - 更新文章
- `DELETE /api/articles/<slug>/` - 删除文章

### 分类管理
- `GET /api/categories/` - 获取分类列表
- `POST /api/categories/` - 创建分类
- `GET /api/categories/<slug>/` - 获取分类详情
- `PUT /api/categories/<slug>/` - 更新分类
- `DELETE /api/categories/<slug>/` - 删除分类

### 标签管理
- `GET /api/tags/` - 获取标签列表
- `POST /api/tags/` - 创建标签
- `GET /api/tags/<slug>/` - 获取标签详情
- `PUT /api/tags/<slug>/` - 更新标签
- `DELETE /api/tags/<slug>/` - 删除标签

## 前后端结合方式

### 1. 架构设计
- 前端使用Next.js构建，通过HTTP请求与后端API进行数据交互
- 后端提供RESTful API接口，返回JSON格式数据
- 使用JWT Token进行身份验证和授权

### 2. 数据流
1. 前端通过API调用获取数据
2. 后端验证请求（包括JWT Token）
3. 后端查询数据库并返回JSON数据
4. 前端接收数据并渲染到页面

### 3. 认证流程
1. 用户在前端进行登录/注册
2. 前端向后端认证接口发送请求
3. 后端验证凭据并返回JWT Token
4. 前端存储Token并在后续请求中使用
5. 后端验证每个需要权限的请求的Token

### 4. 静态生成
- 前端可以调用后端API获取内容
- 使用获取的数据生成静态页面
- 支持部署到GitHub Pages等静态托管服务

## 部署

1. 安装依赖：`pip install -r requirements.txt`
2. 数据库迁移：`python manage.py migrate`
3. 创建超级用户：`python manage.py createsuperuser`
4. 启动服务：`python manage.py runserver`

## 环境配置

在生产环境中，建议设置以下环境变量：
- `DEBUG` - 调试模式
- `SECRET_KEY` - Django密钥
- `DATABASE_URL` - 数据库连接字符串
- `ALLOWED_HOSTS` - 允许的主机地址