import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Search, Link, FileText, User, CheckCircle2, AlertTriangle, Lightbulb, Sparkles, Award, RotateCcw, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { linkedinSupabase } from '../../../infrastructure/supabase/linkedinClient';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import type { UserProfile } from '../../ProfileScreen/types';
import * as S from '../LinkedInChampionScreen.styles';

interface AnalysisResult {
  score: number;
  positives: string[];
  improvements: string[];
  tips: string[];
  profileName?: string;
  profilePhoto?: string;
}

interface LinkedInProfile {
  full_name: string;
  headline: string;
  summary: string;
  occupation: string;
  experiences: Array<{
    title: string;
    company: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree_name: string;
    field_of_study: string;
  }>;
  skills: string[];
  recommendations: string[];
  profile_pic_url: string;
  connections: number;
  follower_count: number;
}

const analyzeFromProfileWithT = (profile: LinkedInProfile, t: any): AnalysisResult => {
  let score = 20;
  const positives: string[] = [];
  const improvements: string[] = [];
  const tips: string[] = [];

  if (profile.profile_pic_url) {
    score += 12;
    positives.push(t('linkedinChampion.analyzer.analysis.profilePhoto.positive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.profilePhoto.improvement'));
  }

  if (profile.headline && profile.headline.length > 20) {
    score += 10;
    if (profile.headline.length > 60) {
      positives.push(t('linkedinChampion.analyzer.analysis.headline.positiveDescriptive', { headline: profile.headline.substring(0, 50) }));
    } else {
      positives.push(t('linkedinChampion.analyzer.analysis.headline.positiveBasic'));
      improvements.push(t('linkedinChampion.analyzer.analysis.headline.improvementExpand'));
    }
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.headline.improvement'));
  }

  if (profile.summary && profile.summary.length > 100) {
    score += 15;
    if (profile.summary.length > 300) {
      positives.push(t('linkedinChampion.analyzer.analysis.summary.positiveComplete'));
    } else {
      positives.push(t('linkedinChampion.analyzer.analysis.summary.positiveBasic'));
      improvements.push(t('linkedinChampion.analyzer.analysis.summary.improvementExpand'));
    }
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.summary.improvement'));
  }

  if (profile.experiences && profile.experiences.length > 0) {
    score += 12;
    const experiencesWithDesc = profile.experiences.filter(e => e.description && e.description.length > 50);
    if (experiencesWithDesc.length >= 2) {
      positives.push(t('linkedinChampion.analyzer.analysis.experience.positiveDetailed', { count: profile.experiences.length }));
    } else {
      positives.push(t('linkedinChampion.analyzer.analysis.experience.positiveBasic', { count: profile.experiences.length }));
      improvements.push(t('linkedinChampion.analyzer.analysis.experience.improvementDetails'));
    }
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.experience.improvement'));
  }

  if (profile.education && profile.education.length > 0) {
    score += 8;
    positives.push(t('linkedinChampion.analyzer.analysis.education.positive', { count: profile.education.length }));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.education.improvement'));
  }

  if (profile.skills && profile.skills.length > 0) {
    if (profile.skills.length >= 10) {
      score += 10;
      positives.push(t('linkedinChampion.analyzer.analysis.skills.positiveMany', { count: profile.skills.length }));
    } else {
      score += 5;
      positives.push(t('linkedinChampion.analyzer.analysis.skills.positiveFew', { count: profile.skills.length }));
      improvements.push(t('linkedinChampion.analyzer.analysis.skills.improvementAdd', { count: profile.skills.length }));
    }
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.skills.improvement'));
  }

  if (profile.recommendations && profile.recommendations.length > 0) {
    score += 10;
    positives.push(t('linkedinChampion.analyzer.analysis.recommendations.positive', { count: profile.recommendations.length }));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.recommendations.improvement'));
  }

  if (profile.connections >= 500) {
    score += 8;
    positives.push(t('linkedinChampion.analyzer.analysis.connections.positiveMany', { count: profile.connections }));
  } else if (profile.connections >= 100) {
    score += 4;
    improvements.push(t('linkedinChampion.analyzer.analysis.connections.improvementModerate', { count: profile.connections }));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.connections.improvement'));
  }

  tips.push(t('linkedinChampion.analyzer.analysis.tips.tip1'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.tip2'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.tip3'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.tip4'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.tip5'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.tip6'));

  return {
    score: Math.min(score, 100),
    positives,
    improvements,
    tips,
    profileName: profile.full_name,
    profilePhoto: profile.profile_pic_url
  };
};

const analyzeFromTextWithT = (text: string, t: any): AnalysisResult => {
  const lowerText = text.toLowerCase();
  const hasPhoto = lowerText.includes("foto") || lowerText.includes("photo") || lowerText.includes("imagem");
  const hasHeadline = lowerText.includes("headline") || text.length > 100;
  const hasSummary = lowerText.includes("sobre") || lowerText.includes("about") || lowerText.includes("resumo") || text.length > 300;
  const hasExperience = lowerText.includes("experiência") || lowerText.includes("experience") || lowerText.includes("trabalho");
  const hasSkills = lowerText.includes("habilidades") || lowerText.includes("skills") || lowerText.includes("competências");
  const hasEducation = lowerText.includes("formação") || lowerText.includes("education") || lowerText.includes("graduação");
  const hasRecommendations = lowerText.includes("recomendação") || lowerText.includes("recommendation");
  const hasProjects = lowerText.includes("projeto") || lowerText.includes("project") || lowerText.includes("portfólio");
  const hasCertifications = lowerText.includes("certificação") || lowerText.includes("certification") || lowerText.includes("certificado");

  let score = 30;
  const positives: string[] = [];
  const improvements: string[] = [];
  const tips: string[] = [];

  if (hasPhoto) {
    score += 10;
    positives.push(t('linkedinChampion.analyzer.analysis.profilePhoto.textPositive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.profilePhoto.textImprovement'));
  }

  if (hasHeadline) {
    score += 10;
    positives.push(t('linkedinChampion.analyzer.analysis.headline.textPositive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.headline.textImprovement'));
  }

  if (hasSummary) {
    score += 12;
    positives.push(t('linkedinChampion.analyzer.analysis.summary.textPositive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.summary.textImprovement'));
  }

  if (hasExperience) {
    score += 10;
    positives.push(t('linkedinChampion.analyzer.analysis.experience.textPositive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.experience.textImprovement'));
  }

  if (hasSkills) {
    score += 8;
    positives.push(t('linkedinChampion.analyzer.analysis.skills.textPositive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.skills.textImprovement'));
  }

  if (hasEducation) {
    score += 7;
    positives.push(t('linkedinChampion.analyzer.analysis.education.textPositive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.education.textImprovement'));
  }

  if (hasRecommendations) {
    score += 8;
    positives.push(t('linkedinChampion.analyzer.analysis.recommendations.textPositive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.recommendations.improvement'));
  }

  if (hasProjects) {
    score += 5;
    positives.push(t('linkedinChampion.analyzer.analysis.projects.positive'));
  } else {
    improvements.push(t('linkedinChampion.analyzer.analysis.projects.improvement'));
  }

  if (hasCertifications) {
    score += 5;
    positives.push(t('linkedinChampion.analyzer.analysis.certifications.positive'));
  }

  tips.push(t('linkedinChampion.analyzer.analysis.tips.textTip1'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.textTip2'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.textTip3'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.textTip4'));
  tips.push(t('linkedinChampion.analyzer.analysis.tips.textTip5'));

  return {
    score: Math.min(score, 100),
    positives,
    improvements,
    tips
  };
};

// Score helpers

const getScoreColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excelente!';
  if (score >= 60) return 'Bom';
  if (score >= 40) return 'Regular';
  return 'Precisa melhorar';
};

export const ProfileAnalyzer: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileText, setProfileText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [resultTab, setResultTab] = useState<'positives' | 'improvements' | 'tips'>('positives');
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [tabHeight, setTabHeight] = useState<number | undefined>(undefined);

  // Measure tab content height for smooth transition
  useLayoutEffect(() => {
    if (!result || !tabContentRef.current) return;
    const inner = tabContentRef.current.firstElementChild as HTMLElement;
    if (inner) {
      setTabHeight(inner.scrollHeight);
    }
  }, [resultTab, result]);

  const loadLinkedInFromProfile = useCallback(async () => {
    if (!currentUser || !db) return;

    try {
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const profileData = profileSnap.data() as UserProfile;

        if (profileData.linkedin && profileData.linkedin.trim()) {
          let linkedinUrlValue = profileData.linkedin.trim();

          if (!linkedinUrlValue.startsWith('http://') && !linkedinUrlValue.startsWith('https://')) {
            linkedinUrlValue = `https://${linkedinUrlValue}`;
          }

          if (!linkedinUrlValue.includes('linkedin.com')) {
            linkedinUrlValue = `https://linkedin.com/in/${linkedinUrlValue.replace(/^\/+|\/+$/g, '')}`;
          }

          setLinkedinUrl(linkedinUrlValue);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar LinkedIn do perfil:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    loadLinkedInFromProfile();
  }, [loadLinkedInFromProfile]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setAnimatedWidth(result.score), 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedWidth(0);
    }
  }, [result]);

  const handleAnalyzeUrl = async () => {
    if (!linkedinUrl.trim()) return;

    const urlPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
    if (!urlPattern.test(linkedinUrl.trim())) {
      toast.error(t('linkedinChampion.analyzer.errors.invalidUrl'));
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await linkedinSupabase.functions.invoke('fetch-linkedin-profile', {
        body: { linkedinUrl: linkedinUrl.trim() }
      });

      if (error) {
        let errorMessage = t('linkedinChampion.analyzer.errors.fetchError');
        if (data?.error) errorMessage = data.error;
        else if (data?.message) errorMessage = data.message;
        else if (error.message) errorMessage = error.message;
        else if (error.context?.message) errorMessage = error.context.message;
        toast.error(errorMessage);
        setIsAnalyzing(false);
        return;
      }

      if (data?.error) {
        toast.error(data.message || data.error || t('linkedinChampion.analyzer.errors.analysisError'));
        setIsAnalyzing(false);
        return;
      }

      const analysis = analyzeFromProfileWithT(data as LinkedInProfile, t);
      setResult(analysis);
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('linkedinChampion.analyzer.errors.analysisError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!profileText.trim()) return;

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = analyzeFromTextWithT(profileText, t);
    setResult(analysis);
    setIsAnalyzing(false);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setResultTab('positives');
  };

  return (
    <S.FormPanel>
      {/* Header — changes icon/title when showing results */}
      <S.FormPanelHeader>
        <S.FormPanelIcon>
          {result ? <Trophy size={17} /> : <Award size={17} />}
        </S.FormPanelIcon>
        <S.FormPanelTitleGroup>
          {result ? (
            <>
              <h2>{t('linkedinChampion.analyzer.results.title')}</h2>
              <p>{t('linkedinChampion.analyzer.results.profileSubtitle')}</p>
            </>
          ) : (
            <>
              <h2>{t('linkedinChampion.analyzer.title')}</h2>
              <p>{t('linkedinChampion.analyzer.subtitle')}</p>
            </>
          )}
        </S.FormPanelTitleGroup>
      </S.FormPanelHeader>

      {!result ? (
        <>
          {/* --- FORM VIEW --- */}
          <S.TabRow>
            <S.TabButton
              type="button"
              $active={activeTab === 'url'}
              onClick={() => setActiveTab('url')}
            >
              <Link size={15} />
              {t('linkedinChampion.analyzer.tabs.url')}
            </S.TabButton>
            <S.TabButton
              type="button"
              $active={activeTab === 'text'}
              onClick={() => setActiveTab('text')}
            >
              <FileText size={15} />
              {t('linkedinChampion.analyzer.tabs.text')}
            </S.TabButton>
          </S.TabRow>

          <S.FormBody>
            {activeTab === 'url' ? (
              <S.FormGroup>
                <S.FormLabel>{t('linkedinChampion.analyzer.urlTab.label')}</S.FormLabel>
                <S.FormInput
                  placeholder={t('linkedinChampion.analyzer.urlTab.placeholder')}
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
                <S.HelpText>
                  {t('linkedinChampion.analyzer.urlTab.helpText')}
                </S.HelpText>
              </S.FormGroup>
            ) : (
              <S.FormGroup>
                <S.FormLabel>{t('linkedinChampion.analyzer.textTab.label')}</S.FormLabel>
                <S.FormTextarea
                  placeholder={t('linkedinChampion.analyzer.textTab.placeholder')}
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                />
              </S.FormGroup>
            )}
          </S.FormBody>

          <S.FormFooter>
            <S.BtnPrimary
              onClick={activeTab === 'url' ? handleAnalyzeUrl : handleAnalyzeText}
              $disabled={activeTab === 'url' ? !linkedinUrl.trim() || isAnalyzing : !profileText.trim() || isAnalyzing}
              disabled={activeTab === 'url' ? !linkedinUrl.trim() || isAnalyzing : !profileText.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <S.LoadingContent>
                  <S.Spinner />
                  <span>{activeTab === 'url' ? t('linkedinChampion.analyzer.urlTab.analyzing') : t('linkedinChampion.analyzer.textTab.analyzing')}</span>
                </S.LoadingContent>
              ) : (
                <>
                  <Search size={15} />
                  {activeTab === 'url' ? t('linkedinChampion.analyzer.urlTab.button') : t('linkedinChampion.analyzer.textTab.button')}
                </>
              )}
            </S.BtnPrimary>
          </S.FormFooter>
        </>
      ) : (
        <>
          {/* --- RESULT VIEW (inside same panel) --- */}
          <S.ResultBody>
            {/* Score Hero — editorial large type + progress bar */}
            <S.ScoreHero>
              <S.ScoreDisplay>
                {result.score}<S.ScoreMax>/100</S.ScoreMax>
              </S.ScoreDisplay>
              <S.ProgressBarRow>
                <S.ProgressBarTrack>
                  <S.ProgressBarFill
                    style={{ width: `${animatedWidth}%` }}
                    $color={getScoreColor(result.score)}
                  />
                </S.ProgressBarTrack>
                <S.ScoreStatusBadge $color={getScoreColor(result.score)}>
                  {getScoreLabel(result.score)}
                </S.ScoreStatusBadge>
              </S.ProgressBarRow>
              {result.profileName && (
                <S.ProfileRow>
                  {result.profilePhoto ? (
                    <S.AvatarImage src={result.profilePhoto} alt={result.profileName} />
                  ) : (
                    <S.AvatarPlaceholder>
                      <User size={14} />
                    </S.AvatarPlaceholder>
                  )}
                  <S.ProfileName>{result.profileName}</S.ProfileName>
                  <S.ProfileSubtitle>{t('linkedinChampion.analyzer.results.profileSubtitle')}</S.ProfileSubtitle>
                </S.ProfileRow>
              )}
            </S.ScoreHero>

            {/* Result Tabs */}
            <S.ResultTabRow>
              <S.ResultTab
                type="button"
                $active={resultTab === 'positives'}
                $variant="success"
                onClick={() => setResultTab('positives')}
              >
                <CheckCircle2 />
                {t('linkedinChampion.analyzer.results.positives')}
                <S.ResultTabBadge $variant="success">{result.positives.length}</S.ResultTabBadge>
              </S.ResultTab>
              <S.ResultTab
                type="button"
                $active={resultTab === 'improvements'}
                $variant="warning"
                onClick={() => setResultTab('improvements')}
              >
                <AlertTriangle />
                {t('linkedinChampion.analyzer.results.improvements')}
                <S.ResultTabBadge $variant="warning">{result.improvements.length}</S.ResultTabBadge>
              </S.ResultTab>
              <S.ResultTab
                type="button"
                $active={resultTab === 'tips'}
                $variant="tip"
                onClick={() => setResultTab('tips')}
              >
                <Lightbulb />
                {t('linkedinChampion.analyzer.results.tips')}
              </S.ResultTab>
            </S.ResultTabRow>

            {/* Tab Content — outer wrapper animates height */}
            <S.TabContentWrapper
              ref={tabContentRef}
              style={{ height: tabHeight !== undefined ? `${tabHeight}px` : 'auto' }}
            >
              <S.ResultTabContent key={resultTab}>
                {resultTab === 'positives' && (
                  <S.ItemsList>
                    {result.positives.length > 0 ? (
                      result.positives.map((item, index) => (
                        <S.TipItemRow key={index} $type="positive" $index={index}>
                          <S.TipIconWrap $type="positive"><CheckCircle2 /></S.TipIconWrap>
                          <S.TipText>{item}</S.TipText>
                        </S.TipItemRow>
                      ))
                    ) : (
                      <S.EmptyMessage>{t('linkedinChampion.analyzer.results.emptyPositives')}</S.EmptyMessage>
                    )}
                  </S.ItemsList>
                )}

                {resultTab === 'improvements' && (
                  <S.ItemsList>
                    {result.improvements.map((item, index) => (
                      <S.TipItemRow key={index} $type="improvement" $index={index}>
                        <S.TipIconWrap $type="improvement"><AlertTriangle /></S.TipIconWrap>
                        <S.TipText>{item}</S.TipText>
                      </S.TipItemRow>
                    ))}
                  </S.ItemsList>
                )}

                {resultTab === 'tips' && (
                  <S.ItemsList>
                    {result.tips.map((tip, index) => (
                      <S.TipItemRow key={index} $type="tip" $index={index}>
                        <S.TipIconWrap $type="tip"><Lightbulb /></S.TipIconWrap>
                        <S.TipText>{tip}</S.TipText>
                      </S.TipItemRow>
                    ))}
                  </S.ItemsList>
                )}
              </S.ResultTabContent>
            </S.TabContentWrapper>

            {/* CTA */}
            <S.CTABanner>
              <Sparkles size={14} />
              <span>{t('linkedinChampion.analyzer.results.cta')}</span>
            </S.CTABanner>
          </S.ResultBody>

          {/* Footer */}
          <S.FormFooter>
            <S.BtnOutline onClick={handleNewAnalysis}>
              <RotateCcw size={14} />
              {t('linkedinChampion.analyzer.results.newAnalysis')}
            </S.BtnOutline>
          </S.FormFooter>
        </>
      )}
    </S.FormPanel>
  );
};
