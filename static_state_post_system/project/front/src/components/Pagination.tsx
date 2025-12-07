import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // 例如 '/posts' 或 '/categories/tech'
};

const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
  // 生成页码链接
  const getPageLink = (page: number) => {
    if (page === 1) {
      return baseUrl; // 第一页不需要页码参数
    }
    return `${baseUrl}?page=${page}`;
  };

  // 生成要显示的页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大可见页数，显示所有页数
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 否则，显示当前页附近的页数
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // 只有一页或没有页面时，不显示分页
  }

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-1">
        {/* 上一页按钮 */}
        <Link
          href={currentPage > 1 ? getPageLink(currentPage - 1) : '#'}
          className={`px-3 py-2 rounded ${
            currentPage > 1
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
          aria-disabled={currentPage <= 1}
        >
          上一页
        </Link>

        {/* 页码按钮 */}
        {pageNumbers.map((page) => (
          <Link
            key={page}
            href={getPageLink(page)}
            className={`px-3 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Link>
        ))}

        {/* 下一页按钮 */}
        <Link
          href={currentPage < totalPages ? getPageLink(currentPage + 1) : '#'}
          className={`px-3 py-2 rounded ${
            currentPage < totalPages
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          下一页
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;