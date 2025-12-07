# SSPS Go/Gin 后端配置与使用手册

## 项目概述
Go/Gin后端实现，提供高性能的API服务和管理功能。

## 环境要求
- Go 1.21+
- 现代操作系统 (Linux, macOS, Windows)

## 安装步骤

### 1. 环境准备
```bash
# 确保Go环境已安装
go version

# 设置Go模块代理（如果需要）
export GOPROXY=https://proxy.golang.org,direct
```

### 2. 依赖管理
```bash
cd project/back/go

# 下载并安装依赖
go mod tidy
```

### 3. 环境变量配置
创建 `.env` 文件或设置环境变量：
```bash
export JWT_SECRET=your-very-secure-jwt-secret-key-change-in-production
export DATABASE_URL=ssps.db  # SQLite文件名
export PORT=8080
export JWT_EXPIRE_HOURS=24
export PAGE_SIZE=10
export MAX_PAGE_SIZE=100
```

## 开发环境配置

### 启动开发服务器
```bash
cd project/back/go
go run main.go
```

服务器将在 http://localhost:8080 上运行

### API端点
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取当前用户
- `GET /api/articles` - 获取文章列表（支持分页、过滤、搜索）
- `GET /api/articles/:slug` - 获取文章详情
- `POST /api/articles` - 创建文章（需认证）
- `PUT /api/articles/:id` - 更新文章（需认证）
- `DELETE /api/articles/:id` - 删除文章（需认证）
- `GET /api/categories` - 获取分类列表
- `GET /api/categories/:slug` - 获取分类详情
- `POST /api/categories` - 创建分类（需认证）
- `PUT /api/categories/:id` - 更新分类（需认证）
- `DELETE /api/categories/:id` - 删除分类（需认证）
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/:slug` - 获取标签详情
- `POST /api/tags` - 创建标签（需认证）
- `PUT /api/tags/:id` - 更新标签（需认证）
- `DELETE /api/tags/:id` - 删除标签（需认证）

## 生产环境配置

### 环境变量设置
```bash
# 生产环境推荐设置
export GIN_MODE=release
export JWT_SECRET=your-production-jwt-secret-key
export DATABASE_URL=postgresql://user:password@localhost/ssps_db  # PostgreSQL
export PORT=8080
export JWT_EXPIRE_HOURS=48
export PAGE_SIZE=20
export MAX_PAGE_SIZE=50
```

### 使用systemd管理服务（Linux）
创建 `/etc/systemd/system/ssps-go.service`：
```ini
[Unit]
Description=SSPS Go Backend
After=network.target

[Service]
Type=simple
User=ssps
WorkingDirectory=/path/to/ssps-go
ExecStart=/path/to/ssps-go/main
Restart=always
RestartSec=10

# 环境变量
Environment=GIN_MODE=release
Environment=JWT_SECRET=your-production-jwt-secret
Environment=DATABASE_URL=postgresql://user:password@localhost/ssps_db
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable ssps-go
sudo systemctl start ssps-go
```

### 构建生产版本
```bash
cd project/back/go
go build -o ssps-go main.go
```

## 数据库配置

### 支持的数据库
- SQLite (默认，适用于开发)
- PostgreSQL (推荐用于生产)
- MySQL (可选)

### 更换数据库
修改数据库连接字符串：
- SQLite: `ssps.db`
- PostgreSQL: `host=localhost user=ssps_user password=ssps_password dbname=ssps_db port=5432 sslmode=disable TimeZone=Asia/Shanghai`
- MySQL: `user:password@tcp(localhost:3306)/ssps_db?charset=utf8mb4&parseTime=True&loc=Local`

## 安全配置

### 密钥管理
- 生产环境中必须使用强JWT密钥（至少32字符）
- 定期轮换JWT密钥
- 使用环境变量存储敏感信息
- 设置适当的文件权限保护配置文件

### 中间件配置
- CORS中间件已配置为允许所有源（开发用途）
- 生产环境中建议限制允许的源

## API使用示例

### 用户认证
```bash
# 注册新用户
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'

# 用户登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### 文章管理
```bash
# 获取文章列表（带分页）
curl "http://localhost:8080/api/articles?page=1&page_size=10"

# 获取特定文章
curl http://localhost:8080/api/articles/article-slug/
```

## 日志配置

当前实现使用标准Go日志包。在生产环境中，建议使用结构化日志库如logrus。

## 错误处理

- 统一的错误响应格式
- 详细的错误日志记录
- 适当的HTTP状态码

## 性能优化

### 缓存配置
如需启用缓存，可集成Redis：
```go
// 示例Redis集成
import "github.com/go-redis/redis/v8"
```

### 数据库优化
- GORM已启用连接池
- 建议使用索引优化查询
- 合理使用预加载避免N+1查询

## 监控与维护

### 健康检查端点
建议添加健康检查端点：
```go
r.GET("/health", func(c *gin.Context) {
    c.JSON(200, gin.H{"status": "ok"})
})
```

### 性能分析
Go内置pprof支持，可启用性能分析：
```go
import _ "net/http/pprof"

// 在main.go中添加
go func() {
    log.Println(http.ListenAndServe("localhost:6060", nil))
}()
```

## 部署建议

### Docker部署
创建Dockerfile：
```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o ssps-go main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/ssps-go .
EXPOSE 8080
CMD ["./ssps-go"]
```

### 反向代理配置
使用Nginx作为反向代理：

```nginx
upstream ssps_go {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://ssps_go;
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