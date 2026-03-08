import styled, { createGlobalStyle } from 'styled-components';

// Global styles for the landing page
export const LandingGlobalStyles = createGlobalStyle`
  /* CSS Variables for colors */
  :root {
    --neon-orange: oklch(0.72 0.19 45);
    --neon-cyan: oklch(0.82 0.15 195);
    --dark-bg: oklch(0.08 0.01 260);
    --card-bg: oklch(0.12 0.015 260);
    --border-color: oklch(0.25 0.02 260);
    --text-primary: oklch(0.95 0.01 260);
    --text-secondary: oklch(0.7 0.01 260);
    --text-tertiary: oklch(0.5 0.01 260);
    
    --font-display: 'Space Grotesk', system-ui, sans-serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-code: 'Fira Code', monospace;
  }
  
  /* Neon glow effects */
  .glow-orange {
    box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.4),
                0 0 40px oklch(0.72 0.19 45 / 0.2),
                0 0 60px oklch(0.72 0.19 45 / 0.1);
  }
  
  .glow-cyan {
    box-shadow: 0 0 20px oklch(0.82 0.15 195 / 0.4),
                0 0 40px oklch(0.82 0.15 195 / 0.2),
                0 0 60px oklch(0.82 0.15 195 / 0.1);
  }
  
  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.82 0.15 195));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Glass effect */
  .glass {
    background: oklch(0.15 0.015 260 / 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid oklch(1 0 0 / 0.1);
  }
  
  /* Grid background pattern */
  .grid-pattern {
    background-image: 
      linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px),
      linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
    background-color: var(--dark-bg);
  }
  
  /* Ensure body has dark background */
  body {
    background-color: var(--dark-bg) !important;
    min-height: 100vh;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: oklch(0.1 0.01 260);
  }
  
  ::-webkit-scrollbar-thumb {
    background: oklch(0.3 0.02 260);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: oklch(0.72 0.19 45);
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--dark-bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  overflow-x: hidden;
  position: relative;
  
  /* Ensure background extends beyond viewport */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--dark-bg);
    z-index: -1;
  }
`;

export const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: 1280px;
  }
`;

export const Section = styled.section`
  position: relative;
  padding: 5rem 0;
  
  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

export const Card = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: oklch(0.72 0.19 45 / 0.5);
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline'; size?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  
  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: var(--neon-orange);
          color: var(--dark-bg);
          box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.4),
                      0 0 40px oklch(0.72 0.19 45 / 0.2),
                      0 0 60px oklch(0.72 0.19 45 / 0.1);
          
          &:hover {
            background: oklch(0.65 0.19 45);
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
        return `
          background: var(--neon-cyan);
          color: var(--dark-bg);
          
          &:hover {
            background: oklch(0.75 0.15 195);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: var(--neon-cyan);
          border: 2px solid var(--neon-cyan);
          
          &:hover {
            background: var(--neon-cyan);
            color: var(--dark-bg);
          }
        `;
    }
  }}
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          
          @media (max-width: 640px) {
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
          }
        `;
      case 'md':
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          
          @media (max-width: 640px) {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
          }
        `;
      case 'lg':
        return `
          padding: 1rem 2rem;
          font-size: 1.125rem;
          
          @media (max-width: 640px) {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        `;
    }
  }}
`;

export const Heading1 = styled.h1`
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
`;

export const Heading2 = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
`;

export const Heading3 = styled.h3`
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
`;

export const Text = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

