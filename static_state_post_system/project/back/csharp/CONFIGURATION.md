# SSPS C# ASP.NET 后端配置与使用手册

## 项目概述
C# ASP.NET后端实现，提供高性能的API服务和管理功能。

## 环境要求
- .NET 8.0 SDK
- Visual Studio 2022 或 Visual Studio Code
- SQL Server (开发: LocalDB, 生产: 推荐完整版)

## 安装步骤

### 1. 环境准备
```bash
# 检查.NET版本
dotnet --version

# 如果没有安装，从 https://dotnet.microsoft.com/download 下载
```

### 2. 项目还原和构建
```bash
cd project/back/csharp/SSPS.Api

# 还原NuGet包
dotnet restore

# 构建项目
dotnet build
```

### 3. 数据库迁移
```bash
# 应用数据库迁移（首次设置）
dotnet ef database update
```

### 4. 运行应用
```bash
# 开发模式运行
dotnet run

# 或发布后运行
dotnet publish -c Release
cd bin/Release/net8.0/publish
dotnet SSPS.Api.dll
```

## 配置文件

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SSPSDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-change-in-production-123456",
    "Issuer": "SSPS.Api",
    "Audience": "SSPS.Users",
    "DurationInMinutes": 1440
  },
  "AllowedHosts": "*"
}
```

### 环境特定配置
- `appsettings.Development.json` - 开发环境配置
- `appsettings.Production.json` - 生产环境配置

## 开发环境配置

### 启动开发服务器
```bash
cd project/back/csharp/SSPS.Api
dotnet watch run
```

服务器将在 https://localhost:5001 和 http://localhost:5000 上运行

### API端点
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取当前用户
- `GET /api/articles` - 获取文章列表（支持分页、过滤、搜索）
- `GET /api/articles/{slug}` - 获取文章详情
- `POST /api/articles` - 创建文章（需认证）
- `PUT /api/articles/{id}` - 更新文章（需认证）
- `DELETE /api/articles/{id}` - 删除文章（需认证）
- `GET /api/categories` - 获取分类列表
- `GET /api/categories/{id}` - 获取分类详情
- `GET /api/categories/slug/{slug}` - 通过slug获取分类
- `POST /api/categories` - 创建分类（需认证）
- `PUT /api/categories/{id}` - 更新分类（需认证）
- `DELETE /api/categories/{id}` - 删除分类（需认证）
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/{id}` - 获取标签详情
- `GET /api/tags/slug/{slug}` - 通过slug获取标签
- `POST /api/tags` - 创建标签（需认证）
- `PUT /api/tags/{id}` - 更新标签（需认证）
- `DELETE /api/tags/{id}` - 删除标签（需认证）

## 生产环境配置

### 环境变量/配置
```bash
# 生产环境推荐配置
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection="Server=prod-server;Database=SSPSDB;User Id=ssps_user;Password=secure_password;"
JwtSettings__SecretKey="your-production-super-secret-key-32-characters-minimum"
JwtSettings__DurationInMinutes=43200  # 30天
```

### IIS部署
1. 发布应用:
```bash
dotnet publish -c Release -o ./publish
```

2. 在IIS中创建应用程序，指向publish目录

3. 确保安装了.NET Core运行时

### Kestrel部署
在生产环境中，Kestrel通常作为反向代理后端运行：

```csharp
// Program.cs - 生产环境配置
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80);  // HTTP
    options.ListenAnyIP(443, listenOptions => 
    {
        // 配置HTTPS
        // listenOptions.UseHttps("path-to-cert.pfx", "cert-password");
    });
});
```

### 反向代理配置（Nginx示例）
```nginx
upstream ssps_csharp {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://ssps_csharp;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 数据库配置

### 支持的数据库
- SQL Server (默认，适用于开发和生产)
- SQLite (开发测试)
- PostgreSQL (通过EF Core Provider)
- MySQL (通过EF Core Provider)

### 更换数据库
在 `Program.cs` 中修改数据库配置：

```csharp
// PostgreSQL示例
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// MySQL示例
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), 
        new MySqlServerVersion(new Version(8, 0, 21))));
```

## 安全配置

### JWT配置
- 密钥至少32字符，使用强随机值
- 设置合适的令牌过期时间
- 在生产环境中使用HTTPS

### 认证和授权
- 所有需要认证的端点使用 `[Authorize]` 特性
- 用户只能操作自己的资源（文章等）

### 防护措施
- 输入验证
- 防止SQL注入（EF Core默认防护）
- 防止XSS（输出编码）
- 防止CSRF（如使用MVC而非纯API）

## API使用示例

### 用户认证
```bash
# 注册新用户
curl -X POST https://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "TestPass123!", "firstName": "Test", "lastName": "User"}'

# 用户登录
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "TestPass123!"}'
```

### 文章管理
```bash
# 获取文章列表（带分页）
curl "https://localhost:5001/api/articles?page=1&pageSize=10"

# 获取特定文章
curl https://localhost:5001/api/articles/article-slug/
```

## 日志配置

### 配置日志
在 `appsettings.json` 中配置日志：
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "SSPS.Api": "Debug"
    }
  }
}
```

### 使用日志
```csharp
// 在控制器或服务中使用
private readonly ILogger<ArticlesController> _logger;

public ArticlesController(IArticleService articleService, ILogger<ArticlesController> logger)
{
    _articleService = articleService;
    _logger = logger;
}

_logger.LogInformation("获取文章列表，页码: {Page}", page);
```

## 错误处理

- 统一的错误响应格式
- 详细的错误日志记录
- 适当的HTTP状态码
- 模型验证错误自动处理

## 性能优化

### 缓存配置
```csharp
// 在Program.cs中添加
builder.Services.AddMemoryCache();  // 本地缓存
// 或
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
});
```

### 数据库优化
- Entity Framework已启用连接池
- 使用异步方法避免阻塞
- 合理使用Include预加载相关数据

## 监控与维护

### 健康检查
```csharp
// 在Program.cs中添加
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();
    
// 在管道中添加
app.MapHealthChecks("/health");
```

### 应用程序洞察
在Azure中配置Application Insights进行监控。

## Docker部署

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SSPS.Api/SSPS.Api.csproj", "SSPS.Api/"]
RUN dotnet restore "SSPS.Api/SSPS.Api.csproj"
COPY . .
WORKDIR "/src/SSPS.Api"
RUN dotnet build "SSPS.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SSPS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SSPS.Api.dll"]
```

### 构建和运行
```bash
docker build -t ssps-csharp .
docker run -p 8080:80 -e "ConnectionStrings__DefaultConnection=your_connection_string" ssps-csharp
```

## 测试

### 单元测试
```bash
# 运行单元测试
dotnet test
```

### 集成测试
创建专门的测试项目进行API集成测试。