import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Briefcase, RefreshCw, Zap, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { pdf } from '@react-pdf/renderer';
import { supabase } from '../../../infrastructure/supabase/client';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import type { UserProfile } from '../../ProfileScreen/types';
import { PDFDocument } from '../../../components/Resume/PDFDocument';
import {
  formatProfileAsResume,
  hashJobDescription,
  parseResumeTextToResumeData,
  mergeResumeData,
} from '../utils';
import type { AnalysisResult, AnalyzedJob } from '../types';
import { ResultModal } from './ResultModal';
import { ScrollTextarea } from './ScrollTextarea';
import * as S from '../CurriculoTurboScreen.styles';

export const ResumeAnalyzer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();

  const [resume, setResume] = useState('');
  const [originalResume, setOriginalResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedJobs, setAnalyzedJobs] = useState<Map<string, AnalyzedJob>>(new Map());
  const [showModal, setShowModal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [formCleared, setFormCleared] = useState(false);

  const currentJobHash = jobDescription ? hashJobDescription(jobDescription) : '';
  const currentAnalyzedJob = analyzedJobs.get(currentJobHash);
  const isReanalysis = currentAnalyzedJob?.suggestionsApplied === true;
  const canApplySuggestions = !currentAnalyzedJob?.suggestionsApplied;
  const isMaxScore = isReanalysis;

  const loadProfile = useCallback(async () => {
    if (!currentUser || !db) {
      toast.error(t('analysis.loginToLoadProfile'));
      return;
    }

    setLoadingProfile(true);

    try {
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const profileData = profileSnap.data() as UserProfile;

        if (profileData.profileCompleted) {
          const hasExperiences = profileData.experiences && profileData.experiences.length > 0;
          const hasEducation = profileData.education && profileData.education.length > 0;
          const hasSkills = profileData.skills && profileData.skills.length > 0;
          const hasCertifications = profileData.certifications && profileData.certifications.length > 0;
          const hasLanguages = profileData.languages && profileData.languages.length > 0;
          const hasCourses = profileData.courses && profileData.courses.length > 0;

          const hasEnoughData = hasExperiences || hasEducation || hasSkills || hasCertifications || hasLanguages || hasCourses;

          if (!hasEnoughData) {
            toast.warning(t('analysis.basicProfileAnalysis'), { autoClose: 8000 });
            return;
          }

          const resumeText = formatProfileAsResume(profileData, t);
          setResume(resumeText);
          setOriginalResume(resumeText);
        } else {
          toast.warning(t('analysis.completeProfileAnalysis'));
        }
      } else {
        toast.warning(t('analysis.profileNotFoundAnalysis'));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error(t('analysis.errorLoadingProfile'));
    } finally {
      setLoadingProfile(false);
    }
  }, [currentUser, t]);

  const analyzeResume = useCallback(async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error(t('analysis.fillResumeAndJob'));
      return;
    }

    setOriginalResume(resume);
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resume,
          jobDescription,
          isReanalysis,
          language: i18n.language,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysisResult(data);
      setShowModal(true);

      if (isReanalysis) {
        setAnalyzedJobs(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(currentJobHash);
          if (existing) {
            newMap.set(currentJobHash, { ...existing, score: data.score });
          }
          return newMap;
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : t('analysis.analysisError');
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resume, jobDescription, isReanalysis, currentJobHash, t, i18n.language]);

  const applySuggestions = useCallback(() => {
    if (!analysisResult?.improvedResume) {
      toast.error(t('analysis.noOptimizedResume'));
      return;
    }

    if (!currentJobHash) {
      toast.error(t('analysis.fillResumeAndJob'));
      return;
    }

    setResume(analysisResult.improvedResume);
    setAnalyzedJobs(prev => {
      const newMap = new Map(prev);
      newMap.set(currentJobHash, {
        jobHash: currentJobHash,
        score: analysisResult.score,
        suggestionsApplied: true,
        improvedResume: analysisResult.improvedResume,
      });
      return newMap;
    });
    setShowModal(false);
    setAnalysisResult(null);
    setFormCleared(true);
    setTimeout(() => setFormCleared(false), 600);

  }, [analysisResult, currentJobHash, t]);

  const handleDownloadOptimizedResume = useCallback(async () => {
    const resumeToDownload = resume.trim();
    if (!resumeToDownload) {
      toast.error(t('analysis.noResumeToDownload'));
      return;
    }

    try {
      toast.info(t('analysis.generatingPDF'));

      const currentData = parseResumeTextToResumeData(resumeToDownload);

      let finalResumeData = currentData;
      if (originalResume && originalResume !== resumeToDownload) {
        const originalData = parseResumeTextToResumeData(originalResume);
        finalResumeData = mergeResumeData(currentData, originalData);
      }

      const pdfBlob = await pdf(<PDFDocument data={finalResumeData} />).toBlob();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = finalResumeData.name
        ? `curriculo_otimizado_${finalResumeData.name.replace(/\s+/g, '_')}.pdf`
        : `curriculo_otimizado_${new Date().toISOString().split('T')[0]}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error(t('analysis.pdfError'));
    }
  }, [resume, originalResume, t]);

  const isButtonDisabled = isAnalyzing || !resume.trim() || !jobDescription.trim();

  const hasContent = !!(resume.trim() || jobDescription.trim());

  const handleClear = useCallback(() => {
    setResume('');
    setOriginalResume('');
    setJobDescription('');
    setAnalysisResult(null);
    setAnalyzedJobs(new Map());
    setFormCleared(true);
    setTimeout(() => setFormCleared(false), 600);
  }, []);

  return (
    <>
      <S.FormPanel>
        <S.FormPanelHeader>
          <S.FormPanelIcon>
            <Zap size={18} />
          </S.FormPanelIcon>
          <S.FormPanelTitleGroup>
            <h2>{t('home.heroTitle')}</h2>
            <p>{t('home.heroSubtitle')}</p>
          </S.FormPanelTitleGroup>
          <S.LoadProfileBtn
            onClick={loadProfile}
            disabled={loadingProfile || isAnalyzing}
          >
            <RefreshCw size={13} />
            {loadingProfile ? t('resume.loading') : t('resume.reloadFromProfile')}
          </S.LoadProfileBtn>
        </S.FormPanelHeader>

        <S.FormBody $cleared={formCleared}>
          <S.FormRow>
            <S.FormGroup>
              <S.FormLabel>
                <FileText size={14} />
                {t('resume.title')}
              </S.FormLabel>
              <ScrollTextarea
                placeholder={t('resume.placeholder')}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                disabled={isAnalyzing}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.FormLabel>
                <Briefcase size={14} />
                {t('job.title')}
              </S.FormLabel>
              <ScrollTextarea
                placeholder={t('job.placeholder')}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isAnalyzing}
              />
            </S.FormGroup>
          </S.FormRow>
        </S.FormBody>

        {currentAnalyzedJob && (
          <S.AnalysisStatusBar>
            {currentAnalyzedJob.suggestionsApplied ? (
              <S.AnalysisStatusHighlight>
                <Zap size={14} />
                {t('analysis.suggestionsApplied', { score: currentAnalyzedJob.score })}
              </S.AnalysisStatusHighlight>
            ) : (
              <span>{t('analysis.lastAnalysis', { score: currentAnalyzedJob.score })}</span>
            )}
          </S.AnalysisStatusBar>
        )}

        <S.FormFooter>
          <S.BtnPrimary
            onClick={analyzeResume}
            disabled={isButtonDisabled}
            $disabled={isButtonDisabled}
          >
            {isAnalyzing ? (
              <S.LoadingContent>
                <S.Spinner />
                {t('analysis.analyzing')}
              </S.LoadingContent>
            ) : (
              <>
                <Zap size={16} />
                {t('analysis.analyze')}
              </>
            )}
          </S.BtnPrimary>
          <S.BtnOutline
            onClick={handleClear}
            disabled={!hasContent && !analysisResult}
          >
            <RotateCcw size={14} />
            {t('coverLetter.actions.clear', 'Limpar')}
          </S.BtnOutline>
        </S.FormFooter>
      </S.FormPanel>

      {showModal && analysisResult && (
        <ResultModal
          result={analysisResult}
          onClose={() => setShowModal(false)}
          onApplySuggestions={applySuggestions}
          onDownloadResume={handleDownloadOptimizedResume}
          canApplySuggestions={canApplySuggestions}
          isMaxScore={isMaxScore}
        />
      )}
    </>
  );
};
