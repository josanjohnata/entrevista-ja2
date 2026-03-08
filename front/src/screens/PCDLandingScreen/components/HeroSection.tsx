import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Button, Heading1, Text, Badge } from '../styles';

const HeroWrapper = styled(Section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 4rem;
  overflow: hidden;
  position: relative;
  
  @media (min-width: 1024px) {
    padding-top: 4rem;
  }
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      hsl(222, 47%, 6%) / 0.6 0%,
      hsl(222, 47%, 6%) / 0.4 50%,
      hsl(222, 47%, 6%) 100%
    );
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 0%,
      hsl(24, 95%, 53%)1A 0%,
      transparent 70%
    );
  }
`;

const Content = styled(Container)`
  position: relative;
  z-index: 10;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
`;

const LeftColumn = styled.div`
  @media (min-width: 1024px) {
    padding-right: 2rem;
  }
`;

const BadgeWrapper = styled(Badge)`
  margin-bottom: 1.5rem;
`;

const Title = styled(Heading1)`
  margin-bottom: 1.5rem;
  
  .text-gradient {
    background: linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(35, 100%, 60%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .text-gradient-accent {
    background: linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(174, 72%, 56%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled(Text)`
  max-width: 36rem;
  margin-bottom: 2rem;
  font-size: 1.125rem;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
  
  strong {
    color: hsl(210, 40%, 98%);
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: nowrap;
  }
  
  button,
  a {
    width: 100%;
    
    @media (min-width: 640px) {
      width: auto;
    }
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.875rem;
  color: hsl(215, 20%, 55%);
  
  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      width: 1rem;
      height: 1rem;
      color: hsl(24, 95%, 53%);
    }
  }
`;

const RightColumn = styled.div`
  display: none;
  
  @media (min-width: 1024px) {
    display: block;
    padding-left: 2rem;
  }
`;

const StatsCard = styled.div`
  background: linear-gradient(145deg, hsl(222, 47%, 11%) 0%, hsl(222, 47%, 8%) 100%);
  border: 1px solid hsl(24, 95%, 53%)33;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 30px hsl(24, 95%, 53%)26;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  div {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: hsl(174, 72%, 46%);
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }
  
  span {
    font-size: 0.875rem;
    color: hsl(215, 20%, 55%);
  }
`;

const BigNumber = styled.div`
  font-size: 4.375rem;
  font-weight: 900;
  color: hsl(210, 40%, 98%);
  margin: 0 auto 0.25rem;
  text-align: center;
  line-height: 1;
  
  @media (min-width: 1024px) {
    font-size: 4.5rem;
  }
`;

const StatsLabel = styled(Text)`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid hsl(222, 30%, 16%);
  
  div {
    text-align: center;
    
    .number {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .label {
      font-size: 0.75rem;
      color: hsl(215, 20%, 55%);
    }
  }
`;

const StatsNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: hsl(24, 95%, 53%);
`;

const StatsLabelSmall = styled.div`
  font-size: 0.75rem;
  color: hsl(215, 20%, 55%);
`;

const stats = [
  { value: '500+', label: 'Vagas/mês' },
  { value: '10x', label: 'Mais rápido' },
  { value: '85%', label: 'Taxa ATS' },
];

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <HeroWrapper>
      <Background>
        <img
          src="/images/hero-background.jpg"
          alt=""
        />
      </Background>
      
      <Content>
        <Grid>
          <LeftColumn>
            <div>
              <BadgeWrapper>♿ Programa de Inclusão PCD</BadgeWrapper>
            </div>
            
            <div>
              <Title>
                Pare de Aplicar por{' '}
                <span className="text-gradient">Semanas</span>
                <br />
                Comece a Ser Chamado para Entrevistas em{' '}
                <span className="text-gradient-accent">Dias</span>
              </Title>
            </div>
            
            <div>
              <Subtitle>
                Programa exclusivo com <strong>30 dias grátis</strong> para pessoas com deficiência.
                Candidaturas automáticas no LinkedIn, currículo otimizado por IA e acesso completo à plataforma.
              </Subtitle>
            </div>
            
            <div>
              <ButtonGroup>
                <Button as={Link} to="/checkout-pcd" $variant="hero" $size="lg">
                  Testar 30 Dias Grátis
                  <ArrowRight size={20} />
                </Button>
                <Button as={HashLink} smooth to="/pcd#como-funciona" $variant="heroOutline" $size="lg">
                  Ver Como Funciona
                </Button>
              </ButtonGroup>
            </div>
            
            <div>
              <Features>
                <div>
                  <CheckCircle size={16} />
                  <span>Não cobramos nada durante o teste</span>
                </div>
                <div>
                  <CheckCircle size={16} />
                  <span>Cancele quando quiser</span>
                </div>
              </Features>
            </div>
          </LeftColumn>
          
          <RightColumn>
            <div>
              <StatsCard>
                <StatusBadge>
                  <div />
                  <span>Aplicando agora...</span>
                </StatusBadge>
                
                <BigNumber>47</BigNumber>
                <StatsLabel>candidaturas enviadas hoje</StatsLabel>
                
              <StatsGrid>
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <StatsNumber>{stat.value}</StatsNumber>
                    <StatsLabelSmall>{stat.label}</StatsLabelSmall>
                  </div>
                ))}
              </StatsGrid>
              </StatsCard>
            </div>
          </RightColumn>
        </Grid>
      </Content>
    </HeroWrapper>
  );
};

