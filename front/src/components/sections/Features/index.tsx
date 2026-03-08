import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './styles';

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const renderSubtitle = () => {
    const subtitleText = t('landing.features.subtitle');
    const parts = subtitleText.split(/(FoxApply)/gi);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === 'foxapply') {
        return <S.HighlightedText key={index}>{part}</S.HighlightedText>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <S.FeaturesSection id="funcionamento">
      <S.ContainerFeature>
        <h1>{t('landing.features.title')}</h1>
        <S.Subtitle>
          {renderSubtitle()}
        </S.Subtitle>
        <S.Description>
          {t('landing.features.description')}
        </S.Description>
        
        <S.StepsContainer>
          <S.StepCard>
            <S.StepContent>
              <S.StepTitle>{t('landing.features.step3.title')}</S.StepTitle>
              <S.StepFunctionality>{t('landing.features.step3.functionality')}</S.StepFunctionality>
              <S.StepBenefit>{t('landing.features.step3.benefit')}</S.StepBenefit>
            </S.StepContent>
          </S.StepCard>

          <S.StepCard>
            <S.StepContent>
              <S.StepTitle>{t('landing.features.step1.title')}</S.StepTitle>
              <S.StepFunctionality>{t('landing.features.step1.functionality')}</S.StepFunctionality>
              <S.StepBenefit>{t('landing.features.step1.benefit')}</S.StepBenefit>
            </S.StepContent>
          </S.StepCard>

          <S.StepCard>
            <S.StepContent>
              <S.StepTitle>{t('landing.features.step4.title')}</S.StepTitle>
              <S.StepFunctionality>{t('landing.features.step4.functionality')}</S.StepFunctionality>
              <S.StepBenefit>{t('landing.features.step4.benefit')}</S.StepBenefit>
            </S.StepContent>
          </S.StepCard>

          <S.StepCard>
            <S.StepContent>
              <S.StepTitle>{t('landing.features.step2.title')}</S.StepTitle>
              <S.StepFunctionality>{t('landing.features.step2.functionality')}</S.StepFunctionality>
              <S.StepBenefit>{t('landing.features.step2.benefit')}</S.StepBenefit>
            </S.StepContent>
          </S.StepCard>
        </S.StepsContainer>
      </S.ContainerFeature>
    </S.FeaturesSection>
  );
};
