import React, { useState, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData, ResumeExperience, ResumeEducation, ResumeSkill, ResumeCertification, ResumeLanguage, ResumeCourse } from '../../domain/resume/types';
import { Button } from '../../presentation/components/Button';
import { Input } from '../../presentation/components/Input';
import { Label } from '../../presentation/components/Label';
import { Textarea } from '../../presentation/components/Textarea';
import { LocationPicker } from '../LocationPicker/LocationPicker';
import { toast } from 'react-toastify';
import * as S from './styles';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  disabled?: boolean;
}

export interface ResumeFormRef {
  validateAll: () => boolean;
}

interface FieldErrors {
  [key: string]: string;
}

const formatDateInput = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) {
    return numbers;
  }
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

export const ResumeForm = forwardRef<ResumeFormRef, ResumeFormProps>(({ data, onChange, disabled = false }, ref) => {
  const { t } = useTranslation();
  const [dateInputs, setDateInputs] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const formatPhone = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }, []);

  const validatePhone = useCallback((phone: string): string => {
    if (!phone || phone.trim() === '') {
      return t('resumeForm.fieldRequired');
    }
    
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      return t('resumeForm.invalidPhone');
    }
    
    if (digitsOnly.length > 11) {
      return t('resumeForm.invalidPhoneMax');
    }
    
    return '';
  }, [t]);

  const validateField = useCallback((field: string, value: string): string => {
    if (!value || value.trim() === '') {
      return t('resumeForm.fieldRequired');
    }
    if (field === 'email' && !value.includes('@')) {
      return t('resumeForm.invalidEmail');
    }
    if (field === 'phone') {
      return validatePhone(value);
    }
    return '';
  }, [validatePhone, t]);

  const handleBlur = useCallback((field: string, value: string, isOptional = false) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (!isOptional) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [validateField]);

  const getInputStyle = (field: string): React.CSSProperties | undefined => {
    if (touched[field] && errors[field]) {
      return { borderColor: '#dc2626' };
    }
    return undefined;
  };

  const validateAll = useCallback((): boolean => {
    const newErrors: FieldErrors = {};
    const newTouched: Record<string, boolean> = {};

    const mainFields = [
      { key: 'name', value: data.name },
      { key: 'title', value: data.title },
      { key: 'email', value: data.contact.email },
      { key: 'phone', value: data.contact.phone },
      { key: 'location', value: data.contact.location },
      { key: 'summary', value: data.summary },
    ];

    mainFields.forEach(({ key, value }) => {
      newTouched[key] = true;
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    data.skills.forEach((skill) => {
      const key = `skill-${skill.id}`;
      newTouched[key] = true;
      const error = validateField(key, skill.name);
      if (error) newErrors[key] = error;
    });

    data.languages.forEach((lang) => {
      const nameKey = `lang-name-${lang.id}`;
      const levelKey = `lang-level-${lang.id}`;
      newTouched[nameKey] = true;
      newTouched[levelKey] = true;
      const nameError = validateField(nameKey, lang.name);
      const levelError = validateField(levelKey, lang.level);
      if (nameError) newErrors[nameKey] = nameError;
      if (levelError) newErrors[levelKey] = levelError;
    });

    data.certifications.forEach((cert) => {
      const key = `cert-${cert.id}`;
      newTouched[key] = true;
      const error = validateField(key, cert.name);
      if (error) newErrors[key] = error;
    });

    data.courses.forEach((course) => {
      if (course.name || course.institution) {
        const nameKey = `course-name-${course.id}`;
        const instKey = `course-inst-${course.id}`;
        newTouched[nameKey] = true;
        newTouched[instKey] = true;
        if (course.name && !course.institution) {
          newErrors[instKey] = t('resumeForm.institutionRequired');
        }
        if (course.institution && !course.name) {
          newErrors[nameKey] = t('resumeForm.courseNameRequired');
        }
      }
    });

    data.experiences.forEach((exp) => {
      const fields = [
        { key: `exp-company-${exp.id}`, value: exp.company },
        { key: `exp-position-${exp.id}`, value: exp.position },
        { key: `exp-startDate-${exp.id}`, value: exp.startDate },
        { key: `exp-location-${exp.id}`, value: exp.location },
        // description é opcional
      ];
      if (!exp.current) {
        fields.push({ key: `exp-endDate-${exp.id}`, value: exp.endDate });
      }
      fields.forEach(({ key, value }) => {
        newTouched[key] = true;
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      });
    });

    data.education.forEach((edu) => {
      const fields = [
        { key: `edu-institution-${edu.id}`, value: edu.institution },
        { key: `edu-degree-${edu.id}`, value: edu.degree },
        { key: `edu-field-${edu.id}`, value: edu.field },
        { key: `edu-startDate-${edu.id}`, value: edu.startDate },
        { key: `edu-endDate-${edu.id}`, value: edu.endDate },
        // description é opcional
      ];
      fields.forEach(({ key, value }) => {
        newTouched[key] = true;
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      });
    });

    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(newErrors);

    const hasErrors = Object.keys(newErrors).length > 0;

    if (hasErrors && formRef.current) {
      setTimeout(() => {
        const firstErrorElement = formRef.current?.querySelector('[style*="border-color: rgb(220, 38, 38)"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstErrorElement as HTMLElement).focus();
        }
      }, 100);
    }

    return !hasErrors;
  }, [data, validateField, t]);

  useImperativeHandle(ref, () => ({
    validateAll,
  }), [validateAll]);

  const updateField = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const updateContact = (field: string, value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const handleDateChange = (
    id: string, 
    field: string, 
    value: string, 
    updateFn: (id: string, field: string, value: string) => void
  ) => {
    const key = `${id}-${field}`;
    const formatted = formatDateInput(value);
    
    setDateInputs(prev => ({ ...prev, [key]: formatted }));
    
    const isoDate = convertToISODate(formatted);
    updateFn(id, field, isoDate);
  };

  const getDateValue = (id: string, field: string, isoValue: string): string => {
    const key = `${id}-${field}`;
    if (dateInputs[key] !== undefined) {
      return dateInputs[key];
    }
    return convertFromISODate(isoValue);
  };

  const scrollToNewItem = useCallback((itemId: string) => {
    setTimeout(() => {
      const newElement = formRef.current?.querySelector(`[data-item-id="${itemId}"]`);
      if (newElement) {
        newElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = newElement.querySelector('input, textarea') as HTMLElement;
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 300);
        }
      }
    }, 100);
  }, []);

  const isLastExperienceFilled = useCallback(() => {
    if (data.experiences.length === 0) return true;
    const last = data.experiences[data.experiences.length - 1];
    return !!(last.company?.trim() && last.position?.trim());
  }, [data.experiences]);

  const isLastEducationFilled = useCallback(() => {
    if (data.education.length === 0) return true;
    const last = data.education[data.education.length - 1];
    return !!(last.institution?.trim() && last.degree?.trim());
  }, [data.education]);

  const isLastSkillFilled = useCallback(() => {
    if (data.skills.length === 0) return true;
    const last = data.skills[data.skills.length - 1];
    return !!last.name?.trim();
  }, [data.skills]);

  const isLastLanguageFilled = useCallback(() => {
    if (data.languages.length === 0) return true;
    const last = data.languages[data.languages.length - 1];
    return !!(last.name?.trim() && last.level?.trim());
  }, [data.languages]);

  const isLastCertificationFilled = useCallback(() => {
    if (data.certifications.length === 0) return true;
    const last = data.certifications[data.certifications.length - 1];
    return !!last.name?.trim();
  }, [data.certifications]);

  const isLastCourseFilled = useCallback(() => {
    if (data.courses.length === 0) return true;
    const last = data.courses[data.courses.length - 1];
    return !!(last.name?.trim() && last.institution?.trim());
  }, [data.courses]);

  const addExperience = () => {
    if (!isLastExperienceFilled()) {
      toast.error(t('resumeForm.fillPreviousExperience'));
      return;
    }
    const newId = Date.now().toString();
    const newExp: ResumeExperience = {
      id: newId,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });

    scrollToNewItem(newId);
  };

  const updateExperience = <K extends keyof ResumeExperience>(id: string, field: K, value: ResumeExperience[K]) => {
    const updated = data.experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, experiences: updated });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter((exp) => exp.id !== id) });
  };

  const addEducation = () => {
    if (!isLastEducationFilled()) {
      toast.error(t('resumeForm.fillPreviousEducation'));
      return;
    }
    const newId = Date.now().toString();
    const newEdu: ResumeEducation = {
      id: newId,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
    scrollToNewItem(newId);
  };

  const updateEducation = (id: string, field: keyof ResumeEducation, value: string) => {
    const updated = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...data, education: updated });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((edu) => edu.id !== id) });
  };

  const addSkill = () => {
    if (!isLastSkillFilled()) {
      toast.error(t('resumeForm.fillPreviousSkill'));
      return;
    }
    const newId = Date.now().toString();
    const newSkill: ResumeSkill = { id: newId, name: '' };
    onChange({ ...data, skills: [...data.skills, newSkill] });
    scrollToNewItem(newId);
  };

  const updateSkill = (id: string, name: string) => {
    const updated = data.skills.map((skill) =>
      skill.id === id ? { ...skill, name } : skill
    );
    onChange({ ...data, skills: updated });
  };

  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter((skill) => skill.id !== id) });
  };

  const addLanguage = () => {
    if (!isLastLanguageFilled()) {
      toast.error(t('resumeForm.fillPreviousLanguage'));
      return;
    }
    const newId = Date.now().toString();
    const newLang: ResumeLanguage = { id: newId, name: '', level: '' };
    onChange({ ...data, languages: [...data.languages, newLang] });
    scrollToNewItem(newId);
  };

  const updateLanguage = (id: string, field: 'name' | 'level', value: string) => {
    const updated = data.languages.map((lang) =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    onChange({ ...data, languages: updated });
  };

  const removeLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter((lang) => lang.id !== id) });
  };

  const addCertification = () => {
    if (!isLastCertificationFilled()) {
      toast.error(t('resumeForm.fillPreviousCertification'));
      return;
    }
    const newId = Date.now().toString();
    const newCert: ResumeCertification = { id: newId, name: '' };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
    scrollToNewItem(newId);
  };

  const updateCertification = (id: string, name: string) => {
    const updated = data.certifications.map((cert) =>
      cert.id === id ? { ...cert, name } : cert
    );
    onChange({ ...data, certifications: updated });
  };

  const removeCertification = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter((cert) => cert.id !== id) });
  };

  const addCourse = () => {
    if (!isLastCourseFilled()) {
      toast.error(t('resumeForm.fillPreviousCourse'));
      return;
    }
    const newId = Date.now().toString();
    const newCourse: ResumeCourse = { 
      id: newId, 
      name: '', 
      institution: '',
      completionDate: '',
      duration: ''
    };
    onChange({ ...data, courses: [...data.courses, newCourse] });
    scrollToNewItem(newId);
  };

  const updateCourse = (id: string, field: keyof ResumeCourse, value: string) => {
    const updated = data.courses.map((course) =>
      course.id === id ? { ...course, [field]: value } : course
    );
    onChange({ ...data, courses: updated });
  };

  const removeCourse = (id: string) => {
    onChange({ ...data, courses: data.courses.filter((course) => course.id !== id) });
  };

  return (
    <S.ResumeFormContainer ref={formRef}>
      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.personalInfo')}</S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
          <S.FormField>
            <Label htmlFor="name">{t('resumeForm.fullName')}</Label>
            <S.InputWrapper>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={() => handleBlur('name', data.name)}
                placeholder={t('resumeForm.fullNamePlaceholder')}
                disabled={disabled}
                style={getInputStyle('name')}
              />
              {touched.name && errors.name && <S.ErrorMessage>{errors.name}</S.ErrorMessage>}
            </S.InputWrapper>
          </S.FormField>
          <S.FormField>
            <Label htmlFor="title">{t('resumeForm.professionalTitle')}</Label>
            <S.InputWrapper>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => updateField('title', e.target.value)}
                onBlur={() => handleBlur('title', data.title)}
                placeholder={t('resumeForm.professionalTitlePlaceholder')}
                disabled={disabled}
                style={getInputStyle('title')}
              />
              {touched.title && errors.title && <S.ErrorMessage>{errors.title}</S.ErrorMessage>}
            </S.InputWrapper>
          </S.FormField>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.contact')}</S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
          <S.FormGrid>
            <S.FormField>
              <Label htmlFor="email">{t('resumeForm.email')}</Label>
              <S.InputWrapper>
                <Input
                  id="email"
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  onBlur={() => handleBlur('email', data.contact.email)}
                  placeholder={t('resumeForm.emailPlaceholder')}
                  disabled={disabled}
                  style={getInputStyle('email')}
                />
                {touched.email && errors.email && <S.ErrorMessage>{errors.email}</S.ErrorMessage>}
              </S.InputWrapper>
            </S.FormField>
            <S.FormField>
              <Label htmlFor="phone">{t('resumeForm.phone')}</Label>
              <S.InputWrapper>
                <Input
                  id="phone"
                  value={data.contact.phone}
                  onChange={(e) => updateContact('phone', formatPhone(e.target.value))}
                  onBlur={() => handleBlur('phone', data.contact.phone)}
                  placeholder={t('resumeForm.phonePlaceholder')}
                  disabled={disabled}
                  style={getInputStyle('phone')}
                />
                {touched.phone && errors.phone && <S.ErrorMessage>{errors.phone}</S.ErrorMessage>}
              </S.InputWrapper>
            </S.FormField>
            <S.FormField>
              <Label htmlFor="linkedin">{t('resumeForm.linkedin')}</Label>
              <S.InputWrapper>
                <Input
                  id="linkedin"
                  value={data.contact.linkedin}
                  onChange={(e) => updateContact('linkedin', e.target.value)}
                  onBlur={() => handleBlur('linkedin', data.contact.linkedin, true)}
                  placeholder={t('resumeForm.linkedinPlaceholder')}
                  disabled={disabled}
                  style={getInputStyle('linkedin')}
                />
                {touched.linkedin && errors.linkedin && <S.ErrorMessage>{errors.linkedin}</S.ErrorMessage>}
              </S.InputWrapper>
            </S.FormField>
            <S.FormField>
              <Label htmlFor="github">{t('resumeForm.github')}</Label>
              <Input
                id="github"
                value={data.contact.github}
                onChange={(e) => updateContact('github', e.target.value)}
                placeholder={t('resumeForm.githubPlaceholder')}
                disabled={disabled}
              />
            </S.FormField>
            <S.FormField>
              <Label htmlFor="location">{t('resumeForm.location')}</Label>
              <S.InputWrapper>
                <LocationPicker
                  value={data.contact.location || ''}
                  onChange={(v) => updateContact('location', v)}
                  disabled={disabled}
                  countryLabel={t('resumeForm.locationCountry')}
                  stateLabel={t('resumeForm.locationState')}
                  cityLabel={t('resumeForm.locationCity')}
                  placeholderCountry={t('resumeForm.placeholderCountry')}
                  placeholderState={t('resumeForm.placeholderState')}
                  placeholderCity={t('resumeForm.placeholderCity')}
                />
                {touched.location && errors.location && <S.ErrorMessage>{errors.location}</S.ErrorMessage>}
              </S.InputWrapper>
            </S.FormField>
          </S.FormGrid>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.professionalSummary')}</S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
          <S.InputWrapper>
            <Textarea
              value={data.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              onBlur={() => handleBlur('summary', data.summary)}
              placeholder={t('resumeForm.summaryPlaceholder')}
              rows={6}
              disabled={disabled}
              style={getInputStyle('summary')}
            />
            {touched.summary && errors.summary && <S.ErrorMessage>{errors.summary}</S.ErrorMessage>}
          </S.InputWrapper>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.skills')}</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addSkill} variant="outline" size="sm">
              <S.AddButtonIcon><Plus size={16} style={{ marginRight: '0.5rem' }} /></S.AddButtonIcon>
              <S.AddButtonText>{t('resumeForm.add')}</S.AddButtonText>
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.skills.map((skill) => (
              <S.ListItem key={skill.id} data-item-id={skill.id}>
                <S.InputWrapper>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, e.target.value)}
                    onBlur={() => handleBlur(`skill-${skill.id}`, skill.name)}
                    placeholder={t('resumeForm.skillPlaceholder')}
                    disabled={disabled}
                    style={getInputStyle(`skill-${skill.id}`)}
                  />
                  {touched[`skill-${skill.id}`] && errors[`skill-${skill.id}`] && <S.ErrorMessage>{errors[`skill-${skill.id}`]}</S.ErrorMessage>}
                </S.InputWrapper>
                {!disabled && (
                  <S.IconButton onClick={() => removeSkill(skill.id)} type="button">
                    <Trash2 size={16} />
                  </S.IconButton>
                )}
              </S.ListItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.languages')}</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addLanguage} variant="outline" size="sm">
              <S.AddButtonIcon><Plus size={16} style={{ marginRight: '0.5rem' }} /></S.AddButtonIcon>
              <S.AddButtonText>{t('resumeForm.add')}</S.AddButtonText>
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.languages.map((lang) => (
              <S.ListItem key={lang.id} data-item-id={lang.id}>
                <S.InputWrapper>
                  <Input
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    onBlur={() => handleBlur(`lang-name-${lang.id}`, lang.name)}
                    placeholder={t('resumeForm.languagePlaceholder')}
                    disabled={disabled}
                    style={getInputStyle(`lang-name-${lang.id}`)}
                  />
                  {touched[`lang-name-${lang.id}`] && errors[`lang-name-${lang.id}`] && <S.ErrorMessage>{errors[`lang-name-${lang.id}`]}</S.ErrorMessage>}
                </S.InputWrapper>
                <S.InputWrapper>
                  <Input
                    value={lang.level}
                    onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                    onBlur={() => handleBlur(`lang-level-${lang.id}`, lang.level)}
                    placeholder={t('resumeForm.languageLevelPlaceholder')}
                    disabled={disabled}
                    style={getInputStyle(`lang-level-${lang.id}`)}
                  />
                  {touched[`lang-level-${lang.id}`] && errors[`lang-level-${lang.id}`] && <S.ErrorMessage>{errors[`lang-level-${lang.id}`]}</S.ErrorMessage>}
                </S.InputWrapper>
                {!disabled && (
                  <S.IconButton onClick={() => removeLanguage(lang.id)} type="button">
                    <Trash2 size={16} />
                  </S.IconButton>
                )}
              </S.ListItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.certifications')}</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addCertification} variant="outline" size="sm">
              <S.AddButtonIcon><Plus size={16} style={{ marginRight: '0.5rem' }} /></S.AddButtonIcon>
              <S.AddButtonText>{t('resumeForm.add')}</S.AddButtonText>
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.certifications.map((cert) => (
              <S.ListItem key={cert.id} data-item-id={cert.id}>
                <S.InputWrapper>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, e.target.value)}
                    onBlur={() => handleBlur(`cert-${cert.id}`, cert.name)}
                    placeholder={t('resumeForm.certificationPlaceholder')}
                    disabled={disabled}
                    style={getInputStyle(`cert-${cert.id}`)}
                  />
                  {touched[`cert-${cert.id}`] && errors[`cert-${cert.id}`] && <S.ErrorMessage>{errors[`cert-${cert.id}`]}</S.ErrorMessage>}
                </S.InputWrapper>
                {!disabled && (
                  <S.IconButton onClick={() => removeCertification(cert.id)} type="button">
                    <Trash2 size={16} />
                  </S.IconButton>
                )}
              </S.ListItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.courses')}</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addCourse} variant="outline" size="sm">
              <S.AddButtonIcon><Plus size={16} style={{ marginRight: '0.5rem' }} /></S.AddButtonIcon>
              <S.AddButtonText>{t('resumeForm.add')}</S.AddButtonText>
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.courses.map((course) => (
              <S.ExperienceItem key={course.id} data-item-id={course.id}>
                <S.ExperienceHeader>
                  <h4>{t('resumeForm.course')}</h4>
                  {!disabled && (
                    <S.IconButton onClick={() => removeCourse(course.id)} type="button">
                      <Trash2 size={16} />
                    </S.IconButton>
                  )}
                </S.ExperienceHeader>
                <S.FormGrid>
                  <S.FormField>
                    <Label>{t('resumeForm.courseName')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        onBlur={() => handleBlur(`course-name-${course.id}`, course.name, !course.institution)}
                        placeholder={t('resumeForm.courseNamePlaceholder')}
                        disabled={disabled}
                        style={getInputStyle(`course-name-${course.id}`)}
                      />
                      {touched[`course-name-${course.id}`] && errors[`course-name-${course.id}`] && <S.ErrorMessage>{errors[`course-name-${course.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.institution')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={course.institution}
                        onChange={(e) => updateCourse(course.id, 'institution', e.target.value)}
                        onBlur={() => handleBlur(`course-inst-${course.id}`, course.institution, !course.name)}
                        placeholder={t('resumeForm.institutionPlaceholderCourse')}
                        disabled={disabled}
                        style={getInputStyle(`course-inst-${course.id}`)}
                      />
                      {touched[`course-inst-${course.id}`] && errors[`course-inst-${course.id}`] && <S.ErrorMessage>{errors[`course-inst-${course.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.completionDate')}</Label>
                    <Input
                      type="text"
                      value={getDateValue(course.id, 'courseDate', course.completionDate)}
                      onChange={(e) => handleDateChange(course.id, 'courseDate', e.target.value, (id, _, val) => updateCourse(id, 'completionDate', val))}
                      onBlur={() => {
                        const key = `${course.id}-courseDate`;
                        setDateInputs(prev => {
                          const newState = { ...prev };
                          delete newState[key];
                          return newState;
                        });
                      }}
                      placeholder={t('resumeForm.dateFormat')}
                      maxLength={7}
                      disabled={disabled}
                    />
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.duration')}</Label>
                    <Input
                      value={course.duration || ''}
                      onChange={(e) => updateCourse(course.id, 'duration', e.target.value)}
                      placeholder={t('resumeForm.durationPlaceholder')}
                      disabled={disabled}
                    />
                  </S.FormField>
                </S.FormGrid>
              </S.ExperienceItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.professionalExperience')}</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addExperience} variant="outline" size="sm">
              <S.AddButtonIcon><Plus size={16} style={{ marginRight: '0.5rem' }} /></S.AddButtonIcon>
              <S.AddButtonText>{t('resumeForm.add')}</S.AddButtonText>
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.experiences.map((exp) => (
              <S.ExperienceItem key={exp.id} data-item-id={exp.id}>
                <S.ExperienceHeader>
                  <h4>{t('resumeForm.experience')}</h4>
                  {!disabled && (
                    <S.IconButton onClick={() => removeExperience(exp.id)} type="button">
                      <Trash2 size={16} />
                    </S.IconButton>
                  )}
                </S.ExperienceHeader>
                <S.FormGrid>
                  <S.FormField>
                    <Label>{t('resumeForm.company')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        onBlur={() => handleBlur(`exp-company-${exp.id}`, exp.company)}
                        placeholder={t('resumeForm.companyPlaceholder')}
                        disabled={disabled}
                        style={getInputStyle(`exp-company-${exp.id}`)}
                      />
                      {touched[`exp-company-${exp.id}`] && errors[`exp-company-${exp.id}`] && <S.ErrorMessage>{errors[`exp-company-${exp.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.position')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        onBlur={() => handleBlur(`exp-position-${exp.id}`, exp.position)}
                        placeholder={t('resumeForm.positionPlaceholder')}
                        disabled={disabled}
                        style={getInputStyle(`exp-position-${exp.id}`)}
                      />
                      {touched[`exp-position-${exp.id}`] && errors[`exp-position-${exp.id}`] && <S.ErrorMessage>{errors[`exp-position-${exp.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.startDate')}</Label>
                    <S.InputWrapper>
                      <Input
                        type="text"
                        value={getDateValue(exp.id, 'startDate', exp.startDate)}
                        onChange={(e) => handleDateChange(exp.id, 'startDate', e.target.value, (id, _, val) => updateExperience(id, 'startDate', val))}
                        onBlur={() => {
                          const key = `${exp.id}-startDate`;
                          setDateInputs(prev => {
                            const newState = { ...prev };
                            delete newState[key];
                            return newState;
                          });
                          handleBlur(`exp-startDate-${exp.id}`, exp.startDate);
                        }}
                        placeholder={t('resumeForm.dateFormat')}
                        maxLength={7}
                        disabled={disabled}
                        style={getInputStyle(`exp-startDate-${exp.id}`)}
                      />
                      {touched[`exp-startDate-${exp.id}`] && errors[`exp-startDate-${exp.id}`] && <S.ErrorMessage>{errors[`exp-startDate-${exp.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.endDate')}</Label>
                    <S.InputWrapper>
                      <Input
                        type="text"
                        value={getDateValue(exp.id, 'endDate', exp.endDate)}
                        onChange={(e) => handleDateChange(exp.id, 'endDate', e.target.value, (id, _, val) => updateExperience(id, 'endDate', val))}
                        onBlur={() => {
                          const key = `${exp.id}-endDate`;
                          setDateInputs(prev => {
                            const newState = { ...prev };
                            delete newState[key];
                            return newState;
                          });
                          if (!exp.current) {
                            handleBlur(`exp-endDate-${exp.id}`, exp.endDate);
                          }
                        }}
                        placeholder={t('resumeForm.dateFormat')}
                        maxLength={7}
                        disabled={exp.current || disabled}
                        style={!exp.current ? getInputStyle(`exp-endDate-${exp.id}`) : undefined}
                      />
                      {!exp.current && touched[`exp-endDate-${exp.id}`] && errors[`exp-endDate-${exp.id}`] && <S.ErrorMessage>{errors[`exp-endDate-${exp.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                    <S.CheckboxContainer>
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        disabled={disabled}
                      />
                      <Label htmlFor={`current-${exp.id}`}>{t('resumeForm.currentlyWorking')}</Label>
                    </S.CheckboxContainer>
                  </S.FormField>
                  <S.FormFieldFullWidth>
                    <Label>{t('resumeForm.location')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        onBlur={() => handleBlur(`exp-location-${exp.id}`, exp.location)}
                        placeholder={t('resumeForm.expLocationPlaceholder')}
                        disabled={disabled}
                        style={getInputStyle(`exp-location-${exp.id}`)}
                      />
                      {touched[`exp-location-${exp.id}`] && errors[`exp-location-${exp.id}`] && <S.ErrorMessage>{errors[`exp-location-${exp.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormFieldFullWidth>
                  <S.FormFieldFullWidth>
                    <Label>{t('resumeForm.description')}</Label>
                    <S.InputWrapper>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        onBlur={() => handleBlur(`exp-description-${exp.id}`, exp.description || '', true)}
                        placeholder={t('resumeForm.descriptionPlaceholder')}
                        rows={4}
                        disabled={disabled}
                        style={getInputStyle(`exp-description-${exp.id}`)}
                      />
                      {touched[`exp-description-${exp.id}`] && errors[`exp-description-${exp.id}`] && <S.ErrorMessage>{errors[`exp-description-${exp.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormFieldFullWidth>
                </S.FormGrid>
              </S.ExperienceItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{t('resumeForm.academicEducation')}</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addEducation} variant="outline" size="sm">
              <S.AddButtonIcon><Plus size={16} style={{ marginRight: '0.5rem' }} /></S.AddButtonIcon>
              <S.AddButtonText>{t('resumeForm.add')}</S.AddButtonText>
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.education.map((edu) => (
              <S.ExperienceItem key={edu.id} data-item-id={edu.id}>
                <S.ExperienceHeader>
                  <h4>{t('resumeForm.education')}</h4>
                  {!disabled && (
                    <S.IconButton onClick={() => removeEducation(edu.id)} type="button">
                      <Trash2 size={16} />
                    </S.IconButton>
                  )}
                </S.ExperienceHeader>
                <S.FormGrid>
                  <S.FormFieldFullWidth>
                    <Label>{t('resumeForm.institution')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        onBlur={() => handleBlur(`edu-institution-${edu.id}`, edu.institution)}
                        placeholder={t('resumeForm.institutionPlaceholder')}
                        disabled={disabled}
                        style={getInputStyle(`edu-institution-${edu.id}`)}
                      />
                      {touched[`edu-institution-${edu.id}`] && errors[`edu-institution-${edu.id}`] && <S.ErrorMessage>{errors[`edu-institution-${edu.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormFieldFullWidth>
                  <S.FormField>
                    <Label>{t('resumeForm.degree')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        onBlur={() => handleBlur(`edu-degree-${edu.id}`, edu.degree)}
                        placeholder={t('resumeForm.degreePlaceholder')}
                        disabled={disabled}
                        style={getInputStyle(`edu-degree-${edu.id}`)}
                      />
                      {touched[`edu-degree-${edu.id}`] && errors[`edu-degree-${edu.id}`] && <S.ErrorMessage>{errors[`edu-degree-${edu.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.fieldOfStudy')}</Label>
                    <S.InputWrapper>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        onBlur={() => handleBlur(`edu-field-${edu.id}`, edu.field)}
                        placeholder={t('resumeForm.fieldPlaceholder')}
                        disabled={disabled}
                        style={getInputStyle(`edu-field-${edu.id}`)}
                      />
                      {touched[`edu-field-${edu.id}`] && errors[`edu-field-${edu.id}`] && <S.ErrorMessage>{errors[`edu-field-${edu.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.startDate')}</Label>
                    <S.InputWrapper>
                      <Input
                        type="text"
                        value={getDateValue(edu.id, 'eduStartDate', edu.startDate)}
                        onChange={(e) => handleDateChange(edu.id, 'eduStartDate', e.target.value, (id, _, value) => updateEducation(id, 'startDate', value))}
                        onBlur={() => {
                          const key = `${edu.id}-eduStartDate`;
                          setDateInputs(prev => {
                            const newState = { ...prev };
                            delete newState[key];
                            return newState;
                          });
                          handleBlur(`edu-startDate-${edu.id}`, edu.startDate);
                        }}
                        placeholder={t('resumeForm.dateFormat')}
                        maxLength={7}
                        disabled={disabled}
                        style={getInputStyle(`edu-startDate-${edu.id}`)}
                      />
                      {touched[`edu-startDate-${edu.id}`] && errors[`edu-startDate-${edu.id}`] && <S.ErrorMessage>{errors[`edu-startDate-${edu.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormField>
                    <Label>{t('resumeForm.endDate')}</Label>
                    <S.InputWrapper>
                      <Input
                        type="text"
                        value={getDateValue(edu.id, 'eduEndDate', edu.endDate)}
                        onChange={(e) => handleDateChange(edu.id, 'eduEndDate', e.target.value, (id, _, value) => updateEducation(id, 'endDate', value))}
                        onBlur={() => {
                          const key = `${edu.id}-eduEndDate`;
                          setDateInputs(prev => {
                            const newState = { ...prev };
                            delete newState[key];
                            return newState;
                          });
                          handleBlur(`edu-endDate-${edu.id}`, edu.endDate);
                        }}
                        placeholder={t('resumeForm.dateFormat')}
                        maxLength={7}
                        disabled={disabled}
                        style={getInputStyle(`edu-endDate-${edu.id}`)}
                      />
                      {touched[`edu-endDate-${edu.id}`] && errors[`edu-endDate-${edu.id}`] && <S.ErrorMessage>{errors[`edu-endDate-${edu.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormField>
                  <S.FormFieldFullWidth>
                    <Label>{t('resumeForm.courseDescription')}</Label>
                    <S.InputWrapper>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        onBlur={() => handleBlur(`edu-description-${edu.id}`, edu.description || '', true)}
                        placeholder={t('resumeForm.courseDescriptionPlaceholder')}
                        rows={3}
                        disabled={disabled}
                        style={getInputStyle(`edu-description-${edu.id}`)}
                      />
                      {touched[`edu-description-${edu.id}`] && errors[`edu-description-${edu.id}`] && <S.ErrorMessage>{errors[`edu-description-${edu.id}`]}</S.ErrorMessage>}
                    </S.InputWrapper>
                  </S.FormFieldFullWidth>
                </S.FormGrid>
              </S.ExperienceItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>
    </S.ResumeFormContainer>
  );
});
