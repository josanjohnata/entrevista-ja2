import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  FileSearch,
  Lightbulb,
  Star,
  CheckCircle2,
  AlertTriangle,
  Download,
  Sparkles,
} from 'lucide-react';
import { getScoreColor, getScoreLabel } from '../utils';
import type { ResultModalProps } from '../types';
import * as S from './ResultModal.styles';

type TabKey = 'analysis' | 'suggestions' | 'recommendation';

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
  onApplySuggestions,
  onDownloadResume,
  canApplySuggestions,
  isMaxScore,
}) => {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('analysis');
  const [progressWidth, setProgressWidth] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [tabHeight, setTabHeight] = useState<number | undefined>(undefined);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const scoreColor = getScoreColor(result.score);
  const scoreLabel = getScoreLabel(result.score);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Animate score counter + progress bar
  useEffect(() => {
    const barTimer = setTimeout(() => setProgressWidth(result.score), 200);

    const duration = 1400;
    const startTime = performance.now() + 200; // sync with bar delay
    const target = result.score;

    const easeOutExpo = (x: number): number =>
      x === 1 ? 1 : 1 - Math.pow(2, -10 * x);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setDisplayScore(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(barTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [result.score]);

  // Measure tab content height
  useLayoutEffect(() => {
    if (tabContentRef.current) {
      setTabHeight(tabContentRef.current.scrollHeight);
    }
  }, [activeTab]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const compatibilityLabel =
    result.compatibility === 'high'
      ? t('analysis.compatibility.high', 'Alta Compatibilidade')
      : result.compatibility === 'medium'
        ? t('analysis.compatibility.medium', 'Compatibilidade Média')
        : t('analysis.compatibility.low', 'Baixa Compatibilidade');

  const showApplyBtn =
    canApplySuggestions &&
    result.improvedResume &&
    result.compatibility !== 'low';

  return (
    <S.Overlay $closing={isClosing} onClick={handleOverlayClick}>
      <S.Panel $closing={isClosing}>
        {/* Header */}
        <S.PanelHeader>
          <S.PanelTitle>{t('analysis.resultTitle', 'Resultado da Análise')}</S.PanelTitle>
          <S.CloseButton onClick={handleClose}>
            <X size={16} />
          </S.CloseButton>
        </S.PanelHeader>

        {/* Scrollable area */}
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          {/* Score Hero */}
          <S.ScoreHero>
            <S.ScoreDisplay>
              {displayScore}<S.ScorePercent>%</S.ScorePercent>
            </S.ScoreDisplay>

            <S.ProgressBarRow>
              <S.ProgressBarTrack>
                <S.ProgressBarFill
                  $color={scoreColor}
                  style={{ width: `${progressWidth}%` }}
                />
              </S.ProgressBarTrack>
            </S.ProgressBarRow>

            <S.CompatibilityBadge $variant={result.compatibility}>
              {result.compatibility === 'high' && <CheckCircle2 />}
              {result.compatibility === 'medium' && <AlertTriangle />}
              {result.compatibility === 'low' && <AlertTriangle />}
              {compatibilityLabel} — {scoreLabel}
            </S.CompatibilityBadge>
          </S.ScoreHero>

          {/* Tabs */}
          <S.TabRow>
            <S.Tab
              $active={activeTab === 'analysis'}
              $variant="analysis"
              onClick={() => setActiveTab('analysis')}
            >
              <FileSearch />
              {t('analysis.tabs.analysis', 'Análise')}
            </S.Tab>
            <S.Tab
              $active={activeTab === 'suggestions'}
              $variant="suggestions"
              onClick={() => setActiveTab('suggestions')}
            >
              <Lightbulb />
              {t('analysis.tabs.suggestions', 'Sugestões')}
              {result.suggestions.length > 0 && (
                <S.TabBadge $variant="suggestions">{result.suggestions.length}</S.TabBadge>
              )}
            </S.Tab>
            <S.Tab
              $active={activeTab === 'recommendation'}
              $variant="recommendation"
              onClick={() => setActiveTab('recommendation')}
            >
              <Star />
              {t('analysis.tabs.recommendation', 'Recomendação')}
            </S.Tab>
          </S.TabRow>

          {/* Tab Content */}
          <S.TabContentWrapper style={{ height: tabHeight !== undefined ? tabHeight : 'auto' }}>
            <S.TabContent ref={tabContentRef} key={activeTab}>
              {activeTab === 'analysis' && (
                <S.AnalysisText>{result.analysis}</S.AnalysisText>
              )}

              {activeTab === 'suggestions' && (
                <S.ItemsList>
                  {result.suggestions.length > 0 ? (
                    result.suggestions.map((suggestion, index) => (
                      <S.SuggestionItem key={index} $index={index}>
                        <S.SuggestionNumber>{index + 1}</S.SuggestionNumber>
                        <S.SuggestionText>{suggestion}</S.SuggestionText>
                      </S.SuggestionItem>
                    ))
                  ) : (
                    <S.AnalysisText>
                      {t('analysis.noSuggestions', 'Nenhuma sugestão disponível.')}
                    </S.AnalysisText>
                  )}
                </S.ItemsList>
              )}

              {activeTab === 'recommendation' && (
                <S.AnalysisText $warning={result.compatibility === 'low'}>
                  {result.recommendation}
                </S.AnalysisText>
              )}
            </S.TabContent>
          </S.TabContentWrapper>
        </div>

        {/* Footer */}
        <S.Footer>
          {showApplyBtn && (
            <S.BtnPrimary onClick={onApplySuggestions}>
              <Sparkles size={15} />
              {t('analysis.applySuggestions', 'Aplicar Sugestões')}
            </S.BtnPrimary>
          )}

          {isMaxScore && (
            <S.BtnOutline onClick={onDownloadResume}>
              <Download size={15} />
              {t('analysis.downloadResume', 'Baixar Currículo Otimizado')}
            </S.BtnOutline>
          )}

          <S.BtnOutline onClick={handleClose}>
            <X size={15} />
            {t('common.close', 'Fechar')}
          </S.BtnOutline>
        </S.Footer>
      </S.Panel>
    </S.Overlay>
  );
};
