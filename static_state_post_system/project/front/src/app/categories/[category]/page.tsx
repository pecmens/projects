import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articleService } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleList from '@/components/ArticleList';
import { Suspense } from 'react';

// 从环境变量获取基础URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// 生成静态参数以支持静态导出
export async function generateStaticParams() {
  const categories = await articleService.getCategories();
  return categories.map(category => ({
    category: category.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await articleService.getCategory(params.category);
  
  if (!category) {
    return {
      title: '分类未找到 - SSPS',
      description: '请求的分类不存在'
    };
  }
  
  return {
    title: `${category.name} - SSPS`,
    description: category.description || `关于${category.name}的文章分类`,
    keywords: `${category.name}, 文章分类, 博客`,
    openGraph: {
      title: `${category.name} - SSPS`,
      description: category.description || `关于${category.name}的文章分类`,
      type: 'website',
      url: `${baseUrl}/categories/${params.category}`,
    },
    alternates: {
      canonical: `/categories/${params.category}`,
    },
  };
}

type CategoryPageProps = {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
};

const CategoryPageContent = async ({ params, searchParams }: CategoryPageProps) => {
  const category = await articleService.getCategory(params.category);
  if (!category) {
    notFound();
  }
  
  const page = parseInt(searchParams.page || '1');
  const { articles, totalPages } = await articleService.getArticles(page, 6, category.name);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              分类: {category.name}
            </h1>
            
            <ArticleList articles={articles} />
            
            {totalPages > 1 && (
              <div className="mt-8">
                {/* 在实际实现中，这里将使用Pagination组件，但目前需要手动实现 */}
                <div className="flex justify-center">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <a
                        key={pageNum}
                        href={`/categories/${params.category}?page=${pageNum}`}
                        className={`px-3 py-2 rounded ${
                          pageNum === page
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </a>
                    ))}
                  </div>
                </div>
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

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  return <CategoryPageContent params={params} searchParams={searchParams} />;
};

export default CategoryPage;