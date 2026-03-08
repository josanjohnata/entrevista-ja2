import styled, { css } from 'styled-components';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface StyledBadgeProps {
  $variant: BadgeVariant;
}

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary.main}15;
    color: ${({ theme }) => theme.colors.primary.main};
    border: 1px solid ${({ theme }) => theme.colors.primary.main}30;
  `,
  
  secondary: css`
    background-color: ${({ theme }) => theme.colors.secondary.main}15;
    color: ${({ theme }) => theme.colors.secondary.main};
    border: 1px solid ${({ theme }) => theme.colors.secondary.main}30;
  `,
  
  success: css`
    background-color: ${({ theme }) => theme.colors.success.main}15;
    color: ${({ theme }) => theme.colors.success.main};
    border: 1px solid ${({ theme }) => theme.colors.success.main}30;
  `,
  
  warning: css`
    background-color: ${({ theme }) => theme.colors.warning.main}15;
    color: ${({ theme }) => theme.colors.warning.main};
    border: 1px solid ${({ theme }) => theme.colors.warning.main}30;
  `,
  
  error: css`
    background-color: ${({ theme }) => theme.colors.error.main}15;
    color: ${({ theme }) => theme.colors.error.main};
    border: 1px solid ${({ theme }) => theme.colors.error.main}30;
  `,
};

export const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: all ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.ease};

  ${({ $variant }) => variantStyles[$variant]}
`;

