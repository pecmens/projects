using Volo.Abp.Modularity;
using Volo.Abp.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using FileTransfer.WebRTC.Services;
using FileTransfer.WebRTC.Hubs;

namespace FileTransfer.WebRTC
{
    [DependsOn(typeof(AbpAspNetCoreMvcModule))]
    public class FileTransferWebRTCModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            // 配置房间管理服务
            context.Services.AddSingleton<IRoomManager, RoomManager>();
            
            // 配置SignalR Hub
            context.Services.AddSignalR();
            
            // 配置CORS
            context.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });
            
            // 配置MVC
            Configure<Microsoft.AspNetCore.Mvc.MvcOptions>(options =>
            {
                // 可以在这里添加MVC相关配置
            });
        }
    }
}