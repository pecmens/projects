import React from 'react';

// 预加载关键资源
export const preloadResource = (url: string, as: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'document') => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  }
};

// 预连接到外部资源
export const preconnect = (url: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  }
};

// 检测设备性能
export const getDevicePerformance = () => {
  if (typeof window === 'undefined') return 'unknown';
  
  // 使用设备内存和连接类型来估算性能
  const deviceMemory = (navigator as any).deviceMemory; // 可能不可用
  const connection = (navigator as any).connection; // 可能不可用
  
  if (deviceMemory && deviceMemory < 4) {
    return 'low';
  }
  
  if (connection && ['slow-2g', '2g'].includes(connection.effectiveType)) {
    return 'low';
  }
  
  return 'high';
};

// 根据设备性能调整内容加载
export const shouldLoadHeavyContent = () => {
  return getDevicePerformance() !== 'low';
};