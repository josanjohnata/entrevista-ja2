import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SvgContainer = styled.svg<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  transform: rotate(-90deg);
`;

export const BackgroundCircle = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
`;

export const ProgressCircle = styled.circle<{ $color: string }>`
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-out;
  filter: drop-shadow(0 0 6px ${({ $color }) => $color}40);
`;

export const ScoreContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ScoreNumber = styled.span`
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.02em;
`;

export const ScoreLabel = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ScoreStatus = styled.span<{ $color: string }>`
  font-size: 0.65rem;
  font-weight: 600;
  margin-top: 2px;
  color: ${({ $color }) => $color};
`;
