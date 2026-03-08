import styled, { css } from 'styled-components';

export const Hero = styled.header`
  background-image: url('/Background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: ${({ theme }) => theme.colors.primary.main};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
  }
`;

export const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

export const MainContent = styled.main`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  }
`;

export const ResultsContainer = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.lg};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints['4k']}) {
    max-width: ${({ theme }) => theme.breakpoints.xl};
  }
`;

interface ScoreCardProps {
  $score: number;
}

const getScoreStyles = (score: number) => {
  if (score >= 80) {
    return css`
      background-color: ${({ theme }) => theme.colors.success.main}10;
      border-color: ${({ theme }) => theme.colors.success.main}30;
      
      ${ScoreValue} {
        color: ${({ theme }) => theme.colors.success.main};
      }
      
      ${ScoreIcon} {
        color: ${({ theme }) => theme.colors.success.main};
      }
    `;
  }
  if (score >= 60) {
    return css`
      background-color: ${({ theme }) => theme.colors.warning.main}10;
      border-color: ${({ theme }) => theme.colors.warning.main}30;
      
      ${ScoreValue} {
        color: ${({ theme }) => theme.colors.warning.main};
      }
      
      ${ScoreIcon} {
        color: ${({ theme }) => theme.colors.warning.main};
      }
    `;
  }
  return css`
    background-color: ${({ theme }) => theme.colors.error.main}10;
    border-color: ${({ theme }) => theme.colors.error.main}30;
    
    ${ScoreValue} {
      color: ${({ theme }) => theme.colors.error.main};
    }
    
    ${ScoreIcon} {
      color: ${({ theme }) => theme.colors.error.main};
    }
  `;
};

export const ScoreCard = styled.div<ScoreCardProps>`
  background: ${({ theme }) => theme.gradients.card};
  border: 2px solid;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: fadeIn ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.ease};

  ${({ $score }) => getScoreStyles($score)}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const ScoreContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const ScoreInfo = styled.div`
  flex: 1;
`;

export const ScoreTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ScoreDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0;
`;

export const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ScoreValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['6xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1;
`;

export const ScoreIcon = styled.div`
  width: 40px;
  height: 40px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ContentCard = styled.div`
  background: ${({ theme }) => theme.gradients.card};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: fadeIn ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.ease};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const CardIcon = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.primary.main}15;
  color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const CardHeaderContent = styled.div`
  flex: 1;
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0;
`;

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const SummaryText = styled.p`
  background-color: rgba(255, 255, 255, 0.04);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-bottom: 0;
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SuggestionItem = styled.div`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  background-color: rgba(255, 255, 255, 0.04);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const SuggestionNumber = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

export const SuggestionText = styled.p`
  flex: 1;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

export const ComparisonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonCard = styled.div<{ variant?: 'before' | 'after' }>`
  background: ${({ theme, variant }) => 
    variant === 'before' 
      ? `${theme.colors.error.main}05` 
      : `${theme.colors.success.main}05`
  };
  border: 2px solid ${({ theme, variant }) => 
    variant === 'before' 
      ? `${theme.colors.error.main}20` 
      : `${theme.colors.success.main}20`
  };
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: ${({ variant }) => variant === 'before' ? '"ANTES"' : '"DEPOIS"'};
    position: absolute;
    top: ${({ theme }) => theme.spacing.sm};
    right: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme, variant }) => 
      variant === 'before' 
        ? theme.colors.error.main 
        : theme.colors.success.main
    };
    color: white;
  }
`;

export const ComparisonTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ComparisonContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
  min-height: 100px;
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

