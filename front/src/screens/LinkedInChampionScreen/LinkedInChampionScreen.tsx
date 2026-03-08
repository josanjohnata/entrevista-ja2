import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeroSection } from './components/HeroSection';
import { ProfileAnalyzer } from './components/ProfileAnalyzer';
import * as S from './LinkedInChampionScreen.styles';

export const LinkedInChampionScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      <S.PageHeader>
        <S.PageTitle>{t('linkedinChampion.hero.title')}</S.PageTitle>
        <S.PageSubtitle>{t('linkedinChampion.hero.subtitle')}</S.PageSubtitle>
      </S.PageHeader>

      <S.ContentWrapper>
        <S.DashboardGrid>
          <HeroSection />
          <S.MainColumn>
            <ProfileAnalyzer />
          </S.MainColumn>
        </S.DashboardGrid>
      </S.ContentWrapper>
    </S.Wrapper>
  );
};
