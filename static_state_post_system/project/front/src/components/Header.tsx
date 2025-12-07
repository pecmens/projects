'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 如果在搜索页面，初始化搜索框的值
  useEffect(() => {
    if (pathname === '/search' && searchParams) {
      const query = searchParams.get('q') || '';
      setSearchQuery(query);
    }
  }, [pathname, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // 检查是否在本地开发环境中，以决定是否显示管理链接
  const isAdminAvailable = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname === '[::1]' ||
     window.location.port !== '');

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            <Link href="/">SSPS</Link>
          </div>
          
          {/* 搜索框 */}
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
          
          {/* 主题切换按钮 */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* 桌面端导航 */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    首页
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/archive" 
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    归档
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    关于
                  </Link>
                </li>
                
                {/* 仅在本地开发环境中显示管理链接 */}
                {isAdminAvailable && (
                  <li>
                    <Link 
                      href="/admin" 
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                    >
                      管理
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            
            {/* 移动端菜单按钮 */}
            <button 
              className="md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  首页
                </Link>
              </li>
              <li>
                <Link 
                  href="/archive" 
                  className="block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  归档
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  关于
                </Link>
              </li>
              
              {/* 仅在本地开发环境中显示管理链接 */}
              {isAdminAvailable && (
                <li>
                  <Link 
                    href="/admin" 
                    className="block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    管理
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;