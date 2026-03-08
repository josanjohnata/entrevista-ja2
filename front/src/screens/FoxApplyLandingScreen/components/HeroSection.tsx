import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ArrowRight, CheckCircle2, Linkedin, Zap } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Button, Heading1, Text } from '../styles';
import { AnimatedCounter } from './AnimatedCounter';
import { useReferralTracking } from '../../../hooks/useReferralTracking';

const HeroWrapper = styled(Section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 5rem;
  overflow: hidden;
  position: relative;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      oklch(0.08 0.01 260),
      transparent,
      oklch(0.08 0.01 260)
    );
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px),
      linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
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
  }
`;

const LeftColumn = styled.div`
  animation: fadeInLeft 0.8s ease-out;
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const Title = styled(Heading1)`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3.75rem;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.82 0.15 195));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gradient-orange {
    background: linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.82 0.15 195));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gradient-cyan {
    background: linear-gradient(135deg, oklch(0.75 0.15 195), oklch(0.85 0.12 220));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  max-width: 36rem;
  color: white;
  line-height: 1.6;
  font-weight: 400;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  button,
  a {
    width: 100%;
    white-space: nowrap;
  }
  
  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: nowrap;
    
    button,
    a {
      width: auto;
    }
  }
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: white;
  
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      width: 1rem;
      height: 1rem;
      color: var(--neon-orange);
    }
  }
`;

const RightColumn = styled.div`
  position: relative;
  animation: fadeInRight 0.8s ease-out 0.2s both;
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StatsCard = styled.div`
  background: oklch(0.15 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(1 0 0 / 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: oklch(0.72 0.19 45 / 0.2);
  color: var(--neon-orange);
  font-size: 0.875rem;
  margin: 0 auto 1rem;
  
  div {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--neon-orange);
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
`;

const BigNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-display);
  color: var(--text-primary);
  margin: 0 auto 0.5rem;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid oklch(1 0 0 / 0.1);
  
  div {
    text-align: center;
    
    .number {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-display);
      margin-bottom: 0.25rem;
    }
    
    .label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }
  }
`;

const FloatingIcon = styled.div<{ $position: 'top' | 'bottom' }>`
  position: absolute;
  ${({ $position }) => ($position === 'top' ? 'top: -1rem; right: -1rem;' : 'bottom: -1rem; left: -1rem;')}
  background: oklch(0.15 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(1 0 0 / 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  animation: float 3s ease-in-out infinite;
  animation-delay: ${({ $position }) => ($position === 'top' ? '0s' : '1.5s')};
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(${({ $position }) => ($position === 'top' ? '-10px' : '10px')});
    }
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${({ $position }) => ($position === 'top' ? 'var(--neon-cyan)' : 'var(--neon-orange)')};
  }
`;

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { getCheckoutUrl, trackCheckoutClick } = useReferralTracking();
  
  const titleText = t('foxApplyLanding.hero.title');
  const hundredsText = t('foxApplyLanding.hero.hundreds');
  const parts = titleText.split(hundredsText);
  const hasHundreds = titleText.includes(hundredsText);
  const hasLineBreak = titleText.includes('\n');
  
  const renderTitleWithGradients = (text: string) => {
    if (hasLineBreak) {
      // Efeito de cor por grupo: mendigar atenção (laranja), LinkedIn (ciano), caçado por recrutadores (laranja), não meses (ciano)
      const gradientOrangeWords = new Set([
        'mendigar', 'atenção', 'atençao', 'caçado', 'por', 'recrutadores'
      ]);
      const gradientCyanWords = new Set([
        'linkedin', 'não', 'meses'
      ]);

      return text.split('\n').map((line, lineIndex) => {
        const words = line.split(/(\s+)/);
        return (
          <React.Fragment key={lineIndex}>
            {words.map((word, wordIndex) => {
              const normalizedWord = word
                .replace(/[.,!?;:()[\][]{}'"]/g, '')
                .replace(/\s/g, '')
                .replace(/[…\u2013\u2014]/g, '')
                .trim()
                .toLowerCase();

              if (gradientOrangeWords.has(normalizedWord)) {
                return (
                  <React.Fragment key={wordIndex}>
                    <span className="gradient-orange">{word}</span>
                  </React.Fragment>
                );
              }
              if (gradientCyanWords.has(normalizedWord)) {
                return (
                  <React.Fragment key={wordIndex}>
                    <span className="gradient-cyan">{word}</span>
                  </React.Fragment>
                );
              }
              return <React.Fragment key={wordIndex}>{word}</React.Fragment>;
            })}
            {lineIndex < text.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      });
    }
    return text;
  };
  
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
            <Title>
              {hasHundreds ? (
                <>
                  {parts[0]}
                  <span className="gradient-text">{hundredsText}</span>
                  {parts[1]}
                </>
              ) : hasLineBreak ? (
                renderTitleWithGradients(titleText)
              ) : (
                titleText
              )}
            </Title>
            
            <Subtitle>{t('foxApplyLanding.hero.subtitle')}</Subtitle>
            
            <ButtonGroup>
              <Button 
                as={Link} 
                to={getCheckoutUrl()} 
                size="lg" 
                className="glow-orange"
                onClick={trackCheckoutClick}
              >
                {t('foxApplyLanding.hero.cta')}
                <ArrowRight size={20} />
              </Button>
              
              <Button as={HashLink} smooth to="/#como-funciona" $variant="outline" size="lg">
                {t('foxApplyLanding.hero.ctaSecondary')}
              </Button>
            </ButtonGroup>
            
            <Features>
              <div>
                <CheckCircle2 />
                <span>{t('foxApplyLanding.hero.noChargeBeforeTest')}</span>
              </div>
              <div>
                <CheckCircle2 />
                <span>{t('foxApplyLanding.hero.cancelAnytime')}</span>
              </div>
            </Features>
          </LeftColumn>
          
          <RightColumn>
            <StatsCard>
              <StatusBadge>
                <div />
                {t('foxApplyLanding.hero.applyingNow')}
              </StatusBadge>
              
              <BigNumber>
                <AnimatedCounter target={97} />
              </BigNumber>
              <Text style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                {t('foxApplyLanding.hero.applicationsSentToday')}
              </Text>
              
              <StatsGrid>
                <div>
                  <div className="number" style={{ color: 'var(--neon-cyan)' }}>
                    <AnimatedCounter target={500} />+
                  </div>
                  <div className="label">{t('foxApplyLanding.hero.jobsPerMonth')}</div>
                </div>
                <div>
                  <div className="number" style={{ color: 'var(--neon-orange)' }}>
                    10x
                  </div>
                  <div className="label">{t('foxApplyLanding.hero.faster')}</div>
                </div>
                <div>
                  <div className="number" style={{ color: 'var(--neon-cyan)' }}>
                    85%
                  </div>
                  <div className="label">{t('foxApplyLanding.hero.atsRate')}</div>
                </div>
              </StatsGrid>
            </StatsCard>
            
            <FloatingIcon $position="top">
              <Linkedin />
            </FloatingIcon>
            
            <FloatingIcon $position="bottom">
              <Zap />
            </FloatingIcon>
          </RightColumn>
        </Grid>
      </Content>
    </HeroWrapper>
  );
};

