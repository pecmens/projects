import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { Suspense } from 'react';
import type { Metadata } from 'next';

// 从环境变量获取基础URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: '关于SSPS - 静态状态发布系统',
  description: '了解静态状态发布系统（SSPS）的愿景、特性和技术栈',
  keywords: 'SSPS, 关于, 博客系统, 静态网站, Next.js',
  openGraph: {
    title: '关于SSPS - 静态状态发布系统',
    description: '了解SSPS的愿景、特性和技术栈',
    type: 'website',
    url: `${baseUrl}/about`,
  },
  alternates: {
    canonical: '/about',
  },
};

const AboutPage = async () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">关于SSPS</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">什么是SSPS？</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                静态状态发布系统（Static State Post System, SSPS）是一个轻量级的博客生成与管理系统，
                旨在为用户提供一个本地开发环境，用于创建、管理和发布静态博客内容。
              </p>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">主要特性</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li>基于Next.js 14+构建，支持React 18+和TypeScript</li>
                <li>支持多种后端语言（Python Django、Go Gin、C# ASP.NET Core）</li>
                <li>静态文件生成，适合GitHub Pages部署</li>
                <li>响应式设计，支持移动设备</li>
                <li>轻量级，易于安装和使用</li>
                <li>支持Markdown格式内容编辑</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">技术栈</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">前端</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Next.js 14+</li>
                    <li>React 18+</li>
                    <li>TypeScript</li>
                    <li>Tailwind CSS</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">后端</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Python Django</li>
                    <li>Go Gin</li>
                    <li>C# ASP.NET Core</li>
                    <li>SQLite（本地开发）</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">开发愿景</h2>
              <p className="text-gray-600 dark:text-gray-300">
                SSPS致力于为用户提供一个简单、轻量、全能的博客发布平台，让用户专注于内容创作，
                而无需担心复杂的后端架构和部署流程。通过本地开发环境与GitHub静态页面的结合，
                SSPS将提供最佳的博客创作体验，同时保持静态网站的高性能和安全性。
              </p>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <Suspense fallback={
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="space-y-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            }>
              <Sidebar />
            </Suspense>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;