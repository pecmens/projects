import type { Article } from '@/types';

type ArticleMetaProps = {
  article: Article;
};

const ArticleMeta = ({ article }: ArticleMetaProps) => {
  return (
    <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
      <span className="mr-4">发布于 {new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
      {article.updatedAt !== article.createdAt && (
        <span className="mr-4">更新于 {new Date(article.updatedAt).toLocaleDateString('zh-CN')}</span>
      )}
      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
        {article.category}
      </span>
    </div>
  );
};

export default ArticleMeta;