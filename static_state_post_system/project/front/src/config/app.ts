// 配置文件 - 管理应用配置
export function getBaseUrl(): string {
  // 优先使用环境变量，否则使用默认值
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export function getApiBaseUrl(): string {
  // API基础URL，可与站点URL不同
  return process.env.NEXT_PUBLIC_API_BASE_URL || `${getBaseUrl()}/api`;
}