import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Heading2, Button } from '../styles';
import { useReferralTracking } from '../../../hooks/useReferralTracking';

const Wrapper = styled(Section)`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      oklch(0.72 0.19 45 / 0.2),
      oklch(0.82 0.15 195 / 0.2)
    );
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px),
      linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.5;
  }
`;

const Content = styled(Container)`
  position: relative;
  z-index: 10;
`;

const Inner = styled.div`
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
`;

const Title = styled(Heading2)`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  
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
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  
  button,
  a {
    width: 100%;
    max-width: 400px;
    
    @media (min-width: 640px) {
      width: auto;
      max-width: none;
      padding: 1.5rem 3rem;
      font-size: 1.125rem;
    }
    
    @media (max-width: 640px) {
      padding: 1rem 2rem;
      font-size: 1rem;
    }
  }
`;

const Disclaimer = styled.p`
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 1rem;
`;

export const CTASection: React.FC = () => {
  const { t } = useTranslation();
  const { getCheckoutUrl, trackCheckoutClick } = useReferralTracking();
  
  const titleText = t('foxApplyLanding.cta.title');
  const accelerateText = t('foxApplyLanding.cta.accelerate');
  const parts = titleText.split('{accelerate}');
  
  return (
    <Wrapper>
      <Content>
        <Inner>
          <Title>
            {parts[0]}
            <span className="gradient-text">{accelerateText}</span>
            {parts[1] || ''}
          </Title>
          
          <Description>{t('foxApplyLanding.cta.description')}</Description>
          
          <ButtonWrapper>
            <Button 
              as={Link} 
              to={getCheckoutUrl()} 
              size="lg" 
              className="glow-orange"
              onClick={trackCheckoutClick}
            >
              {t('foxApplyLanding.cta.button')}
              <ArrowRight size={20} />
            </Button>
          </ButtonWrapper>
          
          <Disclaimer>{t('foxApplyLanding.cta.disclaimer')}</Disclaimer>
        </Inner>
      </Content>
    </Wrapper>
  );
};

