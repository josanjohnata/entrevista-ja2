import React from 'react';
import { Box, Target, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from './HeroSection.styles';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.Sidebar>
      <S.FeatureCard>
        <S.FeatureIconLarge>
          <Box size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('recommendedJobs.hero.feature1.title')}</S.FeatureTitle>
          <S.FeatureDescription>{t('recommendedJobs.hero.feature1.description')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>

      <S.FeatureCard>
        <S.FeatureIconLarge>
          <Target size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('recommendedJobs.hero.feature2.title')}</S.FeatureTitle>
          <S.FeatureDescription>{t('recommendedJobs.hero.feature2.description')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>

      <S.FeatureCard>
        <S.FeatureIconLarge>
          <Briefcase size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('recommendedJobs.hero.feature3.title')}</S.FeatureTitle>
          <S.FeatureDescription>{t('recommendedJobs.hero.feature3.description')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>
    </S.Sidebar>
  );
};
