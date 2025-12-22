import Link from 'next/link';
import type { Category } from '@/types';
import { articleService } from '@/services/api';

// 获取侧边栏数据的异步函数
const getSidebarData = async () => {
  const [categories, latestArticlesResult, allArticlesResult] = await Promise.all([
    articleService.getCategories(),
    articleService.getArticles(1, 5),
    articleService.getArticles(1, 100) // 获取所有文章以计算统计数据
  ]);
  
  const totalPosts = allArticlesResult.total;
  
  // 计算每个分类的文章数量
  const categoryCounts: Record<string, number> = {};
  allArticlesResult.articles.forEach(article => {
    if (article.category) {
      categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
    }
  });
  
  return {
    categories,
    latestArticles: latestArticlesResult.articles,
    totalPosts,
    categoryCounts
  };
};

// 服务端组件，用于渲染侧边栏内容
const SidebarContent = async () => {
  const { categories, latestArticles, totalPosts, categoryCounts } = await getSidebarData();

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">关于 SSPS</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">静态状态发布系统是一个轻量级的博客生成与管理系统</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">统计信息</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex justify-between">
              <span>文章总数</span>
              <span className="font-medium">{totalPosts}</span>
            </li>
            <li className="flex justify-between">
              <span>分类数量</span>
              <span className="font-medium">{categories.length}</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">分类</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  href={`/categories/${category.slug}`} 
                  className="text-blue-600 hover:underline dark:text-blue-400 flex justify-between"
                >
                  <span>{category.name}</span>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {categoryCounts[category.name] || 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">最新文章</h3>
          <ul className="space-y-3">
            {latestArticles.map((article) => (
              <li key={article.id}>
                <Link 
                  href={`/posts/${article.slug}`} 
                  className="text-blue-600 hover:underline dark:text-blue-400 text-sm block"
                >
                  <span className="block truncate">{article.title}</span>
                  <span className="block text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default SidebarContent;