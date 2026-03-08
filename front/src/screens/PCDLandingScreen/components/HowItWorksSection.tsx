import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Section, Container, Heading2, Text } from '../styles';

const Wrapper = styled(Section)`
  id: como-funciona;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const BadgeText = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(24, 95%, 53%);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const Title = styled(Heading2)`
  margin-bottom: 1rem;
  
  .text-gradient {
    background: linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(35, 100%, 60%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled(Text)`
  font-size: 1.125rem;
  margin-top: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 80rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StepCard = styled.div`
  position: relative;
`;

const StepNumber = styled.div`
  font-size: 3.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(35, 100%, 60%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.4;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: hsl(210, 40%, 98%);
`;

const StepDescription = styled(Text)`
  font-size: 0.875rem;
`;

const Connector = styled.div`
  display: none;
  
  @media (min-width: 1024px) {
    display: block;
    position: absolute;
    top: 1.875rem;
    right: 0;
    transform: translateX(50%);
    width: 2rem;
    height: 1px;
    background: hsl(222, 30%, 16%);
  }
`;

const steps = [
  { number: '01', key: 'step1' },
  { number: '02', key: 'step2' },
  { number: '03', key: 'step3' },
  { number: '04', key: 'step4' },
];

export const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Wrapper id="como-funciona">
      <Container>
        <Header>
          <div>
            <BadgeText>Simples e Poderoso</BadgeText>
          </div>
          <div>
            <Title>
              Como a FoxApply <span className="text-gradient">Funciona</span>
            </Title>
            <Subtitle>
              Em 4 passos simples, você transforma sua busca por emprego
            </Subtitle>
          </div>
        </Header>
        
        <Grid>
          {steps.map((step, index) => (
            <div key={index}>
              <StepCard>
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{t(`pcdLanding.howItWorks.${step.key}.title`)}</StepTitle>
                <StepDescription>{t(`pcdLanding.howItWorks.${step.key}.description`)}</StepDescription>
                {index < steps.length - 1 && <Connector />}
              </StepCard>
            </div>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

