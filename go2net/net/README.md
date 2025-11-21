# WebRTC文件传输应用 (.NET ABP.io 版本)

这是一个基于WebRTC技术的P2P文件传输应用，使用.NET ABP.io框架重构自原始Go项目。该应用允许用户通过6位取件码在浏览器之间直接传输文件、文字和共享桌面。

## 功能特性

- **P2P文件传输**：基于WebRTC DataChannel实现端到端加密传输
- **房间管理**：6位取件码系统，支持临时房间创建和过期清理
- **多类型传输**：支持文件传输、文字消息、桌面共享
- **ABP.io框架**：基于.NET 8和ABP.io框架构建，提供模块化架构

## 技术栈

- **后端**：.NET 8, ASP.NET Core, ABP.io框架, SignalR (WebSocket)
- **前端**：支持WebRTC的现代浏览器 (需要原Next.js前端代码)
- **传输协议**：WebRTC DataChannel, STUN/TURN服务器

## 项目结构

```
FileTransfer.WebRTC/
├── Controllers/          # API控制器
│   └── RoomController.cs # 房间管理API
├── Hubs/                 # SignalR Hub
│   └── WebRtcSignalingHub.cs # WebRTC信令处理
├── Services/             # 业务逻辑服务
│   ├── IRoomManager.cs   # 房间管理接口
│   └── RoomManager.cs    # 房间管理实现
├── AbpAppInitializer.cs  # ABP应用初始化器
├── FileTransferWebRTCModule.cs # ABP模块定义
├── Program.cs            # 应用入口
└── FileTransfer.WebRTC.csproj # 项目文件
```

## 主要组件

### 房间管理服务
- 创建6位取件码房间
- 管理房间内的客户端连接
- 自动清理过期房间

### WebRTC信令服务器
- 使用SignalR实现WebSocket连接
- 处理WebRTC信令交换（offer, answer, ICE candidates）
- 支持客户端加入/离开房间通知

### API接口
- `/api/room/create` - 创建新房间
- `/api/room/status/{code}` - 获取房间状态
- `/api/room/exists/{code}` - 检查房间是否存在

## 使用方法

### 1. 启动服务器
```bash
dotnet run
```

### 2. 客户端连接流程
1. 发送方创建房间，获取6位取件码
2. 接收方使用取件码加入房间
3. 通过WebSocket连接进行WebRTC信令交换
4. 建立P2P连接后进行文件传输或文字聊天

## WebSocket端点

- `/api/ws/webrtc` - WebRTC信令WebSocket端点
- `/ws/webrtc` - 备用WebSocket端点（兼容原始Go服务）

## SignalR方法

### 客户端调用
- `CreateRoom()` - 创建新房间
- `JoinRoom(code, role, clientId)` - 加入房间
- `SendSignal(code, targetClientId, signal)` - 发送WebRTC信令
- `Heartbeat()` - 心跳检测

### 服务器推送
- `peer_joined` - 通知房间内其他用户新用户加入
- `signal` - 转发WebRTC信令消息
- `heartbeat` - 心跳响应
- `error` - 错误通知

## 部署说明

### 本地开发
```bash
cd FileTransfer.WebRTC
dotnet restore
dotnet build
dotnet run
```

### 生产部署
1. 构建发布版本：`dotnet publish -c Release`
2. 部署到支持ASP.NET Core的服务器
3. 配置环境变量（可选）

### 注意事项
- 生产环境建议配置STUN/TURN服务器以提高连接成功率
- 考虑配置适当的房间过期时间和清理策略

## 与原始Go版本的差异

- 使用.NET ABP.io框架替代Go后端
- 使用SignalR替代标准WebSocket实现
- 采用ABP模块化架构设计
- 保持相同的API端点和WebSocket接口以兼容现有前端