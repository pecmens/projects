# SSPS C# ASP.NET 后端管理平台

## 项目概述
静态状态发布系统 (Static State Post System, SSPS) 的 C# ASP.NET 后端，提供完整的博客管理功能。

## 技术栈
- ASP.NET Core 8.0
- Entity Framework Core 8.0
- JWT 认证
- SQL Server (默认) / SQLite (开发)

## 功能特性
- 用户注册和登录
- 文章管理（CRUD 操作）
- 分类管理
- 标签管理
- 分页和搜索功能
- JWT 身份验证

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取当前用户信息

### 文章
- `GET /api/articles` - 获取文章列表（支持分页、过滤、搜索）
- `GET /api/articles/{slug}` - 获取文章详情
- `POST /api/articles` - 创建文章（需认证）
- `PUT /api/articles/{id}` - 更新文章（需认证）
- `DELETE /api/articles/{id}` - 删除文章（需认证）

### 分类
- `GET /api/categories` - 获取分类列表
- `GET /api/categories/{id}` - 获取分类详情
- `GET /api/categories/slug/{slug}` - 通过 slug 获取分类
- `POST /api/categories` - 创建分类（需认证）
- `PUT /api/categories/{id}` - 更新分类（需认证）
- `DELETE /api/categories/{id}` - 删除分类（需认证）

### 标签
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/{id}` - 获取标签详情
- `GET /api/tags/slug/{slug}` - 通过 slug 获取标签
- `POST /api/tags` - 创建标签（需认证）
- `PUT /api/tags/{id}` - 更新标签（需认证）
- `DELETE /api/tags/{id}` - 删除标签（需认证）

## 配置

项目使用 appsettings.json 文件进行配置：

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SSPSDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-change-in-production-123456",
    "Issuer": "SSPS.Api",
    "Audience": "SSPS.Users",
    "DurationInMinutes": 1440
  }
}
```

## 启动说明

1. 确保已安装 .NET 8.0 SDK
2. 进入项目目录: `cd SSPS.Api`
3. 还原 NuGet 包: `dotnet restore`
4. 应用数据库迁移: `dotnet ef database update`
5. 启动应用: `dotnet run`

## 数据库迁移

如果需要创建新的数据库迁移，请使用以下命令：

```bash
dotnet ef migrations add "MigrationName"
dotnet ef database update
```

> 注意：首次运行时需要先创建数据库迁移并更新数据库。