import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiShield, FiDatabase, FiLock, FiUsers, FiMail, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { SimpleHeader } from '../../components/SimpleHeader';
import * as S from './styles';

export const PrivacyPolicyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoBack = () => {
    if (window.history.length <= 1) {
      window.close();
      setTimeout(() => {
        navigate('/');
      }, 100);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <SimpleHeader />
      <S.PageWrapper>
        <S.MainContainer>
          <S.BackButton onClick={handleGoBack}>
            <FiArrowLeft />
            {t('common.back')}
          </S.BackButton>

          <S.MainTitle>{t('privacyPolicy.title')}</S.MainTitle>
          <S.LastUpdated>{t('privacyPolicy.lastUpdated')}</S.LastUpdated>

          <S.ContentCard>
            <S.Section>
              <S.Paragraph>
                {t('privacyPolicy.intro')}
              </S.Paragraph>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiDatabase />
                {t('privacyPolicy.section1.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('privacyPolicy.section1.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('privacyPolicy.section1.item1')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section1.item2')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section1.item3')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section1.item4')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiShield />
                {t('privacyPolicy.section2.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('privacyPolicy.section2.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('privacyPolicy.section2.item1')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section2.item2')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section2.item3')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section2.item4')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section2.item5')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section2.item6')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiUsers />
                {t('privacyPolicy.section3.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('privacyPolicy.section3.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('privacyPolicy.section3.item1')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section3.item2')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section3.item3')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section3.item4')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiLock />
                {t('privacyPolicy.section4.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('privacyPolicy.section4.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('privacyPolicy.section4.item1')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section4.item2')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section4.item3')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section4.item4')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiFileText />
                {t('privacyPolicy.section5.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('privacyPolicy.section5.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('privacyPolicy.section5.item1')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section5.item2')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section5.item3')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section5.item4')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section5.item5')}</S.ListItem>
                <S.ListItem>{t('privacyPolicy.section5.item6')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiRefreshCw />
                {t('privacyPolicy.section6.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('privacyPolicy.section6.description')}
              </S.Paragraph>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiMail />
                {t('privacyPolicy.section7.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('privacyPolicy.section7.description')}
              </S.Paragraph>
              <S.ContactInfo>
                <S.Paragraph>
                  <strong>{t('privacyPolicy.section7.email')}</strong>{' '}
                  <S.ContactLink href="mailto:privacidade@entrevistaja.com.br">
                    privacidade@entrevistaja.com.br
                  </S.ContactLink>
                </S.Paragraph>
                <S.Paragraph style={{ marginBottom: 0 }}>
                  <strong>{t('privacyPolicy.section7.website')}</strong>{' '}
                  <S.ContactLink href="https://entrevistaja.com.br" target="_blank" rel="noopener noreferrer">
                    www.entrevistaja.com.br
                  </S.ContactLink>
                </S.Paragraph>
              </S.ContactInfo>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.Paragraph style={{ fontSize: '0.875rem', color: '#888', textAlign: 'center' }}>
                {t('privacyPolicy.footer')}
              </S.Paragraph>
            </S.Section>
          </S.ContentCard>
        </S.MainContainer>
      </S.PageWrapper>
    </>
  );
};
