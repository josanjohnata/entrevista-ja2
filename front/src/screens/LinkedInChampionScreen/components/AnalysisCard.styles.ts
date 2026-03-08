import styled from 'styled-components';

export const CardWrapper = styled.div<{ $variant: 'success' | 'warning' }>`
  border-left: 4px solid ${({ theme, $variant }) => 
    $variant === 'success' ? theme.colors.success.main : theme.colors.warning.main
  };
  background: ${({ theme, $variant }) => 
    $variant === 'success' 
      ? `linear-gradient(to bottom right, ${theme.colors.success.light}10, ${theme.colors.success.main}20)`
      : `linear-gradient(to bottom right, ${theme.colors.warning.light}10, ${theme.colors.warning.main}20)`
  };
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: all ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.ease};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  > div {
    background: transparent;
    border: none;
    box-shadow: none;
  }
`;

export const CardHeader = styled.div`
  padding-bottom: 0.75rem;
`;

export const CardTitle = styled.h3<{ $variant: 'success' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme, $variant }) => 
    $variant === 'success' ? theme.colors.success.dark : theme.colors.warning.dark
  };
  margin: 0;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

