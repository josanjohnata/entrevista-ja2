import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiMail, FiFileText, FiRefreshCw } from 'react-icons/fi';
import { SimpleHeader } from '../../components/SimpleHeader';
import * as S from './styles';

export const RefundReturnScreen: React.FC = () => {
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

          <S.MainTitle>{t('refundReturn.title')}</S.MainTitle>
          <S.LastUpdated>{t('refundReturn.lastUpdated')}</S.LastUpdated>

          <S.ContentCard>
            <S.Section>
              <S.Paragraph>
                {t('refundReturn.intro')}
              </S.Paragraph>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiDollarSign />
                {t('refundReturn.section1.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('refundReturn.section1.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('refundReturn.section1.item1')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section1.item2')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section1.item3')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section1.item4')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiClock />
                {t('refundReturn.section2.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('refundReturn.section2.description')}
              </S.Paragraph>
              <S.InfoBox>
                <S.InfoBoxIcon>
                  <FiCheckCircle />
                </S.InfoBoxIcon>
                <S.InfoBoxContent>
                  <S.InfoBoxTitle>{t('refundReturn.section2.infoTitle')}</S.InfoBoxTitle>
                  <S.InfoBoxText>{t('refundReturn.section2.infoText')}</S.InfoBoxText>
                </S.InfoBoxContent>
              </S.InfoBox>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiRefreshCw />
                {t('refundReturn.section3.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('refundReturn.section3.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('refundReturn.section3.item1')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section3.item2')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section3.item3')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section3.item4')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiFileText />
                {t('refundReturn.section4.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('refundReturn.section4.description')}
              </S.Paragraph>
              <S.WarningBox>
                <S.WarningBoxIcon>
                  <FiAlertCircle />
                </S.WarningBoxIcon>
                <S.WarningBoxContent>
                  <S.WarningBoxTitle>{t('refundReturn.section4.warningTitle')}</S.WarningBoxTitle>
                  <S.WarningBoxText>{t('refundReturn.section4.warningText')}</S.WarningBoxText>
                </S.WarningBoxContent>
              </S.WarningBox>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiCheckCircle />
                {t('refundReturn.section5.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('refundReturn.section5.description')}
              </S.Paragraph>
              <S.List>
                <S.ListItem>{t('refundReturn.section5.item1')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section5.item2')}</S.ListItem>
                <S.ListItem>{t('refundReturn.section5.item3')}</S.ListItem>
              </S.List>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>
                <FiMail />
                {t('refundReturn.section6.title')}
              </S.SectionTitle>
              <S.Paragraph>
                {t('refundReturn.section6.description')}
              </S.Paragraph>
              <S.ContactInfo>
                <S.Paragraph>
                  <strong>{t('refundReturn.section6.email')}</strong>{' '}
                  <S.ContactLink href="mailto:suporte@foxapply.com">
                    suporte@foxapply.com
                  </S.ContactLink>
                </S.Paragraph>
                <S.Paragraph style={{ marginBottom: 0 }}>
                  <strong>{t('refundReturn.section6.responseTime')}</strong>{' '}
                  {t('refundReturn.section6.responseTimeValue')}
                </S.Paragraph>
              </S.ContactInfo>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.Paragraph style={{ fontSize: '0.875rem', color: '#888', textAlign: 'center' }}>
                {t('refundReturn.footer')}
              </S.Paragraph>
            </S.Section>
          </S.ContentCard>
        </S.MainContainer>
      </S.PageWrapper>
    </>
  );
};

