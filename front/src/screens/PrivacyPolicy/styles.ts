import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

export const PageWrapper = styled.div`
  background-color: ${colors.background.primary};
  color: ${colors.text.secondary};
  padding: clamp(3rem, 5vw, 5rem) clamp(0.75rem, 2vw, 2rem) clamp(2rem, 3vw, 3rem);
  min-height: 100vh;
  min-height: 100dvh;
`;

export const MainContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const MainTitle = styled.h1`
  text-align: center;
  font-size: clamp(1.5rem, 1rem + 3vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${colors.text.primary};
`;

export const LastUpdated = styled.p`
  text-align: center;
  color: ${colors.text.tertiary};
  font-size: 0.875rem;
  margin-bottom: 3rem;
`;

export const ContentCard = styled.div`
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: clamp(1.25rem, 3vw, 3rem);
  border-radius: 12px;
`;

export const Section = styled.section`
  margin-bottom: 2.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${colors.primary.main};
  }
`;

export const Paragraph = styled.p`
  color: ${colors.text.secondary};
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

export const ListItem = styled.li`
  color: ${colors.text.secondary};
  line-height: 1.8;
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
  
  &::before {
    content: '•';
    color: ${colors.primary.main};
    font-weight: bold;
    position: absolute;
    left: 0;
  }
`;

export const ContactInfo = styled.div`
  background-color: ${colors.background.primary};
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  border-left: 4px solid ${colors.primary.main};
`;

export const ContactLink = styled.a`
  color: ${colors.primary.main};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${colors.text.secondary};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
  transition: color 0.2s;
  
  &:hover {
    color: ${colors.text.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.border.light};
  margin: 2rem 0;
`;
