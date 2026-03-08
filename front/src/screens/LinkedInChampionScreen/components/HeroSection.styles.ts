import styled from 'styled-components';

export const FeatureIconLarge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  transition: var(--transition-med);
  flex-shrink: 0;
`;

export const FeatureCard = styled.div`
  background: var(--surface-2);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: clamp(14px, 1.5vw, 18px) clamp(16px, 1.5vw, 20px);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1vw, 12px);
  transition: var(--transition-med);
  cursor: default;

  &:hover {
    border-color: var(--border-fox);
    background-color: var(--fox-surface);
    transform: scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  }

  &:hover ${FeatureIconLarge} {
    background-color: var(--fox-primary);
    color: #fff;
    border-color: var(--fox-primary);
    box-shadow: 0 4px 12px var(--fox-glow);
    transform: rotate(-8deg);
  }

  @media (max-width: 1024px) {
    flex: 1;
  }
`;

export const FeatureTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
`;

export const FeatureDescription = styled.p`
  font-size: clamp(0.78rem, 0.74rem + 0.25vw, 0.84rem);
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1vw, 10px);
  align-self: start;
  animation: fadeRight 1s var(--ease-out-expo) 0.4s forwards;
  opacity: 0;
  transform: translateX(-20px);

  @media (max-width: 1024px) {
    position: static;
    flex-direction: row;
  }

  @media (min-width: 1025px) {
    position: sticky;
    top: 100px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;
