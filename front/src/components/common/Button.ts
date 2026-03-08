import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: none;
  transition: opacity 0.3s ease;

  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.background.primary};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;
