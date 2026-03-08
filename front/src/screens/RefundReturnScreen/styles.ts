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

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.border.light};
  margin: 2rem 0;
`;

export const InfoBox = styled.div`
  background-color: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

export const InfoBoxIcon = styled.div`
  color: #10b981;
  font-size: 1.5rem;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const InfoBoxContent = styled.div`
  flex: 1;
`;

export const InfoBoxTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #34d399;
  margin: 0 0 0.5rem 0;
`;

export const InfoBoxText = styled.p`
  font-size: 0.875rem;
  color: rgba(52, 211, 153, 0.8);
  margin: 0;
  line-height: 1.6;
`;

export const WarningBox = styled.div`
  background-color: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

export const WarningBoxIcon = styled.div`
  color: #f59e0b;
  font-size: 1.5rem;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const WarningBoxContent = styled.div`
  flex: 1;
`;

export const WarningBoxTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #fbbf24;
  margin: 0 0 0.5rem 0;
`;

export const WarningBoxText = styled.p`
  font-size: 0.875rem;
  color: rgba(251, 191, 36, 0.8);
  margin: 0;
  line-height: 1.6;
`;

