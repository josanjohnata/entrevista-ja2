import styled from 'styled-components';

/* =============================================
   ACCESS DENIED
   ============================================= */

export const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 60vh;
  text-align: center;
  background: #f5f5f5;
  color: #525252;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #171717;
    margin-bottom: 12px;
  }

  p {
    font-size: 0.95rem;
    color: #737373;
    margin-bottom: 8px;
    line-height: 1.6;

    strong {
      color: var(--fox-primary, #FF5500);
    }
  }
`;
