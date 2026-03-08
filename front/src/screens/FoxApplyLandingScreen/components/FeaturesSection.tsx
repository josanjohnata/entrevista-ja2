import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, FileText, Search, Filter, Shield, TrendingUp } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Card, Heading2, Heading3, Badge } from '../styles';

const Wrapper = styled(Section)``;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const BadgeText = styled(Badge)`
  color: var(--neon-orange);
  margin-bottom: 0.5rem;
  display: block;
`;

const Title = styled(Heading2)`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.82 0.15 195));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  padding: 1.5rem;
  
  &:hover {
    border-color: oklch(0.72 0.19 45 / 0.5);
  }
`;

const IconWrapper = styled.div<{ $color: 'orange' | 'cyan' }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: ${({ $color }) => 
    $color === 'orange' 
      ? 'oklch(0.72 0.19 45 / 0.1)' 
      : 'oklch(0.82 0.15 195 / 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
  
  ${FeatureCard}:hover & {
    background: ${({ $color }) => 
      $color === 'orange' 
        ? 'oklch(0.72 0.19 45 / 0.2)' 
        : 'oklch(0.82 0.15 195 / 0.2)'};
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${({ $color }) => 
      $color === 'orange' ? 'var(--neon-orange)' : 'var(--neon-cyan)'};
  }
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const CardDescription = styled.p`
  color: var(--text-tertiary);
  line-height: 1.6;
`;

const features = [
  { icon: Zap, color: 'orange' as const, key: 'feature1' },
  { icon: FileText, color: 'cyan' as const, key: 'feature2' },
  { icon: Search, color: 'orange' as const, key: 'feature3' },
  { icon: Filter, color: 'cyan' as const, key: 'feature4' },
  { icon: Shield, color: 'orange' as const, key: 'feature5' },
  { icon: TrendingUp, color: 'cyan' as const, key: 'feature6' },
];

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();
  
  const titleText = t('foxApplyLanding.features.title');
  const conquerText = t('foxApplyLanding.features.conquer');
  const parts = titleText.split('{conquer}');
  
  return (
    <Wrapper id="recursos">
      <Container>
        <Header>
          <BadgeText>{t('foxApplyLanding.features.badge')}</BadgeText>
          <Title>
            {parts[0]}
            <span className="gradient-text">{conquerText}</span>
            {parts[1] || ''}
          </Title>
        </Header>
        
        <Grid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <IconWrapper $color={feature.color}>
                <feature.icon />
              </IconWrapper>
              <CardTitle>{t(`foxApplyLanding.features.${feature.key}.title`)}</CardTitle>
              <CardDescription>{t(`foxApplyLanding.features.${feature.key}.description`)}</CardDescription>
            </FeatureCard>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

