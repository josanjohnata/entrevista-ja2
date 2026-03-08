import styled from 'styled-components';
import { Button } from '../../common/Button';
import { theme } from '../../../GlobalStyles';

export const CTASection = styled.section`
  padding: 5rem 0;
  background-color: #f5f5f5;
  color: #171717;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 6rem 0;
  }
  
  h1 {
    color: #0a0a0a;
    font-size: 1.75rem;
    letter-spacing: -0.02em;
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2.75rem;
    }
  }
  
  p {
    color: #404040;
  }
`;

export const CTAButton = styled(Button)`
  background-color: #0a0a0a;
  color: #fff;
  
  &:hover {
    background-color: #171717;
    opacity: 0.95;
  }
`;
