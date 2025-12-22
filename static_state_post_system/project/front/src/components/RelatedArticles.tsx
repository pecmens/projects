import Link from 'next/link';
import type { Article } from '@/types';

type RelatedArticlesProps = {
  currentArticle: Article;
  allArticles: Article[];
};

const RelatedArticles = ({ currentArticle, allArticles }: RelatedArticlesProps) => {
  // 根据标签和分类推荐相关文章
  const relatedArticles = allArticles
    .filter(article => 
      article.id !== currentArticle.id && 
      (article.tags.some(tag => currentArticle.tags.includes(tag)) || 
       article.category === currentArticle.category)
    )
    .slice(0, 3); // 限制为最多3篇相关文章

  if (relatedArticles.length === 0) {
    return null; // 如果没有相关文章，则不显示组件
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">相关文章</h3>
      <div className="space-y-4">
        {relatedArticles.map(article => (
          <div key={article.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold">
              <Link 
                href={`/posts/${article.slug}`} 
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {article.title}
              </Link>
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {article.excerpt || (article.content.length > 100 ? article.content.substring(0, 100) + '...' : article.content)}
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
              <span className="mx-2">•</span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {article.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;