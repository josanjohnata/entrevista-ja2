import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${theme.colors.border.light};
  border-radius: 0.5rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
  }
`;
