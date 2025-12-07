# SSPS 项目生产环境部署配置

## 环境变量配置

### 前端 (Next.js)
```bash
# 基础URL配置
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# 站点配置
NEXT_PUBLIC_SITE_NAME="您的网站名称"
NEXT_PUBLIC_SITE_DESCRIPTION="您的网站描述"
```

### Python后端 (Django)
```bash
# Django配置
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET_KEY=your-production-jwt-secret

# 安全配置
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Go后端 (Gin)
```bash
# Go后端配置
GIN_MODE=release
JWT_SECRET=your-production-jwt-secret-key-at-least-32-characters
DATABASE_URL=postgresql://user:password@localhost/ssps_db
PORT=8080
JWT_EXPIRE_HOURS=168  # 7天
PAGE_SIZE=15
MAX_PAGE_SIZE=50
```

### C#后端 (ASP.NET)
```bash
# ASP.NET后端配置
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection="Server=prod-server;Database=SSPSDB;User Id=ssps_user;Password=secure_password;"
JwtSettings__SecretKey="your-production-super-secret-key-32-characters-minimum"
JwtSettings__DurationInMinutes=10080  # 7天
ASPNETCORE_URLS=http://localhost:8080
```

## Docker部署配置示例

### 前端Dockerfile
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# 安装依赖
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 构建
FROM base AS builder
COPY . .
RUN npm run build

# 生产环境
FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
```

### Python后端Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# 安装Python依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 收集静态文件
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "ssps_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Go后端Dockerfile
```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/static ./static

EXPOSE 8080

CMD ["./main"]
```

### C#后端Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

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

## Nginx反向代理配置

```nginx
# 前端配置
upstream frontend {
    server frontend:3000;
}

# Python后端配置
upstream python_backend {
    server python_backend:8000;
}

# Go后端配置
upstream go_backend {
    server go_backend:8080;
}

# C#后端配置
upstream csharp_backend {
    server csharp_backend:8080;
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

    # 前端应用
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API代理到后端
    location /api/ {
        proxy_pass http://python_backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 管理后台
    location /admin/ {
        proxy_pass http://python_backend/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 数据库配置

### PostgreSQL生产配置
```sql
-- 创建数据库
CREATE DATABASE ssps_db;

-- 创建用户
CREATE USER ssps_user WITH PASSWORD 'secure_password';

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE ssps_db TO ssps_user;
```

## 监控和日志

### 日志轮转配置
```bash
# /etc/logrotate.d/ssps
/var/log/ssps/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 root adm
    postrotate
        # 重启服务或发送信号
    endscript
}
```

### 健康检查脚本
```bash
#!/bin/bash
# health_check.sh

services=("frontend" "python_backend" "go_backend" "csharp_backend")

for service in "${services[@]}"; do
    if ! docker ps | grep -q "$service"; then
        echo "服务 $service 未运行"
        # 这里可以添加重启逻辑
    else
        echo "服务 $service 运行正常"
    fi
done
```

## 备份策略

### 数据库备份脚本
```bash
#!/bin/bash
# db_backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# PostgreSQL备份
pg_dump -h localhost -U ssps_user -d ssps_db > $BACKUP_DIR/ssps_db_$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "ssps_db_*.sql" -mtime +7 -delete
```

## 安全加固

### 防火墙配置
```bash
# 只开放必要的端口
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
```

### 定期安全更新
```bash
# 定期更新系统和依赖包
apt-get update && apt-get upgrade -y
```

## 性能优化

### 数据库索引
```sql
-- 为常用查询字段添加索引
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_created_at ON articles(created_at);
CREATE INDEX idx_articles_slug ON articles(slug);
```

### 缓存配置
- 使用Redis作为缓存后端
- 配置API响应缓存
- 静态资源CDN加速

## CI/CD配置示例

### GitHub Actions工作流
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /path/to/ssps
            git pull origin main
            docker-compose build --no-cache
            docker-compose up -d
            docker image prune -f
```