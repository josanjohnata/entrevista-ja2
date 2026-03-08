import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowLeft, Tag as TagIcon, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlogPost, fetchPostBySlug, formatDate } from '../../lib/blog';
import { Navbar } from '../../components/sections/Navbar';
import { Footer } from '../../components/sections/Footer';
import * as LandingStyles from '../landing/styles';
import * as S from './styles';

export const BlogPostScreen: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const postData = await fetchPostBySlug(slug);
        
        if (postData) {
          setPost(postData);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [slug]);
  
  const handleBack = () => {
    navigate(ROUTES.BLOG);
  };
  
  return (
    <LandingStyles.PageWrapper>
      <Navbar />
        <S.BlogSection>
          <S.PostContentWrapper>
            {loading ? (
              <S.LoadingState>
                <p>{t('blog.loadingPost', 'Carregando post...')}</p>
              </S.LoadingState>
            ) : error || !post ? (
              <S.ErrorState>
                <h2>{t('blog.postNotFound', 'Post não encontrado')}</h2>
                <p>{t('blog.postNotFoundDescription', 'O post que você está procurando não existe ou foi removido.')}</p>
                <S.BackButton onClick={handleBack}>
                  <ArrowLeft />
                  {t('blog.backToBlog', 'Voltar para o blog')}
                </S.BackButton>
              </S.ErrorState>
            ) : (
              <>
                <S.BackButton onClick={handleBack}>
                  <ArrowLeft />
                  {t('blog.backToBlog', 'Voltar para o blog')}
                </S.BackButton>
                
                {post.coverImage && <S.CoverImage $image={post.coverImage} />}
                
                <S.PostHeader>
                  <S.PostTitle>{post.title}</S.PostTitle>
                  
                  <S.Meta>
                    <S.MetaItem>
                      <Calendar />
                      <span>{formatDate(post.date)}</span>
                    </S.MetaItem>
                    {post.readTime && (
                      <S.MetaItem>
                        <Clock />
                        <span>{post.readTime} {t('blog.minRead', 'min de leitura')}</span>
                      </S.MetaItem>
                    )}
                    {post.author && (
                      <S.MetaItem>
                        <User />
                        <span>{post.author.name}</span>
                      </S.MetaItem>
                    )}
                  </S.Meta>
                  
                  {post.tags && post.tags.length > 0 && (
                    <S.Tags>
                      {post.tags.map((tag) => (
                        <S.Tag key={tag}>
                          <TagIcon />
                          {tag}
                        </S.Tag>
                      ))}
                    </S.Tags>
                  )}
                </S.PostHeader>
                
                <S.PostContent>
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </S.PostContent>
              </>
            )}
          </S.PostContentWrapper>
        </S.BlogSection>
      <Footer />
    </LandingStyles.PageWrapper>
  );
};
