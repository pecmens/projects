/**
 * SSPS 项目初始化脚本
 * 静态状态发布系统 (Static State Post System)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('正在初始化 SSPS 项目...');

// 创建必要的配置文件
const configs = {
  // 前端 Next.js 配置
  'project/front/next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 生成静态文件
  trailingSlash: true,
  images: {
    unoptimized: true // 由于是静态导出，需要设置为未优化
  }
}

module.exports = nextConfig
`,

  // 前端 package.json
  'project/front/package.json': `{
  "name": "ssps-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build && next export"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
`,

  // 前端主页面
  'project/front/src/app/page.js': `import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>SSPS - 静态状态发布系统</title>
        <meta name="description" content="轻量级博客生成与管理系统" />
      </Head>
      
      <main>
        <h1>欢迎使用 SSPS - 静态状态发布系统</h1>
        <p>一个轻量级的博客生成与管理系统</p>
      </main>
    </div>
  );
}
`,

  // 后端 Python/Django 配置文件
  'project/back/python/manage.py': `#!/usr/bin/env python
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ssps_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "无法导入 Django. 请确保它已正确安装."
        ) from exc
    execute_from_command_line(sys.argv)
`,

  // 后端 Python 主应用文件
  'project/back/python/app.py': `# SSPS 后端服务入口
from django.core.management import execute_from_command_line
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ssps_backend.settings')
    execute_from_command_line([sys.argv[0], 'runserver', '8000'])
`
};

// 创建文件和目录
for (const [filePath, content] of Object.entries(configs)) {
  const fullPath = path.join(__dirname, filePath);
  const dirPath = path.dirname(fullPath);
  
  // 确保目录存在
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // 写入文件
  fs.writeFileSync(fullPath, content);
  console.log(`已创建: ${filePath}`);
}

// 创建后端 Python Django 项目结构
const djangoDirs = [
  'project/back/python/ssps_backend',
  'project/back/python/articles',
  'project/back/python/media',
  'project/back/python/static'
];

for (const dir of djangoDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
    console.log(`已创建目录: ${dir}`);
    
    // 为 Django 应用添加 __init__.py
    if (dir.includes('ssps_backend') || dir.includes('articles')) {
      const initPath = path.join(__dirname, dir, '__init__.py');
      fs.writeFileSync(initPath, '');
      console.log(`已创建: ${dir}/__init__.py`);
    }
  }
}

// 创建 Django 配置文件
const djangoConfigs = {
  'project/back/python/ssps_backend/settings.py': `# SSPS Django 设置
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'your-secret-key-here'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'articles',  # 文章应用
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ssps_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ssps_backend.wsgi.application'

# 数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 国际化
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
USE_I18N = True
USE_TZ = True

# 静态文件
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"

# 媒体文件
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"
`,

  'project/back/python/ssps_backend/urls.py': `from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('articles.urls')),  # 文章 API
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
`
};

for (const [filePath, content] of Object.entries(djangoConfigs)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`已创建: ${filePath}`);
}

// 创建文章应用的文件
const articleFiles = {
  'project/back/python/articles/models.py': `from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)

    def __str__(self):
        return self.title
`,
  
  'project/back/python/articles/urls.py': `from django.urls import path
from . import views

urlpatterns = [
    path('articles/', views.article_list, name='article_list'),
    path('articles/<slug:slug>/', views.article_detail, name='article_detail'),
]
`
};

for (const [filePath, content] of Object.entries(articleFiles)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`已创建: ${filePath}`);
}

console.log('\n项目初始化完成！');
console.log('接下来的步骤：');
console.log('1. 进入 project/front 目录并运行 npm install 安装前端依赖');
console.log('2. 进入 project/back/python 目录并运行 pip install django djangorestframework 安装后端依赖');
console.log('3. 在 project/back/python 目录下运行 python manage.py migrate 创建数据库表');
console.log('4. 运行 npm run dev 启动开发服务器');
