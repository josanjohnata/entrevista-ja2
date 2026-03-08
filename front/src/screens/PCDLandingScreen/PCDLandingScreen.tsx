import React from 'react';
import * as S from './styles';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PainPointsSection } from './components/PainPointsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturesSection } from './components/FeaturesSection';
import { BenefitsSection } from './components/BenefitsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

export const PCDLandingScreen: React.FC = () => {
  return (
    <>
      <S.PCDLandingGlobalStyles />
      <S.PageWrapper>
        <Navbar />
        <HeroSection />
        <PainPointsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </S.PageWrapper>
    </>
  );
};
