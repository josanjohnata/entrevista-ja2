'use client';

import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SimpleHeader } from '../../components/SimpleHeader';
import { ROUTES } from '../../routes/paths';
import * as S from './styles';

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const initialForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  jobTitle: '',
  jobDescription: '',
  location: '',
};

export const DivulgueVagaScreen: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.companyName.trim()) next.companyName = t('divulgueVaga.required');
    if (!form.contactName.trim()) next.contactName = t('divulgueVaga.required');
    if (!form.email.trim()) next.email = t('divulgueVaga.required');
    else if (!form.email.includes('@')) next.email = t('checkout.emailInvalid');
    if (!form.jobTitle.trim()) next.jobTitle = t('divulgueVaga.required');
    if (!form.jobDescription.trim()) next.jobDescription = t('divulgueVaga.required');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    // TODO: enviar para backend/API quando existir
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <SimpleHeader />
        <S.PageWrapper>
          <S.MainContainer>
            <S.SuccessMessage>{t('divulgueVaga.success')}</S.SuccessMessage>
            <S.BackLink>
              <Link to={ROUTES.HOME}>{t('divulgueVaga.backToHome')}</Link>
            </S.BackLink>
          </S.MainContainer>
        </S.PageWrapper>
      </>
    );
  }

  return (
    <>
      <SimpleHeader />
      <S.PageWrapper>
        <S.MainContainer>
          <S.MainTitle>{t('divulgueVaga.title')}</S.MainTitle>
          <S.Subtitle>{t('divulgueVaga.subtitle')}</S.Subtitle>

          <S.FormCard>
            <form onSubmit={handleSubmit}>
              <S.FormSection>
                <S.SectionHeader>{t('divulgueVaga.companySection')}</S.SectionHeader>

                <S.InputGroup>
                  <label htmlFor="companyName">{t('divulgueVaga.companyName')}</label>
                  <S.Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(e) => setField('companyName', e.target.value)}
                    placeholder={t('divulgueVaga.companyNamePlaceholder')}
                    hasError={!!errors.companyName}
                  />
                  {errors.companyName && <S.FieldError>{errors.companyName}</S.FieldError>}
                </S.InputGroup>

                <S.InputGroup>
                  <label htmlFor="contactName">{t('divulgueVaga.contactName')}</label>
                  <S.Input
                    id="contactName"
                    value={form.contactName}
                    onChange={(e) => setField('contactName', e.target.value)}
                    placeholder={t('divulgueVaga.contactNamePlaceholder')}
                    hasError={!!errors.contactName}
                  />
                  {errors.contactName && <S.FieldError>{errors.contactName}</S.FieldError>}
                </S.InputGroup>

                <S.InputGroup>
                  <label htmlFor="email">{t('divulgueVaga.email')}</label>
                  <S.Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder={t('divulgueVaga.emailPlaceholder')}
                    hasError={!!errors.email}
                  />
                  {errors.email && <S.FieldError>{errors.email}</S.FieldError>}
                </S.InputGroup>

                <S.InputGroup>
                  <label htmlFor="phone">{t('divulgueVaga.phone')}</label>
                  <S.Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField('phone', formatPhone(e.target.value))}
                    placeholder={t('divulgueVaga.phonePlaceholder')}
                  />
                </S.InputGroup>
              </S.FormSection>

              <S.FormSection>
                <S.SectionHeader>{t('divulgueVaga.jobSection')}</S.SectionHeader>

                <S.InputGroup>
                  <label htmlFor="jobTitle">{t('divulgueVaga.jobTitle')}</label>
                  <S.Input
                    id="jobTitle"
                    value={form.jobTitle}
                    onChange={(e) => setField('jobTitle', e.target.value)}
                    placeholder={t('divulgueVaga.jobTitlePlaceholder')}
                    hasError={!!errors.jobTitle}
                  />
                  {errors.jobTitle && <S.FieldError>{errors.jobTitle}</S.FieldError>}
                </S.InputGroup>

                <S.InputGroup>
                  <label htmlFor="jobDescription">{t('divulgueVaga.jobDescription')}</label>
                  <S.Textarea
                    id="jobDescription"
                    value={form.jobDescription}
                    onChange={(e) => setField('jobDescription', e.target.value)}
                    placeholder={t('divulgueVaga.jobDescriptionPlaceholder')}
                    hasError={!!errors.jobDescription}
                  />
                  {errors.jobDescription && <S.FieldError>{errors.jobDescription}</S.FieldError>}
                </S.InputGroup>

                <S.InputGroup>
                  <label htmlFor="location">{t('divulgueVaga.location')}</label>
                  <S.Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setField('location', e.target.value)}
                    placeholder={t('divulgueVaga.locationPlaceholder')}
                  />
                </S.InputGroup>
              </S.FormSection>

              <S.SubmitButton type="submit" disabled={submitting}>
                {submitting ? t('divulgueVaga.submitting') : t('divulgueVaga.submit')}
              </S.SubmitButton>
            </form>
          </S.FormCard>
        </S.MainContainer>
      </S.PageWrapper>
    </>
  );
};
