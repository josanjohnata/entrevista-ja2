import styled, { keyframes } from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

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
  min-height: 100vh;
  min-height: 100dvh;
  background-color: ${colors.background.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 5vw, 2rem);
`;

export const Container = styled.div`
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const IconWrapper = styled.div`
  width: clamp(60px, 10vw, 80px);
  height: clamp(60px, 10vw, 80px);
  margin: 0 auto 1.5rem;
  background-color: ${colors.warning.main};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: ${colors.warning.contrast};
  }
`;

export const Title = styled.h1`
  font-size: clamp(1.35rem, 1rem + 2vw, 1.75rem);
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 2rem;
`;

export const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid ${colors.border.light};
  border-radius: 12px;
  padding: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: 1.5rem;
`;

export const StatusBadge = styled.div<{ $type: 'pending' | 'expired' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  
  background-color: ${props => props.$type === 'pending' 
    ? 'rgba(245, 158, 11, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$type === 'pending' 
    ? colors.warning.main 
    : colors.error.main};
  border: 1px solid ${props => props.$type === 'pending' 
    ? colors.warning.main 
    : colors.error.main};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
  
  span:first-child {
    color: ${colors.text.secondary};
    font-size: 0.875rem;
  }
  
  span:last-child {
    color: ${colors.text.primary};
    font-weight: 500;
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: ${colors.primary.main};
  color: ${colors.primary.contrast};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: transparent;
  color: ${colors.text.secondary};
  border: 1px solid ${colors.border.main};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${colors.text.primary};
  }
`;

export const HelpText = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
  margin-top: 1.5rem;
  
  a {
    color: ${colors.primary.main};
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      color: ${colors.primary.light};
    }
  }
`;
