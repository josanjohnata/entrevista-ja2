import styled from 'styled-components';

export const TipItemContainer = styled.div<{ $type: 'positive' | 'improvement' | 'tip' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.ease};
  
  background: ${({ theme, $type }) => {
    if ($type === 'positive') return `${theme.colors.success.main}10`;
    if ($type === 'improvement') return `${theme.colors.warning.main}10`;
    return `${theme.colors.primary.main}10`;
  }};
  
  &:hover {
    background: ${({ theme, $type }) => {
      if ($type === 'positive') return `${theme.colors.success.main}15`;
      if ($type === 'improvement') return `${theme.colors.warning.main}15`;
      return `${theme.colors.primary.main}15`;
    }};
  }
`;

export const IconWrapper = styled.div<{ $type: 'positive' | 'improvement' | 'tip' }>`
  flex-shrink: 0;
  color: ${({ theme, $type }) => {
    if ($type === 'positive') return theme.colors.success.main;
    if ($type === 'improvement') return theme.colors.warning.main;
    return theme.colors.primary.main;
  }};
`;

export const Text = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.75;
  margin: 0;
`;

