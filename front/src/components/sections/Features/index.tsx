import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './styles';

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const renderSubtitle = () => {
    const subtitleText = t('landing.features.subtitle');
    const parts = subtitleText.split(/(Entrevista Já)/gi);
    
    return parts.map((part, index) => {
      if (part === 'Entrevista Já') {
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
        
        <S.VideoContainer>
          <iframe 
            src="https://player.vimeo.com/video/1148295137?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=0&amp;loop=1"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            title="EntrevistaJa"
            allowFullScreen
          />
          <script src="https://player.vimeo.com/api/player.js"></script>
        </S.VideoContainer>
      </S.ContainerFeature>
    </S.FeaturesSection>
  );
};
