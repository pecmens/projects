using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.AspNetCore.Mvc.Extensions;
using Volo.Abp.Modularity;

namespace FileTransfer.WebRTC
{
    public static class AbpAppInitializer
    {
        public static async Task<WebApplicationBuilder> InitializeApplicationAsync<TModule>(this WebApplicationBuilder builder)
            where TModule : AbpModule
        {
            // 添加ABP模块
            builder.Services.AddApplication<TModule>();

            // 添加内存缓存
            builder.Services.AddMemoryCache();

            // 添加Razor Pages支持
            builder.Services.AddRazorPages();

            // 添加MVC支持
            builder.Services.AddControllers();

            return builder;
        }

        public static async Task InitializeApplicationAsync(this WebApplication app)
        {
            // 初始化ABP应用
            await app.InitializeApplicationAsync();

            // 配置中间件
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();

            // 配置路由
            app.MapRazorPages();
            app.MapControllers();
        }
    }
}