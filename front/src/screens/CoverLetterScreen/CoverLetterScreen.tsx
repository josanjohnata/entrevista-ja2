import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { pdf } from '@react-pdf/renderer';
import { FileText, Sparkles, RotateCcw, Copy, Check, Download, RefreshCw, Wand2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { coverLetterSupabase } from '../../infrastructure/supabase/coverLetterClient';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import type { UserProfile } from '../ProfileScreen/types';
import { PDFCoverLetter } from '../../components/CoverLetter/PDFCoverLetter';
import { HeroSection } from './components/HeroSection';
import { ScrollTextarea } from './components/ScrollTextarea';
import * as S from './styles';

const formatProfileAsResume = (profile: UserProfile, t: any): string => {
  let resumeText = '';

  resumeText += `${profile.displayName}\n`;
  if (profile.professionalTitle) {
    resumeText += `${profile.professionalTitle}\n`;
  }
  resumeText += `${profile.email}\n`;
  if (profile.phone) {
    resumeText += `${profile.phone}\n`;
  }
  if (profile.location) {
    resumeText += `${profile.location}\n`;
  }
  if (profile.linkedin) {
    resumeText += `LinkedIn: ${profile.linkedin}\n`;
  }
  if (profile.github) {
    resumeText += `GitHub: ${profile.github}\n`;
  }
  resumeText += '\n';

  if (profile.about) {
    resumeText += `${t('coverLetter.profile.sections.summary')}:\n${profile.about}\n\n`;
  }

  if (profile.experiences && profile.experiences.length > 0) {
    resumeText += `${t('coverLetter.profile.sections.experience')}:\n\n`;
    profile.experiences.forEach((exp) => {
      resumeText += `${exp.position} - ${exp.company}\n`;
      if (exp.location) {
        resumeText += `${exp.location}\n`;
      }
      const endDate = exp.isCurrent ? t('coverLetter.profile.current') : (exp.endDate || '');
      resumeText += `${exp.startDate} - ${endDate}\n`;
      if (exp.description) {
        resumeText += `${exp.description}\n`;
      }
      resumeText += '\n';
    });
  }

  if (profile.education && profile.education.length > 0) {
    resumeText += `${t('coverLetter.profile.sections.education')}:\n\n`;
    profile.education.forEach((edu) => {
      resumeText += `${edu.institution}\n`;
      if (edu.degree) {
        resumeText += `${edu.degree}`;
        if (edu.fieldOfStudy) {
          resumeText += ` em ${edu.fieldOfStudy}`;
        }
        resumeText += '\n';
      }
      if (edu.startDate || edu.endDate) {
        resumeText += `${edu.startDate || ''} - ${edu.endDate || ''}\n`;
      }
      if ((edu as { activities?: string }).activities) {
        resumeText += `${(edu as { activities?: string }).activities}\n`;
      }
      if ((edu as { description?: string }).description) {
        resumeText += `${(edu as { description?: string }).description}\n`;
      }
      resumeText += '\n';
    });
  }

  if (profile.skills && profile.skills.length > 0) {
    resumeText += `\n${t('coverLetter.profile.sections.skills')}:\n`;
    profile.skills.forEach((skill: string | { name: string }) => {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      resumeText += `- ${skillName}\n`;
    });
  }

  if (profile.languages && profile.languages.length > 0) {
    resumeText += `\n${t('coverLetter.profile.sections.languages')}:\n`;
    profile.languages.forEach((lang) => {
      const proficiencyKey = lang.proficiency as 'basic' | 'intermediate' | 'professional' | 'native';
      const proficiency = t(`coverLetter.profile.proficiency.${proficiencyKey}`, { defaultValue: lang.proficiency });
      resumeText += `- ${lang.language}: ${proficiency}\n`;
    });
  }

  if (profile.certifications && profile.certifications.length > 0) {
    resumeText += `\n${t('coverLetter.profile.sections.certifications')}:\n`;
    profile.certifications.forEach((cert: string | { name: string; issuer?: string }) => {
      const certName = typeof cert === 'string' ? cert : cert.name;
      resumeText += `- ${certName}\n`;
    });
  }

  if (profile.courses && profile.courses.length > 0) {
    resumeText += `\n${t('coverLetter.profile.sections.courses')}:\n`;
    profile.courses.forEach((course: { name: string; institution?: string; completionDate?: string; duration?: string }) => {
      resumeText += `- ${course.name}`;
      if (course.institution) {
        resumeText += ` - ${course.institution}`;
      }
      if (course.completionDate || course.duration) {
        resumeText += ` (${course.completionDate || ''}${course.duration ? ' • ' + course.duration : ''})`;
      }
      resumeText += '\n';
    });
  }

  return resumeText.trim();
};

export const CoverLetterScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'improve'>('create');
  const [resumeInput, setResumeInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [existingLetter, setExistingLetter] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleGenerate = async () => {
    if (activeTab === 'create' && !resumeInput.trim()) {
      toast.error(t('coverLetter.errors.resumeRequired'));
      return;
    }
    if (activeTab === 'improve' && !existingLetter.trim()) {
      toast.error(t('coverLetter.errors.letterRequired'));
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const { data, error } = await coverLetterSupabase.functions.invoke('generate-cover-letter', {
        body: {
          type: activeTab,
          resumeInput: resumeInput,
          jobDescription: jobDescription,
          existingLetter: existingLetter,
          language: i18n.language,
        },
      });

      if (error) {
        throw new Error(error.message || t('coverLetter.errors.generationError'));
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data.result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('coverLetter.errors.generationError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t('coverLetter.errors.copyError'));
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const pdfBlob = await pdf(<PDFCoverLetter content={result} />).toBlob();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cover_letter_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(t('coverLetter.errors.downloadError'));
    } finally {
      setIsDownloading(false);
    }
  };

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
            toast.warning(
              t('coverLetter.profile.warnings.basicProfile'),
              { autoClose: 8000 }
            );
            return;
          }

          const resumeText = formatProfileAsResume(profileData, t);
          setResumeInput(resumeText);
        } else {
          toast.warning(t('coverLetter.profile.warnings.completeProfile'));
        }
      } else {
        toast.warning(t('coverLetter.profile.warnings.profileNotFound'));
      }
    } catch (error) {
      toast.error(t('analysis.errorLoadingProfile'));
    } finally {
      setLoadingProfile(false);
    }
  }, [currentUser, t]);

  const handleClear = () => {
    setResumeInput('');
    setJobDescription('');
    setExistingLetter('');
    setResult('');
    setCleared(true);
    setTimeout(() => setCleared(false), 600);
  };

  const hasContent = activeTab === 'create'
    ? !!(resumeInput.trim() || jobDescription.trim())
    : !!existingLetter.trim();

  const canGenerate = activeTab === 'create'
    ? !!resumeInput.trim()
    : !!existingLetter.trim();

  return (
    <S.Wrapper>
        <S.PageHeader>
          <S.PageTitle>{t('coverLetter.hero.title')}</S.PageTitle>
          <S.PageSubtitle>{t('coverLetter.hero.subtitle')}</S.PageSubtitle>
        </S.PageHeader>

        <S.ContentWrapper>
          <S.DashboardGrid>
            <HeroSection />

            <S.MainColumn>
              <S.FormPanel>
                <S.FormPanelHeader>
                  <S.FormPanelIcon>
                    <Wand2 size={17} />
                  </S.FormPanelIcon>
                  <S.FormPanelTitleGroup>
                    <h2>
                      {activeTab === 'create'
                        ? t('coverLetter.create.title')
                        : t('coverLetter.improve.title')}
                    </h2>
                    <p>
                      {activeTab === 'create'
                        ? t('coverLetter.create.description')
                        : t('coverLetter.improve.description')}
                    </p>
                  </S.FormPanelTitleGroup>
                  {activeTab === 'create' && (
                    <S.LoadProfileBtn
                      onClick={loadProfile}
                      disabled={loadingProfile || isLoading}
                    >
                      {loadingProfile ? (
                        <>
                          <S.Spinner />
                          {t('resume.loading')}
                        </>
                      ) : (
                        <>
                          <RefreshCw size={13} />
                          {t('resume.reloadFromProfile')}
                        </>
                      )}
                    </S.LoadProfileBtn>
                  )}
                </S.FormPanelHeader>

                <S.TabRow>
                  <S.TabButton
                    type="button"
                    $active={activeTab === 'create'}
                    onClick={() => setActiveTab('create')}
                  >
                    <FileText size={15} />
                    {t('coverLetter.tabs.create')}
                  </S.TabButton>
                  <S.TabButton
                    type="button"
                    $active={activeTab === 'improve'}
                    onClick={() => setActiveTab('improve')}
                  >
                    <Sparkles size={15} />
                    {t('coverLetter.tabs.improve')}
                  </S.TabButton>
                </S.TabRow>

                <S.FormBody $cleared={cleared}>
                  {activeTab === 'create' ? (
                    <S.FormRow>
                      <S.FormGroup>
                        <S.FormLabel>{t('coverLetter.create.resumeLabel')} *</S.FormLabel>
                        <ScrollTextarea
                          placeholder={t('coverLetter.create.resumePlaceholder')}
                          value={resumeInput}
                          onChange={(e) => setResumeInput(e.target.value)}
                        />
                      </S.FormGroup>
                      <S.FormGroup>
                        <S.FormLabel>{t('coverLetter.create.jobDescriptionLabel')}</S.FormLabel>
                        <ScrollTextarea
                          placeholder={t('coverLetter.create.jobDescriptionPlaceholder')}
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                        />
                      </S.FormGroup>
                    </S.FormRow>
                  ) : (
                    <S.FormGroup>
                      <S.FormLabel>{t('coverLetter.improve.letterLabel')} *</S.FormLabel>
                      <ScrollTextarea
                        placeholder={t('coverLetter.improve.letterPlaceholder')}
                        value={existingLetter}
                        onChange={(e) => setExistingLetter(e.target.value)}
                      />
                    </S.FormGroup>
                  )}
                </S.FormBody>

                <S.FormFooter>
                  <S.BtnPrimary
                    onClick={handleGenerate}
                    $disabled={!canGenerate || isLoading}
                    disabled={!canGenerate || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <S.Spinner />
                        {t('coverLetter.actions.processing')}
                      </>
                    ) : (
                      <>
                        <Wand2 size={15} />
                        {activeTab === 'create'
                          ? t('coverLetter.actions.generate')
                          : t('coverLetter.actions.improve')}
                      </>
                    )}
                  </S.BtnPrimary>
                  <S.BtnOutline
                    onClick={handleClear}
                    $disabled={!hasContent && !result}
                    disabled={!hasContent && !result}
                  >
                    <RotateCcw size={14} />
                    {t('coverLetter.actions.clear')}
                  </S.BtnOutline>
                </S.FormFooter>
              </S.FormPanel>

              {result && (
                <S.ResultPanel>
                  <S.ResultHeader>
                    <S.ResultTitleGroup>
                      <h2>
                        {activeTab === 'create'
                          ? t('coverLetter.result.newTitle')
                          : t('coverLetter.result.improvedTitle')}
                      </h2>
                      <p>{t('coverLetter.result.description')}</p>
                    </S.ResultTitleGroup>
                    <S.ResultActions>
                      <S.ActionBtn onClick={handleDownload} disabled={isDownloading}>
                        {isDownloading ? (
                          <>
                            <S.Spinner />
                            {t('coverLetter.actions.processing')}
                          </>
                        ) : (
                          <>
                            <Download />
                            {t('coverLetter.result.download')}
                          </>
                        )}
                      </S.ActionBtn>
                      <S.ActionBtn onClick={handleCopy}>
                        {copied ? (
                          <>
                            <Check />
                            {t('coverLetter.result.copied')}
                          </>
                        ) : (
                          <>
                            <Copy />
                            {t('coverLetter.result.copy')}
                          </>
                        )}
                      </S.ActionBtn>
                    </S.ResultActions>
                  </S.ResultHeader>
                  <S.ResultBody>
                    <S.ResultText>{result}</S.ResultText>
                  </S.ResultBody>
                </S.ResultPanel>
              )}
            </S.MainColumn>
          </S.DashboardGrid>
        </S.ContentWrapper>
    </S.Wrapper>
  );
};
