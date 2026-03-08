import styled from 'styled-components';
import * as LandingStyles from '../FoxApplyLandingScreen/styles';

// ========================================
// Blog Section (Main Container)
// ========================================

export const BlogSection = styled.section`
  padding-top: 8rem;
  padding-bottom: 5rem;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding-top: 6rem;
    padding-bottom: 3rem;
  }
`;

// ========================================
// Shared States
// ========================================

export const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
  
  p {
    font-size: 1.125rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  
  h3 {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
    font-family: var(--font-display);
  }
  
  p {
    font-size: 1.125rem;
    color: var(--text-secondary);
  }
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 4rem;
  
  h2 {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-family: var(--font-display);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-size: 1.125rem;
  }
`;

// ========================================
// Blog List Styles
// ========================================

export const ContentWrapper = styled(LandingStyles.Container)`
  max-width: 1200px;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
`;

export const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 6rem;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, var(--neon-orange), var(--neon-cyan));
  margin-bottom: 1.5rem;
  padding: 1rem;
  box-shadow: 0 0 30px oklch(0.72 0.19 45 / 0.4),
              0 0 60px oklch(0.72 0.19 45 / 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const Title = styled(LandingStyles.Heading1)`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  .highlight {
    background: linear-gradient(135deg, var(--neon-orange), var(--neon-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled(LandingStyles.Text)`
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// ========================================
// Blog Post Styles
// ========================================

export const PostContentWrapper = styled(LandingStyles.Container)`
  max-width: 900px;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2.5rem;
  
  &:hover {
    border-color: var(--neon-orange);
    color: var(--neon-orange);
    transform: translateX(-4px);
  }
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export const CoverImage = styled.div<{ $image?: string }>`
  width: 100%;
  height: 450px;
  border-radius: 1rem;
  margin-bottom: 2.5rem;
  background: ${({ $image }) => 
    $image 
      ? `url(${$image}) center/cover` 
      : 'linear-gradient(135deg, var(--neon-orange), var(--neon-cyan))'
  };
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, oklch(0.08 0.01 260 / 0.5), transparent 50%);
  }
  
  @media (max-width: 768px) {
    height: 280px;
    border-radius: 0.75rem;
  }
`;

export const PostHeader = styled.header`
  margin-bottom: 3rem;
`;

export const PostTitle = styled(LandingStyles.Heading1)`
  font-size: 2.75rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
    color: var(--neon-orange);
  }
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.875rem;
  background: var(--neon-orange);
  color: var(--dark-bg);
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

export const PostContent = styled.article`
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.125rem;
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--text-primary);
    font-weight: 700;
    font-family: var(--font-display);
    margin: 2.5rem 0 1rem;
    line-height: 1.3;
  }
  
  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  a {
    color: var(--neon-orange);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--neon-cyan);
    }
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.75rem;
  }
  
  code {
    background: var(--card-bg);
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-family: var(--font-code);
    font-size: 0.875em;
    color: var(--neon-cyan);
    border: 1px solid var(--border-color);
  }
  
  pre {
    background: var(--card-bg);
    padding: 1.25rem;
    border-radius: 0.75rem;
    overflow-x: auto;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
    
    code {
      background: none;
      padding: 0;
      color: var(--text-secondary);
      border: none;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--neon-orange);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--text-tertiary);
    font-size: 1.25rem;
    
    p {
      margin-bottom: 0;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
    margin: 2rem 0;
  }
  
  hr {
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 3rem 0;
  }
  
  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`;
