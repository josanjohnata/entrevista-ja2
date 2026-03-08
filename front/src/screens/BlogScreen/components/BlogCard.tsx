import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { BlogPostMetadata, formatDate } from '../../../lib/blog';

const Card = styled.article`
  background: var(--card-bg, oklch(0.12 0.015 260));
  border: 1px solid var(--border-color, oklch(0.25 0.02 260));
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: oklch(0.72 0.19 45 / 0.5);
    transform: translateY(-6px);
    box-shadow: 0 12px 40px oklch(0 0 0 / 0.4),
                0 0 30px oklch(0.72 0.19 45 / 0.15);
  }
`;

const CoverImage = styled.div<{ $image?: string }>`
  width: 100%;
  height: 220px;
  background: ${({ $image }) => 
    $image 
      ? `url(${$image}) center/cover` 
      : 'linear-gradient(135deg, var(--neon-orange, oklch(0.72 0.19 45)), var(--neon-cyan, oklch(0.82 0.15 195)))'
  };
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, oklch(0.08 0.01 260 / 0.8), transparent 60%);
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-primary, oklch(0.95 0.01 260));
  line-height: 1.3;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Excerpt = styled.p`
  font-size: 0.9375rem;
  color: var(--text-secondary, oklch(0.7 0.01 260));
  line-height: 1.6;
  margin-bottom: 1.25rem;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--text-tertiary, oklch(0.5 0.01 260));
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  svg {
    width: 0.9375rem;
    height: 0.9375rem;
    color: var(--neon-orange, oklch(0.72 0.19 45));
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: var(--neon-orange, oklch(0.72 0.19 45));
  color: var(--dark-bg, oklch(0.08 0.01 260));
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  svg {
    width: 0.6875rem;
    height: 0.6875rem;
  }
`;

interface BlogCardProps {
  post: BlogPostMetadata;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleClick = () => {
    navigate(`/blog/${post.slug}`);
  };
  
  return (
    <Card onClick={handleClick}>
      <CoverImage $image={post.coverImage} />
      <Content>
        <Title>{post.title}</Title>
        <Excerpt>{post.excerpt}</Excerpt>
        
        <Meta>
          <MetaItem>
            <Calendar />
            <span>{formatDate(post.date)}</span>
          </MetaItem>
          {post.readTime && (
            <MetaItem>
              <Clock />
              <span>{post.readTime} {t('blog.minRead', 'min')}</span>
            </MetaItem>
          )}
        </Meta>
        
        {post.tags && post.tags.length > 0 && (
          <Tags>
            {post.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>
                <TagIcon />
                {tag}
              </Tag>
            ))}
          </Tags>
        )}
      </Content>
    </Card>
  );
};
