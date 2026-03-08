import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';
import { Container } from '../../common/Container';
export const ExtensionSection = styled.section`
  background-color: #f0f0f0;
  padding: 5rem 0;
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 6rem 0;
  }
`;

export const ExtensionContainer = styled(Container)`
  position: relative;
  z-index: 1;
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

export const TextContent = styled.div`
  color: #171717;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  color: #0a0a0a;

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

export const Description = styled.p`
  font-size: 1.125rem;
  color: #404040;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

export const FeaturesList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 1rem;
  color: #404040;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: #22c55e;
    margin-top: 2px;
  }
`;

export const IllustrationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const BrowserMockup = styled.div`
  background: #1e1e2e;
  border-radius: 12px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 480px;
`;

export const BrowserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #2a2a3e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const BrowserDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

export const BrowserContent = styled.div`
  padding: 1.5rem;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AutomationStep = styled.div<{ $active?: boolean; $delay?: number }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${props => props.$active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$active ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.$active ? '#22c55e' : 'rgba(255, 255, 255, 0.6)'};
  opacity: 0;
  animation: slideIn 0.5s ease-out forwards;
  animation-delay: ${props => (props.$delay || 0) * 0.2}s;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

export const StepNumber = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  color: #818cf8;
`;

export const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

