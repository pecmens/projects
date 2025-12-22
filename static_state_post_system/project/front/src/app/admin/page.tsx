'use client';

import { useState, useEffect } from 'react';
import { articleService } from '@/services/api';
import { getApiBaseUrl } from '@/config/app';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

const AdminPage = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('articles');
  const [user, setUser] = useState<any>(null);

  // 检查用户认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 这单检查是否有认证令牌
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('请先登录');
          return;
        }
        
        // 尝试获取用户信息以验证令牌
        const response = await fetch(`${getApiBaseUrl()}/auth/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('认证令牌无效');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError('认证失败，请重新登录');
        console.error('Auth error:', err);
      }
    };

    checkAuth();
  }, []);

  // 获取数据
  useEffect(() => {
    if (!user) return; // 只有在用户认证后才获取数据
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取文章、分类和标签
        const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
          articleService.getArticles(1, 100),
          articleService.getCategories(),
          articleService.getTags()
        ]);
        
        setArticles(articlesRes.articles);
        setCategories(categoriesRes);
        setTags(tagsRes);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-red-600 dark:text-red-400 mb-4">错误</h2>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            前往前台登录
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                管理面板
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300 mr-4">
                欢迎, {user?.username || user?.email}
              </span>
              <button 
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  window.location.href = '/';
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('articles')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'articles'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              文章管理
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              分类管理
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tags'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              标签管理
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'articles' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">文章管理</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  新增文章
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.map((article) => (
                    <li key={article.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                            {article.title}
                          </p>
                          <div className="ml-2 flex flex-shrink-0">
                            <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              article.published 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400'
                            }`}>
                              {article.published ? '已发布' : '草稿'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {article.category}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                              {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                            <span className="inline-flex items-center">
                              {article.tags && article.tags.length > 0 ? (
                                <span className="flex flex-wrap gap-1">
                                  {article.tags.slice(0, 3).map((tag: string, idx: number) => (
                                    <span 
                                      key={idx} 
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {article.tags.length > 3 && (
                                    <span className="text-gray-500 dark:text-gray-400">
                                      +{article.tags.length - 3}
                                    </span>
                                  )}
                                </span>
                              ) : '无标签'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">分类管理</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  新增分类
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                            {category.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {category.description}
                          </p>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              标签: {category.slug}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                            文章数: {articles.filter((a: any) => a.category === category.name).length}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">标签管理</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  新增标签
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tags.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {tag.name}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          标签: {tag.slug}
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          相关文章数: {articles.filter((a: any) => 
                            a.tags && a.tags.includes(tag.name)
                          ).length}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;