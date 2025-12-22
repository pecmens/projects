import dynamic from 'next/dynamic';
import type { Article } from '@/types';

// 动态导入Markdown渲染器，实现代码分割
const MarkdownRenderer = dynamic(
  () => import('./MarkdownRenderer'),
  { 
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    ),
    ssr: true // 重新启用SSR，因为ReactMarkdown支持服务端渲染
  }
);

type DynamicMarkdownRendererProps = {
  content: string;
};

const DynamicMarkdownRenderer = ({ content }: DynamicMarkdownRendererProps) => {
  return <MarkdownRenderer content={content} />;
};

export default DynamicMarkdownRenderer;