# SSPS Python/Django 后端配置与使用手册

## 项目概述
Python/Django后端实现，提供完整的API服务和管理功能。

## 环境要求
- Python 3.9+
- pip包管理器
- 虚拟环境工具 (推荐venv)

## 安装步骤

### 1. 环境准备
```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 升级pip
pip install --upgrade pip
```

### 2. 安装依赖
```bash
cd project/back/python
pip install -r requirements.txt
```

### 3. 数据库配置
```bash
# 运行数据库迁移
python manage.py migrate

# 创建超级用户（可选）
python manage.py createsuperuser
```

### 4. 环境变量配置
创建 `.env` 文件（如果使用python-decouple）：
```env
SECRET_KEY=your-very-secure-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
JWT_SECRET_KEY=your-jwt-secret-key
```

## 开发环境配置

### 启动开发服务器
```bash
python manage.py runserver
```

服务器将在 http://127.0.0.1:8000 上运行

### API端点
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取当前用户
- `GET /api/articles/` - 获取文章列表
- `GET /api/articles/<slug>/` - 获取文章详情
- `GET /api/categories/` - 获取分类列表
- `GET /api/categories/<slug>/` - 获取分类详情
- `GET /api/tags/` - 获取标签列表
- `GET /api/tags/<slug>/` - 获取标签详情

## 生产环境配置

### 环境变量设置
```env
SECRET_KEY=your-production-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@localhost/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
JWT_SECRET_KEY=your-production-jwt-secret
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=('HTTP_X_FORWARDED_PROTO', 'https')
```

### 部署步骤
```bash
# 收集静态文件
python manage.py collectstatic --noinput

# 运行生产服务器（推荐使用Gunicorn）
gunicorn ssps_backend.wsgi:application --bind 0.0.0.0:8000
```

### 使用Nginx反向代理
配置Nginx以代理到Django应用：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/your/project/staticfiles/;
    }
}
```

## 安全配置

### 密钥管理
- 生产环境中必须使用强密钥
- 定期轮换JWT密钥
- 使用环境变量存储敏感信息

### 中间件配置
- CSRF保护已启用
- 安全头配置（在生产环境中）
- CORS配置（在settings.py中）

## 数据库配置

### 支持的数据库
- SQLite (默认，适用于开发)
- PostgreSQL (推荐用于生产)
- MySQL (可选)

### 更换数据库
修改 `ssps_backend/settings.py` 中的 DATABASES 设置：

```python
# PostgreSQL配置示例
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'ssps_db'),
        'USER': os.environ.get('DB_USER', 'ssps_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'password'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

## API使用示例

### 用户认证
```bash
# 注册新用户
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'

# 用户登录
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### 文章管理
```bash
# 获取文章列表
curl http://localhost:8000/api/articles/

# 获取特定文章
curl http://localhost:8000/api/articles/article-slug/
```

## 日志配置

日志配置在 `ssps_backend/settings.py` 中定义。默认配置会将日志写入控制台和文件。

## 错误处理

Django的默认错误处理机制：
- 开发环境显示详细错误信息
- 生产环境返回通用错误页面
- 所有错误记录到日志

## 性能优化

### 缓存配置
如需启用缓存，在settings.py中添加：
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### 静态文件优化
- 使用CDN提供静态文件
- 启用Gzip压缩
- 设置适当的缓存头