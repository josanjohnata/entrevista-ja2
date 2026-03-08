import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Heading2, Button } from '../styles';
import { useReferralTracking } from '../../../hooks/useReferralTracking';

const Wrapper = styled(Section)`
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ImageWrapper = styled.div`
  img {
    width: 100%;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
`;

const Content = styled.div``;

const Title = styled(Heading2)`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  .gradient-text,
  .gradient-orange {
    background: linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.82 0.15 195));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gradient-cyan {
    background: linear-gradient(135deg, oklch(0.75 0.15 195), oklch(0.85 0.12 220));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: white;
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonWrapper = styled.div`
  button,
  a {
    width: 100%;
    
    @media (min-width: 640px) {
      width: auto;
    }
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    
    svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--neon-orange);
      margin-top: 0.125rem;
      flex-shrink: 0;
    }
    
    span {
      color: white;
      line-height: 1.6;
    }
  }
`;

const SUCCESS_TITLE_ORANGE_WORDS = new Set(['imagine', 'acordar', 'celular']);
const SUCCESS_TITLE_CYAN_WORDS = new Set(['olhar', 'já', 'ter']);

function renderSuccessTitle(titleText: string, invitesText: string) {
  const hasInvitesPlaceholder = titleText.includes('{invites}');
  if (hasInvitesPlaceholder && invitesText) {
    const parts = titleText.split('{invites}');
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{invitesText}</span>
        {parts[1] || ''}
      </>
    );
  }
  const words = titleText.split(/(\s+)/);
  return (
    <>
      {words.map((word, index) => {
        const normalized = word.replace(/[.,!?;:()[\][]{}'"]/g, '').toLowerCase();
        if (SUCCESS_TITLE_ORANGE_WORDS.has(normalized)) {
          return <span key={index} className="gradient-orange">{word}</span>;
        }
        if (SUCCESS_TITLE_CYAN_WORDS.has(normalized)) {
          return <span key={index} className="gradient-cyan">{word}</span>;
        }
        return <React.Fragment key={index}>{word}</React.Fragment>;
      })}
    </>
  );
}

export const SuccessSection: React.FC = () => {
  const { t } = useTranslation();
  const { getCheckoutUrl, trackCheckoutClick } = useReferralTracking();
  
  const titleText = t('foxApplyLanding.success.title');
  const invitesText = t('foxApplyLanding.success.invites');
  const descriptionText = t('foxApplyLanding.success.description');
  const descriptionHighlight = t('foxApplyLanding.success.descriptionHighlight');
  const descriptionParts = descriptionText.split('{highlight}');
  
  return (
    <Wrapper>
      <Container>
        <Grid>
          <ImageWrapper>
            <img 
              src="/images/success-celebration.jpg" 
              alt="Profissional de T.I. celebrando conquista"
              onError={(e) => {
                console.error('Erro ao carregar imagem:', e.currentTarget.src);
              }}
            />
          </ImageWrapper>
          
          <Content>
            <Title>
              {renderSuccessTitle(titleText, invitesText)}
            </Title>

            <BenefitsList>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <li key={num}>
                  <CheckCircle2 />
                  <span>{t(`foxApplyLanding.success.benefit${num}`)}</span>
                </li>
              ))}
            </BenefitsList>
            
            <Description>
              {descriptionParts.length > 1 ? (
                <>
                  {descriptionParts[0]}
                  <strong>{descriptionHighlight}</strong>
                  {descriptionParts[1] || ''}
                </>
              ) : (
                descriptionText
              )}
            </Description>
            
            <ButtonWrapper>
              <Button 
                as={Link} 
                to={getCheckoutUrl()} 
                size="lg" 
                className="glow-orange"
                onClick={trackCheckoutClick}
              >
                {t('foxApplyLanding.success.cta')}
                <ArrowRight size={20} />
              </Button>
            </ButtonWrapper>
          </Content>
        </Grid>
      </Container>
    </Wrapper>
  );
};

