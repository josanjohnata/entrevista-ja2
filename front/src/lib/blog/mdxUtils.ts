import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMetadata } from './types';

const BLOG_DIRECTORY = path.join(process.cwd(), 'src/content/blog');

export function getBlogDirectory(): string {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    fs.mkdirSync(BLOG_DIRECTORY, { recursive: true });
  }
  return BLOG_DIRECTORY;
}

export function getAllPostSlugs(): string[] {
  const blogDir = getBlogDirectory();
  const files = fs.readdirSync(blogDir);
  
  return files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const blogDir = getBlogDirectory();
    const realSlug = slug.replace(/\.mdx?$/, '');
    
    let fullPath = path.join(blogDir, `${realSlug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(blogDir, `${realSlug}.md`);
    }
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const readTime = calculateReadTime(content);
    
    return {
      slug: realSlug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      content,
      coverImage: data.coverImage,
      date: data.date || new Date().toISOString(),
      author: data.author || { name: 'FoxApply Team' },
      tags: data.tags || [],
      readTime,
      published: data.published !== false,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): BlogPostMetadata[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null && post.published !== false)
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
  
  return posts.map(({ content, ...metadata }) => metadata);
}

export function getPostsByTag(tag: string): BlogPostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => 
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): { tag: string; count: number }[] {
  const allPosts = getAllPosts();
  const tagCounts = new Map<string, number>();
  
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      tagCounts.set(lowerTag, (tagCounts.get(lowerTag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export function formatDate(dateString: string, locale: string = 'pt-BR'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

