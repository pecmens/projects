# SSPS 项目规则

## 通用规则

1. **代码风格**
   - 前端代码使用 Next.js + React + TypeScript + Tailwind CSS
   - 后端代码遵循 RESTful API 设计原则
   - 代码必须包含适当的注释和文档

2. **文件结构**
   - 前端代码放置在 project/front/ 目录
   - 后端代码按语言分别放置在 project/back/python/, project/back/go/, project/back/csharp/ 目录
   - 配置文件统一放置在项目根目录
   - 实现前后端分离架构，前端与后端分别在独立的目录中开发

3. **依赖管理**
   - 前端使用 npm 管理依赖
   - Python 后端使用 pip 管理依赖
   - 各模块的依赖应独立管理

## 当前开发重点

- 项目目前优先开发前端功能，后端管理系统为后续计划
- 前端项目文件全部放在 project/front 文件夹下
- 后端项目文件分为三种不同的架构语言分别放入 python、golang、csharp 对应的文件夹中

## 前端规则 (project/front/)

1. **技术栈**
   - 使用 Next.js 14+ 框架
   - 使用 React 18+ 和 TypeScript
   - 使用 Tailwind CSS 进行样式设计
   - 遵循 Next.js 的 App Router 结构

2. **组件设计**
   - 组件应具有良好的可重用性
   - 使用函数组件和 Hooks
   - 遵循 React 最佳实践

3. **页面结构**
   - 首页应展示博客文章列表
   - 文章详情页应支持 Markdown 渲染
   - 提供内容管理界面（仅本地开发时可用）

## 后端规则 (project/back/)

1. **Python (Django)**
   - 使用 Django 框架和 Django REST Framework
   - 数据库使用 SQLite（本地开发）
   - API 接口应支持 JWT 认证
   - 提供文章、分类、标签等管理功能

2. **API 设计**
   - 遵循 RESTful 风格
   - 使用 JSON 格式进行数据交换
   - 错误处理应返回适当的 HTTP 状态码

3. **数据模型**
   - 文章模型应包含标题、内容、发布时间等字段
   - 支持 Markdown 格式的文章内容
   - 支持图片等媒体文件上传

## 静态生成规则

1. **生成流程**
   - 后端管理系统写入内容后，自动生成静态 HTML 页面
   - 静态文件应包含完整的 HTML、CSS 和 JavaScript
   - 生成的静态文件应能独立运行

2. **SEO 优化**
   - 生成的页面应包含适当的 meta 标签
   - 支持预渲染以提高 SEO 效果

## 部署规则

1. **GitHub 部署**
   - 提供一键部署到 GitHub Pages 的功能
   - 生成的静态文件应符合 GitHub Pages 要求
   - 支持自定义域名配置

2. **本地开发**
   - 本地开发环境应模拟线上服务器行为
   - 本地运行时可以同时看到前端和后端

## 安全规则

1. **输入验证**
   - 所有用户输入必须进行验证和清理
   - 防止 XSS 和 SQL 注入攻击

2. **认证授权**
   - 后端管理系统必须实现用户认证
   - 使用 JWT 进行身份验证

## 性能规则

1. **优化目标**
   - 生成的静态文件体积小，加载速度快
   - 本地运行资源占用低