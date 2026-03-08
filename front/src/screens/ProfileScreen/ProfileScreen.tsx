import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  UserCircle,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Linkedin,
  Github,
  Download,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  Pin,
  Lightbulb,
  AlertTriangle,
  Check,
  Users,
  Key,
  Gift,
} from 'lucide-react';
import { detectRegion } from '../../utils/regionDetector';
import { useProfileScreen } from './useProfileScreen';
import { useResumeEditor } from '../../hooks/useResumeEditor';
import { useAuth } from '../../contexts/AuthContext';
import { CancelSubscriptionDialog } from '../../components/CancelSubscriptionDialog';
import { ReferralComponent } from '../../components/Referral/ReferralComponent';
import { CreateUserForm } from '../../components/Admin/CreateUserForm';
import {
  FoxLogoWrapper,
  OrbitRing,
  OrbitRingInner,
  FoxOutline,
  FoxMask,
  FoxDetail,
  LoadingBarTrack,
  LoadingBarShine,
  LoadingText,
  Dot,
} from '../../components/ProtectedRoute/styles';
import { toast } from 'react-toastify';
import type {
  ResumeData,
  ResumeExperience,
  ResumeEducation,
  ResumeSkill,
  ResumeLanguage,
  ResumeCertification,
  ResumeCourse,
} from '../../domain/resume/types';
import { ScrollTextarea } from './ScrollTextarea';
import { AnimatedHeight } from './AnimatedHeight';
import * as S from './styles';

type TabId = 'contato' | 'resumo' | 'experiencia' | 'formacao' | 'habilidades' | 'idiomas' | 'admin';

const ADMIN_EMAILS = ['josanjohnata@gmail.com', 'edhurabelo@gmail.com'];

const TABS: { id: TabId; icon: React.FC<{ size?: number }>; labelKey: string; fallback: string; adminOnly?: boolean }[] = [
  { id: 'contato', icon: UserCircle, labelKey: 'profile.tabs.contact', fallback: 'Contato' },
  { id: 'resumo', icon: FileText, labelKey: 'profile.tabs.summary', fallback: 'Resumo' },
  { id: 'experiencia', icon: Briefcase, labelKey: 'profile.tabs.experience', fallback: 'Experiência' },
  { id: 'formacao', icon: GraduationCap, labelKey: 'profile.tabs.education', fallback: 'Formação' },
  { id: 'habilidades', icon: Code, labelKey: 'profile.tabs.skills', fallback: 'Habilidades' },
  { id: 'idiomas', icon: Globe, labelKey: 'profile.tabs.languages', fallback: 'Idiomas' },
  { id: 'admin', icon: Users, labelKey: 'profile.tabs.admin', fallback: 'Criar Usuários', adminOnly: true },
];

/* =============================================
   DATE / PHONE UTILITIES
   ============================================= */

const formatDateInput = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 6)}`;
};

const convertToISODate = (formattedDate: string): string => {
  if (!formattedDate || formattedDate.length < 7) return '';
  const [month, year] = formattedDate.split('/');
  if (!month || !year || month.length !== 2 || year.length !== 4) return '';
  return `${year}-${month}`;
};

const convertFromISODate = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month] = isoDate.split('-');
  if (!year || !month) return '';
  return `${month}/${year}`;
};

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

/* =============================================
   COMPONENT
   ============================================= */

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const {
    currentUser,
    profile,
    loading,
    saving,
    message,
    isFirstAccess,
    isImporting,
    handleSubmitResumeData,
    handleImportFromLinkedIn,
    dismissMessage,
    isEditing,
    handleEdit,
    handleCancelEdit,
  } = useProfileScreen();

  const {
    resumeData,
    setResumeData,
    downloadPDF,
    isGeneratingPDF,
  } = useResumeEditor({
    profile,
    userEmail: currentUser?.email || undefined,
  });

  const [activeTab, setActiveTab] = useState<TabId>('contato');

  /* ---- referral panel tabs ---- */
  type ReferralTabId = 'indicacao' | 'metricas' | 'pix';
  const [referralTab, setReferralTab] = useState<ReferralTabId>('indicacao');
  const isBR = useMemo(() => detectRegion() === 'BR', []);
  const isAdmin = useMemo(() => currentUser?.email && ADMIN_EMAILS.includes(currentUser.email), [currentUser]);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showLinkedInDialog, setShowLinkedInDialog] = useState(false);
  const [linkedInURL, setLinkedInURL] = useState('');
  const [analysisInfo, setAnalysisInfo] = useState<{
    palavrasChave?: string[];
    sugestoes?: string[];
  } | null>(null);
  const [dateInputs, setDateInputs] = useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    const analysisData = location.state?.analysisData;
    if (analysisData) {
      setAnalysisInfo({
        palavrasChave: analysisData.palavrasChave,
        sugestoes: analysisData.sugestoes,
      });
    }
  }, [location.state]);

  /* ---- helpers ---- */

  const getAvatarURL = () => {
    // Priorizar foto do profile (que vem do LinkedIn)
    if (profile?.photoURL) {
      // Verificar se a URL é válida e não está vazia
      const photoURL = profile.photoURL.trim();
      if (photoURL && (photoURL.startsWith('http://') || photoURL.startsWith('https://'))) {
        return photoURL;
      }
    }
    // Fallback para foto do Firebase Auth
    if (currentUser?.photoURL) {
      const photoURL = currentUser.photoURL.trim();
      if (photoURL && (photoURL.startsWith('http://') || photoURL.startsWith('https://'))) {
        return photoURL;
      }
    }
    // Fallback para avatar gerado
    const name = resumeData.name || currentUser?.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=FF5500&color=fff&bold=true`;
  };

  const updateField = useCallback(
    <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
      setResumeData({ ...resumeData, [field]: value });
    },
    [resumeData, setResumeData],
  );

  const updateContact = useCallback(
    (field: keyof ResumeData['contact'], value: string) => {
      setResumeData({
        ...resumeData,
        contact: { ...resumeData.contact, [field]: value },
      });
    },
    [resumeData, setResumeData],
  );

  const getDateValue = (key: string, isoValue: string) => {
    if (dateInputs[key] !== undefined) return dateInputs[key];
    return convertFromISODate(isoValue);
  };

  const handleDateChange = (key: string, value: string, setter: (iso: string) => void) => {
    const formatted = formatDateInput(value);
    setDateInputs((prev) => ({ ...prev, [key]: formatted }));
    const iso = convertToISODate(formatted);
    if (iso) setter(iso);
  };

  const handleDateBlur = (key: string) => {
    setDateInputs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  /* ---- Experience CRUD ---- */

  const addExperience = () => {
    const newItem: ResumeExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    };
    updateField('experiences', [...resumeData.experiences, newItem]);
  };

  const updateExperience = (id: string, field: keyof ResumeExperience, value: string | boolean) => {
    updateField(
      'experiences',
      resumeData.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    );
  };

  const removeExperience = (id: string) => {
    updateField(
      'experiences',
      resumeData.experiences.filter((exp) => exp.id !== id),
    );
  };

  /* ---- Education CRUD ---- */

  const addEducation = () => {
    const newItem: ResumeEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    updateField('education', [...resumeData.education, newItem]);
  };

  const updateEducation = (id: string, field: keyof ResumeEducation, value: string) => {
    updateField(
      'education',
      resumeData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    );
  };

  const removeEducation = (id: string) => {
    updateField(
      'education',
      resumeData.education.filter((edu) => edu.id !== id),
    );
  };

  /* ---- Skills CRUD ---- */

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const item: ResumeSkill = { id: Date.now().toString(), name: newSkill.trim() };
    updateField('skills', [...resumeData.skills, item]);
    setNewSkill('');
  };

  const removeSkill = (id: string) => {
    updateField(
      'skills',
      resumeData.skills.filter((s) => s.id !== id),
    );
  };

  /* ---- Certifications CRUD ---- */

  const addCertification = () => {
    if (!newCertification.trim()) return;
    const item: ResumeCertification = { id: Date.now().toString(), name: newCertification.trim() };
    updateField('certifications', [...resumeData.certifications, item]);
    setNewCertification('');
  };

  const removeCertification = (id: string) => {
    updateField(
      'certifications',
      resumeData.certifications.filter((c) => c.id !== id),
    );
  };

  /* ---- Courses CRUD ---- */

  const addCourse = () => {
    const newItem: ResumeCourse = {
      id: Date.now().toString(),
      name: '',
      institution: '',
      completionDate: '',
      duration: '',
    };
    updateField('courses', [...resumeData.courses, newItem]);
  };

  const updateCourse = (id: string, field: keyof ResumeCourse, value: string) => {
    updateField(
      'courses',
      resumeData.courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const removeCourse = (id: string) => {
    updateField(
      'courses',
      resumeData.courses.filter((c) => c.id !== id),
    );
  };

  /* ---- Languages CRUD ---- */

  const addLanguage = () => {
    const newItem: ResumeLanguage = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediário',
    };
    updateField('languages', [...resumeData.languages, newItem]);
  };

  const updateLanguage = (id: string, field: keyof ResumeLanguage, value: string) => {
    updateField(
      'languages',
      resumeData.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  const removeLanguage = (id: string) => {
    updateField(
      'languages',
      resumeData.languages.filter((l) => l.id !== id),
    );
  };

  /* ---- Save / Download ---- */

  const handleSaveResume = async () => {
    if (!isEditing) return;

    const requiredChecks: { value: string; tabId: TabId }[] = [
      { value: resumeData.name, tabId: 'contato' },
      { value: resumeData.title, tabId: 'contato' },
      { value: resumeData.contact.email, tabId: 'contato' },
      { value: resumeData.contact.phone, tabId: 'contato' },
      { value: resumeData.summary, tabId: 'resumo' },
    ];

    const firstMissing = requiredChecks.find((c) => !c.value?.trim());
    if (firstMissing) {
      toast.error(t('profile.fillRequiredFields', 'Preencha todos os campos obrigatórios.'));
      setActiveTab(firstMissing.tabId);
      return;
    }

    await handleSubmitResumeData(resumeData);
  };

  const handleDownloadPDFClick = async () => {
    const requiredChecks = [
      resumeData.name,
      resumeData.title,
      resumeData.contact.email,
      resumeData.contact.phone,
      resumeData.summary,
    ];

    if (requiredChecks.some((v) => !v?.trim())) {
      toast.error(t('profile.fillRequiredFieldsBeforeDownload', 'Preencha os campos obrigatórios antes de baixar o PDF.'));
      return;
    }

    try {
      await downloadPDF();
    } catch {
      toast.error(t('profile.pdfError', 'Erro ao gerar o PDF.'));
    }
  };

  const handleLinkedInImport = async () => {
    if (!linkedInURL.trim()) {
      toast.error(t('profile.linkedinImportError'));
      return;
    }
    await handleImportFromLinkedIn(linkedInURL);
    setShowLinkedInDialog(false);
    setLinkedInURL('');
  };

  /* =============================================
     TAB RENDERERS
     ============================================= */

  const renderContatoTab = () => (
    <>
      <S.FormRow>
        <S.FormGroup>
          <S.FormLabel>
            {t('resumeForm.fullName', 'Nome Completo')} <S.RequiredDot />
          </S.FormLabel>
          <S.FormInput
            value={resumeData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder={t('resumeForm.fullNamePlaceholder', 'Seu nome completo')}
            disabled={!isEditing}
          />
        </S.FormGroup>
        <S.FormGroup>
          <S.FormLabel>
            {t('resumeForm.professionalTitle', 'Título Profissional')} <S.RequiredDot />
          </S.FormLabel>
          <S.FormInput
            value={resumeData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder={t('resumeForm.professionalTitlePlaceholder', 'Ex: Desenvolvedor Full Stack')}
            disabled={!isEditing}
          />
        </S.FormGroup>
      </S.FormRow>

      <S.FormRow>
        <S.FormGroup>
          <S.FormLabel>
            {t('resumeForm.email', 'Email')} <S.RequiredDot />
          </S.FormLabel>
          <S.FormInput
            type="email"
            value={resumeData.contact.email}
            onChange={(e) => updateContact('email', e.target.value)}
            placeholder={t('resumeForm.emailPlaceholder', 'seu@email.com')}
            disabled={!isEditing}
          />
        </S.FormGroup>
        <S.FormGroup>
          <S.FormLabel>
            {t('resumeForm.phone', 'Telefone')} <S.RequiredDot />
          </S.FormLabel>
          <S.FormInput
            value={resumeData.contact.phone}
            onChange={(e) => updateContact('phone', formatPhone(e.target.value))}
            placeholder="(11) 99999-9999"
            disabled={!isEditing}
          />
        </S.FormGroup>
      </S.FormRow>

      <S.FormRow>
        <S.FormGroup>
          <S.FormLabel>
            <Linkedin size={13} />
            LinkedIn
          </S.FormLabel>
          <S.FormInput
            value={resumeData.contact.linkedin}
            onChange={(e) => updateContact('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/seu-perfil"
            disabled={!isEditing}
          />
        </S.FormGroup>
        <S.FormGroup>
          <S.FormLabel>
            <Github size={13} />
            GitHub
          </S.FormLabel>
          <S.FormInput
            value={resumeData.contact.github}
            onChange={(e) => updateContact('github', e.target.value)}
            placeholder="https://github.com/seu-usuario"
            disabled={!isEditing}
          />
        </S.FormGroup>
      </S.FormRow>
    </>
  );

  const renderResumoTab = () => (
    <S.FormGroup>
      <S.FormLabel>
        {t('resumeForm.professionalSummary', 'Resumo Profissional')} <S.RequiredDot />
      </S.FormLabel>
      <ScrollTextarea
        value={resumeData.summary}
        onChange={(e) => updateField('summary', e.target.value)}
        placeholder={t(
          'resumeForm.professionalSummaryPlaceholder',
          'Descreva sua experiência profissional, principais realizações e objetivos de carreira...',
        )}
        disabled={!isEditing}
        $minHeight="420px"
      />
    </S.FormGroup>
  );

  const renderExperienciaTab = () => (
    <>
      {resumeData.experiences.length === 0 && (
        <S.EmptyState>
          <div className="empty-icon-wrapper"><Briefcase /></div>
          <p>{t('resumeForm.noExperiences', 'Nenhuma experiência adicionada.')}</p>
        </S.EmptyState>
      )}

      <S.ItemsList>
        {resumeData.experiences.map((exp, index) => (
          <S.ItemCard key={exp.id} $index={index}>
            <S.ItemHeader>
              <S.ItemTitle>
                {exp.position || exp.company || `${t('resumeForm.experience', 'Experiência')} ${index + 1}`}
              </S.ItemTitle>
              {isEditing && (
                <S.RemoveButton onClick={() => removeExperience(exp.id)}>
                  <Trash2 /> {t('common.remove', 'Remover')}
                </S.RemoveButton>
              )}
            </S.ItemHeader>

            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.company', 'Empresa')} <S.RequiredDot /></S.FormLabel>
                <S.FormInput
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder={t('resumeForm.companyPlaceholder', 'Nome da empresa')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.position', 'Cargo')} <S.RequiredDot /></S.FormLabel>
                <S.FormInput
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder={t('resumeForm.positionPlaceholder', 'Seu cargo')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
            </S.FormRow>

            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.startDate', 'Data Início')} <S.RequiredDot /></S.FormLabel>
                <S.FormInput
                  value={getDateValue(`exp-start-${exp.id}`, exp.startDate)}
                  onChange={(e) =>
                    handleDateChange(`exp-start-${exp.id}`, e.target.value, (iso) =>
                      updateExperience(exp.id, 'startDate', iso),
                    )
                  }
                  onBlur={() => handleDateBlur(`exp-start-${exp.id}`)}
                  placeholder="MM/AAAA"
                  maxLength={7}
                  disabled={!isEditing}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.endDate', 'Data Fim')}</S.FormLabel>
                <S.FormInput
                  value={getDateValue(`exp-end-${exp.id}`, exp.endDate)}
                  onChange={(e) =>
                    handleDateChange(`exp-end-${exp.id}`, e.target.value, (iso) =>
                      updateExperience(exp.id, 'endDate', iso),
                    )
                  }
                  onBlur={() => handleDateBlur(`exp-end-${exp.id}`)}
                  placeholder="MM/AAAA"
                  maxLength={7}
                  disabled={!isEditing || exp.current}
                />
              </S.FormGroup>
            </S.FormRow>

            <S.CheckboxRow>
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                disabled={!isEditing}
              />
              {t('resumeForm.currentlyWorking', 'Trabalho atual')}
            </S.CheckboxRow>

            <S.FormGroup>
              <S.FormLabel>{t('resumeForm.locationLabel', 'Localização')}</S.FormLabel>
              <S.FormInput
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                placeholder={t('resumeForm.locationPlaceholder', 'Ex: São Paulo, SP')}
                disabled={!isEditing}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.FormLabel>{t('resumeForm.description', 'Descrição')}</S.FormLabel>
              <S.FormTextarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder={t('resumeForm.descriptionPlaceholder', 'Descreva suas responsabilidades e conquistas...')}
                disabled={!isEditing}
                $minHeight="100px"
              />
            </S.FormGroup>
          </S.ItemCard>
        ))}
      </S.ItemsList>

      {isEditing && (
        <S.AddItemButton onClick={addExperience}>
          <Plus /> {t('resumeForm.addExperience', 'Adicionar Experiência')}
        </S.AddItemButton>
      )}
    </>
  );

  const renderFormacaoTab = () => (
    <>
      {resumeData.education.length === 0 && (
        <S.EmptyState>
          <div className="empty-icon-wrapper"><GraduationCap /></div>
          <p>{t('resumeForm.noEducation', 'Nenhuma formação adicionada.')}</p>
        </S.EmptyState>
      )}

      <S.ItemsList>
        {resumeData.education.map((edu, index) => (
          <S.ItemCard key={edu.id} $index={index}>
            <S.ItemHeader>
              <S.ItemTitle>
                {edu.institution || `${t('resumeForm.education', 'Formação')} ${index + 1}`}
              </S.ItemTitle>
              {isEditing && (
                <S.RemoveButton onClick={() => removeEducation(edu.id)}>
                  <Trash2 /> {t('common.remove', 'Remover')}
                </S.RemoveButton>
              )}
            </S.ItemHeader>

            <S.FormGroup>
              <S.FormLabel>{t('resumeForm.institution', 'Instituição')} <S.RequiredDot /></S.FormLabel>
              <S.FormInput
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder={t('resumeForm.institutionPlaceholder', 'Nome da instituição')}
                disabled={!isEditing}
              />
            </S.FormGroup>

            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.degree', 'Grau')} <S.RequiredDot /></S.FormLabel>
                <S.FormInput
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder={t('resumeForm.degreePlaceholder', 'Ex: Bacharelado')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.fieldOfStudy', 'Área de Estudo')} <S.RequiredDot /></S.FormLabel>
                <S.FormInput
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder={t('resumeForm.fieldOfStudyPlaceholder', 'Ex: Ciência da Computação')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
            </S.FormRow>

            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.startDate', 'Data Início')}</S.FormLabel>
                <S.FormInput
                  value={getDateValue(`edu-start-${edu.id}`, edu.startDate)}
                  onChange={(e) =>
                    handleDateChange(`edu-start-${edu.id}`, e.target.value, (iso) =>
                      updateEducation(edu.id, 'startDate', iso),
                    )
                  }
                  onBlur={() => handleDateBlur(`edu-start-${edu.id}`)}
                  placeholder="MM/AAAA"
                  maxLength={7}
                  disabled={!isEditing}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.endDate', 'Data Fim')}</S.FormLabel>
                <S.FormInput
                  value={getDateValue(`edu-end-${edu.id}`, edu.endDate)}
                  onChange={(e) =>
                    handleDateChange(`edu-end-${edu.id}`, e.target.value, (iso) =>
                      updateEducation(edu.id, 'endDate', iso),
                    )
                  }
                  onBlur={() => handleDateBlur(`edu-end-${edu.id}`)}
                  placeholder="MM/AAAA"
                  maxLength={7}
                  disabled={!isEditing}
                />
              </S.FormGroup>
            </S.FormRow>

            <S.FormGroup>
              <S.FormLabel>{t('resumeForm.description', 'Descrição')}</S.FormLabel>
              <S.FormTextarea
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                placeholder={t('resumeForm.educationDescriptionPlaceholder', 'Atividades relevantes, projetos, etc.')}
                disabled={!isEditing}
                $minHeight="80px"
              />
            </S.FormGroup>
          </S.ItemCard>
        ))}
      </S.ItemsList>

      {isEditing && (
        <S.AddItemButton onClick={addEducation}>
          <Plus /> {t('resumeForm.addEducation', 'Adicionar Formação')}
        </S.AddItemButton>
      )}
    </>
  );

  const renderHabilidadesTab = () => (
    <>
      {/* Skills */}
      <S.FormGroup>
        <S.FormLabel>
          <Code size={13} />
          {t('resumeForm.skills', 'Habilidades')}
        </S.FormLabel>
        <S.TagsContainer>
          {resumeData.skills.map((skill) => (
            <S.TagItem key={skill.id}>
              {skill.name}
              {isEditing && (
                <S.TagRemoveBtn onClick={() => removeSkill(skill.id)}>
                  <X />
                </S.TagRemoveBtn>
              )}
            </S.TagItem>
          ))}
        </S.TagsContainer>
        {isEditing && (
          <S.TagInputRow>
            <S.TagInput
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder={t('resumeForm.addSkillPlaceholder', 'Nova habilidade...')}
            />
            <S.TagAddBtn onClick={addSkill} disabled={!newSkill.trim()}>
              <Plus />
            </S.TagAddBtn>
          </S.TagInputRow>
        )}
      </S.FormGroup>

      {/* Certifications */}
      <S.SectionDivider>
        <S.SectionLabel>{t('resumeForm.certifications', 'Certificações')}</S.SectionLabel>
      </S.SectionDivider>

      <S.FormGroup>
        <S.TagsContainer>
          {resumeData.certifications.map((cert) => (
            <S.TagItem key={cert.id}>
              {cert.name}
              {isEditing && (
                <S.TagRemoveBtn onClick={() => removeCertification(cert.id)}>
                  <X />
                </S.TagRemoveBtn>
              )}
            </S.TagItem>
          ))}
        </S.TagsContainer>
        {isEditing && (
          <S.TagInputRow>
            <S.TagInput
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCertification();
                }
              }}
              placeholder={t('resumeForm.addCertificationPlaceholder', 'Nova certificação...')}
            />
            <S.TagAddBtn onClick={addCertification} disabled={!newCertification.trim()}>
              <Plus />
            </S.TagAddBtn>
          </S.TagInputRow>
        )}
      </S.FormGroup>

      {/* Courses */}
      <S.SectionDivider>
        <S.SectionLabel>{t('resumeForm.courses', 'Cursos')}</S.SectionLabel>
      </S.SectionDivider>

      <S.ItemsList>
        {resumeData.courses.map((course, index) => (
          <S.ItemCard key={course.id} $index={index}>
            <S.ItemHeader>
              <S.ItemTitle>{course.name || `${t('resumeForm.course', 'Curso')} ${index + 1}`}</S.ItemTitle>
              {isEditing && (
                <S.RemoveButton onClick={() => removeCourse(course.id)}>
                  <Trash2 /> {t('common.remove', 'Remover')}
                </S.RemoveButton>
              )}
            </S.ItemHeader>

            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.courseName', 'Nome do Curso')}</S.FormLabel>
                <S.FormInput
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder={t('resumeForm.courseNamePlaceholder', 'Nome do curso')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.courseInstitution', 'Instituição')}</S.FormLabel>
                <S.FormInput
                  value={course.institution}
                  onChange={(e) => updateCourse(course.id, 'institution', e.target.value)}
                  placeholder={t('resumeForm.courseInstitutionPlaceholder', 'Instituição')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
            </S.FormRow>

            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.completionDate', 'Data de Conclusão')}</S.FormLabel>
                <S.FormInput
                  value={getDateValue(`course-date-${course.id}`, course.completionDate)}
                  onChange={(e) =>
                    handleDateChange(`course-date-${course.id}`, e.target.value, (iso) =>
                      updateCourse(course.id, 'completionDate', iso),
                    )
                  }
                  onBlur={() => handleDateBlur(`course-date-${course.id}`)}
                  placeholder="MM/AAAA"
                  maxLength={7}
                  disabled={!isEditing}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.duration', 'Duração')}</S.FormLabel>
                <S.FormInput
                  value={course.duration || ''}
                  onChange={(e) => updateCourse(course.id, 'duration', e.target.value)}
                  placeholder={t('resumeForm.durationPlaceholder', 'Ex: 40 horas')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
            </S.FormRow>
          </S.ItemCard>
        ))}
      </S.ItemsList>

      {isEditing && (
        <S.AddItemButton onClick={addCourse}>
          <Plus /> {t('resumeForm.addCourse', 'Adicionar Curso')}
        </S.AddItemButton>
      )}
    </>
  );

  const renderIdiomasTab = () => (
    <>
      {resumeData.languages.length === 0 && (
        <S.EmptyState>
          <div className="empty-icon-wrapper"><Globe /></div>
          <p>{t('resumeForm.noLanguages', 'Nenhum idioma adicionado.')}</p>
        </S.EmptyState>
      )}

      <S.ItemsList>
        {resumeData.languages.map((lang, index) => (
          <S.ItemCard key={lang.id} $index={index}>
            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.language', 'Idioma')}</S.FormLabel>
                <S.FormInput
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                  placeholder={t('resumeForm.languagePlaceholder', 'Ex: Inglês')}
                  disabled={!isEditing}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>{t('resumeForm.level', 'Nível')}</S.FormLabel>
                <S.FormSelect
                  value={lang.level}
                  onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="Básico">{t('resumeForm.levelBasic', 'Básico')}</option>
                  <option value="Intermediário">{t('resumeForm.levelIntermediate', 'Intermediário')}</option>
                  <option value="Avançado">{t('resumeForm.levelAdvanced', 'Avançado')}</option>
                  <option value="Fluente">{t('resumeForm.levelFluent', 'Fluente')}</option>
                  <option value="Nativo">{t('resumeForm.levelNative', 'Nativo')}</option>
                </S.FormSelect>
              </S.FormGroup>
              {isEditing && (
                <S.RemoveButton
                  onClick={() => removeLanguage(lang.id)}
                  style={{ alignSelf: 'flex-end', marginBottom: 4 }}
                >
                  <Trash2 />
                </S.RemoveButton>
              )}
            </S.FormRow>
          </S.ItemCard>
        ))}
      </S.ItemsList>

      {isEditing && (
        <S.AddItemButton onClick={addLanguage}>
          <Plus /> {t('resumeForm.addLanguage', 'Adicionar Idioma')}
        </S.AddItemButton>
      )}
    </>
  );

  /* =============================================
     LOADING / AUTH GUARDS
     ============================================= */

  if (loading) {
    return (
      <S.Wrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', gap: 36 }}>
        <FoxLogoWrapper>
          <OrbitRing />
          <OrbitRingInner />
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="foxGradProfile" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#FF7A2E" />
                <stop offset="100%" stopColor="#CC4400" />
              </linearGradient>
              <linearGradient id="foxEarProfile" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFB088" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FF8844" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id="foxMaskProfile" x1="50%" y1="20%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFEEDD" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FFCCAA" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <FoxOutline d="M 10 8 L 24 26 L 32 20 L 40 26 L 54 8 L 50 42 L 32 58 L 14 42 Z" fill="url(#foxGradProfile)" />
            <FoxMask d="M 25 33 L 32 52 L 39 33 L 32 27 Z" fill="url(#foxMaskProfile)" />
            <FoxDetail d="M 14 13 L 23 25 L 20 17 Z" fill="url(#foxEarProfile)" $delay={0.15} />
            <FoxDetail d="M 50 13 L 41 25 L 44 17 Z" fill="url(#foxEarProfile)" $delay={0.25} />
            <FoxDetail d="M 30 45 L 32 49 L 34 45 Z" fill="rgba(0,0,0,0.5)" $delay={0.4} />
          </svg>
        </FoxLogoWrapper>
        <LoadingBarTrack>
          <LoadingBarShine />
        </LoadingBarTrack>
        <LoadingText>
          {t('common.loading', 'Carregando').replace('...', '')}
          <Dot $delay={0}>.</Dot>
          <Dot $delay={0.2}>.</Dot>
          <Dot $delay={0.4}>.</Dot>
        </LoadingText>
      </S.Wrapper>
    );
  }

  if (!currentUser) {
    return (
      <S.Wrapper>
        <S.CenteredMessage>{t('profile.loginRequired', 'Faça login para acessar seu perfil.')}</S.CenteredMessage>
      </S.Wrapper>
    );
  }

  /* =============================================
     RENDER
     ============================================= */

  return (
    <S.Wrapper>
      <S.PageGrid>

          {/* ===================================================
              LEFT COLUMN — Profile card + Referral panel
              =================================================== */}
          <S.LeftColumn>

            {/* Profile Card */}
            <S.ProfileHero>
              <S.ProfileHeroLeft>
                <S.AvatarWrapper>
                  <S.Avatar 
                    src={getAvatarURL()} 
                    alt={resumeData.name || 'User'}
                    onError={(e) => {
                      // Se a imagem falhar ao carregar (CORS ou URL inválida), usar fallback
                      const target = e.target as HTMLImageElement;
                      const name = resumeData.name || currentUser?.email || 'User';
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=FF5500&color=fff&bold=true`;
                    }}
                  />
                  {profile?.profileCompleted && <S.AvatarBadge><Check /></S.AvatarBadge>}
                </S.AvatarWrapper>
                <S.ProfileInfo>
                  <S.UserName>{resumeData.name || t('profile.noName', 'Sem nome')}</S.UserName>
                  <S.UserMeta>{resumeData.title || currentUser.email}</S.UserMeta>
                  {resumeData.title && <S.UserMeta>{currentUser.email}</S.UserMeta>}
                  {(resumeData.contact.linkedin || resumeData.contact.github) && (
                    <S.SocialLinks>
                      {resumeData.contact.linkedin && (
                        <S.SocialLink href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin />
                        </S.SocialLink>
                      )}
                      {resumeData.contact.github && (
                        <S.SocialLink href={resumeData.contact.github} target="_blank" rel="noopener noreferrer">
                          <Github />
                        </S.SocialLink>
                      )}
                    </S.SocialLinks>
                  )}
                </S.ProfileInfo>
              </S.ProfileHeroLeft>
              <S.ProfileHeroActions>
                <S.ActionBtn onClick={() => setShowLinkedInDialog(true)} disabled={isImporting}>
                  <Linkedin />
                  {isImporting ? t('profile.importingFromLinkedIn', 'Importando...') : t('profile.importFromLinkedIn', 'Importar do LinkedIn')}
                </S.ActionBtn>
                <S.ActionBtn onClick={handleDownloadPDFClick} disabled={isGeneratingPDF}>
                  <Download />
                  {isGeneratingPDF ? t('profile.generatingPDF', 'Gerando PDF...') : t('profile.downloadPDF', 'Baixar PDF')}
                </S.ActionBtn>
                {!isFirstAccess && userData?.subscriptionStatus === 'active' && (
                  <S.CancelActionBtn onClick={() => setShowCancelDialog(true)}>
                    <Trash2 /> {t('profile.cancelSubscription', 'Cancelar Assinatura')}
                  </S.CancelActionBtn>
                )}
              </S.ProfileHeroActions>
            </S.ProfileHero>

            {/* Referral Panel — tab navigation replaces the header title */}
            {!isFirstAccess && (
              <S.ReferralPanel>
                <S.ReferralTabBar>
                  <S.ReferralTab $active={referralTab === 'indicacao'} onClick={() => setReferralTab('indicacao')}>
                    <Gift size={12} />
                    {t('referral.title', 'Indicação')}
                  </S.ReferralTab>
                  <S.ReferralTab $active={referralTab === 'metricas'} onClick={() => setReferralTab('metricas')}>
                    <Users size={12} />
                    {t('referral.metrics', 'Métricas')}
                  </S.ReferralTab>
                  {isBR && (
                    <S.ReferralTab $active={referralTab === 'pix'} onClick={() => setReferralTab('pix')}>
                      <Key size={12} />
                      PIX
                    </S.ReferralTab>
                  )}
                </S.ReferralTabBar>
                <S.ReferralTabContent>
                  <ReferralComponent view={referralTab} />
                </S.ReferralTabContent>
              </S.ReferralPanel>
            )}

            {/* First Access Banner (shown only when no referral panel) */}
            {isFirstAccess && (
              <S.FirstAccessBanner>
                <h3>{t('profile.welcome', 'Bem-vindo ao FoxApply!')}</h3>
                <p>{t('profile.welcomeDescription', 'Complete seu perfil profissional para começar.')}</p>
                <S.FirstAccessActions>
                  <S.ActionBtn onClick={() => setShowLinkedInDialog(true)} disabled={isImporting}>
                    <Linkedin />
                    {isImporting ? t('profile.importingFromLinkedIn', 'Importando...') : t('profile.importFromLinkedIn', 'Importar do LinkedIn')}
                  </S.ActionBtn>
                </S.FirstAccessActions>
              </S.FirstAccessBanner>
            )}

          </S.LeftColumn>

          {/* ===================================================
              RIGHT COLUMN — Full-height curriculum form panel
              =================================================== */}
          <S.FormPanel>
            <S.FormPanelHeader>
              <S.FormPanelIcon><FileText size={15} /></S.FormPanelIcon>
              <S.FormPanelTitleGroup>
                <h2>{t('profile.professionalResume', 'Currículo Profissional')}</h2>
                <p>{t('profile.professionalResumeDescription', 'Gerencie seu perfil e currículo')}</p>
              </S.FormPanelTitleGroup>
            </S.FormPanelHeader>

            {/* Alert / analysis banners — persist across tab changes */}
            {message && (
              <S.AlertBanner $type={message.type} style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <S.AlertContent>
                  {message.text}
                  {message.text.includes('Recarregar do Perfil Atualizado') && (
                    <S.ActionBtn onClick={() => navigate('/cv-automation', { state: { fromProfile: true } })} style={{ marginTop: 8, maxWidth: 300 }}>
                      {t('profile.goToHomeAndAnalyze', 'Ir para Análise')}
                    </S.ActionBtn>
                  )}
                </S.AlertContent>
                <S.AlertCloseBtn onClick={dismissMessage}><X /></S.AlertCloseBtn>
              </S.AlertBanner>
            )}

            {analysisInfo && (analysisInfo.palavrasChave || analysisInfo.sugestoes) && (
              <S.AnalysisInfoCard style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
                <button className="close-btn" onClick={() => setAnalysisInfo(null)} type="button"><X size={18} /></button>
                <h4><Info size={16} /> {t('profile.suggestionsApplied', 'Sugestões Aplicadas')}</h4>
                <div className="auto-applied">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <CheckCircle size={16} />
                    <strong style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.84rem' }}>{t('profile.fieldsUpdated', 'Campos atualizados')}</strong>
                  </div>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                    <li>{t('profile.summaryReplaced', 'Resumo profissional substituído')}</li>
                    {analysisInfo.palavrasChave && analysisInfo.palavrasChave.length > 0 && (
                      <li>{t('profile.experiencesUpdated', 'Experiências atualizadas com palavras-chave')}</li>
                    )}
                    <li>{t('profile.otherFieldsUpdated', 'Outros campos verificados')}</li>
                  </ul>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{t('profile.importantReview', 'Revise os campos antes de salvar.')}</span>
                  </p>
                </div>
                {analysisInfo.palavrasChave && analysisInfo.palavrasChave.length > 0 && (
                  <div className="keywords">
                    <strong><Pin size={14} /> {t('profile.keywordsIncorporated', 'Palavras-chave incorporadas')}</strong>
                    <div className="keyword-list">
                      {analysisInfo.palavrasChave.map((keyword, i) => <span key={i} className="keyword-tag">{keyword}</span>)}
                    </div>
                  </div>
                )}
                {analysisInfo.sugestoes && analysisInfo.sugestoes.length > 0 && (
                  <div className="suggestions">
                    <strong><Lightbulb size={14} /> {t('profile.otherSuggestions', 'Outras sugestões')}</strong>
                    <ul>{analysisInfo.sugestoes.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                )}
              </S.AnalysisInfoCard>
            )}

            <S.TabRow>
              {TABS.filter(tab => !tab.adminOnly || isAdmin).map((tab) => {
                const Icon = tab.icon;
                return (
                  <S.TabButton key={tab.id} $active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                    <Icon size={15} />
                    <S.TabButtonText>{t(tab.labelKey, tab.fallback)}</S.TabButtonText>
                  </S.TabButton>
                );
              })}
            </S.TabRow>

            <AnimatedHeight>
              <S.FormBody key={activeTab}>
                {activeTab === 'contato' && renderContatoTab()}
                {activeTab === 'resumo' && renderResumoTab()}
                {activeTab === 'experiencia' && renderExperienciaTab()}
                {activeTab === 'formacao' && renderFormacaoTab()}
                {activeTab === 'habilidades' && renderHabilidadesTab()}
                {activeTab === 'idiomas' && renderIdiomasTab()}
                {activeTab === 'admin' && isAdmin && <CreateUserForm />}
              </S.FormBody>
            </AnimatedHeight>

            <S.FormFooter>
              {isEditing ? (
                <>
                  {!isFirstAccess && profile?.profileCompleted && (
                    <S.BtnOutline onClick={handleCancelEdit} disabled={saving}>
                      <X size={15} />{t('profile.cancel', 'Cancelar')}
                    </S.BtnOutline>
                  )}
                  <S.BtnPrimary onClick={handleSaveResume} $disabled={saving} disabled={saving}>
                    {saving ? (
                      <S.LoadingContent><S.Spinner />{t('profile.saving', 'Salvando...')}</S.LoadingContent>
                    ) : (
                      <>
                        <Save size={15} />
                        {isFirstAccess ? t('profile.completeRegistration', 'Completar Cadastro') : t('profile.saveResume', 'Salvar Currículo')}
                      </>
                    )}
                  </S.BtnPrimary>
                </>
              ) : (
                <S.BtnPrimary onClick={handleEdit}>
                  <Edit3 size={15} />{t('profile.editResume', 'Editar Currículo')}
                </S.BtnPrimary>
              )}
            </S.FormFooter>
          </S.FormPanel>

        </S.PageGrid>

        {/* LinkedIn Import Modal */}
        {showLinkedInDialog && (
          <S.ModalOverlay onClick={() => !isImporting && setShowLinkedInDialog(false)}>
            <S.ModalPanel onClick={(e) => e.stopPropagation()}>
              <S.ModalHeader>
                <h3>{t('profile.importFromLinkedIn', 'Importar do LinkedIn')}</h3>
                <S.ModalCloseButton onClick={() => !isImporting && setShowLinkedInDialog(false)}>
                  <X size={16} />
                </S.ModalCloseButton>
              </S.ModalHeader>
              <S.ModalBody>
                <p>{t('profile.enterLinkedInURL', 'Cole a URL do seu perfil do LinkedIn abaixo.')}</p>
                <S.FormInput
                  type="url"
                  value={linkedInURL}
                  onChange={(e) => setLinkedInURL(e.target.value)}
                  placeholder={t('profile.linkedinURLPlaceholder', 'https://linkedin.com/in/seu-perfil')}
                  disabled={isImporting}
                />
              </S.ModalBody>
              <S.ModalFooter>
                <S.BtnOutline onClick={() => setShowLinkedInDialog(false)} disabled={isImporting}>
                  {t('profile.cancel', 'Cancelar')}
                </S.BtnOutline>
                <S.BtnPrimary onClick={handleLinkedInImport} $disabled={isImporting || !linkedInURL.trim()} disabled={isImporting || !linkedInURL.trim()}>
                  {isImporting ? (
                    <S.LoadingContent><S.Spinner />{t('profile.importingFromLinkedIn', 'Importando...')}</S.LoadingContent>
                  ) : (
                    <><Linkedin size={15} />{t('profile.importFromLinkedIn', 'Importar')}</>
                  )}
                </S.BtnPrimary>
              </S.ModalFooter>
            </S.ModalPanel>
          </S.ModalOverlay>
        )}

        {/* Cancel Subscription Dialog */}
        <CancelSubscriptionDialog
          isOpen={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onCancel={() => { setShowCancelDialog(false); navigate('/'); }}
          subscriptionDate={userData?.lastPaymentAt || userData?.createdAt}
        />
    </S.Wrapper>
  );
};
