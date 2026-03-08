import { BlogPost, BlogPostMetadata, BlogLocale } from './types';
import { blogPosts } from './blogPosts';

/**
 * Busca todos os posts filtrados por idioma
 * @param locale - Idioma desejado ('pt', 'en', 'es')
 */
export async function fetchAllPosts(locale: BlogLocale = 'pt'): Promise<BlogPostMetadata[]> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return blogPosts
    .filter(post => post.published && post.locale === locale)
    .map(({ content, ...metadata }) => metadata)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Busca um post específico por slug
 * @param slug - Slug do post
 */
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const post = blogPosts.find(p => p.slug === slug && p.published);
  return post || null;
}

/**
 * Busca posts por tag e idioma
 * @param tag - Tag para filtrar
 * @param locale - Idioma desejado
 */
export async function fetchPostsByTag(tag: string, locale: BlogLocale = 'pt'): Promise<BlogPostMetadata[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return blogPosts
    .filter(post => 
      post.published && 
      post.locale === locale &&
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )
    .map(({ content, ...metadata }) => metadata);
}

/**
 * Busca todas as tags disponíveis para um idioma
 * @param locale - Idioma desejado
 */
export async function fetchAllTags(locale: BlogLocale = 'pt'): Promise<{ tag: string; count: number }[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const tagCounts = new Map<string, number>();
  
  blogPosts
    .filter(post => post.published && post.locale === locale)
    .forEach(post => {
      post.tags.forEach(tag => {
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
