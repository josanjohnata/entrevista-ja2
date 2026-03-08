import React from 'react';
import styled from 'styled-components';
import { Section, Container, Heading2, Card } from '../styles';

const Wrapper = styled(Section)`
  id: depoimentos;
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
  max-width: 64rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TestimonialCard = styled(Card)`
  padding: 1.75rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: hsl(24, 95%, 53%)33;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: hsl(24, 95%, 53%);
`;

const UserDetails = styled.div`
  .name {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(210, 40%, 98%);
  }
  
  .role {
    font-size: 0.75rem;
    color: hsl(215, 20%, 55%);
  }
`;

const Quote = styled.p`
  color: hsl(215, 20%, 55%);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ResultBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: hsl(24, 95%, 53%)1A;
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(24, 95%, 53%);
`;

const testimonials = [
  {
    initials: 'RS',
    name: 'Ricardo Santos',
    role: 'Dev Frontend • PCD',
    quote: 'Estava há 8 meses sem receber retorno. Com o Entrevista Já, apliquei para mais de 200 vagas e recebi 6 convites para entrevistas em 2 semanas!',
    result: '6 entrevistas em 2 semanas',
  },
  {
    initials: 'ML',
    name: 'Maria Lima',
    role: 'Analista de Dados • PCD',
    quote: 'O programa de inclusão da Entrevista Já mudou minha vida. Em 1 mês, recebi 4 propostas de emprego. Hoje estou empregada na empresa dos meus sonhos.',
    result: '4 propostas em 1 mês',
  },
  {
    initials: 'CF',
    name: 'Carlos Ferreira',
    role: 'Dev Backend • PCD',
    quote: 'A automação me poupou centenas de horas. Antes eu gastava o dia todo preenchendo formulários. Agora foco em me preparar para as entrevistas.',
    result: 'Contratado em 3 semanas',
  },
  {
    initials: 'AP',
    name: 'Ana Paula',
    role: 'QA Engineer • PCD',
    quote: 'Nunca imaginei que conseguiria tantas oportunidades. O Entrevista Já aplicou para vagas que eu nem sabia que existiam. Recebi 8 convites!',
    result: '8 entrevistas em 1 mês',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <Wrapper id="depoimentos">
      <Container>
        <Header>
          <div>
            <BadgeText>Histórias Reais</BadgeText>
          </div>
          <div>
            <Title>
              Profissionais PCD que estão{' '}
              <span className="text-gradient">conquistando entrevistas</span>
            </Title>
          </div>
        </Header>

        <Grid>
          {testimonials.map((t) => (
            <div key={t.name}>
              <TestimonialCard>
                <UserInfo>
                  <Avatar>{t.initials}</Avatar>
                  <UserDetails>
                    <div className="name">{t.name}</div>
                    <div className="role">{t.role}</div>
                  </UserDetails>
                </UserInfo>
                <Quote>"{t.quote}"</Quote>
                <ResultBadge>
                  ✨ {t.result}
                </ResultBadge>
              </TestimonialCard>
            </div>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

