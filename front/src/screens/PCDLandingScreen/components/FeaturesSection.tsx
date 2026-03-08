import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Users, Zap, Target } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Heading2, Card } from '../styles';

const Wrapper = styled(Section)`
  id: recursos;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled(Card)`
  padding: 1.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: hsl(24, 95%, 53%)33;
  }
`;

const IconWrapper = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  background: hsl(24, 95%, 53%)1A;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: hsl(24, 95%, 53%);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: hsl(210, 40%, 98%);
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: hsl(215, 20%, 55%);
  line-height: 1.6;
`;

const features = [
  { icon: Heart, key: 'freeTrial' },
  { icon: Users, key: 'inclusion' },
  { icon: Zap, key: 'fullAccess' },
  { icon: Target, key: 'career' },
];

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Wrapper id="recursos">
      <Container>
        <Header>
          <div>
            <BadgeText>Recursos Poderosos</BadgeText>
          </div>
          <div>
            <Title>
              Tudo que você precisa para{' '}
              <span className="text-gradient">conquistar sua vaga</span>
            </Title>
          </div>
        </Header>
        
        <Grid>
          {features.map((feature, index) => (
            <div key={index}>
              <FeatureCard>
                <IconWrapper>
                  <feature.icon />
                </IconWrapper>
                <CardTitle>{t(`pcdLanding.features.${feature.key}.title`)}</CardTitle>
                <CardDescription>{t(`pcdLanding.features.${feature.key}.description`)}</CardDescription>
              </FeatureCard>
            </div>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

