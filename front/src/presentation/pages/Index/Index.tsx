import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { 
  Loader2, 
  Sparkles, 
  Target, 
  TrendingUp, 
  FileText, 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileCheck, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { pdf } from '@react-pdf/renderer';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Textarea } from '../../components/Textarea';
import { Container, Page } from '../../components/Layout';
import { supabase } from '../../../infrastructure/supabase/client';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import type { UserProfile } from '../../../screens/ProfileScreen/types';
import { PDFDocument } from '../../../components/Resume/PDFDocument';
import type { ResumeData } from '../../../domain/resume/types';

import * as S from './Index.styles';
import type { AnalysisResultProps, IndexPageProps, AnalysisResult, AnalyzedJob } from './types';

function parseResumeTextToResumeData(resumeText: string): ResumeData {
  const lines = resumeText.split('\n');
  const sections: { title: string; content: string[] }[] = [];
  let currentSection: { title: string; content: string[] } | null = null;

  const isHeaderLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (/^#{1,3}\s+/.test(trimmed)) return true;
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && /[A-Z]/.test(trimmed) && !trimmed.includes('@') && !trimmed.includes('http')) return true;
    if (trimmed.endsWith(':') && !trimmed.includes('@') && !trimmed.includes('http') && trimmed.length < 60 && trimmed.length > 3) return true;
    if (/^(RESUMO|EXPERIÊNCIA|FORMAÇÃO|EDUCAÇÃO|IDIOMAS|CERTIFICAÇÕES|CERTIFICACOES|CURSOS|COMPETÊNCIAS|COMPETENCIAS|HABILIDADES|TECNOLOGIAS|PRINCIPAIS)\s*(PROFISSIONAL|PROFISSIONAIS|ACADÊMICA|ACADEMICA|TÉCNICAS|TECNICAS|E TREINAMENTOS)?:?$/i.test(trimmed)) return true;
    return false;
  };

  const extractHeaderTitle = (line: string): string => {
    return line.trim().replace(/^#{1,3}\s+/, '').replace(/:$/, '').trim();
  };

  const name = lines[0] ? lines[0].trim() : '';
  let role = '';
  
  for (let i = 1; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (isHeaderLine(line)) {
      break;
    }
    if (!role && !line.includes('@') && !line.includes('http') && !line.match(/^\d/) && !line.includes('•')) {
      role = line;
      break;
    }
  }

  const contact: ResumeData['contact'] = {
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    location: '',
  };

  for (let i = 1; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (isHeaderLine(line)) break;
    
    if (!contact.email) {
      const lineEmailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (lineEmailMatch) {
        contact.email = lineEmailMatch[0];
        console.log('Found email in line:', lineEmailMatch[0], 'from line:', line);
      }
    }
    
    const parts = line.split(/[•|]/).map(p => p.trim()).filter(p => p);
    
    parts.forEach(part => {
      if (!part || part === 'undefined' || part === 'null') return;
      
      const emailMatch = part.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch && !contact.email) {
        contact.email = emailMatch[0];
      }
      else if ((part.match(/\(\d{2}\)/) || part.match(/^\+?\d[\d\s-]{7,}/)) && !contact.phone) {
        contact.phone = part;
      }
      else if (part.toLowerCase().includes('linkedin')) {
        contact.linkedin = part.replace(/^LinkedIn:\s*/i, '');
      }
      else if (part.toLowerCase().includes('github')) {
        contact.github = part.replace(/^GitHub:\s*/i, '');
      }
      else if (!contact.location && !part.includes('@') && !part.includes('http') && !part.match(/^\d+$/) && part.length < 50) {
        const jobTitlePatterns = /engineer|developer|specialist|manager|analyst|designer|architect|lead|senior|junior|full\s*stack|front\s*end|back\s*end|solutions|software|data|product|project|devops|sre|qa|tech/i;
        if (jobTitlePatterns.test(part)) {
          return;
        }
        const locationPatterns = /[A-Z]{2}$|,|\b(cidade|city|estado|state|brasil|brazil|sp|rj|mg|es|pr|sc|rs|ba|pe|ce|df|go|mt|ms|pa|am|ma|pb|rn|al|se|pi|to|ro|ac|ap|rr)\b/i;
        if (locationPatterns.test(part)) {
          contact.location = part;
        }
      }
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (isHeaderLine(line)) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: extractHeaderTitle(line), content: [] };
    } else if (currentSection) {
      if (!/^-+$/.test(line) && !/^_+$/.test(line)) {
        currentSection.content.push(line);
      }
    }
  }
  if (currentSection) sections.push(currentSection);

  const isSummarySection = (title: string) =>
    /resumo|sobre|perfil|summary|about/i.test(title);

  const isSkillsSection = (title: string) => {
    const t = title.toLowerCase();
    return t.includes('competência') || t.includes('competencia') || t.includes('skills') || t.includes('tecnologia') || t.includes('habilidade') || t.includes('principais');
  };

  const isExperienceSection = (title: string) => {
    const t = title.toLowerCase();
    return t.includes('experiência') || t.includes('experiencia') || t.includes('experience');
  };

  const isEducationSection = (title: string) => {
    const t = title.toLowerCase();
    return t.includes('formação') || t.includes('formacao') || t.includes('educação') || t.includes('educacao') || t.includes('education') || t.includes('acadêmic') || t.includes('academic');
  };

  const isLanguageSection = (title: string) =>
    /idioma|language/i.test(title);

  const isCertificationSection = (title: string) => {
    const t = title.toLowerCase();
    return t.includes('certificaç') || t.includes('certificac') || t.includes('certification') || t.includes('licença') || t.includes('license');
  };

  const isCourseSection = (title: string) => {
    const t = title.toLowerCase();
    return t.includes('curso') || t.includes('treinamento') || t.includes('course') || t.includes('training');
  };

  let summary = '';
  const skills: ResumeData['skills'] = [];
  const experiences: ResumeData['experiences'] = [];
  const education: ResumeData['education'] = [];
  const languages: ResumeData['languages'] = [];
  const certifications: ResumeData['certifications'] = [];
  const courses: ResumeData['courses'] = [];

  sections.forEach((section) => {
    if (isSummarySection(section.title)) {
      summary = section.content.join(' ').trim();
    } else if (isSkillsSection(section.title)) {
      const allContent = section.content.join('\n');
      const skillList = allContent.split(/[,|•;\n]/).map(s => s.replace(/^[-•]\s*/, '').trim()).filter(s => s && s.length > 0);
      skillList.forEach((skill, index) => {
        const cleanSkill = skill.replace(/\s*\([^)]*\)\s*$/, '').trim();
        if (cleanSkill && !skills.find(s => s.name === cleanSkill)) {
          skills.push({ id: `skill-${index}`, name: cleanSkill });
        }
      });
    } else if (isExperienceSection(section.title)) {
      let currentExp: Partial<ResumeData['experiences'][0]> = {};
      let descriptionLines: string[] = [];
      
      section.content.forEach((line, idx) => {
        const isSubHeader = /^##\s+/.test(line);
        const cleanLine = line.replace(/^##\s+/, '').trim();
        
        const hasDate = /\d{2}\/\d{4}|\d{4}|presente|atual|present/i.test(cleanLine);
        const isDateLine = hasDate && cleanLine.length < 80;
        const isLocationLine = /remoto|remote|presencial|híbrido|hybrid/i.test(cleanLine.toLowerCase()) && cleanLine.length < 50;
        
        if (isSubHeader || (idx === 0 && !hasDate)) {
          if (currentExp.company || currentExp.position) {
            currentExp.description = descriptionLines.join('\n').trim();
            experiences.push({
              id: `exp-${experiences.length}`,
              company: currentExp.company || '',
              position: currentExp.position || '',
              startDate: currentExp.startDate || '',
              endDate: currentExp.endDate || '',
              current: currentExp.current || false,
              description: currentExp.description || '',
              location: currentExp.location || '',
            });
            currentExp = {};
            descriptionLines = [];
          }
          currentExp.company = cleanLine;
        } else if (!currentExp.position && !isDateLine && !isLocationLine && cleanLine.length < 80) {
          currentExp.position = cleanLine;
        } else if (isDateLine) {
          const dateMatch = cleanLine.match(/(.+?)\s*[-–]\s*(.+)/);
          if (dateMatch) {
            currentExp.startDate = dateMatch[1].trim().replace(/\s*\([^)]*\)/, '');
            const endPart = dateMatch[2].trim().toLowerCase();
            currentExp.current = /atual|presente|present/i.test(endPart);
            currentExp.endDate = currentExp.current ? '' : dateMatch[2].trim().replace(/\s*\([^)]*\)/, '');
          }
        } else if (isLocationLine) {
          currentExp.location = cleanLine;
        } else if (cleanLine.length > 0) {
          descriptionLines.push(cleanLine);
        }
      });
      
      if (currentExp.company || currentExp.position) {
        currentExp.description = descriptionLines.join('\n').trim();
        experiences.push({
          id: `exp-${experiences.length}`,
          company: currentExp.company || '',
          position: currentExp.position || '',
          startDate: currentExp.startDate || '',
          endDate: currentExp.endDate || '',
          current: currentExp.current || false,
          description: currentExp.description || '',
          location: currentExp.location || '',
        });
      }
    } else if (isEducationSection(section.title)) {
      let currentEdu: Partial<ResumeData['education'][0]> = {};
      let descriptionLines: string[] = [];
      
      section.content.forEach((line) => {
        const isSubHeader = /^#{2,3}\s+/.test(line);
        const cleanLine = line.replace(/^#{2,3}\s+/, '').trim();
        const hasDate = /\d{2}\/\d{4}|\d{4}/i.test(cleanLine);
        
        if (isSubHeader) {
          if (currentEdu.institution) {
            currentEdu.description = descriptionLines.join('\n').trim();
            education.push({
              id: `edu-${education.length}`,
              institution: currentEdu.institution || '',
              degree: currentEdu.degree || '',
              field: currentEdu.field || '',
              startDate: currentEdu.startDate || '',
              endDate: currentEdu.endDate || '',
              description: currentEdu.description || '',
            });
            currentEdu = {};
            descriptionLines = [];
          }
          currentEdu.institution = cleanLine;
        } else if (!currentEdu.institution && cleanLine.length < 100 && !hasDate) {
          currentEdu.institution = cleanLine;
        } else if (!currentEdu.degree) {
          const combinedMatch = cleanLine.match(/^(.+?)\s*[-–·]\s*\((.+?)\s*[-–]\s*(.+?)\)$/);
          if (combinedMatch) {
            const degreeField = combinedMatch[1].trim();
            if (degreeField.includes(',')) {
              const parts = degreeField.split(',');
              currentEdu.degree = parts[0].trim();
              currentEdu.field = parts.slice(1).join(',').trim();
            } else if (degreeField.includes(' em ')) {
              const parts = degreeField.split(' em ');
              currentEdu.degree = parts[0].trim();
              currentEdu.field = parts[1]?.trim() || '';
            } else {
              currentEdu.degree = degreeField;
            }
            currentEdu.startDate = combinedMatch[2].trim();
            currentEdu.endDate = combinedMatch[3].trim();
          } else if (cleanLine.includes(' em ')) {
            const parts = cleanLine.split(' em ');
            currentEdu.degree = parts[0].trim();
            currentEdu.field = parts[1]?.trim() || '';
          } else if (!hasDate && cleanLine.length < 80) {
            if (cleanLine.includes(',')) {
              const parts = cleanLine.split(',');
              currentEdu.degree = parts[0].trim();
              currentEdu.field = parts.slice(1).join(',').trim();
            } else {
              currentEdu.degree = cleanLine;
            }
          }
        } else if (hasDate && !currentEdu.startDate) {
          const dateMatch = cleanLine.match(/\(?\s*(.+?)\s*[-–]\s*(.+?)\s*\)?$/);
          if (dateMatch) {
            currentEdu.startDate = dateMatch[1].trim();
            currentEdu.endDate = dateMatch[2].trim();
          }
        } else if (cleanLine.length > 0) {
          descriptionLines.push(cleanLine);
        }
      });
      
      if (currentEdu.institution) {
        currentEdu.description = descriptionLines.join('\n').trim();
        education.push({
          id: `edu-${education.length}`,
          institution: currentEdu.institution || '',
          degree: currentEdu.degree || '',
          field: currentEdu.field || '',
          startDate: currentEdu.startDate || '',
          endDate: currentEdu.endDate || '',
          description: currentEdu.description || '',
        });
      }
    } else if (isLanguageSection(section.title)) {
      const levelMap: Record<string, string> = {
        'beginner': 'Básico',
        'basic': 'Básico',
        'elementary': 'Básico',
        'intermediate': 'Intermediário',
        'upper intermediate': 'Intermediário Avançado',
        'advanced': 'Avançado',
        'fluent': 'Fluente',
        'proficient': 'Profissional',
        'professional': 'Profissional',
        'native': 'Nativo',
        'native speaker': 'Nativo',
      };
      
      section.content.forEach((line, index) => {
        const cleanLine = line.replace(/^[-•]\s*/, '').trim();
        if (!cleanLine) return;
        
        const match = cleanLine.match(/^(.+?)\s*[:\-–(]\s*(.+?)\)?$/);
        if (match) {
          const rawLevel = match[2].replace(/\)$/, '').trim();
          const normalizedLevel = levelMap[rawLevel.toLowerCase()] || rawLevel;
          languages.push({
            id: `lang-${index}`,
            name: match[1].trim(),
            level: normalizedLevel,
          });
        } else {
          languages.push({
            id: `lang-${index}`,
            name: cleanLine,
            level: '',
          });
        }
      });
    } else if (isCertificationSection(section.title)) {
      section.content.forEach((line, index) => {
        const cleanLine = line.replace(/^[-•]\s*/, '').trim();
        if (cleanLine && cleanLine.length > 0) {
          certifications.push({
            id: `cert-${index}`,
            name: cleanLine,
          });
        }
      });
    } else if (isCourseSection(section.title)) {
      let currentCourse: Partial<ResumeData['courses'][0]> = {};
      
      section.content.forEach((line) => {
        const isSubHeader = /^#{2,3}\s+/.test(line);
        const cleanLine = line.replace(/^#{2,3}\s+/, '').replace(/^[-•]\s*/, '').trim();
        if (!cleanLine) return;
        
        const hasDate = /\d{2}\/\d{4}|\d{4}|horas?/i.test(cleanLine);
        
        if (isSubHeader) {
          if (currentCourse.name) {
            courses.push({
              id: `course-${courses.length}`,
              name: currentCourse.name || '',
              institution: currentCourse.institution || '',
              completionDate: currentCourse.completionDate || '',
              duration: currentCourse.duration || '',
            });
            currentCourse = {};
          }
          currentCourse.name = cleanLine;
        } else if (!currentCourse.name) {
          currentCourse.name = cleanLine;
        } else if (!currentCourse.institution && !hasDate) {
          currentCourse.institution = cleanLine;
        } else if (hasDate) {
          if (cleanLine.includes('•')) {
            const parts = cleanLine.split('•');
            currentCourse.completionDate = parts[0].trim();
            currentCourse.duration = parts[1]?.trim() || '';
          } else {
            currentCourse.completionDate = cleanLine;
          }
          
          if (currentCourse.name) {
            courses.push({
              id: `course-${courses.length}`,
              name: currentCourse.name || '',
              institution: currentCourse.institution || '',
              completionDate: currentCourse.completionDate || '',
              duration: currentCourse.duration || '',
            });
            currentCourse = {};
          }
        }
      });
      
      if (currentCourse.name) {
        courses.push({
          id: `course-${courses.length}`,
          name: currentCourse.name || '',
          institution: currentCourse.institution || '',
          completionDate: currentCourse.completionDate || '',
          duration: currentCourse.duration || '',
        });
      }
    }
  });

  const cleanContact = {
    email: contact.email && contact.email !== 'undefined' && contact.email !== 'null' ? contact.email : '',
    phone: contact.phone && contact.phone !== 'undefined' && contact.phone !== 'null' ? contact.phone : '',
    linkedin: contact.linkedin && contact.linkedin !== 'undefined' && contact.linkedin !== 'null' ? contact.linkedin : '',
    github: contact.github && contact.github !== 'undefined' && contact.github !== 'null' ? contact.github : '',
    location: contact.location && contact.location !== 'undefined' && contact.location !== 'null' ? contact.location : '',
  };

  return {
    name: name && name !== 'undefined' ? name : '',
    title: role && role !== 'undefined' ? role : '',
    summary,
    contact: cleanContact,
    skills,
    languages,
    certifications,
    courses,
    experiences,
    education,
  };
}

function mergeResumeData(optimized: ResumeData, original: ResumeData): ResumeData {
  return {
    name: original.name || optimized.name,
    title: original.title || optimized.title,
    summary: optimized.summary || original.summary,
    contact: {
      email: original.contact.email || optimized.contact.email,
      phone: original.contact.phone || optimized.contact.phone,
      linkedin: original.contact.linkedin || optimized.contact.linkedin,
      github: original.contact.github || optimized.contact.github,
      location: original.contact.location || optimized.contact.location,
    },
    skills: original.skills.length > 0 ? original.skills : optimized.skills,
    languages: original.languages.length > 0 ? original.languages : optimized.languages,
    certifications: original.certifications.length > 0 ? original.certifications : optimized.certifications,
    courses: original.courses.length > 0 ? original.courses : optimized.courses,
    experiences: original.experiences.length > 0 
      ? original.experiences.map((exp, idx) => {
          const optimizedExp = optimized.experiences[idx];
          return {
            ...exp,
            description: (optimizedExp?.description && optimizedExp.description.length > exp.description.length)
              ? optimizedExp.description
              : exp.description,
          };
        })
      : optimized.experiences,
    education: original.education.length > 0 ? original.education : optimized.education,
  };
}

function hashJobDescription(jobDescription: string): string {
  let hash = 0;
  const str = jobDescription.trim().toLowerCase();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score <= 40) return 'error';
    if (score <= 70) return 'warning';
    return 'success';
  };

  const color = getScoreColor(score);
  const strokeColor = color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : '#ef4444';
  const textColor = color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : '#ef4444';

  return (
    <S.ScoreContainer>
      <svg 
        viewBox="0 0 100 100" 
        style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${score * 2.83} 283`}
          style={{ transition: 'stroke-dasharray 1s ease-out' }}
        />
      </svg>
      <S.ScoreText $color={textColor}>
        {score}%
      </S.ScoreText>
    </S.ScoreContainer>
  );
};

const AnalysisResultComponent: React.FC<AnalysisResultProps> = ({
  result,
  onApplySuggestions,
  onBack,
  onDownloadResume,
  canApplySuggestions,
  isMaxScore,
}) => {
  const getCompatibilityIcon = () => {
    switch (result.compatibility) {
      case 'high':
        return <CheckCircle2 style={{ color: '#10b981' }} />;
      case 'medium':
        return <AlertTriangle style={{ color: '#f59e0b' }} />;
      case 'low':
        return <XCircle style={{ color: '#ef4444' }} />;
    }
  };

  const { t } = useTranslation();
  
  const getCompatibilityLabel = () => {
    switch (result.compatibility) {
      case 'high':
        return t('analysis.highCompatibility');
      case 'medium':
        return t('analysis.mediumCompatibility');
      case 'low':
        return t('analysis.lowCompatibility');
    }
  };

  return (
    <Page>
      <Container>
        <S.ResultContainer>
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            style={{ marginBottom: '1.5rem' }}
          >
            <ArrowLeft size={16} />
            {t('common.back')}
          </Button>

          <S.ResultHeader>
            <ScoreCircle score={result.score} />
            
            <S.CompatibilityBadge $variant={result.compatibility}>
              {getCompatibilityIcon()}
              <span>{getCompatibilityLabel()}</span>
            </S.CompatibilityBadge>

            {isMaxScore && (
              <S.MaxScoreBadge>
                <span>{t('analysis.bestScore')}</span>
              </S.MaxScoreBadge>
            )}
          </S.ResultHeader>

          <Card style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <S.CardSectionTitle>{t('analysis.title')}</S.CardSectionTitle>
            <S.CardSectionText>{result.analysis}</S.CardSectionText>
          </Card>

          <Card style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <S.CardSectionTitle>{t('analysis.recommendation')}</S.CardSectionTitle>
            <S.CardSectionText $isError={result.compatibility === 'low'}>
              {result.recommendation}
            </S.CardSectionText>
          </Card>

          {result.suggestions.length > 0 && (
            <Card style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <S.CardSectionTitle style={{ marginBottom: '1rem' }}>{t('analysis.suggestions')}</S.CardSectionTitle>
              <S.SuggestionsList>
                {result.suggestions.map((suggestion, index) => (
                  <S.SuggestionItem key={index}>
                    <S.SuggestionNumber>{index + 1}</S.SuggestionNumber>
                    <S.SuggestionText>{suggestion}</S.SuggestionText>
                  </S.SuggestionItem>
                ))}
              </S.SuggestionsList>
            </Card>
          )}

          {canApplySuggestions && result.improvedResume && result.compatibility !== 'low' && (
            <Button
              onClick={onApplySuggestions}
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
            >
              {t('analysis.applySuggestions')}
            </Button>
          )}

          {isMaxScore && (
            <Button
              onClick={onDownloadResume}
              variant="outline"
              size="lg"
              style={{ width: '100%', marginTop: canApplySuggestions ? '0.75rem' : 0 }}
            >
              <Download size={20} />
              {t('analysis.downloadOptimized')}
            </Button>
          )}
        </S.ResultContainer>
      </Container>
    </Page>
  );
};

const formatProfileAsResume = (profile: UserProfile, t: (key: string) => string): string => {
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
          resumeText += ` - ${edu.fieldOfStudy}`;
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
      const proficiency = t(`coverLetter.profile.proficiency.${lang.proficiency}`) || lang.proficiency;
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

export const IndexPage: React.FC<IndexPageProps> = ({ onShowResultChange }) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const location = useLocation();
  const [resume, setResume] = useState('');
  const [originalResume, setOriginalResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedJobs, setAnalyzedJobs] = useState<Map<string, AnalyzedJob>>(new Map());
  const [showResult, setShowResultState] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const state = location.state as { 
      optimizedResume?: string; 
      fromResults?: boolean;
      clearJobDescription?: boolean;
    } | null;
    
    if (state?.optimizedResume && state?.fromResults) {
      setResume(state.optimizedResume);
      setOriginalResume(state.optimizedResume);
      window.history.replaceState({}, document.title);
    }
    
    if (state?.clearJobDescription) {
      setJobDescription('');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, t]);

  const setShowResult = useCallback((value: boolean) => {
    setShowResultState(value);
    onShowResultChange?.(value);
  }, [onShowResultChange]);

  const currentJobHash = jobDescription ? hashJobDescription(jobDescription) : '';
  const currentAnalyzedJob = analyzedJobs.get(currentJobHash);
  const isReanalysis = currentAnalyzedJob?.suggestionsApplied === true;

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
              t('analysis.basicProfileAnalysis'),
              { autoClose: 8000 }
            );
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

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data);
      setShowResult(true);

      if (isReanalysis) {
        setAnalyzedJobs(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(currentJobHash);
          if (existing) {
            newMap.set(currentJobHash, {
              ...existing,
              score: data.score,
            });
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
  }, [resume, jobDescription, isReanalysis, currentJobHash, setShowResult, t]);

  const applySuggestions = useCallback(() => {
    if (!analysisResult?.improvedResume) {
      console.warn('applySuggestions: improvedResume não disponível', { analysisResult });
      toast.error(t('analysis.noOptimizedResume'));
      return;
    }
    
    if (!currentJobHash) {
      console.warn('applySuggestions: jobDescription não disponível');
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
    setShowResult(false);
    setAnalysisResult(null);
    
  }, [analysisResult, currentJobHash, setShowResult, t]);

  const goBack = useCallback(() => {
    setShowResult(false);
  }, [setShowResult]);

  const canApplySuggestions = !currentAnalyzedJob?.suggestionsApplied;
  const isMaxScore = isReanalysis;

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
        console.log('Original data:', {
          email: originalData.contact.email,
          location: originalData.contact.location,
          certifications: originalData.certifications.length,
          education: originalData.education.map(e => ({ institution: e.institution, degree: e.degree, description: e.description?.substring(0, 50) }))
        });
        finalResumeData = mergeResumeData(currentData, originalData);
        console.log('Merged data:', {
          email: finalResumeData.contact.email,
          location: finalResumeData.contact.location,
          certifications: finalResumeData.certifications.length
        });
      } else {
        console.log('Using current data (no merge). Email:', currentData.contact.email, 'Certifications:', currentData.certifications.length);
        console.log('originalResume exists:', !!originalResume, 'same as current:', originalResume === resumeToDownload);
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

  if (showResult && analysisResult) {
    return (
      <AnalysisResultComponent
        result={analysisResult}
        onApplySuggestions={applySuggestions}
        onBack={goBack}
        onDownloadResume={handleDownloadOptimizedResume}
        canApplySuggestions={canApplySuggestions}
        isMaxScore={isMaxScore}
      />
    );
  }

  return (
    <Page>
      <S.Hero>
        <Container>
          <S.HeroTitle>{t('home.heroTitle')}</S.HeroTitle>
          <S.HeroSubtitle>{t('home.heroSubtitle')}</S.HeroSubtitle>
        </Container>
      </S.Hero>

      <S.FeaturesSection>
        <Container>
          <S.FeaturesGrid>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Target />
              </S.FeatureIcon>
              <S.FeatureTitle>{t('features.matchScore')}</S.FeatureTitle>
              <S.FeatureDescription>
                {t('features.matchScoreDesc')}
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Sparkles />
              </S.FeatureIcon>
              <S.FeatureTitle>{t('features.keywords')}</S.FeatureTitle>
              <S.FeatureDescription>
                {t('features.keywordsDesc')}
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <TrendingUp />
              </S.FeatureIcon>
              <S.FeatureTitle>{t('features.aiSuggestions')}</S.FeatureTitle>
              <S.FeatureDescription>
                {t('features.aiSuggestionsDesc')}
              </S.FeatureDescription>
            </S.FeatureCard>
          </S.FeaturesGrid>
        </Container>
      </S.FeaturesSection>

      <S.MainContent>
        <Container>
          <S.CardsGrid>
            <Card style={{ padding: '1.5rem' }}>
              <S.CardHeader>
                <S.CardTitleRow>
                  <S.CardIcon>
                    <FileText size={20} />
                  </S.CardIcon>
                  <S.CardTitle>{t('resume.title')}</S.CardTitle>
                </S.CardTitleRow>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadProfile}
                  disabled={loadingProfile || isAnalyzing}
                >
                  {loadingProfile ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      {t('resume.loading')}
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      {t('resume.reloadFromProfile')}
                    </>
                  )}
                </Button>
              </S.CardHeader>
              <Textarea
                placeholder={t('resume.placeholder')}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                rows={12}
                disabled={isAnalyzing}
              />
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <S.CardHeader>
                <S.CardTitleRow>
                  <S.CardIcon>
                    <Briefcase size={20} />
                  </S.CardIcon>
                  <S.CardTitle>{t('job.title')}</S.CardTitle>
                </S.CardTitleRow>
              </S.CardHeader>
              <Textarea
                placeholder={t('job.placeholder')}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                disabled={isAnalyzing}
              />
            </Card>
          </S.CardsGrid>

          <S.ActionButtons>
            {currentAnalyzedJob && (
              <S.AnalysisStatus>
                {currentAnalyzedJob.suggestionsApplied ? (
                  <S.AnalysisStatusHighlight>
                    <FileCheck size={16} />
                    {t('analysis.suggestionsApplied', { score: currentAnalyzedJob.score })}
                  </S.AnalysisStatusHighlight>
                ) : (
                  <span>{t('analysis.lastAnalysis', { score: currentAnalyzedJob.score })}</span>
                )}
              </S.AnalysisStatus>
            )}

            <Button
              onClick={analyzeResume}
              disabled={isAnalyzing || !resume.trim() || !jobDescription.trim()}
              variant="primary"
              size="lg"
              style={{ minWidth: '300px' }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  {t('analysis.analyzing')}
                </>
              ) : (
                <>
                  {t('analysis.analyze')}
                </>
              )}
            </Button>
          </S.ActionButtons>
        </Container>
      </S.MainContent>
    </Page>
  );
};
