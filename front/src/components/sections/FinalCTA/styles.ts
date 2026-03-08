import styled from 'styled-components';
import { Button } from '../../common/Button';
import { theme } from '../../../GlobalStyles';

export const CTASection = styled.section`
  padding: 5rem 0;
  background-color: ${theme.colors.background.primary};
  color: ${theme.colors.primary.main};
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 6rem 0;
  }
  
  h1 {
    color: ${theme.colors.primary.main};
    font-size: 1.75rem;
    letter-spacing: -0.02em;
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2.75rem;
    }
  }
`;

export const CTAButton = styled(Button)`
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.background.primary};
  
  &:hover {
    background-color: ${theme.colors.primary.main};
    opacity: 1;
  }
`;
