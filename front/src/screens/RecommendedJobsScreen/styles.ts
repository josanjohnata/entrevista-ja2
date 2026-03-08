import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  padding-bottom: clamp(2rem, 3vw, 3rem);
  background: #f5f5f5;
  color: #171717;
`;

export const PageHeader = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: clamp(1.5rem, 2.5vw, 2rem) 0 clamp(1rem, 2vw, 1.5rem);
  animation: fadeUp 0.9s var(--ease-out-expo) 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
  flex-shrink: 0;
`;

export const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 1.2rem + 2.2vw, 3.15rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 14px;
  color: #171717;
`;

export const PageSubtitle = styled.p`
  margin: 0 auto;
  font-size: clamp(0.82rem, 0.78rem + 0.25vw, 0.92rem);
  line-height: 1.4;
  color: #525252;
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 2.5vw, 1.5rem);
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 2560px) {
    max-width: 1800px;
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 1.5vw, 1.25rem);
  align-items: stretch;
  flex: 1;

  @media (min-width: 1024px) {
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 20px;
  }

  @media (min-width: 1536px) {
    grid-template-columns: 320px minmax(0, 1fr);
    gap: 28px;
  }

  @media (min-width: 2560px) {
    grid-template-columns: 360px minmax(0, 1fr);
    gap: 36px;
  }
`;
