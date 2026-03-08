import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';

export const FooterWrapper = styled.footer`
  border-top: 1px solid #e5e5e5;
  padding: 2rem 0;
  background-color: #fafafa;
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;  
  
  p {
    font-size: 0.875rem;
    color: #525252;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

export const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e5e5;
  color: #525252;
  transition: all 0.2s ease;

  &:hover {
    background: #0a0a0a;
    color: #fff;
    transform: translateY(-2px);
  }
`;
