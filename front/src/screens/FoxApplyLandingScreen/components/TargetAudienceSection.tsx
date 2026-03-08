import React from 'react';
import { useTranslation } from 'react-i18next';
import { Rocket, RefreshCw, TrendingUp, Globe } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Card, Heading2, Badge } from '../styles';

const Wrapper = styled(Section)`
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const BadgeText = styled(Badge)`
  color: var(--neon-cyan);
  margin-bottom: 0.5rem;
  display: block;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const AudienceCard = styled(Card)`
  height: 100%;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  background: oklch(0.15 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(1 0 0 / 0.1);
  
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
  flex-shrink: 0;
  transition: background 0.3s ease;
  
  ${AudienceCard}:hover & {
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

const Content = styled.div`
  flex: 1;
`;

const Highlight = styled.div`
  font-size: 0.75rem;
  color: var(--neon-cyan);
  font-weight: 500;
  margin-bottom: 0.25rem;
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

const audiences = [
  { icon: Rocket, color: 'orange' as const, key: 'audience1' },
  { icon: RefreshCw, color: 'cyan' as const, key: 'audience2' },
  { icon: TrendingUp, color: 'orange' as const, key: 'audience3' },
  { icon: Globe, color: 'cyan' as const, key: 'audience4' },
];

export const TargetAudienceSection: React.FC = () => {
  const { t } = useTranslation();
  
  const titleText = t('foxApplyLanding.targetAudience.title');
  const professionalsText = t('foxApplyLanding.targetAudience.professionals');
  const parts = titleText.split('{professionals}');
  
  return (
    <Wrapper id="para-quem">
      <Container>
        <Header>
          <BadgeText>{t('foxApplyLanding.targetAudience.badge')}</BadgeText>
          <Title>
            {parts[0]}
            <span className="highlight">{professionalsText}</span>
            {parts[1] || ''}
          </Title>
        </Header>
        
        <Grid>
          {audiences.map((audience, index) => (
            <AudienceCard key={index}>
              <IconWrapper $color={audience.color}>
                <audience.icon />
              </IconWrapper>
              <Content>
                <Highlight>{t(`foxApplyLanding.targetAudience.${audience.key}.highlight`)}</Highlight>
                <CardTitle>{t(`foxApplyLanding.targetAudience.${audience.key}.title`)}</CardTitle>
                <CardDescription>{t(`foxApplyLanding.targetAudience.${audience.key}.description`)}</CardDescription>
              </Content>
            </AudienceCard>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

