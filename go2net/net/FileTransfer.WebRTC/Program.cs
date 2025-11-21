using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Modularity;

var builder = WebApplication.CreateBuilder(args);

// 使用ABP框架初始化应用程序
await builder.InitializeApplicationAsync<FileTransferWebRTCModule>();

// 构建应用程序
var app = builder.Build();

// 配置HTTP请求管道
await app.InitializeApplicationAsync();

// 确保应用程序使用CORS策略
app.UseCors("AllowAll");

// 映射SignalR Hub
app.MapHub<Hubs.WebRtcSignalingHub>("/api/ws/webrtc");
app.MapHub<Hubs.WebRtcSignalingHub>("/ws/webrtc");

// 启动应用程序
await app.RunAsync();