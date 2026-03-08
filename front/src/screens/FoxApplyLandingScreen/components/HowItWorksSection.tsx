import React from 'react';
import { useTranslation } from 'react-i18next';
import { Rocket, FileText, Zap, Target } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Card, Heading2, Heading3, Text, Badge } from '../styles';

const Wrapper = styled(Section)`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url('/images/features-bg.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.3;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: oklch(0.08 0.01 260 / 0.8);
  }
`;

const Content = styled(Container)`
  position: relative;
  z-index: 10;
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
`;

const Subtitle = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  color: var(--text-tertiary);
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StepCard = styled(Card)`
  height: 100%;
  padding: 1.5rem;
  position: relative;
  background: oklch(0.15 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(1 0 0 / 0.1);
  
  &:hover {
    border-color: oklch(0.82 0.15 195 / 0.5);
  }
`;

const StepNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-display);
  color: oklch(0.72 0.19 45 / 0.2);
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: oklch(0.82 0.15 195 / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
  
  ${StepCard}:hover & {
    background: oklch(0.82 0.15 195 / 0.2);
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--neon-cyan);
  }
`;

const CardTitle = styled(Heading3)`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled(Text)`
  font-size: 0.875rem;
  color: var(--text-tertiary);
`;

const Connector = styled.div`
  display: none;
  
  @media (min-width: 1024px) {
    display: block;
    position: absolute;
    top: 50%;
    right: -0.75rem;
    width: 1.5rem;
    height: 2px;
    background: linear-gradient(to right, var(--neon-orange), var(--neon-cyan));
    transform: translateY(-50%);
  }
`;

const steps = [
  { number: '01', icon: Rocket, key: 'step1' },
  { number: '02', icon: FileText, key: 'step2' },
  { number: '03', icon: Zap, key: 'step3' },
  { number: '04', icon: Target, key: 'step4' },
];

export const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Wrapper id="como-funciona">
      <Content>
        <Header>
          <BadgeText>{t('foxApplyLanding.howItWorks.badge')}</BadgeText>
          <Title>{t('foxApplyLanding.howItWorks.title')}</Title>
        </Header>
        
        <Grid>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{step.number}</StepNumber>
              <IconWrapper>
                <step.icon />
              </IconWrapper>
              <CardTitle>{t(`foxApplyLanding.howItWorks.${step.key}.title`)}</CardTitle>
              {index < steps.length - 1 && <Connector />}
            </StepCard>
          ))}
        </Grid>
        <Subtitle>{t('foxApplyLanding.howItWorks.subtitle')}</Subtitle>
      </Content>
    </Wrapper>
  );
};

