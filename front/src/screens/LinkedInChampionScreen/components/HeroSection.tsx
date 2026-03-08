import React from 'react';
import { TrendingUp, Target, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from './HeroSection.styles';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.Sidebar>
      <S.FeatureCard>
        <S.FeatureIconLarge>
          <TrendingUp size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('linkedinChampion.hero.feature1.title')}</S.FeatureTitle>
          <S.FeatureDescription>{t('linkedinChampion.hero.feature1.description')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>

      <S.FeatureCard>
        <S.FeatureIconLarge>
          <Target size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('linkedinChampion.hero.feature2.title')}</S.FeatureTitle>
          <S.FeatureDescription>{t('linkedinChampion.hero.feature2.description')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>

      <S.FeatureCard>
        <S.FeatureIconLarge>
          <Sparkles size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('linkedinChampion.hero.feature3.title')}</S.FeatureTitle>
          <S.FeatureDescription>{t('linkedinChampion.hero.feature3.description')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>
    </S.Sidebar>
  );
};
