import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Zap, Search, FileText, Linkedin, Shield, ArrowRight } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Card, Heading2, Button } from '../styles';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled(Section)`
  background: linear-gradient(
    180deg,
    var(--dark-bg) 0%,
    oklch(0.1 0.02 260) 50%,
    var(--dark-bg) 100%
  );
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      oklch(0.82 0.15 195 / 0.3),
      transparent
    );
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled(Heading2)`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, oklch(0.82 0.15 195), oklch(0.72 0.19 45));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.h3`
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled(Card)`
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: oklch(0.82 0.15 195 / 0.5);
    transform: translateX(4px);
  }
`;

const IconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  border-radius: 0.5rem;
  background: oklch(0.82 0.15 195 / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  
  ${FeatureCard}:hover & {
    background: oklch(0.82 0.15 195 / 0.2);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--neon-cyan);
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-tertiary);
  line-height: 1.5;
  font-size: 0.9375rem;
`;

const CTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const StyledButton = styled(Button)`
  white-space: nowrap;
  min-width: 200px;
`;

const features = [
  { icon: Bot, key: 'feature1' },       // Otimização ATS automática
  { icon: Zap, key: 'feature2' },     // Candidaturas automáticas
  { icon: Search, key: 'feature3' },  // Busca inteligente + % de match
  { icon: FileText, key: 'feature4' }, // Cartas de apresentação IA
  { icon: Linkedin, key: 'feature5' }, // LinkedIn Champion
  { icon: Shield, key: 'feature6' },   // 100% seguro
];

export const LinkedInChampionSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleNavigateToChampion = () => {
    navigate('/plans');
  };
  
  return (
    <Wrapper id="linkedin-champion">
      <Container>
        <Header>
          <Title>
            {t('foxApplyLanding.linkedinChampion.title.part1')}{' '}
            <span className="gradient-text">
              {t('foxApplyLanding.linkedinChampion.title.highlight')}
            </span>
          </Title>
          <Subtitle>
            {t('foxApplyLanding.linkedinChampion.subtitle')}
          </Subtitle>
        </Header>

        <Wrapper>
          <Header>
            <Title style={{ marginTop: '1rem' }}>
              {t('foxApplyLanding.linkedinChampion.title.part2')}
              <br />
              <span className="gradient-text">
                {t('foxApplyLanding.linkedinChampion.title.highlight2')}
              </span>
            </Title>
            <Subtitle>
              {t('foxApplyLanding.linkedinChampion.subtitle2')}
            </Subtitle>
          </Header>
        </Wrapper>
        <ContentWrapper>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <IconWrapper>
                  <feature.icon />
                </IconWrapper>
                <FeatureContent>
                  <FeatureTitle>
                    {t(`foxApplyLanding.linkedinChampion.${feature.key}.title`)}
                  </FeatureTitle>
                  <FeatureDescription>
                    {t(`foxApplyLanding.linkedinChampion.${feature.key}.description`)}
                  </FeatureDescription>
                </FeatureContent>
              </FeatureCard>
            ))}
          </FeaturesGrid>
            
        </ContentWrapper>
        <Subtitle style={{ marginTop: '2rem', textAlign: 'center' }}>
          {t('foxApplyLanding.linkedinChampion.subtitle3')}
        </Subtitle>
        <CTAWrapper>
          <StyledButton 
            $variant="secondary" 
            size="lg"
            onClick={handleNavigateToChampion}
          >
            {t('foxApplyLanding.linkedinChampion.cta')}
            <ArrowRight size={20} />
          </StyledButton>
        </CTAWrapper>
      </Container>
    </Wrapper>
  );
};

