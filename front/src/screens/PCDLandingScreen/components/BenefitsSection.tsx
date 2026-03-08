import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Heading2, Text, Card } from '../styles';

const Wrapper = styled(Section)``;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 80rem;
  margin: 0 auto;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const LeftColumn = styled.div``;

const Title = styled(Heading2)`
  margin-bottom: 1rem;
  
  .text-gradient {
    background: linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(35, 100%, 60%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled(Text)`
  font-size: 1.125rem;
  margin-bottom: 2rem;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const CheckIcon = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: hsl(24, 95%, 53%)33;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
  
  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: hsl(24, 95%, 53%);
  }
`;

const BenefitText = styled.span`
  color: hsl(210, 40%, 98%);
  font-size: 0.875rem;
`;

const RightColumn = styled.div``;

const StatsCard = styled(Card)`
  text-align: center;
  padding: 2.5rem;
  border-color: hsl(24, 95%, 53%)33;
`;

const BigNumber = styled.div`
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(35, 100%, 60%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatsTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: hsl(210, 40%, 98%);
`;

const StatsDescription = styled(Text)`
  margin-bottom: 1.5rem;
`;

const StatsFooter = styled.div`
  font-size: 0.875rem;
  color: hsl(215, 20%, 55%);
  padding-top: 1rem;
  border-top: 1px solid hsl(222, 30%, 16%);
`;

const benefits = [
  'benefit1',
  'benefit2',
  'benefit3',
  'benefit4',
  'benefit5',
  'benefit6',
];

export const BenefitsSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Wrapper>
      <Container>
        <Grid>
          <LeftColumn>
            <div>
              <Title>
                Imagine receber convites para entrevistas{' '}
                <span className="text-gradient">toda semana</span>
              </Title>
              <Description>
                Enquanto outros candidatos perdem horas aplicando manualmente, você está focado no que realmente importa.
              </Description>
              
              <BenefitsList>
                {benefits.map((benefit, index) => (
                  <div key={index}>
                    <BenefitItem>
                      <CheckIcon>
                        <Check size={12} />
                      </CheckIcon>
                      <BenefitText>{t(`pcdLanding.benefits.${benefit}`)}</BenefitText>
                    </BenefitItem>
                  </div>
                ))}
              </BenefitsList>
            </div>
          </LeftColumn>
          
          <RightColumn>
            <div>
              <StatsCard>
                <BigNumber>30</BigNumber>
                <StatsTitle>dias grátis</StatsTitle>
                <StatsDescription>
                  Exclusivo para pessoas com deficiência
                </StatsDescription>
                <StatsFooter>
                  Sem cartão de crédito • Sem compromisso • Cancele quando quiser
                </StatsFooter>
              </StatsCard>
            </div>
          </RightColumn>
        </Grid>
      </Container>
    </Wrapper>
  );
};

