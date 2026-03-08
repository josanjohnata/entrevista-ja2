import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';
import BackgroundImage from '../../../assets/Background.png';

export const HeroSection = styled.section`
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 5rem 0;
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 8rem 0;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 2rem;
  letter-spacing: -0.02em;
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

export const Subtitle = styled.p`
  margin-top: 1.5rem;
  max-width: 800px;
  font-size: 1.125rem;
  color: ${theme.colors.text.secondary};
`;

export const FormContainer = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 0.75rem;
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    align-items: flex-start;
    max-width: 550px;
    gap: 0.5rem;
  }

  button {
    width: 100%;
    
    @media (min-width: ${theme.breakpoints.md}) {
      width: auto;
    }
  }
`;

export const FinePrint = styled.p`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: ${theme.colors.text.secondary};
`;

export const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: left;
  width: 100%;
`;

export const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const SocialProof = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 999px;
  animation: fadeInUp 0.6s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const CounterNumber = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.primary.main};
  font-variant-numeric: tabular-nums;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

export const CounterText = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;
