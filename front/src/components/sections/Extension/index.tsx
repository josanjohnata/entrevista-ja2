import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiMousePointer, FiClock, FiTarget, FiShield } from 'react-icons/fi';
import * as S from './styles';

export const Extension: React.FC = () => {
  const { t } = useTranslation();
  
  const features = [
    { icon: FiMousePointer, text: t('landing.extension.feature1') },
    { icon: FiClock, text: t('landing.extension.feature2') },
    { icon: FiTarget, text: t('landing.extension.feature3') },
    { icon: FiShield, text: t('landing.extension.feature4') },
  ];

  const automationSteps = [
    { text: t('landing.extension.step1'), active: true },
    { text: t('landing.extension.step2'), active: true },
    { text: t('landing.extension.step3'), active: true },
    { text: t('landing.extension.step4'), active: true },
  ];

  return (
    <S.ExtensionSection id="extensao">
      <S.ExtensionContainer>
        <S.ContentWrapper>
          <S.TextContent>
            <S.Title>
              {t('landing.extension.title')}
            </S.Title>
            <S.Description>
              {t('landing.extension.description')}
            </S.Description>
            <S.FeaturesList>
              {features.map((feature, index) => (
                <S.FeatureItem key={index}>
                  <feature.icon />
                  <span>{feature.text}</span>
                </S.FeatureItem>
              ))}
            </S.FeaturesList>
          </S.TextContent>

          <S.IllustrationWrapper>
            <S.BrowserMockup>
              <S.BrowserHeader>
                <S.BrowserDot $color="#ff5f57" />
                <S.BrowserDot $color="#febc2e" />
                <S.BrowserDot $color="#28c840" />
              </S.BrowserHeader>
              <S.BrowserContent>
                {automationSteps.map((step, index) => (
                  <S.AutomationStep key={index} $active={step.active} $delay={index}>
                    <S.StepNumber>{index + 1}</S.StepNumber>
                    <span>{step.text}</span>
                    {step.active && <FiCheck style={{ marginLeft: 'auto', color: '#22c55e' }} />}
                  </S.AutomationStep>
                ))}
              </S.BrowserContent>
            </S.BrowserMockup>
          </S.IllustrationWrapper>
        </S.ContentWrapper>
      </S.ExtensionContainer>
    </S.ExtensionSection>
  );
};
