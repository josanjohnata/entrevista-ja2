import styled, { keyframes, css } from 'styled-components';

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
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 5rem 2rem 3rem;
  color: #171717;
  
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
  color: #171717;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.75rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
  
  span {
    color: #0a0a0a;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #0a0a0a;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #525252;
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
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 0.75rem;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out both;
  animation-delay: ${props => props.$delay || 0}ms;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  
  ${props => props.$isPopular && css`
    border: 2px solid #0a0a0a;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    @media (min-width: 1024px) {
      transform: scale(1.05);
      z-index: 2;
    }
  `}
  
  &:hover {
    transform: translateY(-5px) ${props => props.$isPopular ? 'scale(1.05)' : 'scale(1)'};
    border-color: ${props => props.$isPopular ? '#0a0a0a' : '#d4d4d4'};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 1rem;
  background: #0a0a0a;
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  z-index: 2;
`;

export const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #171717;
  margin-bottom: 0.5rem;
`;

export const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: #525252;
  margin-bottom: 1.5rem;
`;

export const PriceContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
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
  color: #525252;
`;

export const Amount = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #171717;
  line-height: 1;
`;

export const Cents = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #525252;
`;

export const Period = styled.span`
  font-size: 1rem;
  color: #737373;
  margin-left: 0.25rem;
`;

export const OriginalPrice = styled.span`
  font-size: 1.5rem;
  color: #737373;
  text-decoration: line-through;
  font-weight: 600;
`;

export const PriceText = styled.span`
  font-size: 1.5rem;
  color: #525252;
  font-weight: 600;
`;

export const CurrentPrice = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #171717;
  line-height: 1;
`;

export const TotalPrice = styled.div`
  font-size: 0.75rem;
  color: #525252;
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
  background: #171717;
  border-radius: 50px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const DiscountBadge = styled.div`
  position: absolute;
  top: -20px;
  right: 1rem;
  background: #171717;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  z-index: 3;
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
  background: #0a0a0a;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  z-index: 2;
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
  color: #525252;
  font-size: 0.9375rem;
  line-height: 1.4;
  
  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #22c55e;
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
  margin-top: auto;
  
  ${props => props.$isPopular ? css`
    background: #0a0a0a;
    border: none;
    color: #fff;
    
    &:hover {
      transform: translateY(-2px);
      background: #171717;
    }
  ` : css`
    background-color: transparent;
    border: 2px solid #d4d4d4;
    color: #171717;
    
    &:hover {
      border-color: #0a0a0a;
      background-color: #fafafa;
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
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 0.75rem;
  animation: ${fadeInUp} 0.6s ease-out 0.6s both;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  
  svg {
    color: #22c55e;
    flex-shrink: 0;
  }
  
  p {
    color: #525252;
    font-size: 0.9375rem;
    margin: 0;
    
    strong {
      color: #171717;
    }
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  color: #525252;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  
  &:hover {
    background: #fafafa;
    color: #171717;
    border-color: #0a0a0a;
  }
`;
