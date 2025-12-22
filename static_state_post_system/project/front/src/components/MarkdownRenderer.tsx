import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/default.css';
import OptimizedImage from './OptimizedImage';

type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      className="prose prose-gray dark:prose-invert max-w-none"
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800 dark:text-white" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-3 text-gray-800 dark:text-white" {...props} />,
        p: ({ node, ...props }) => <p className="my-4 text-gray-700 dark:text-gray-300" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline dark:text-blue-400" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside my-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-4" {...props} />,
        li: ({ node, ...props }) => <li className="my-2" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote 
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 text-gray-600 dark:text-gray-400" 
            {...props} 
          />
        ),
        code: ({ node, inline, ...props }) => {
          if (inline) {
            return <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props} />;
          }
          return (
            <code className="block bg-gray-100 dark:bg-gray-700 p-4 rounded my-4 overflow-x-auto text-sm" {...props} />
          );
        },
        pre: ({ node, ...props }) => <pre className="my-4" {...props} />,
        img: (props) => {
          // 从Markdown中的![](url "alt")语法中提取属性
          const { src, alt, title } = props;
          return (
            <OptimizedImage 
              src={src || ''}
              alt={alt || ''}
              title={title}
              className="my-4 rounded-lg max-w-full h-auto" 
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;