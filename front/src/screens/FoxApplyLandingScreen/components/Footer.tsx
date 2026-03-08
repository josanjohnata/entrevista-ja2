import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiLinkedin, FiInstagram } from 'react-icons/fi';
import styled from 'styled-components';
import { Container } from '../styles';

const FooterWrapper = styled.footer`
  padding: 3rem 0;
  border-top: 1px solid var(--border-color);
`;

const FooterContent = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  img {
    height: 2rem;
    width: 2rem;
  }
  
  span {
    font-size: 1.125rem;
    font-weight: 700;
    font-family: var(--font-display);
    color: var(--text-primary);
    
    .highlight {
      color: var(--neon-orange);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: oklch(0.12 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(0.25 0.02 260);
  color: var(--text-tertiary);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--text-primary);
    border-color: oklch(0.72 0.19 45 / 0.5);
    background: oklch(0.72 0.19 45 / 0.1);
    transform: translateY(-2px);
    box-shadow: 0 0 20px oklch(0.72 0.19 45 / 0.3);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const Copyright = styled.p`
  font-size: 0.875rem;
  color: var(--text-tertiary);
`;

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <FooterWrapper>
      <FooterContent>
        <Logo>
          <img 
            src="/images/fox-mascot.png" 
            alt="FoxApply"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', e.currentTarget.src);
            }}
          />
          <span>
            Fox<span className="highlight">Apply</span>
          </span>
        </Logo>
        
        <SocialLinks>
          <SocialLink href="mailto:support@foxapply.com" aria-label="Email">
            <FiMail size={20} />
          </SocialLink>
          <SocialLink href="https://linkedin.com/company/foxapply" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FiLinkedin size={20} />
          </SocialLink>
          <SocialLink href="https://instagram.com/foxapply" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FiInstagram size={20} />
          </SocialLink>
        </SocialLinks>
        
        <Copyright>{t('foxApplyLanding.footer.copyright')}</Copyright>
      </FooterContent>
    </FooterWrapper>
  );
};

