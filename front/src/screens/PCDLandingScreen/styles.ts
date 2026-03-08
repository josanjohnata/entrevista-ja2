import styled, { createGlobalStyle } from 'styled-components';

// Cores baseadas no design da landing-page-a-b-test-12
const primary = 'hsl(24, 95%, 53%)'; // Laranja
const accent = 'hsl(174, 72%, 46%)'; // Ciano
const background = 'hsl(222, 47%, 6%)';
const foreground = 'hsl(210, 40%, 98%)';
const mutedForeground = 'hsl(215, 20%, 55%)';
const border = 'hsl(222, 30%, 16%)';

// Global styles
export const PCDLandingGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  html {
    background-color: ${background} !important;
    scroll-behavior: smooth;
  }
  
  body {
    background-color: ${background} !important;
    color: ${foreground} !important;
    min-height: 100vh;
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
  }
  
  #root {
    background-color: ${background};
    min-height: 100vh;
  }
  
  /* Gradient text utilities */
  .text-gradient {
    background: linear-gradient(135deg, ${primary} 0%, hsl(35, 100%, 60%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .text-gradient-accent {
    background: linear-gradient(135deg, ${accent} 0%, hsl(174, 72%, 56%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Card styles */
  .card-dark {
    background: linear-gradient(145deg, hsl(222, 47%, 11%) 0%, hsl(222, 47%, 8%) 100%);
    border: 1px solid ${border};
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }
  
  .glow-border {
    border: 1px solid ${primary}33;
  }
  
  .shadow-glow {
    box-shadow: 0 0 30px ${primary}26;
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${background};
  color: ${foreground};
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${background};
    z-index: -1;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (min-width: 768px) {
    padding: 0 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const Section = styled.section`
  padding: 6rem 0;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

export const Button = styled.button<{ $variant?: 'hero' | 'heroOutline' | 'cta'; $size?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  
  ${({ $variant = 'hero' }) => {
    switch ($variant) {
      case 'hero':
        return `
          background: ${primary};
          color: white;
          box-shadow: 0 0 30px ${primary}26;
          font-size: 1rem;
          font-weight: 600;
          
          &:hover {
            background: hsl(24, 95%, 48%);
            transform: translateY(-2px);
          }
        `;
      case 'heroOutline':
        return `
          background: transparent;
          color: ${primary};
          border: 1px solid ${primary}80;
          font-size: 1rem;
          font-weight: 600;
          
          &:hover {
            background: ${primary}1A;
          }
        `;
      case 'cta':
        return `
          background: ${primary};
          color: white;
          box-shadow: 0 0 30px ${primary}26;
          font-size: 1.125rem;
          font-weight: 700;
          
          &:hover {
            background: hsl(24, 95%, 48%);
            transform: translateY(-2px);
          }
        `;
    }
  }}
  
  ${({ $size = 'lg' }) => {
    switch ($size) {
      case 'sm':
        return `
          height: 2.25rem;
          padding: 0 1.25rem;
          font-size: 0.875rem;
        `;
      case 'md':
        return `
          height: 2.5rem;
          padding: 0 1.5rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return `
          height: 3.5rem;
          padding: 0 2rem;
          font-size: 1rem;
          
          @media (max-width: 640px) {
            height: 3rem;
            padding: 0 1.5rem;
            font-size: 0.875rem;
          }
        `;
    }
  }}
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const Heading1 = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  line-height: 1.1;
  color: ${foreground};
  font-size: 2.5rem;
  
  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 4.5rem;
  }
`;

export const Heading2 = styled.h2`
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  line-height: 1.2;
  color: ${foreground};
  font-size: 2rem;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
`;

export const Heading3 = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  line-height: 1.3;
  color: ${foreground};
  font-size: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const Text = styled.p`
  color: ${mutedForeground};
  line-height: 1.6;
  font-size: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${primary}1A;
  color: ${primary};
  border: 1px solid ${primary}4D;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Card = styled.div`
  background: linear-gradient(145deg, hsl(222, 47%, 11%) 0%, hsl(222, 47%, 8%) 100%);
  border: 1px solid ${border};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${primary}33;
  }
  
  &.glow-border {
    border-color: ${primary}33;
  }
`;
