import styled from 'styled-components';

export const FeatureIconLarge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #171717;
  transition: var(--transition-med);
  flex-shrink: 0;
`;

export const FeatureCard = styled.div`
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: var(--transition-med);
  cursor: default;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  &:hover {
    border-color: rgba(255, 85, 0, 0.4);
    background-color: rgba(255, 85, 0, 0.04);
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:hover ${FeatureIconLarge} {
    background-color: var(--fox-primary);
    color: #fff;
    border-color: var(--fox-primary);
    box-shadow: 0 4px 12px rgba(255, 85, 0, 0.2);
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
  color: #171717;
`;

export const FeatureDescription = styled.p`
  font-size: 0.84rem;
  color: #525252;
  line-height: 1.5;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  top: 100px;
  align-self: start;
  animation: fadeRight 1s var(--ease-out-expo) 0.4s forwards;
  opacity: 0;
  transform: translateX(-20px);

  @media (max-width: 1024px) {
    position: static;
    flex-direction: row;
  }

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;
