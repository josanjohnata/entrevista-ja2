export type BlogLocale = 'pt' | 'en' | 'es';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  readTime?: number;
  published?: boolean;
  locale: BlogLocale;
  translations?: {
    [key in BlogLocale]?: string; // slug of translated version
  };
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  readTime?: number;
  published?: boolean;
  locale: BlogLocale;
  translations?: {
    [key in BlogLocale]?: string; // slug of translated version
  };
}

