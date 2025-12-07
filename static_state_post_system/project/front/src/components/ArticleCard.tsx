import Link from 'next/link';
import type { Article } from '@/types';

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        <Link href={`/posts/${article.slug || article.id}`} className="hover:underline">
          {article.title}
        </Link>
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {article.excerpt || (article.content.length > 150 ? article.content.substring(0, 150) + '...' : article.content)}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(article.createdAt).toLocaleDateString('zh-CN')}
        </span>
        <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
          {article.category}
        </span>
      </div>
    </div>
  );
};

export default ArticleCard;