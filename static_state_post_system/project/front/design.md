# SSPS 前端项目设计文档

## 1. 项目概述

静态状态发布系统（SSPS）的前端部分是一个现代化的博客平台，采用Next.js 14+框架构建，使用React 18+、TypeScript和Tailwind CSS技术栈。前端需要实现博客展示、内容浏览和本地内容管理功能。

## 2. 设计原则

- **响应式设计**：适配桌面端、平板和移动端设备
- **用户体验优先**：简洁直观的界面，流畅的交互体验
- **性能优化**：快速加载，优化SEO
- **可维护性**：清晰的组件结构，易于扩展

## 3. 技术架构

- **框架**：Next.js 14+ (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **状态管理**：React Hooks 或其他适当的状态管理方案
- **API通信**：fetch API 或 SWR/React Query

## 4. 页面结构

### 4.1 主要页面
- **首页** (`/`) - 展示博客文章列表，包含标题、摘要、发布日期等信息
- **文章详情页** (`/posts/[slug]`) - 展示完整的文章内容，支持Markdown渲染
- **分类页** (`/categories/[category]`) - 按分类展示文章列表
- **归档页** (`/archive`) - 按时间归档展示文章
- **关于页** (`/about`) - 站点信息
- **内容管理页** (`/admin` 或 `/manage`) - 本地开发时的管理界面

### 4.2 布局组件
- **头部导航** - 包含站点标题、主要导航链接
- **侧边栏** - 展示分类、标签、最新文章等信息
- **页脚** - 版权信息、社交媒体链接等
- **文章卡片** - 统一的文章展示组件
- **分页组件** - 文章列表分页功能

## 5. 组件设计

### 5.1 全局组件
- `Header` - 顶部导航栏
- `Footer` - 页面底部
- `Sidebar` - 侧边栏
- `Navigation` - 主导航
- `Search` - 搜索功能
- `ThemeToggle` - 主题切换（暗色/亮色模式）

### 5.2 文章相关组件
- `ArticleCard` - 文章卡片展示
- `ArticleList` - 文章列表
- `MarkdownRenderer` - Markdown内容渲染器
- `ArticleMeta` - 文章元数据（作者、日期、分类等）
- `Toc` - 文章目录（Table of Contents）

### 5.3 管理功能组件（本地开发）
- `Editor` - 内容编辑器
- `ArticleForm` - 文章创建/编辑表单
- `MediaManager` - 媒体文件管理

## 6. 功能需求

### 6.1 核心功能
- 首页文章列表展示
- 文章详情页展示（Markdown渲染）
- 分类浏览
- 标签系统
- 文章搜索
- 归档功能
- 响应式布局

### 6.2 高级功能
- 深色/浅色主题切换
- 文章分享功能
- 相关文章推荐
- 评论系统（预留接口）

### 6.3 管理功能（本地开发）
- 文章创建、编辑、删除
- 预览功能
- Markdown编辑器
- 媒体文件上传

## 7. API设计（前端视角）

### 7.1 数据模型
- Article: { id, title, slug, content, excerpt, published, createdAt, updatedAt, category, tags }

### 7.2 API端点
- GET /api/articles - 获取文章列表
- GET /api/articles/:slug - 获取特定文章
- GET /api/categories - 获取分类列表
- GET /api/tags - 获取标签列表
- (管理功能) POST/PUT/DELETE /api/articles - 创建/更新/删除文章

## 8. 路由结构

```
/
├── page.tsx (首页)
├── posts/
│   └── [slug]/
│       └── page.tsx (文章详情页)
├── categories/
│   └── [category]/
│       └── page.tsx (分类页)
├── archive/
│   └── page.tsx (归档页)
├── about/
│   └── page.tsx (关于页)
├── admin/
│   └── page.tsx (管理页)
├── layout.tsx (根布局)
├── error.tsx (错误处理)
└── not-found.tsx (404处理)
```

## 9. 设计风格

- **颜色方案**：简约风格，以中性色为主，强调阅读体验
- **字体**：中文使用思源黑体/苹方，英文使用系统默认字体
- **间距**：遵循Tailwind CSS的默认间距系统
- **动画**：适度使用动画效果提升用户体验

## 10. SEO优化

- 预渲染关键页面
- 合理的meta标签设置
- 结构化数据支持
- 正确的标题层级

## 11. 性能优化

- 图像优化（使用next/image）
- 代码分割
- 预加载关键资源
- 静态生成优化

## 12. 安全考虑

- Markdown内容的安全渲染（防止XSS）
- 用户输入验证
- 适当的CSP策略