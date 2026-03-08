import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Target, TrendingUp } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Card, Heading2, Heading3, Text } from '../styles';

const Wrapper = styled(Section)``;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(Heading2)`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  .highlight {
    color: var(--neon-orange);
  }
`;

const Subtitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0 auto;
  max-width: 42rem;
  color: var(--text-tertiary);
  line-height: 1.6;
`;

const IntroList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  color: var(--text-tertiary);
  font-size: 1.0625rem;
  line-height: 1.6;
  text-align: left;

  li {
    position: relative;
    padding-left: 1.25rem;
    margin-bottom: 0.75rem;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--neon-orange);
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PainPointCard = styled(Card)`
  height: 100%;
  padding: 1.5rem;
  
  &:hover {
    border-color: oklch(0.72 0.19 45 / 0.5);
  }
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: oklch(0.72 0.19 45 / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--neon-orange);
  }
`;

const CardTitle = styled(Heading3)`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled(Text)`
  color: var(--text-tertiary);
`;

const painPoints = [
  { icon: Clock, key: 'point1' },
  { icon: Target, key: 'point2' },
  { icon: TrendingUp, key: 'point3' },
];

export const PainPointsSection: React.FC = () => {
  const { t } = useTranslation();
  
  const titleText = t('foxApplyLanding.painPoints.title');
  const ignoredText = t('foxApplyLanding.painPoints.ignored');
  const parts = titleText.split('{ignored}');
  const introList = t('foxApplyLanding.painPoints.introList', { returnObjects: true }) as string[];
  
  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>
            {parts[0]}
            <span className="highlight">{ignoredText}</span>
            {parts[1] || ''}
          </Title>
          {Array.isArray(introList) && introList.length > 0 && (
            <IntroList>
              {introList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </IntroList>
          )}
          <Subtitle>{t('foxApplyLanding.painPoints.subtitle')}</Subtitle>
        </Header>
        
        <Grid>
          {painPoints.map((point, index) => (
            <PainPointCard key={index}>
              <IconWrapper>
                <point.icon />
              </IconWrapper>
              <CardTitle>{t(`foxApplyLanding.painPoints.${point.key}.title`)}</CardTitle>
              <CardDescription>{t(`foxApplyLanding.painPoints.${point.key}.description`)}</CardDescription>
            </PainPointCard>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

