import styled, { keyframes, css, createGlobalStyle } from 'styled-components';

// Aplicar estilos globais da landing page
export const PlansGlobalStyles = createGlobalStyle`
  /* CSS Variables for colors - mesmo padrão da landing page */
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
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PageWrapper = styled.div`
  background-color: var(--dark-bg);
  min-height: 100vh;
  padding: 5rem 2rem 3rem;
  color: var(--text-primary);
  font-family: var(--font-body);
  
  @media (max-width: 768px) {
    padding: 4rem 1rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 0.75rem 1.5rem;
  }
`;

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.75rem;
  font-family: var(--font-display);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
  
  span {
    background: linear-gradient(135deg, var(--neon-orange), var(--neon-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, var(--neon-orange), var(--neon-cyan));
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 420px;
  }
`;

interface PlanCardProps {
  $isPopular?: boolean;
  $delay?: number;
}

export const PlanCard = styled.div<PlanCardProps>`
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out both;
  animation-delay: ${props => props.$delay || 0}ms;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  
  ${props => props.$isPopular && css`
    border: 2px solid var(--neon-orange);
    transform: scale(1.02);
    box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.2),
                0 0 40px oklch(0.72 0.19 45 / 0.1);
    
    @media (min-width: 1024px) {
      transform: scale(1.05);
      z-index: 2;
    }
  `}
  
  &:hover {
    transform: translateY(-5px) ${props => props.$isPopular ? 'scale(1.05)' : 'scale(1)'};
    border-color: ${props => props.$isPopular ? 'var(--neon-orange)' : 'oklch(0.72 0.19 45 / 0.5)'};
    box-shadow: 0 10px 30px oklch(0 0 0 / 0.3),
                0 0 20px ${props => props.$isPopular ? 'oklch(0.72 0.19 45 / 0.3)' : 'oklch(0.72 0.19 45 / 0.1)'};
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 1rem;
  background: linear-gradient(135deg, var(--neon-orange), oklch(0.65 0.19 45));
  color: var(--dark-bg);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.4);
  z-index: 2;
`;

export const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
`;

export const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
`;

export const PriceContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

export const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const Currency = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

export const Amount = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  font-family: var(--font-display);
`;

export const Cents = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

export const Period = styled.span`
  font-size: 1rem;
  color: var(--text-tertiary);
  margin-left: 0.25rem;
`;

export const OriginalPrice = styled.span`
  font-size: 1.5rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
  font-weight: 600;
`;

export const PriceText = styled.span`
  font-size: 1.5rem;
  color: var(--text-secondary);
  font-weight: 600;
`;

export const CurrentPrice = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  font-family: var(--font-display);
  line-height: 1;
`;

export const TotalPrice = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  line-height: 1.5;
  text-align: left;
  
  .no-break {
    white-space: nowrap;
  }
  
  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`;

export const Savings = styled.div`
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, var(--neon-cyan), oklch(0.75 0.15 195));
  border-radius: 50px;
  color: var(--dark-bg);
  font-size: 0.75rem;
  font-weight: 600;
`;

export const DiscountBadge = styled.div`
  position: absolute;
  top: -20px;
  right: 1rem;
  background: linear-gradient(135deg, var(--neon-cyan), oklch(0.75 0.15 195));
  color: var(--dark-bg);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  z-index: 3;
  box-shadow: 0 0 30px oklch(0.82 0.15 195 / 0.6),
              0 0 60px oklch(0.82 0.15 195 / 0.3);
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.625rem 1.25rem;
    top: -18px;
  }
`;

export const LimitedTimeBadge = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--neon-orange), oklch(0.65 0.19 45));
  color: var(--dark-bg);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  z-index: 2;
  box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.4);
  animation: pulse 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 0.6875rem;
    padding: 0.375rem 0.875rem;
    top: 2.25rem;
  }
`;

export const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex-grow: 1;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.4;
  
  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--neon-cyan);
  }
`;

interface SelectButtonProps {
  $isPopular?: boolean;
}

export const SelectButton = styled.button<SelectButtonProps>`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-body);
  margin-top: auto;
  
  ${props => props.$isPopular ? css`
    background: var(--neon-orange);
    border: none;
    color: var(--dark-bg);
    box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.4),
                0 0 40px oklch(0.72 0.19 45 / 0.2),
                0 0 60px oklch(0.72 0.19 45 / 0.1);
    
    &:hover {
      transform: translateY(-2px);
      background: oklch(0.65 0.19 45);
      box-shadow: 0 0 30px oklch(0.72 0.19 45 / 0.5),
                  0 0 50px oklch(0.72 0.19 45 / 0.3),
                  0 0 70px oklch(0.72 0.19 45 / 0.2);
    }
  ` : css`
    background-color: transparent;
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    
    &:hover {
      border-color: var(--neon-orange);
      background-color: oklch(0.12 0.015 260);
      box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.2);
    }
  `}
  
  &:active {
    transform: scale(0.98);
  }
`;

export const Guarantee = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 3rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  animation: ${fadeInUp} 0.6s ease-out 0.6s both;
  backdrop-filter: blur(12px);
  
  svg {
    color: var(--neon-cyan);
    flex-shrink: 0;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.9375rem;
    margin: 0;
    
    strong {
      color: var(--text-primary);
    }
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  backdrop-filter: blur(12px);
  
  &:hover {
    background: oklch(0.15 0.015 260);
    color: var(--text-primary);
    border-color: var(--neon-orange);
  }
`;
