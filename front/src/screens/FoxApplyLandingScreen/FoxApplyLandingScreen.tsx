import React, { useEffect } from 'react';
import * as S from './styles';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PainPointsSection } from './components/PainPointsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturesSection } from './components/FeaturesSection';
import { LinkedInChampionSection } from './components/LinkedInChampionSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { SuccessSection } from './components/SuccessSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { CouponPopUp } from './components/CouponPopUp';
import { useReferralTracking } from '../../hooks/useReferralTracking';

export const FoxApplyLandingScreen: React.FC = () => {
  // Inicializar rastreamento de indicação
  const { referralCode } = useReferralTracking();

  useEffect(() => {
    // Log para debug (pode ser removido em produção)
    if (referralCode) {
      console.log('🔗 Código de indicação detectado:', referralCode);
    }
  }, [referralCode]);

  return (
    <>
      <S.LandingGlobalStyles />
      <S.PageWrapper>
        <Navbar />
        <HeroSection />
        <PainPointsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <LinkedInChampionSection />
        <TargetAudienceSection />
        <TestimonialsSection />
        <SuccessSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <Footer />
        <CouponPopUp />
      </S.PageWrapper>
    </>
  );
};

