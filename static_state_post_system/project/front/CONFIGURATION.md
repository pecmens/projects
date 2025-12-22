# SSPS 前端配置与使用手册

## 项目概述
Next.js 14前端实现，提供现代化的用户界面和管理面板。

## 环境要求
- Node.js 18.17.0 或更高版本
- npm 或 yarn 包管理器
- Git (用于版本控制)

## 安装步骤

### 1. 环境准备
```bash
# 检查Node.js版本
node --version

# 如果需要安装Node.js，请从 https://nodejs.org/ 下载
# 推荐使用LTS版本
```

### 2. 项目克隆和依赖安装
```bash
# 克隆项目（如果需要）
# git clone <repository-url>
# cd path/to/project

# 进入前端目录
cd project/front

# 安装依赖
npm install
# 或使用yarn
# yarn install
```

### 3. 环境变量配置
创建 `.env.local` 文件：
```bash
# Next.js相关
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api  # 后端API地址

# 其他环境变量
# NEXT_PUBLIC_SITE_NAME=你的网站名称
# NEXT_PUBLIC_SITE_DESCRIPTION=你的网站描述
```

## 开发环境配置

### 启动开发服务器
```bash
cd project/front

# 启动开发服务器
npm run dev
# 或
# yarn dev

# 服务器将在 http://localhost:3000 上运行
```

### 可用脚本
- `npm run dev` - 启动开发服务器（支持热重载）
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run export` - 导出静态文件
- `npm run lint` - 检查代码规范
- `npm run preview` - 预览生产构建
- `npm run type-check` - 检查TypeScript类型

## 项目结构
```
project/front/
├── public/                 # 静态资源
│   ├── favicon.ico
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── app/               # Next.js 14 App Router页面
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   ├── page.tsx       # 首页
│   │   └── ...            # 其他页面
│   ├── components/        # React组件
│   ├── config/            # 配置文件
│   ├── services/          # API服务
│   ├── styles/            # 样式文件
│   ├── types/             # TypeScript类型定义
│   └── utils/             # 工具函数
├── package.json           # 项目配置和依赖
├── next.config.js         # Next.js配置
├── tailwind.config.js     # Tailwind CSS配置
├── tsconfig.json          # TypeScript配置
└── .env.local             # 环境变量
```

## API集成配置

### API基础URL配置
在 `src/config/app.ts` 中配置API地址：

```typescript
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || `${getBaseUrl()}/api`;
}
```

### 服务API端点
- 首页: `/`
- 文章列表: `/archive`
- 文章详情: `/posts/[slug]`
- 分类浏览: `/categories/[category]`
- 搜索: `/search`
- 管理面板: `/admin`
- 关于页面: `/about`

## 样式和UI配置

### Tailwind CSS配置
在 `tailwind.config.js` 中配置：

```js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 自定义样式扩展
    },
  },
  plugins: [],
}
```

## 生产环境配置

### 构建生产版本
```bash
cd project/front

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 静态导出
如果需要静态导出:
```bash
npm run export
# 输出到 out/ 目录
```

### 环境变量（生产环境）
```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
# 其他生产环境变量
```

### 部署配置

#### Vercel部署（推荐）
```bash
# 使用Vercel CLI部署
npm i -g vercel
vercel
```

#### 静态托管
如果使用静态导出，可部署到任何静态文件托管服务：
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- 或其他CDN服务

#### 自托管
使用Node.js服务器：

```bash
# 构建项目
npm run build

# 启动服务器
npm run start
```

### 反向代理配置（Nginx示例）
```nginx
upstream ssps_front {
    server 127.0.0.1:3000;
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
        proxy_pass http://ssps_front;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源（如果使用静态导出）
    location /_next {
        proxy_pass http://ssps_front;
    }

    location /static {
        alias /path/to/out/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 性能优化

### 图片优化
- 使用Next.js Image组件
- 自动响应式图片
- WebP格式支持

### 代码分割
- Next.js自动代码分割
- 按需加载组件

### 缓存策略
- HTTP缓存头配置
- CDN友好

## SEO优化

### 元数据配置
- 动态标题和描述
- Open Graph标签
- Twitter Card标签
- 结构化数据

### 预渲染
- 静态生成 (SSG)
- 服务端渲染 (SSR)

## 安全配置

### 内容安全策略 (CSP)
在 `next.config.js` 中配置:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}
```

## 调试和开发工具

### 开发工具
- Next.js开发服务器热重载
- TypeScript类型检查
- ESLint代码规范
- Tailwind CSS JIT模式

### 调试技巧
```bash
# 检查类型
npm run type-check

# 检查代码规范
npm run lint

# 查看构建分析
npm run build -- --analyze
```

## 自定义配置

### TypeScript配置
在 `tsconfig.json` 中配置TypeScript选项

### PostCSS配置
Tailwind CSS和其他PostCSS插件配置

### 自定义Webpack配置
在 `next.config.js` 中扩展Webpack配置

## 第三方服务集成

### 分析服务
```bash
# Google Analytics等服务的环境变量
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 搜索服务
集成Algolia或其他搜索服务

## 错误处理

### Next.js错误处理
- 全局错误边界
- 404/500页面
- 懒加载错误处理

### 日志记录
- 前端错误日志
- 用户行为跟踪