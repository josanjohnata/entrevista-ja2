import React from 'react';
import { Target, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from './HeroSection.styles';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.Sidebar>
      <S.FeatureCard>
        <S.FeatureIconLarge>
          <Target size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('features.matchScore')}</S.FeatureTitle>
          <S.FeatureDescription>{t('features.matchScoreDesc')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>

      <S.FeatureCard>
        <S.FeatureIconLarge>
          <Sparkles size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('features.keywords')}</S.FeatureTitle>
          <S.FeatureDescription>{t('features.keywordsDesc')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>

      <S.FeatureCard>
        <S.FeatureIconLarge>
          <TrendingUp size={19} />
        </S.FeatureIconLarge>
        <div>
          <S.FeatureTitle>{t('features.aiSuggestions')}</S.FeatureTitle>
          <S.FeatureDescription>{t('features.aiSuggestionsDesc')}</S.FeatureDescription>
        </div>
      </S.FeatureCard>
    </S.Sidebar>
  );
};
