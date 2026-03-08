import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Card, Heading2, Badge, Button } from '../styles';
import { getRegionConfig, getPlanPrice } from '../../../utils/regionDetector';
import { useReferralTracking } from '../../../hooks/useReferralTracking';

const Wrapper = styled(Section)``;

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
  
  .highlight {
    color: var(--neon-orange);
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 70rem;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PricingCard = styled(Card)`
  padding: 2rem;
  background: oklch(0.15 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid var(--neon-orange);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 640px) {
    padding: 1.5rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, var(--neon-orange), var(--neon-cyan));
  }
  
  button,
  a {
    width: 100%;
    
    @media (min-width: 640px) {
      width: auto;
    }
  }
`;

const LimitedTimeBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  background: oklch(0.72 0.19 45 / 0.3);
  color: var(--neon-orange);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  border: 1px solid var(--neon-orange);
  z-index: 1;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  background: oklch(0.65 0.2 150 / 0.3);
  color: var(--neon-cyan);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  border: 1px solid var(--neon-cyan);
  z-index: 1;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 3rem 0 0.5rem 0;
  color: var(--text-primary);
  text-align: center;
`;

const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-tertiary);
  text-align: center;
  margin-bottom: 1.5rem;
`;

const PriceContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const OriginalPrice = styled.div`
  font-size: 0.875rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
`;

const CurrentPrice = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  white-space: nowrap;
`;

const Currency = styled.span`
  font-size: 1.5rem;
  color: var(--text-tertiary);
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-display);
  color: var(--text-primary);
  
  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const Period = styled.span`
  font-size: 1rem;
  color: var(--text-tertiary);
`;

const PriceInfo = styled.p`
  text-align: center;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
  font-size: 0.875rem;
  
  &.highlight {
    color: var(--neon-orange);
    font-weight: 500;
    margin-top: 0.25rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--neon-orange);
      flex-shrink: 0;
    }
    
    span {
      color: var(--text-primary);
    }
  }
`;

const Disclaimer = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 1rem;
`;

export const PricingSection: React.FC = () => {
  const { t } = useTranslation();
  const { getCheckoutUrl, trackCheckoutClick } = useReferralTracking();
  const regionConfig = useMemo(() => getRegionConfig(), []);
  
  const prices = useMemo(() => {
    const monthlyPrice = getPlanPrice(regionConfig.region, 'monthly');
    const lifetimePrice = getPlanPrice(regionConfig.region, 'lifetime');
    
    if (regionConfig.region === 'BR') {
      const monthlyParts = monthlyPrice.priceDisplay.split(',');
      const lifetimeParts = lifetimePrice.priceDisplay.split(',');
      return {
        monthly: {
          currency: 'R$',
          amount: monthlyParts[0],
          cents: ',' + monthlyParts[1],
          perMonth: monthlyPrice.priceDisplay
        },
        lifetime: {
          currency: 'R$',
          amount: lifetimeParts[0],
          cents: ',' + lifetimeParts[1],
          originalPrice: '798,00',
          discount: '90%'
        }
      };
    } else if (regionConfig.region === 'EU') {
      const monthlyParts = monthlyPrice.priceDisplay.split(',');
      const lifetimeParts = lifetimePrice.priceDisplay.split(',');
      return {
        monthly: {
          currency: '€',
          amount: monthlyParts[0],
          cents: ',' + monthlyParts[1],
          perMonth: monthlyPrice.priceDisplay
        },
        lifetime: {
          currency: '€',
          amount: lifetimeParts[0],
          cents: ',' + lifetimeParts[1],
          originalPrice: '299,00',
          discount: '90%'
        }
      };
    } else {
      const monthlyParts = monthlyPrice.priceDisplay.split('.');
      const lifetimeParts = lifetimePrice.priceDisplay.split('.');
      return {
        monthly: {
          currency: '$',
          amount: monthlyParts[0],
          cents: '.' + monthlyParts[1],
          perMonth: monthlyPrice.priceDisplay
        },
        lifetime: {
          currency: '$',
          amount: lifetimeParts[0],
          cents: '.' + lifetimeParts[1],
          originalPrice: '299.00',
          discount: '90%'
        }
      };
    }
  }, [regionConfig]);
  
  const titleText = t('foxApplyLanding.pricing.title');
  const changeText = t('foxApplyLanding.pricing.change');
  const change1Text = t('foxApplyLanding.pricing.change1');
  const change2Text = t('foxApplyLanding.pricing.change2');
  const hasChange1And2 = titleText.includes('{change1}') && titleText.includes('{change2}');
  const parts = hasChange1And2
    ? titleText.split('{change1}').flatMap((p) => p.split('{change2}'))
    : titleText.split('{change}');
  
  const planFeatures = t('plans.features.monthly', { returnObjects: true }) as string[];
  
  return (
    <Wrapper>
      <Container>
        <Header>
          <BadgeText>{t('foxApplyLanding.pricing.badge')}</BadgeText>
          <Title>
            {hasChange1And2 ? (
              <>
                {parts[0]}
                <span className="highlight">{change1Text}</span>
                {parts[1]}
                <span className="highlight">{change2Text}</span>
                {parts[2] || ''}
              </>
            ) : (
              <>
                {parts[0]}
                <span className="highlight">{changeText}</span>
                {parts[1] || ''}
              </>
            )}
          </Title>
        </Header>
        
        <PricingGrid>
          <PricingCard>
            <PlanName>{t('plans.monthlyPlan')}</PlanName>
            <PlanDescription>{t('plans.monthlyDescription')}</PlanDescription>
            
            <PriceContainer>
              <PriceDisplay>
                <CurrentPrice>
                  <Currency>{prices.monthly.currency}</Currency>
                  <Price>{prices.monthly.amount}{prices.monthly.cents}</Price>
                  <Period>{t('plans.perMonth')}</Period>
                </CurrentPrice>
              </PriceDisplay>
              <PriceInfo className="highlight">{t('foxApplyLanding.pricing.noChargeDuringTrial')}</PriceInfo>
            </PriceContainer>
            
            <FeaturesList>
              {planFeatures.map((feature, idx) => (
                <li key={idx}>
                  <CheckCircle2 />
                  <span>{feature}</span>
                </li>
              ))}
            </FeaturesList>
            
            <Button 
              as={Link} 
              to={getCheckoutUrl('monthly')} 
              size="lg" 
              className="glow-orange"
              onClick={trackCheckoutClick}
            >
              {t('foxApplyLanding.pricing.cta')}
              <ArrowRight size={20} />
            </Button>
            
            <Disclaimer>{t('foxApplyLanding.pricing.disclaimer')}</Disclaimer>
          </PricingCard>

          <PricingCard>
            <LimitedTimeBadge>{t('plans.limitedTime')}</LimitedTimeBadge>
            <DiscountBadge>{prices.lifetime.discount} {t('plans.off')}</DiscountBadge>
            
            <PlanName>{t('plans.lifetime')}</PlanName>
            <PlanDescription>{t('plans.lifetimeDescription')}</PlanDescription>
            
            <PriceContainer>
              <PriceDisplay>
                <OriginalPrice>
                  {t('plans.from')} {prices.lifetime.currency} {prices.lifetime.originalPrice}
                </OriginalPrice>
                <CurrentPrice>
                  <Currency>{prices.lifetime.currency}</Currency>
                  <Price>{prices.lifetime.amount}{prices.lifetime.cents}</Price>
                  <Period>{t('plans.lifetimePeriod')}</Period>
                </CurrentPrice>
              </PriceDisplay>
            </PriceContainer>
            
            <FeaturesList>
              {planFeatures.map((feature, idx) => (
                <li key={idx}>
                  <CheckCircle2 />
                  <span>{feature}</span>
                </li>
              ))}
            </FeaturesList>
            
            <Button 
              as={Link} 
              to={getCheckoutUrl('lifetime')} 
              size="lg" 
              className="glow-orange"
              onClick={trackCheckoutClick}
            >
              {t('foxApplyLanding.pricing.cta')}
              <ArrowRight size={20} />
            </Button>
            
            <Disclaimer>{t('foxApplyLanding.pricing.disclaimer')}</Disclaimer>
          </PricingCard>
        </PricingGrid>
      </Container>
    </Wrapper>
  );
};

