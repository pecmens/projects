import type { Metadata } from 'next';
import { articleService } from '@/services/api';
import type { Article } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleList from '@/components/ArticleList';
import { Suspense } from 'react';

// 从环境变量获取基础URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  
  return {
    title: query ? `搜索 "${query}" 的结果 - SSPS` : '搜索 - SSPS',
    description: query 
      ? `在SSPS博客中搜索 "${query}" 的结果` 
      : '在SSPS博客中搜索文章',
    keywords: query ? `搜索, ${query}, 博客, SSPS` : '搜索, 博客, SSPS',
    openGraph: {
      title: query ? `搜索 "${query}" 的结果 - SSPS` : '搜索 - SSPS',
      description: query 
        ? `在SSPS博客中搜索 "${query}" 的结果` 
        : '在SSPS博客中搜索文章',
      type: 'website',
      url: query 
        ? `${baseUrl}/search?q=${encodeURIComponent(query)}` 
        : `${baseUrl}/search`,
    },
    alternates: {
      canonical: query 
        ? `/search?q=${encodeURIComponent(query)}` 
        : '/search',
    },
  };
}

const SearchPageContent = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || '';
  let articles: Article[] = [];
  let searchResultsCount = 0;

  if (query) {
    articles = await articleService.searchArticles(query);
    searchResultsCount = articles.length;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">搜索结果</h1>
            
            {query ? (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  找到 {searchResultsCount} 条关于 "<span className="font-semibold">{query}</span>" 的结果
                </p>
                
                {searchResultsCount > 0 ? (
                  <ArticleList articles={articles} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">未找到与您的搜索条件匹配的文章</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">请输入搜索关键词</p>
              </div>
            )}
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

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  return <SearchPageContent searchParams={searchParams} />;
};

export default SearchPage;