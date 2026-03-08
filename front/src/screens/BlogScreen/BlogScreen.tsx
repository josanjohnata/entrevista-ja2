import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlogCard } from './components/BlogCard';
import { BlogPostMetadata, fetchAllPosts } from '../../lib/blog';
import { Navbar } from '../../components/sections/Navbar';
import { Footer } from '../../components/sections/Footer';
import * as LandingStyles from '../landing/styles';
import * as S from './styles';
import logoImage from '../../assets/logo.png';

export const BlogScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  
  const getBlogLocale = (lng: string): 'pt' | 'en' | 'es' => {
    if (lng.startsWith('pt')) return 'pt';
    if (lng.startsWith('es')) return 'es';
    return 'en';
  };
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const locale = getBlogLocale(i18n.language);
        const allPosts = await fetchAllPosts(locale);
        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, [i18n.language]);
  
  return (
    <LandingStyles.PageWrapper>
      <Navbar />
        <S.BlogSection>
          <S.ContentWrapper>
            <S.Header>
              <S.IconWrapper>
                <img src={logoImage} alt="Entrevista Já" />
              </S.IconWrapper>
              <S.Title>
                Blog <span className="highlight">Entrevista Já</span>
              </S.Title>
              <S.Subtitle>
                {t('blog.subtitle', 'Dicas, estratégias e insights para turbinar sua carreira e conseguir a vaga dos sonhos')}
              </S.Subtitle>
            </S.Header>
            
            {loading ? (
              <S.LoadingState>
                <p>{t('blog.loading', 'Carregando posts...')}</p>
              </S.LoadingState>
            ) : posts.length === 0 ? (
              <S.EmptyState>
                <h3>{t('blog.emptyTitle', 'Nenhum post encontrado')}</h3>
                <p>{t('blog.emptyDescription', 'Em breve teremos conteúdos incríveis por aqui!')}</p>
              </S.EmptyState>
            ) : (
              <S.Grid>
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </S.Grid>
            )}
          </S.ContentWrapper>
        </S.BlogSection>
      <Footer />
    </LandingStyles.PageWrapper>
  );
};
