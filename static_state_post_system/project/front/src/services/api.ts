import type { Article, Category, Tag } from '@/types';
import { getApiBaseUrl } from '@/config/app';

// API服务
export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 为API调用添加通用错误处理
const handleAPIResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // 尝试获取错误消息
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (e) {
      // 如果无法解析错误响应，使用默认消息
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

export const articleService = {
  // 获取文章列表
  getArticles: async (page: number = 1, limit: number = 6, category?: string, tag?: string): Promise<{ articles: Article[]; totalPages: number; total: number }> => {
    try {
      let url = `${getApiBaseUrl()}/articles?page=${page}&page_size=${limit}`;
      if (category) url += `&category=${category}`;
      if (tag) url += `&tag=${tag}`;
      
      const response = await fetch(url);
      const data = await handleAPIResponse<any>(response);
      
      // 适配API响应格式到期望的格式
      return {
        articles: data.result || data.items || data, // API可能返回不同格式
        totalPages: Math.ceil((data.count || data.total || 0) / limit),
        total: data.count || data.total || (data.items ? data.items.length : data.length)
      };
    } catch (error) {
      console.error('获取文章列表失败:', error);
      // 在开发期间，返回模拟数据作为后备
      if (process.env.NODE_ENV !== 'production') {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        // 返回模拟数据的子集
        const mockArticles = [
          {
            id: 1,
            title: '欢迎来到SSPS',
            slug: 'welcome-to-ssps',
            content: '欢迎内容...',
            excerpt: '这是一个示例文章摘要。',
            published: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            category: '技术',
            tags: ['SSPS', '博客', 'Next.js'],
          },
          {
            id: 2,
            title: '快速开始指南',
            slug: 'getting-started',
            content: '快速开始内容...',
            excerpt: '本文将指导您如何快速搭建和使用SSPS静态博客系统。',
            published: true,
            createdAt: '2023-01-02T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
            category: '教程',
            tags: ['教程', '快速开始', '指南'],
          }
        ];
        
        return {
          articles: mockArticles,
          totalPages: 1,
          total: mockArticles.length
        };
      }
      throw error;
    }
  },

  // 获取特定文章
  getArticle: async (slug: string): Promise<Article | null> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/articles/${slug}`);
      if (response.status === 404) return null;
      
      const article: Article = await handleAPIResponse<Article>(response);
      return article;
    } catch (error) {
      console.error(`获取文章 ${slug} 失败:`, error);
      // 在开发期间，返回模拟数据作为后备
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (slug === 'welcome-to-ssps') {
          return {
            id: 1,
            title: '欢迎来到SSPS',
            slug: 'welcome-to-ssps',
            content: '欢迎内容...',
            excerpt: '这是一个示例文章摘要。',
            published: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            category: '技术',
            tags: ['SSPS', '博客', 'Next.js'],
          };
        }
      }
      throw error;
    }
  },

  // 搜索文章
  searchArticles: async (query: string): Promise<Article[]> => {
    if (!query) return [];
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/articles?search=${encodeURIComponent(query)}`);
      const data = await handleAPIResponse<any>(response);
      return data.result || data.items || data;
    } catch (error) {
      console.error(`搜索文章失败:`, error);
      // 在开发期间，返回模拟数据作为后备
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
          {
            id: 1,
            title: '欢迎来到SSPS',
            slug: 'welcome-to-ssps',
            content: '欢迎内容...',
            excerpt: '这是一个示例文章摘要。',
            published: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            category: '技术',
            tags: ['SSPS', '博客', 'Next.js'],
          }
        ];
      }
      throw error;
    }
  },

  // 获取分类列表
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/categories`);
      const categories: Category[] = await handleAPIResponse<Category[]>(response);
      return categories;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      // 在开发期间，返回模拟数据作为后备
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
          { id: 1, name: '技术', slug: 'tech', description: '技术相关的文章' },
          { id: 2, name: '教程', slug: 'tutorial', description: '教程和指南' },
        ];
      }
      throw error;
    }
  },

  // 根据slug获取分类
  getCategory: async (slug: string): Promise<Category | null> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/categories/slug/${slug}`);
      if (response.status === 404) return null;
      
      const category: Category = await handleAPIResponse<Category>(response);
      return category;
    } catch (error) {
      console.error(`获取分类 ${slug} 失败:`, error);
      // 在开发期间，返回模拟数据作为后备
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (slug === 'tech') {
          return { id: 1, name: '技术', slug: 'tech', description: '技术相关的文章' };
        }
      }
      throw error;
    }
  },

  // 获取标签列表
  getTags: async (): Promise<Tag[]> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/tags`);
      const tags: Tag[] = await handleAPIResponse<Tag[]>(response);
      return tags;
    } catch (error) {
      console.error('获取标签列表失败:', error);
      // 在开发期间，返回模拟数据作为后备
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
          { id: 1, name: 'SSPS', slug: 'ssps' },
          { id: 2, name: '博客', slug: 'blog' },
        ];
      }
      throw error;
    }
  },
};

// 按年份归档文章（仍使用本地数据）
export const getArchivedArticles = (articles: Article[]): { year: number; articles: Article[] }[] => {
  const grouped: { [year: number]: Article[] } = {};
  
  articles.forEach(article => {
    // 确保日期字符串格式正确
    const date = new Date(article.createdAt);
    const year = date.getFullYear();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(article);
  });
  
  // 按年份降序排列
  return Object.entries(grouped)
    .map(([year, articles]) => ({
      year: parseInt(year),
      articles: articles.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }))
    .sort((a, b) => b.year - a.year);
};