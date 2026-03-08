import React from 'react';
import { Clock, FileX, Users } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Heading2, Text, Card } from '../styles';

const Wrapper = styled(Section)``;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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

const Description = styled(Text)`
  font-size: 1.125rem;
  max-width: 42rem;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PainPointCard = styled(Card)`
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: hsl(24, 95%, 53%)33;
  }
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: hsl(24, 95%, 53%)1A;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: hsl(24, 95%, 53%);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: hsl(210, 40%, 98%);
`;

const CardDescription = styled(Text)`
  font-size: 0.875rem;
  line-height: 1.6;
`;

const painPoints = [
  {
    icon: Clock,
    title: 'Horas perdidas aplicando manualmente',
    description: 'Você gasta horas todos os dias copiando informações e preenchendo formulários repetitivos.',
  },
  {
    icon: FileX,
    title: 'Currículo ignorado por robôs',
    description: 'Seu currículo é descartado pelo ATS antes mesmo de chegar às mãos do recrutador.',
  },
  {
    icon: Users,
    title: 'Barreiras de acessibilidade',
    description: 'Muitas plataformas de emprego não são acessíveis, tornando o processo ainda mais difícil para PCDs.',
  },
];

export const PainPointsSection: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Header>
          <div>
            <Title>
              Cansado de aplicar para vagas e ser{' '}
              <span className="text-gradient">ignorado</span>?
            </Title>
            <Description>
              A busca tradicional por emprego é quebrada. Você merece uma abordagem mais inteligente e inclusiva.
            </Description>
          </div>
        </Header>

        <Grid>
          {painPoints.map((point) => (
            <div key={point.title}>
              <PainPointCard>
                <IconWrapper>
                  <point.icon />
                </IconWrapper>
                <CardTitle>{point.title}</CardTitle>
                <CardDescription>{point.description}</CardDescription>
              </PainPointCard>
            </div>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

