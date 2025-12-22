import { articleService } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';

// 从环境变量获取基础URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: '文章归档 - SSPS',
  description: '按年份归档的SSPS博客文章列表',
  keywords: '博客归档, 文章列表, 按年份归档',
  openGraph: {
    title: '文章归档 - SSPS',
    description: '按年份归档的SSPS博客文章列表',
    type: 'website',
    url: `${baseUrl}/archive`,
  },
  alternates: {
    canonical: '/archive',
  },
};

const ArchivePageContent = async () => {
  // 获取所有文章以构建归档
  const { articles } = await articleService.getArticles(1, 100); // 获取所有文章
  const archivedArticles = articleService.getArchivedArticles(articles);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">文章归档</h1>
            
            <div className="space-y-8">
              {archivedArticles.map((yearGroup) => (
                <div key={yearGroup.year}>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{yearGroup.year}年</h2>
                  <ul className="space-y-2">
                    {yearGroup.articles.map((article) => (
                      <li key={article.id} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4 py-1 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <div className="flex justify-between items-start">
                          <Link 
                            href={`/posts/${article.slug}`} 
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                          >
                            {article.title}
                          </Link>
                          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                            {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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

const ArchivePage = async () => {
  return <ArchivePageContent />;
};

export default ArchivePage;