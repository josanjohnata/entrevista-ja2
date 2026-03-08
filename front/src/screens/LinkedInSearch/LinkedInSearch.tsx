import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Briefcase, FileText, ExternalLink, RotateCcw, Filter } from 'lucide-react';

import { CustomSelect } from './CustomSelect';
import { MultiSelect } from './MultiSelect';
import { HeroSection } from './components/HeroSection';

import * as S from './styles';

interface DeveloperFormValues {
  tab: 'jobs' | 'content';
  tech: string;
  seniority: string[];
  skip?: number;
  exclude?: string;
  location?: string;
  workMode: string[];
  datePosted?: string;
}

const SENIORITY_MAP: Record<string, string> = {
  'internship': '1',
  'junior': '2',
  'mid': '3,4',
  'senior': '5,6',
};

const WORK_MODE_MAP: Record<string, string> = {
  'remote': '2',
  'onSite': '1',
  'hybrid': '3',
};

const DATE_POSTED_MAP: Record<string, string> = {
  'anyTime': '',
  'past24Hours': 'r86400',
  'pastWeek': 'r604800',
  'pastMonth': 'r2592000',
};

const buildQuery = (data: DeveloperFormValues, isJobsTab: boolean) => {
  let query = data.tech;

  if (data.exclude && data.exclude.trim()) {
    const excludeTerms = data.exclude
      .split(',')
      .map(term => term.trim())
      .filter(Boolean);

    if (isJobsTab) {
      const notClauses = excludeTerms.map(term => `NOT "${term}"`).join(' ');
      query = `${data.tech} ${notClauses}`;
    } else {
      const notClauses = excludeTerms.map(term => `NOT (${term})`).join(' ');
      query = `${data.tech} ${notClauses}`;
    }
  }

  return query;
};

export const LinkedInSearchScreen: React.FC = () => {
  const { t } = useTranslation();
  const { handleSubmit, control, watch, reset } = useForm<DeveloperFormValues>({
    defaultValues: {
      tab: 'jobs',
      tech: '',
      seniority: [],
      skip: 1,
      exclude: '',
      location: '',
      workMode: [],
      datePosted: 'anyTime',
    },
  });

  const values = watch();
  const [cleared, setCleared] = useState(false);
  const onSubmit = useCallback((data: DeveloperFormValues) => {
    const isJobsTab = data.tab === 'jobs';
    const keywords = buildQuery(data, isJobsTab);

    const pageNumber = data.skip || 1;
    const startIndex = (pageNumber - 1) * 25;

    let url = '';

    if (isJobsTab) {
      const experienceLevels = data.seniority
        .map(s => SENIORITY_MAP[s])
        .filter(Boolean)
        .join(',');

      const workModeValues = data.workMode
        .map(w => WORK_MODE_MAP[w])
        .filter(Boolean)
        .join(',');

      const datePostedValue = data.datePosted ? DATE_POSTED_MAP[data.datePosted] : '';

      let baseUrl = '';
      if (data.location && data.location.trim()) {
        baseUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(data.location)}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true`;
      } else {
        baseUrl = `https://www.linkedin.com/jobs/search/?geoId=92000000&keywords=${encodeURIComponent(keywords)}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true`;
      }

      url = `${baseUrl}${experienceLevels ? `&f_E=${experienceLevels}` : ''}${workModeValues ? `&f_WT=${workModeValues}` : ''}${datePostedValue ? `&f_TPR=${datePostedValue}` : ''}&start=${startIndex}`;
    } else {
      url = `https://www.linkedin.com/search/results/CONTENT/?keywords=${encodeURIComponent(keywords)}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true`;
    }

    window.open(url, '_blank');
  }, [t]);

  const handleClear = useCallback(() => {
    reset({
      tab: values.tab,
      tech: '',
      seniority: [],
      skip: 1,
      exclude: '',
      location: '',
      workMode: [],
      datePosted: 'anyTime',
    });
    setCleared(true);
    setTimeout(() => setCleared(false), 600);
  }, [reset, values.tab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleSubmit(onSubmit)();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, handleClear, onSubmit]);

  const isFormFilled = values.tab && values.tech?.trim() && values.skip !== undefined && values.skip >= 1;

  const hasFilters = !!(
    values.tech?.trim() ||
    values.exclude?.trim() ||
    values.location?.trim() ||
    values.seniority.length > 0 ||
    values.workMode.length > 0 ||
    values.datePosted !== 'anyTime' ||
    (values.skip !== undefined && values.skip !== 1)
  );

  return (
    <S.Wrapper>
        <S.PageHeader>
          <S.PageTitle>{t('linkedinSearch.hero.title')}</S.PageTitle>
          <S.PageSubtitle>{t('linkedinSearch.hero.subtitle')}</S.PageSubtitle>
        </S.PageHeader>

        <S.ContentWrapper>
          <S.DashboardGrid>
            <HeroSection />

            {/* Form panel */}
            <S.FormPanel>
            <S.FormPanelHeader>
              <S.FormPanelIcon>
                <Filter size={17} />
              </S.FormPanelIcon>
              <S.FormPanelTitleGroup>
                <h2>{t('linkedinSearch.searchIn')}</h2>
                <p>{t('linkedinSearch.hero.subtitle')}</p>
              </S.FormPanelTitleGroup>
            </S.FormPanelHeader>

            {/* Tab switcher */}
            <Controller
              name="tab"
              control={control}
              render={({ field }) => (
                <S.TabRow>
                  <S.TabButton
                    type="button"
                    $active={field.value === 'jobs'}
                    onClick={() => field.onChange('jobs')}
                  >
                    <Briefcase size={15} />
                    {t('linkedinSearch.jobs')}
                  </S.TabButton>
                  <S.TabButton
                    type="button"
                    $active={field.value === 'content'}
                    onClick={() => field.onChange('content')}
                  >
                    <FileText size={15} />
                    {t('linkedinSearch.posts')}
                  </S.TabButton>
                </S.TabRow>
              )}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <S.FormBody $cleared={cleared}>
                {/* Keywords */}
                <S.FormGroup>
                  <S.FormLabel htmlFor="tech">{t('linkedinSearch.keywords')}</S.FormLabel>
                  <Controller
                    name="tech"
                    control={control}
                    render={({ field }) => (
                      <S.FormInput
                        {...field}
                        id="tech"
                        placeholder={t('linkedinSearch.keywordsPlaceholder')}
                        required
                      />
                    )}
                  />
                </S.FormGroup>

                {/* Exclude keywords */}
                <S.FormGroup>
                  <S.FormLabel htmlFor="exclude">{t('linkedinSearch.excludeKeywords')}</S.FormLabel>
                  <Controller
                    name="exclude"
                    control={control}
                    render={({ field }) => (
                      <S.FormInput
                        {...field}
                        id="exclude"
                        placeholder={t('linkedinSearch.excludePlaceholder')}
                      />
                    )}
                  />
                </S.FormGroup>

                {values.tab === 'jobs' && (
                  <>
                    {/* Location + Work Mode row */}
                    <S.FormRow>
                      <S.FormGroup>
                        <S.FormLabel htmlFor="location">{t('linkedinSearch.location')}</S.FormLabel>
                        <Controller
                          name="location"
                          control={control}
                          render={({ field }) => (
                            <S.FormInput
                              {...field}
                              id="location"
                              placeholder={t('linkedinSearch.locationPlaceholder')}
                            />
                          )}
                        />
                      </S.FormGroup>

                      <S.FormGroup>
                        <S.FormLabel htmlFor="workMode">{t('linkedinSearch.workMode')}</S.FormLabel>
                        <Controller
                          name="workMode"
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              id="workMode"
                              values={field.value}
                              onChange={field.onChange}
                              placeholder={t('linkedinSearch.selectWorkMode')}
                              options={[
                                { value: 'remote', label: t('linkedinSearch.remote') },
                                { value: 'onSite', label: t('linkedinSearch.onSite') },
                                { value: 'hybrid', label: t('linkedinSearch.hybrid') },
                              ]}
                            />
                          )}
                        />
                      </S.FormGroup>
                    </S.FormRow>

                    {/* Seniority + Date Posted row */}
                    <S.FormRow>
                      <S.FormGroup>
                        <S.FormLabel htmlFor="seniority">{t('linkedinSearch.seniority')}</S.FormLabel>
                        <Controller
                          name="seniority"
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              id="seniority"
                              values={field.value}
                              onChange={field.onChange}
                              placeholder={t('linkedinSearch.selectSeniority')}
                              options={[
                                { value: 'internship', label: t('linkedinSearch.internship') },
                                { value: 'junior', label: t('linkedinSearch.junior') },
                                { value: 'mid', label: t('linkedinSearch.mid') },
                                { value: 'senior', label: t('linkedinSearch.senior') },
                              ]}
                            />
                          )}
                        />
                      </S.FormGroup>

                      <S.FormGroup>
                        <S.FormLabel htmlFor="datePosted">{t('linkedinSearch.datePosted')}</S.FormLabel>
                        <Controller
                          name="datePosted"
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              id="datePosted"
                              value={field.value || 'anyTime'}
                              onChange={field.onChange}
                              options={[
                                { value: 'anyTime', label: t('linkedinSearch.anyTime') },
                                { value: 'past24Hours', label: t('linkedinSearch.past24Hours') },
                                { value: 'pastWeek', label: t('linkedinSearch.pastWeek') },
                                { value: 'pastMonth', label: t('linkedinSearch.pastMonth') },
                              ]}
                            />
                          )}
                        />
                      </S.FormGroup>
                    </S.FormRow>

                    {/* Page number */}
                    <S.FormGroup>
                      <S.FormLabel htmlFor="skip">{t('linkedinSearch.searchPage')}</S.FormLabel>
                      <Controller
                        name="skip"
                        control={control}
                        render={({ field }) => (
                          <S.FormInput
                            {...field}
                            id="skip"
                            type="number"
                            min="1"
                            placeholder="1"
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              field.onChange(value < 1 ? 1 : value);
                            }}
                          />
                        )}
                      />
                    </S.FormGroup>
                  </>
                )}
              </S.FormBody>

              {/* Actions */}
              <S.FormFooter>
                <S.BtnPrimary
                  type="submit"
                  $disabled={!isFormFilled}
                  disabled={!isFormFilled}
                >
                  <ExternalLink size={15} />
                  {t('linkedinSearch.searchLinkedIn')}
                </S.BtnPrimary>
                <S.BtnOutline type="button" onClick={handleClear} disabled={!hasFilters} $disabled={!hasFilters}>
                  <RotateCcw size={14} />
                  {t('linkedinSearch.clearFilters')}
                </S.BtnOutline>
              </S.FormFooter>

              <S.KeyboardHints>
                <S.KbdHint>
                  <S.Kbd>Ctrl</S.Kbd> + <S.Kbd>Enter</S.Kbd> {t('linkedinSearch.searchLinkedIn')}
                </S.KbdHint>
                <S.KbdHint>
                  <S.Kbd>Ctrl</S.Kbd> + <S.Kbd>L</S.Kbd> {t('linkedinSearch.clearFilters')}
                </S.KbdHint>
              </S.KeyboardHints>
            </form>
          </S.FormPanel>
          </S.DashboardGrid>
        </S.ContentWrapper>
    </S.Wrapper>
  );
};
