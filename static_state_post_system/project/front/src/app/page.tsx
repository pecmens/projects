import { articleService } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleList from '@/components/ArticleList';
import { Suspense } from 'react';
import type { Metadata } from 'next';

// 从环境变量获取基础URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'SSPS - 静态状态发布系统 - 轻量级博客生成与管理系统',
  description: 'SSPS是一个轻量级的博客生成与管理系统，基于Next.js构建，支持多种后端语言，适合创建和管理静态博客内容。',
  keywords: '博客, 静态网站生成器, Next.js, React, TypeScript, Markdown',
  openGraph: {
    title: 'SSPS - 静态状态发布系统',
    description: '一个轻量级的博客生成与管理系统',
    type: 'website',
    url: baseUrl,
  },
  alternates: {
    canonical: '/',
  },
};

// 服务端获取文章数据
export const dynamic = 'force-dynamic'; // 确保获取最新数据

const HomeContent = async () => {
  const { articles } = await articleService.getArticles(1, 6); // 获取前6篇文章

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">欢迎使用 SSPS - 静态状态发布系统</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">一个轻量级的博客生成与管理系统</p>
            
            <ArticleList articles={articles} />
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

const Home = async () => {
  return <HomeContent />;
};

export default Home;
