export type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};