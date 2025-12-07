import type { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';

type ArticleListProps = {
  articles: Article[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
};

const ArticleList = ({ articles, loading = false, error, onRetry }: ArticleListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        )}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;