import styled from 'styled-components';

// Cyber Neon Tech color scheme from CheckoutScreen
const neonOrange = '#ff6b35'; // oklch(0.72 0.19 45)
const neonCyan = '#00d4ff'; // oklch(0.82 0.15 195)
const darkBg = '#0a0a0f'; // oklch(0.08 0.01 260)
const darkSurface = '#1a1a24'; // oklch(0.12 0.015 260)
const darkCard = '#1f1f2e'; // oklch(0.16 0.015 260)
const darkBorder = '#3a3a4a'; // oklch(0.25 0.02 260)
const lightText = '#f2f2f2'; // oklch(0.95 0.01 260)
const mutedText = '#a0a0a0'; // oklch(0.65 0.02 260)

export const PageWrapper = styled.div`
  background-color: ${darkBg};
  color: ${lightText};
  padding: 5rem 2rem 3rem;
  min-height: 100vh;
  background-image: 
    linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 0.75rem 1.5rem;
  }
`;

export const MainContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

