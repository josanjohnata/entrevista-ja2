import React from 'react';
import styled from 'styled-components';
import { CheckCircle, Activity, TrendingUp, ArrowUpRight } from 'lucide-react';

interface JobCardProps {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  postedDate: string;
  jobUrl: string;
  employmentType?: string;
  salaryRange?: string;
  matchScore?: number;
  index?: number;
  baseDelay?: number;
}

/* =============================================
   STYLED COMPONENTS
   ============================================= */

const ArrowBtn = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  opacity: 0;
  transform: translate(6px, -6px);
  transition: all 0.35s var(--ease-out-expo);
  z-index: 2;

  svg {
    transition: transform 0.3s var(--ease-out-expo);
  }

  @media (hover: none) and (pointer: coarse) {
    width: 44px;
    height: 44px;
  }
`;

const MatchScoreBadge = styled.div<{ $level: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: clamp(0.68rem, 0.64rem + 0.2vw, 0.72rem);
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 7px;
  transition: var(--transition-fast);
  white-space: nowrap;

  color: ${({ $level }) =>
    $level === 'high'
      ? 'var(--success-color)'
      : $level === 'medium'
        ? 'var(--fox-secondary)'
        : 'rgba(160, 160, 180, 0.9)'};

  background: ${({ $level }) =>
    $level === 'high'
      ? 'var(--success-surface)'
      : $level === 'medium'
        ? 'rgba(255, 119, 51, 0.1)'
        : 'rgba(160, 160, 180, 0.08)'};

  border: 1px solid ${({ $level }) =>
    $level === 'high'
      ? 'rgba(16, 185, 129, 0.2)'
      : $level === 'medium'
        ? 'rgba(255, 119, 51, 0.2)'
        : 'rgba(160, 160, 180, 0.15)'};
`;

const JobTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;

  h3 {
    font-family: var(--font-display);
    font-size: clamp(0.95rem, 0.9rem + 0.35vw, 1.08rem);
    font-weight: 600;
    color: #171717;
    transition: var(--transition-fast);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const JobTag = styled.span<{ $highlight?: boolean }>`
  font-size: clamp(0.68rem, 0.64rem + 0.2vw, 0.72rem);
  padding: 5px 10px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 7px;
  color: ${({ $highlight }) => ($highlight ? '#171717' : '#525252')};
  font-weight: 600;
  transition: var(--transition-fast);
  white-space: nowrap;
  border-color: ${({ $highlight }) => ($highlight ? '#d4d4d4' : '#e5e5e5')};
`;

const Card = styled.div<{ $index: number; $baseDelay: number }>`
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: clamp(14px, 1.2vw + 10px, 18px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  cursor: pointer;
  transition: var(--transition-med);
  position: relative;
  overflow: hidden;
  height: 100%;
  animation: cardReveal 0.6s var(--ease-out-expo) forwards;
  animation-delay: ${({ $index, $baseDelay }) => $baseDelay + $index * 0.08}s;
  opacity: 0;
  transform: translateY(20px) scale(0.97);
  will-change: transform, opacity;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      600px circle at var(--mouse-x, 50%) var(--mouse-y, -20%),
      rgba(255, 85, 0, 0.03),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }

  &:hover {
    background-color: #fafafa;
    border-color: #d4d4d4;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover ${ArrowBtn} {
    opacity: 1;
    transform: translate(0, 0);
    background: var(--fox-primary);
    border-color: var(--fox-primary);
    color: #fff;
  }

  &:hover ${ArrowBtn}:hover {
    transform: scale(1.08);
  }

  &:hover ${ArrowBtn}:hover svg {
    transform: translate(1px, -1px);
  }

  &:hover ${JobTitleRow} h3 {
    color: #171717;
  }

  &:hover ${JobTag} {
    border-color: #d4d4d4;
    color: #171717;
  }
`;

const JobPrimary = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding-right: 36px;
`;

const JobLogoPlaceholder = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 11px;
  flex-shrink: 0;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: #737373;
  text-transform: uppercase;
  user-select: none;
`;

const JobLogo = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 11px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid #e5e5e5;
`;

const JobTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const PostTime = styled.span<{ $recent: boolean }>`
  font-size: clamp(0.68rem, 0.64rem + 0.2vw, 0.72rem);
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;

  color: ${({ $recent }) => ($recent ? 'var(--fox-primary)' : '#737373')};
  background: ${({ $recent }) => ($recent ? 'rgba(255, 85, 0, 0.08)' : '#f5f5f5')};
`;

const JobMeta = styled.p`
  font-size: clamp(0.78rem, 0.74rem + 0.25vw, 0.84rem);
  color: #525252;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Dot = styled.span`
  color: #d4d4d4;
  margin: 0 4px;
`;

const JobBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  flex-wrap: wrap;
`;

/* =============================================
   HELPERS
   ============================================= */

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Agora';
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    return `${Math.floor(diffDays / 7)}sem atrás`;
  } catch {
    return dateString;
  }
};

const getScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 90) return 'high';
  if (score >= 85) return 'medium';
  return 'low';
};

const isRecent = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 24;
  } catch {
    return false;
  }
};

/* =============================================
   COMPONENT
   ============================================= */

export const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  companyLogo,
  location,
  postedDate,
  jobUrl,
  employmentType,
  salaryRange,
  matchScore,
  index = 0,
  baseDelay = 0,
}) => {
  const [showFallback, setShowFallback] = React.useState(!companyLogo);
  const rafId = React.useRef(0);

  const handleClick = () => {
    window.open(jobUrl, '_blank');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const x = e.clientX;
    const y = e.clientY;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${x - rect.left}px`);
      el.style.setProperty('--mouse-y', `${y - rect.top}px`);
    });
  };

  const scoreLevel = matchScore ? getScoreLevel(matchScore) : 'low';
  const dateLabel = formatDate(postedDate);
  const recent = isRecent(postedDate);

  return (
    <Card $index={index} $baseDelay={baseDelay} onClick={handleClick} onMouseMove={handleMouseMove}>
      <ArrowBtn>
        <ArrowUpRight size={16} strokeWidth={2.5} />
      </ArrowBtn>

      <JobPrimary>
        {!showFallback && companyLogo ? (
          <JobLogo src={companyLogo} alt={company} onError={() => setShowFallback(true)} />
        ) : (
          <JobLogoPlaceholder>
            {company.charAt(0)}
          </JobLogoPlaceholder>
        )}
        <JobTextGroup>
          <JobTitleRow>
            <h3>{title}</h3>
          </JobTitleRow>
          <JobMeta>
            {company}
            <Dot>&bull;</Dot>
            {location}
          </JobMeta>
        </JobTextGroup>
      </JobPrimary>

      <JobBottomRow>
        {matchScore !== undefined && (
          <MatchScoreBadge $level={scoreLevel}>
            {scoreLevel === 'high' ? (
              <CheckCircle size={13} />
            ) : scoreLevel === 'medium' ? (
              <Activity size={13} />
            ) : (
              <TrendingUp size={13} />
            )}
            {matchScore}%
          </MatchScoreBadge>
        )}
        {employmentType && <JobTag>{employmentType}</JobTag>}
        {salaryRange && <JobTag $highlight>{salaryRange}</JobTag>}
      </JobBottomRow>
    </Card>
  );
};
