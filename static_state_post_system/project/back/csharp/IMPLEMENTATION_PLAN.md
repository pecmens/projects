# SSPS C# ASP.NET 后端管理平台实施计划

## 项目概述
静态状态发布系统 (Static State Post System, SSPS) 的 C# ASP.NET 后端，提供完整的博客管理功能，包括文章、分类、标签和用户管理。

## 技术栈
- ASP.NET Core 8.0
- Entity Framework Core 8.0
- JWT 认证
- SQL Server (默认) / SQLite (开发)
- ASP.NET Core Web API

## 项目结构
```
project/back/csharp/
├── SSPS.Api/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   ├── DTOs/
│   ├── Middleware/
│   └── Program.cs
├── SSPS.Core/
│   ├── Entities/
│   ├── Interfaces/
│   └── Services/
├── SSPS.Infrastructure/
│   └── Data/
├── SSPS.API/
│   └── Properties/
└── SSPS.sln
```

## 实施步骤

### 第一步：项目初始化与基础配置
- 创建 ASP.NET Core Web API 项目
- 配置项目依赖 (Entity Framework, JWT, CORS)
- 设置基础配置文件

### 第二步：数据模型定义
- 定义 User, Article, Category, Tag 实体
- 设置实体关系 (一对多、多对多)
- 配置 Entity Framework 模型

### 第三步：数据库上下文和迁移
- 创建 ApplicationDbContext
- 配置数据库连接
- 创建初始迁移

### 第四步：DTOs 定义
- 定义 API 数据传输对象
- 包括请求和响应模型

### 第五步：服务层开发
- 创建业务逻辑服务
- 实现数据访问逻辑

### 第六步：控制器开发
- 创建控制器 (Authentication, Articles, Categories, Tags)
- 实现 CRUD 操作

### 第七步：认证系统
- JWT 令牌生成和验证
- 用户注册和登录
- 身份验证中间件

### 第八步：API 完善和测试
- 实现分页和过滤
- 添加错误处理
- 进行 API 测试

## 功能模块

### 1. 认证模块
- 用户注册
- 用户登录
- 获取当前用户信息
- JWT 令牌刷新

### 2. 文章管理
- 获取文章列表 (支持分页、过滤、搜索)
- 获取文章详情
- 创建文章
- 更新文章
- 删除文章

### 3. 分类管理
- 获取分类列表
- 获取分类详情
- 创建分类
- 更新分类
- 删除分类

### 4. 标签管理
- 获取标签列表
- 获取标签详情
- 创建标签
- 更新标签
- 删除标签

## 安全考虑
- JWT 认证和授权
- 密码哈希
- 输入验证
- 防止 SQL 注入
- CORS 配置

## 预期完成时间
- 总计: 5-8 小时
- 每个步骤: 30-60 分钟