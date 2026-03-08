import styled from 'styled-components';

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

