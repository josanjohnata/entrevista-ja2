import styled from 'styled-components';

// Cyber Neon Tech color scheme from CheckoutScreen
const neonOrange = '#ff6b35'; // oklch(0.72 0.19 45)
const neonCyan = '#00d4ff'; // oklch(0.82 0.15 195)
const darkBg = '#0a0a0f'; // oklch(0.08 0.01 260)
const darkSurface = '#1a1a24'; // oklch(0.12 0.015 260)
const darkCard = '#1f1f2e'; // oklch(0.16 0.015 260)
const darkBorder = '#3a3a4a'; // oklch(0.25 0.02 260)
const lightText = '#f2f2f2'; // oklch(0.95 0.01 260)
const mutedText = '#a0a0a0'; // oklch(0.65 0.02 260)

export const DashboardContainer = styled.div`
  width: 100%;
`;

export const DashboardHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

export const DashboardTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  position: relative;
  padding-bottom: 0.75rem;
  color: ${lightText};
  text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }

  svg {
    color: ${neonOrange};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, ${neonOrange}, ${neonCyan});
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
  }
`;

export const DashboardSubtitle = styled.p`
  color: ${mutedText};
  font-size: 1rem;
  margin: 0;
  margin-top: 0.5rem;
`;

export const DashboardCard = styled.div`
  background-color: ${darkCard};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${darkBorder};
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const MetricCard = styled.div`
  background-color: ${darkCard};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid ${darkBorder};
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: ${neonOrange};
    box-shadow: 0 0 25px rgba(255, 107, 53, 0.2);
  }
`;

export const MetricIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
`;

export const MetricContent = styled.div`
  flex: 1;
`;

export const MetricValue = styled.div`
  font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  font-weight: 700;
  color: ${lightText};
  margin-bottom: 0.25rem;
`;

export const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${mutedText};
  font-weight: 500;
`;

export const TopReferrersSection = styled.div`
  background-color: ${darkCard};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${darkBorder};
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${lightText};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const ReferrersTable = styled.div`
  overflow-x: auto;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${darkBorder};
  font-weight: 600;
  color: ${mutedText};

  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1.5fr;
    font-size: 0.875rem;
    gap: 0.5rem;
  }
`;

export const TableHeaderCell = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${darkBorder};
  align-items: center;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1.5fr;
    font-size: 0.875rem;
    gap: 0.5rem;
  }
`;

export const TableCell = styled.div`
  color: ${lightText};
  font-size: 0.875rem;
`;

export const CodeBadge = styled.span`
  display: inline-block;
  background: rgba(255, 107, 53, 0.15);
  color: ${neonOrange};
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-family: 'Fira Code', monospace;
  font-weight: 600;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 107, 53, 0.3);
  text-shadow: 0 0 5px rgba(255, 107, 53, 0.3);
`;

export const CompletedBadge = styled.span`
  display: inline-block;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${mutedText};
  font-size: 1rem;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ef4444;
  font-size: 1rem;
  text-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
`;
