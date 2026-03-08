import styled, { keyframes } from 'styled-components';
import { theme } from '../../../GlobalStyles';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingContainer = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ fullScreen }) => fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  `}
`;

export const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg'; color?: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '20px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '20px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  border: 3px solid ${theme.colors.neutral[200]};
  border-top-color: ${({ color }) => color || theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;
