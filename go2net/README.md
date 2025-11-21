# File Transfer System (.NET ABP.io)

## 项目简介
这是一个基于.NET ABP.io框架开发的跨平台文件传输系统，是对原有Go语言file-transfer-go项目的重构版本。该系统利用WebRTC技术实现高效、安全的P2P文件传输，支持大文件传输、断点续传和多文件同时传输等功能。

## 主要功能

- **高效文件传输**
  - P2P直连传输，减少服务器负担
  - 支持大文件传输（>1GB）
  - 断点续传机制
  - 多文件并行传输

- **现代化Web界面**
  - 响应式设计，支持多设备访问
  - 文件拖拽上传支持
  - 实时传输进度显示
  - 用户友好的操作体验

- **安全可靠**
  - 用户认证与授权
  - 数据传输加密
  - 传输状态监控
  - 详细日志记录

## 技术栈

### 后端
- .NET 8.0
- ABP.io Framework
- C# 12
- SignalR
- Entity Framework Core

### 前端
- React/Angular
- TypeScript
- Tailwind CSS
- WebRTC API

### 数据库
- SQL Server/PostgreSQL

### 部署
- Docker
- Docker Compose
- CI/CD支持

## 快速开始

### 开发环境要求
- .NET 8.0 SDK
- Node.js 18+
- SQL Server/PostgreSQL
- Docker（可选）

### 安装与运行

1. 克隆项目
```bash
git clone <repository-url>
cd go2net/net
```

2. 配置数据库连接
编辑 `appsettings.json` 中的数据库连接字符串

3. 运行数据库迁移
```bash
dotnet ef database update
```

4. 启动后端服务
```bash
dotnet run
```

5. 启动前端服务
```bash
cd src/frontend
npm install
npm start
```

## 项目结构

- `net/`: .NET项目根目录
  - `src/`: 源代码目录
    - `*.Application/`: 应用服务层
    - `*.Domain/`: 领域层
    - `*.EntityFrameworkCore/`: 数据访问层
    - `*.Web/`: Web API和前端集成
    - `frontend/`: 前端代码
  - `tests/`: 测试代码

## 许可证
[MIT License](LICENSE)

## 贡献指南
欢迎提交Issue和Pull Request！

## 联系方式
如有问题或建议，请通过Issues与我们联系。