import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articleService } from '@/services/api';
import type { Article } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleMeta from '@/components/ArticleMeta';
import DynamicMarkdownRenderer from '@/components/DynamicMarkdownRenderer';
import Share from '@/components/Share';
import RelatedArticles from '@/components/RelatedArticles';
import Toc from '@/components/Toc';

// 生成静态参数以支持静态导出
export async function generateStaticParams() {
  // 在实际实现中，这将从API获取所有文章的slug
  // 由于无法在构建时获取API数据，这里返回空数组
  // 实际的文章slug将通过API获取
  return [];
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await articleService.getArticle(params.slug);
  
  if (!article) {
    return {
      title: '文章未找到 - SSPS',
      description: '请求的文章不存在'
    };
  }
  
  // 从环境变量获取基础URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // 生成文章的结构化数据
  const datePublished = new Date(article.createdAt).toISOString();
  const dateModified = new Date(article.updatedAt).toISOString();
  
  return {
    title: `${article.title} - SSPS`,
    description: article.excerpt || article.content.substring(0, 160),
    keywords: article.tags.join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      type: 'article',
      publishedTime: datePublished,
      modifiedTime: dateModified,
      authors: ['SSPS Team'],
      tags: article.tags,
      url: `${baseUrl}/posts/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
    },
    alternates: {
      canonical: `/posts/${params.slug}`,
    },
    authors: [{ name: 'SSPS Team' }],
  };
}

type ArticleDetailPageProps = {
  params: {
    slug: string;
  };
};

// 从Markdown内容中提取标题
const extractHeadings = (content: string) => {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/(<([^>]+)>)|(&nbsp;)/gi, '').trim(); // 移除可能的HTML标签
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中英文、数字、空格和连字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .replace(/^-|-$/g, ''); // 去除开头和结尾的连字符

    headings.push({ id, text, level });
  }

  return headings;
};

const ArticleDetailPage = async ({ params }: ArticleDetailPageProps) => {
  const article = await articleService.getArticle(params.slug);
  
  if (!article) {
    notFound(); // 如果文章不存在，显示404页面
  }

  // 获取所有文章用于相关文章推荐
  const { articles: allArticles } = await articleService.getArticles(1, 100); // 获取所有文章
  
  // 提取标题用于目录
  const headings = extractHeadings(article.content);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className={headings.length > 0 ? 'md:w-2/3' : 'md:w-2/3'}>
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{article.title}</h1>
              
              <ArticleMeta article={article} />
              
              <div className="mt-6">
                <DynamicMarkdownRenderer content={article.content} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 分享组件 */}
              <Share 
                title={article.title} 
                url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/posts/${article.slug}`} 
              />
              
              {/* 相关文章推荐 */}
              <RelatedArticles 
                currentArticle={article} 
                allArticles={allArticles} 
              />
            </article>
          </div>
          
          <div className="md:w-1/3">
            {/* 如果有标题，则显示目录，否则显示侧边栏 */}
            {headings.length > 0 ? (
              <>
                <Toc headings={headings} />
                <div className="mt-6">
                  <Sidebar />
                </div>
              </>
            ) : (
              <Sidebar />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;