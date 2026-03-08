import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/paths';
import {
  TrendingUp,
  AlertCircle,
  Lightbulb,
  FileText,
  Home,
  CheckCircle,
  Award,
  Sparkles,
  BarChart3,
  Target
} from 'lucide-react';

import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Container } from '../../components/Layout';
import * as S from './Resultados.styles';

interface AnalysisResult {
  placar: number;
  palavrasChaveFaltando: string;
  resumoOtimizado: string;
  sugestoesMelhoria: string;
}

interface ImprovementData {
  previousScore: number;
  currentScore: number;
  improvement: number;
  analysisCount: number;
}

export const ResultadosPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis as AnalysisResult;
  const improvementData = location.state?.improvementData as ImprovementData | undefined;
  const currentResume = location.state?.currentResume as string | undefined;
  const showOptimizedView = improvementData && improvementData.currentScore >= 75;
  const isLowCompatibility = analysis?.placar < 50;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!analysis) {
      navigate(ROUTES.HOME);
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return null;
  }

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return t('results.excellentScore');
    if (score >= 60) return t('results.goodScore');
    return t('results.canImprove');
  };

  const keywords = analysis.palavrasChaveFaltando
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const generateOptimizedResume = (): string => {
    if (!currentResume) {
      return '';
    }

    let optimizedResume = currentResume.replace(
      /RESUMO PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|\n\nEXPERIÊNCIA|$)/i,
      `RESUMO PROFISSIONAL\n${analysis.resumoOtimizado}`
    );
    
    if (keywords.length > 0) {
      const expSection = optimizedResume.match(/EXPERIÊNCIA PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|$)/i);
      if (expSection) {
        let updatedExpSection = expSection[0];

        const missingKeywords = keywords.filter(kw => 
          !updatedExpSection.toLowerCase().includes(kw.toLowerCase())
        ).slice(0, 5);
        
        if (missingKeywords.length > 0) {
          const expBlocks = updatedExpSection.split(/\n\n(?=[A-Z])/);
          if (expBlocks.length > 1) {
            expBlocks[1] += `\n\n✨ ${t('results.relevantSkills')} ${missingKeywords.join(', ')}`;
            updatedExpSection = expBlocks.join('\n\n');
          }
        }
        
        optimizedResume = optimizedResume.replace(
          /EXPERIÊNCIA PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|$)/i,
          updatedExpSection
        );
      }
    }
    
    return optimizedResume;
  };

  return (
    <>
      <S.Hero>
        <Container>
          <S.HeroTitle>{t('results.title')}</S.HeroTitle>
        </Container>
      </S.Hero>

      <S.MainContent>
        <Container>
          <S.ResultsContainer>
            <S.ScoreCard $score={analysis.placar}>
              <S.ScoreContent>
                <S.ScoreInfo>
                  <S.ScoreTitle>
                    {showOptimizedView ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={24} /> {t('results.optimizedCompatibility')}
                      </span>
                    ) : (
                      t('results.yourCompatibility')
                    )}
                  </S.ScoreTitle>
                  <S.ScoreDescription>
                    {showOptimizedView 
                      ? t('results.congratulations', { 
                          previous: improvementData.previousScore, 
                          current: improvementData.currentScore, 
                          improvement: improvementData.improvement 
                        })
                      : getScoreMessage(analysis.placar)
                    }
                  </S.ScoreDescription>
                </S.ScoreInfo>
                <S.ScoreDisplay>
                  <S.ScoreValue>{showOptimizedView ? improvementData.currentScore : analysis.placar}%</S.ScoreValue>
                  <S.ScoreIcon>
                    {showOptimizedView ? <Award /> : <TrendingUp />}
                  </S.ScoreIcon>
                </S.ScoreDisplay>
              </S.ScoreContent>
            </S.ScoreCard>

            {isLowCompatibility && (
              <S.ContentCard>
                <S.CardHeader>
                  <S.CardIcon style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
                    <AlertCircle />
                  </S.CardIcon>
                  <S.CardHeaderContent>
                    <S.CardTitle>{t('results.lowCompatibility')}</S.CardTitle>
                    <S.CardSubtitle>
                      {t('results.lowCompatibilitySubtitle')}
                    </S.CardSubtitle>
                  </S.CardHeaderContent>
                </S.CardHeader>
                <S.CardContent>
                  <S.SummaryText style={{ background: '#ef444410', borderColor: '#ef4444' }}>
                    <p style={{ marginBottom: '1rem' }}>
                      <strong>{t('results.notRecommended')}</strong>
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      {t('results.atsWarning', { score: analysis.placar })}
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      <strong>{t('results.suggestions')}</strong>
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
                      <li>{t('results.searchAlignedJobs', { keywords: keywords.slice(0, 3).join(', ') })}</li>
                      <li>{t('results.developSkills')}</li>
                      <li>{t('results.considerLevel')}</li>
                    </ul>
                  </S.SummaryText>
                </S.CardContent>
              </S.ContentCard>
            )}

            {showOptimizedView && (
              <S.ContentCard>
                <S.CardHeader>
                  <S.CardIcon style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                    <CheckCircle />
                  </S.CardIcon>
                  <S.CardHeaderContent>
                    <S.CardTitle>{t('results.optimizedProfile')}</S.CardTitle>
                    <S.CardSubtitle>
                      {t('results.bestScorePossible')}
                    </S.CardSubtitle>
                  </S.CardHeaderContent>
                </S.CardHeader>
                <S.CardContent>
                  <S.SummaryText style={{ background: '#10b98110', borderColor: '#10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <CheckCircle size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>{t('results.profileOptimized')}</strong> {improvementData.analysisCount === 2 ? t('results.profileEvolved') : t('results.profileAlreadyOptimized')}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <BarChart3 size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>{t('results.scoreEvolution')}</strong> {improvementData.previousScore}% → {improvementData.currentScore}% ({improvementData.improvement > 0 ? '+' : ''}{improvementData.improvement} {t('common.points')})
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        {improvementData.currentScore >= 70 
                          ? t('results.excellentChances', { score: improvementData.currentScore })
                          : t('results.continueOptimizing', { improvement: improvementData.improvement })
                        }
                      </div>
                    </div>
                    
                    {improvementData.analysisCount >= 3 && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Sparkles size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                        <div>
                          <strong>{t('results.analysisNumber', { count: improvementData.analysisCount })}</strong> {t('results.bestFormat')}
                        </div>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Target size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>{t('results.nextSteps')}</strong>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                          <li>{t('results.downloadOptimized')}</li>
                          <li>{t('results.useWhenApplying')}</li>
                          <li>{t('results.keepImproving')}</li>
                        </ul>
                      </div>
                    </div>
                  </S.SummaryText>
                </S.CardContent>
              </S.ContentCard>
            )}

            {!showOptimizedView && !isLowCompatibility && (
              <>
                <S.ContentCard>
                  <S.CardHeader>
                    <S.CardIcon>
                      <FileText />
                    </S.CardIcon>
                    <S.CardHeaderContent>
                      <S.CardTitle>{t('results.optimizedSummary')}</S.CardTitle>
                      <S.CardSubtitle>{t('results.optimizedSummarySubtitle')}</S.CardSubtitle>
                    </S.CardHeaderContent>
                  </S.CardHeader>
                  <S.CardContent>
                    <S.SummaryText>{analysis.resumoOtimizado}</S.SummaryText>
                  </S.CardContent>
                </S.ContentCard>

                <S.ContentCard>
                  <S.CardHeader>
                    <S.CardIcon style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                      <AlertCircle />
                    </S.CardIcon>
                    <S.CardHeaderContent>
                      <S.CardTitle>{t('results.missingKeywords')}</S.CardTitle>
                      <S.CardSubtitle>{t('results.missingKeywordsSubtitle')}</S.CardSubtitle>
                    </S.CardHeaderContent>
                  </S.CardHeader>
                  <S.CardContent>
                    <S.BadgeContainer>
                      {keywords.map((keyword, index) => (
                        <Badge key={index} variant="warning">
                          {keyword}
                        </Badge>
                      ))}
                    </S.BadgeContainer>
                  </S.CardContent>
                </S.ContentCard>

                {analysis.sugestoesMelhoria && (
                  <S.ContentCard>
                    <S.CardHeader>
                      <S.CardIcon style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
                        <Lightbulb />
                      </S.CardIcon>
                      <S.CardHeaderContent>
                        <S.CardTitle>{t('results.detailedComparison')}</S.CardTitle>
                        <S.CardSubtitle>
                          {t('results.detailedComparisonSubtitle')}
                        </S.CardSubtitle>
                      </S.CardHeaderContent>
                    </S.CardHeader>
                    <S.CardContent>
                      <S.SummaryText style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                        {analysis.sugestoesMelhoria}
                      </S.SummaryText>
                    </S.CardContent>
                  </S.ContentCard>
                )}
              </>
            )}

            <S.ActionContainer>
              <Button 
                onClick={() => navigate(ROUTES.CURRICULO_TURBO, { 
                  state: isLowCompatibility ? { clearJobDescription: true } : undefined 
                })} 
                size="lg" 
                variant={showOptimizedView || isLowCompatibility ? "primary" : "outline"}
              >
                <Home size={20} />
                {showOptimizedView || isLowCompatibility ? t('results.analyzeNewJob') : t('results.analyzeAnotherJob')}
              </Button>
              {!showOptimizedView && !isLowCompatibility && (
                <Button 
                  onClick={() => {
                    const optimizedResume = generateOptimizedResume();
                    navigate(ROUTES.CURRICULO_TURBO, { 
                      state: { 
                        optimizedResume,
                        fromResults: true
                      } 
                    });
                  }} 
                  size="lg" 
                  variant="primary"
                >
                  <FileText size={20} />
                  {t('results.applySuggestions')}
                </Button>
              )}
            </S.ActionContainer>
          </S.ResultsContainer>
        </Container>
      </S.MainContent>
    </>
  );
};
