import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../../common/Container';
import { Logo } from '../../Logo';
import { FiMail, FiLinkedin, FiInstagram } from 'react-icons/fi';
import * as S from './styles';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <S.FooterWrapper id="contato">
      <Container>
        <S.FooterContent>
          <Logo />
          <S.SocialLinks>
            <S.SocialLink href="mailto:support@foxapply.com" aria-label="Email">
              <FiMail size={20} />
            </S.SocialLink>
            <S.SocialLink href="https://linkedin.com/company/entrevista-ja" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin size={20} />
            </S.SocialLink>
            <S.SocialLink href="https://instagram.com/entrevista_ja" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram size={20} />
            </S.SocialLink>
          </S.SocialLinks>
          <p>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</p>
        </S.FooterContent>
      </Container>
    </S.FooterWrapper>
  );
};
