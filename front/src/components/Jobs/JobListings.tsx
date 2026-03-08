import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Briefcase, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, MapPin, Edit3, SearchX, Sparkles, Pen, Globe, KeyRound, UserCog } from 'lucide-react';
import { JobCard } from './JobCard';
import { LocationModal } from '../LocationModal';
import { type LocationSelection } from '../../data/locations';
import { jobsSupabase } from '../../infrastructure/supabase/jobsClient';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

/* =============================================
   TYPES
   ============================================= */

interface JobListingsProps {
  headline?: string;
  occupation?: string;
  skills?: string[];
  location?: string;
  isPCD?: boolean;
  onLocationChange?: (selection: LocationSelection) => void;
}

interface Job {
  job_id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  posted_date: string;
  job_url: string;
  employment_type?: string;
  seniority_level?: string;
  salary_range?: string;
  description?: string;
  company_name?: string;
}

/* =============================================
   LOCATION PARSING (preserved from original)
   ============================================= */

const countryMappings: Record<string, string> = {
  'canada': 'ca', 'united states': 'us', 'usa': 'us', 'brazil': 'br', 'brasil': 'br',
  'united kingdom': 'gb', 'uk': 'gb', 'germany': 'de', 'france': 'fr', 'spain': 'es',
  'portugal': 'pt', 'italy': 'it', 'netherlands': 'nl', 'australia': 'au', 'japan': 'jp',
  'china': 'cn', 'india': 'in', 'mexico': 'mx', 'argentina': 'ar', 'chile': 'cl',
  'colombia': 'co', 'peru': 'pe', 'ireland': 'ie', 'switzerland': 'ch', 'austria': 'at',
  'belgium': 'be', 'sweden': 'se', 'norway': 'no', 'denmark': 'dk', 'finland': 'fi',
  'poland': 'pl', 'czech': 'cz', 'new zealand': 'nz', 'singapore': 'sg',
  'alemanha': 'de', 'frança': 'fr', 'espanha': 'es', 'itália': 'it', 'holanda': 'nl',
  'países baixos': 'nl', 'austrália': 'au', 'japão': 'jp', 'índia': 'in', 'méxico': 'mx',
  'irlanda': 'ie', 'suíça': 'ch', 'suécia': 'se', 'noruega': 'no', 'dinamarca': 'dk',
  'finlândia': 'fi', 'polônia': 'pl', 'nova zelândia': 'nz', 'cingapura': 'sg',
  'estados unidos': 'us', 'reino unido': 'gb', 'inglaterra': 'gb', 'canadá': 'ca',
};

const cityMappings: Record<string, string> = {
  'toronto': 'ca', 'vancouver': 'ca', 'montreal': 'ca', 'calgary': 'ca', 'ottawa': 'ca',
  'new york': 'us', 'san francisco': 'us', 'los angeles': 'us', 'chicago': 'us',
  'seattle': 'us', 'austin': 'us', 'boston': 'us', 'miami': 'us',
  'são paulo': 'br', 'rio de janeiro': 'br', 'belo horizonte': 'br', 'curitiba': 'br',
  'porto alegre': 'br', 'brasília': 'br', 'fortaleza': 'br', 'salvador': 'br',
  'recife': 'br', 'manaus': 'br', 'belém': 'br', 'goiânia': 'br', 'guarulhos': 'br',
  'campinas': 'br', 'london': 'gb', 'londres': 'gb', 'manchester': 'gb',
  'berlin': 'de', 'berlim': 'de', 'munich': 'de', 'paris': 'fr',
  'madrid': 'es', 'barcelona': 'es', 'lisbon': 'pt', 'lisboa': 'pt',
  'amsterdam': 'nl', 'sydney': 'au', 'melbourne': 'au', 'dublin': 'ie',
  'zurich': 'ch', 'tokyo': 'jp', 'tóquio': 'jp',
};

const COUNTRY_CODES_SET = new Set(['br', 'us', 'ca', 'gb', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'au', 'jp', 'in', 'mx', 'ar', 'cl', 'co', 'pe', 'ie', 'ch', 'at', 'be', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'nz', 'sg', 'cn']);

interface LocationInfo {
  countryCode: string;
  city?: string;
  state?: string;
}

function isValidCityOrState(part: string): boolean {
  if (!part || part.length < 2) return false;
  const lower = part.toLowerCase().trim();
  if (COUNTRY_CODES_SET.has(lower)) return false;
  return true;
}

const parseLocation = (location?: string): LocationInfo => {
  if (!location || !location.trim()) return { countryCode: 'br' };

  const locationLower = location.toLowerCase().trim();
  const parts = locationLower.split(',').map(p => p.trim()).filter(Boolean);

  let countryCode = 'br';
  let city: string | undefined;
  let state: string | undefined;

  for (const part of parts) {
    let foundAsCountry = false;
    if (part.length >= 2) {
      for (const [country, code] of Object.entries(countryMappings)) {
        if (part === country || part === code || (part.length >= 3 && part.includes(country)) || (country.length >= 3 && country.includes(part))) {
          countryCode = code;
          foundAsCountry = true;
          break;
        }
      }
    }
    if (foundAsCountry) continue;

    const inCityMappings = Object.keys(cityMappings).find(
      (cityName) => part === cityName || part.includes(cityName) || cityName.includes(part)
    );
    if (inCityMappings) {
      if (isValidCityOrState(part)) city = part;
      if (countryCode === 'br' && cityMappings[inCityMappings] !== 'br') {
        countryCode = cityMappings[inCityMappings];
      }
      continue;
    }

    if (isValidCityOrState(part)) {
      if (part.length === 2 && !city) state = part;
      else if (!city) city = part;
      else if (!state && part.length === 2) state = part;
    }
  }

  if (countryCode === 'br') {
    for (const [country, code] of Object.entries(countryMappings)) {
      if (locationLower.includes(country)) { countryCode = code; break; }
    }
  }

  if (!city && parts.length > 1) {
    for (const part of parts) {
      let isCountry = false;
      for (const [country, code] of Object.entries(countryMappings)) {
        if (part === country || part === code || country.includes(part) || part.includes(country)) { isCountry = true; break; }
      }
      if (!isCountry && isValidCityOrState(part)) { city = part; break; }
    }
  } else if (!city && parts.length === 1) {
    for (const [cityName] of Object.keys(cityMappings)) {
      if (locationLower.includes(cityName)) { if (isValidCityOrState(cityName)) city = cityName; break; }
    }
    if (!city && isValidCityOrState(locationLower)) {
      let isCountry = false;
      for (const country of Object.keys(countryMappings)) {
        if (locationLower.includes(country)) { isCountry = true; break; }
      }
      if (!isCountry) city = locationLower;
    }
  }

  return { countryCode, city, state };
};

const countryDisplayNames: Record<string, string> = {
  'br': 'BRASIL', 'us': 'USA', 'ca': 'CANADA', 'gb': 'UK', 'de': 'GERMANY',
  'fr': 'FRANCE', 'es': 'SPAIN', 'pt': 'PORTUGAL', 'it': 'ITALY', 'nl': 'NETHERLANDS',
  'au': 'AUSTRALIA', 'jp': 'JAPAN', 'in': 'INDIA', 'mx': 'MEXICO', 'ar': 'ARGENTINA',
  'cl': 'CHILE', 'co': 'COLOMBIA', 'pe': 'PERU', 'ie': 'IRELAND', 'ch': 'SWITZERLAND',
  'at': 'AUSTRIA', 'be': 'BELGIUM', 'se': 'SWEDEN', 'no': 'NORWAY', 'dk': 'DENMARK',
  'fi': 'FINLAND', 'pl': 'POLAND', 'cz': 'CZECH', 'nz': 'NEW ZEALAND', 'sg': 'SINGAPORE',
  'cn': 'CHINA',
};

function formatLocationForDisplay(info: LocationInfo): string {
  return countryDisplayNames[info.countryCode] || info.countryCode.toUpperCase();
}

function formatLocationForApi(info: LocationInfo): string {
  const parts: string[] = [];
  if (info.city && isValidCityOrState(info.city)) parts.push(info.city);
  if (info.state && isValidCityOrState(info.state)) parts.push(info.state);
  parts.push(info.countryCode.toUpperCase());
  return parts.length === 1 ? parts[0] : parts.join(', ');
}

/* =============================================
   STYLED COMPONENTS
   ============================================= */

const AppPanel = styled.div`
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeUp 0.8s var(--ease-out-expo) 0.3s forwards;
  opacity: 0;
  transform: translateY(20px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const PanelHeader = styled.div`
  padding: clamp(10px, 1vw + 6px, 14px) clamp(14px, 1.5vw + 8px, 20px);
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
`;

const PanelTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PanelIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #171717;
`;

const PanelTitleText = styled.div`
  h2 {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: #171717;
  }

  p {
    font-size: 0.82rem;
    color: #737373;
    margin-top: 2px;
  }
`;

const BtnRefresh = styled.button<{ $isLoading?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover {
    color: #171717;
    background: #e5e5e5;
    transform: rotate(180deg);
  }

  svg {
    animation: ${({ $isLoading }) => ($isLoading ? 'spin 1s linear infinite' : 'none')};
  }
`;

const PanelFilterRow = styled.div`
  padding: clamp(8px, 0.8vw + 4px, 10px) clamp(14px, 1.5vw + 8px, 20px);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  border-bottom: 1px solid #e5e5e5;
`;

const FilterLabel = styled.span`
  color: #525252;
  font-size: 0.82rem;
  font-weight: 500;
`;

const EditableRole = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #171717;
  padding: 6px 12px;
  border: 1px dashed #d4d4d4;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-fast);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.82rem;

  &:hover {
    border-style: solid;
    border-color: var(--fox-primary);
    background: rgba(255, 85, 0, 0.04);
  }
`;

const EditableRoleInput = styled.input`
  flex: 1;
  min-width: 120px;
  padding: 0;
  border: none;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  color: #171717;
  background: transparent;
  outline: none;

  &::placeholder {
    color: #a3a3a3;
  }
`;

const PanelBody = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const AlertBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: clamp(8px, 0.8vw + 4px, 10px) clamp(10px, 1vw + 6px, 14px);
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(255, 85, 0, 0.06) 0%, rgba(255, 85, 0, 0.01) 100%);
  border: 1px solid rgba(255, 85, 0, 0.15);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AlertLeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AlertIcon = styled.div`
  color: var(--fox-primary);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const AlertTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;

  p {
    font-size: 0.8rem;
    color: #404040;
    font-weight: 600;
    margin: 0;
  }
`;

const AlertSubtext = styled.span`
  font-size: 0.8rem;
  color: #737373;
  font-weight: 400;
`;

const LocationBadge = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  background: rgba(255, 85, 0, 0.08);
  color: var(--fox-primary);
  padding: 4px 10px 4px 8px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: var(--font-body);
  border: 1px solid rgba(255, 85, 0, 0.15);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition-fast);
  position: relative;

  .badge-edit-icon {
    opacity: 0.4;
    transition: var(--transition-fast);
  }

  &:hover {
    background: rgba(255, 85, 0, 0.15);
    border-color: rgba(255, 85, 0, 0.3);
    transform: translateY(-1px);

    .badge-edit-icon {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }
`;

const JobsList = styled.div<{ $exiting?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: 10px;
  flex: 1;
  opacity: ${({ $exiting }) => ($exiting ? 0 : 1)};
  transform: ${({ $exiting }) => ($exiting ? 'scale(0.98) translateY(-8px)' : 'none')};
  transition: ${({ $exiting }) =>
    $exiting
      ? 'opacity 0.28s ease-out, transform 0.28s ease-out'
      : 'none'};
`;

const Shimmer = styled.div<{ $w?: string; $h?: string; $r?: string; $shrink?: boolean }>`
  width: ${({ $w }) => $w || '100%'};
  height: ${({ $h }) => $h || '12px'};
  border-radius: ${({ $r }) => $r || '6px'};
  flex-shrink: ${({ $shrink }) => ($shrink ? 0 : 'initial')};
  background: linear-gradient(
    90deg,
    #e5e5e5 0%,
    #f0f0f0 50%,
    #e5e5e5 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
`;

const SkeletonCard = styled.div<{ $index: number }>`
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  animation: cardReveal 0.5s var(--ease-out-expo) forwards;
  animation-delay: ${({ $index }) => $index * 0.06}s;
  opacity: 0;

  ${Shimmer} {
    animation-delay: ${({ $index }) => $index * 0.15}s;
  }
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const SkeletonTextGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonPills = styled.div`
  display: flex;
  gap: 6px;
  margin-top: auto;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;

  svg {
    width: 32px;
    height: 32px;
    color: #dc2626;
    margin-bottom: 1rem;
  }

  p {
    color: #525252;
    margin: 0;
  }
`;

const emptyPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.6); opacity: 0; }
`;

const emptyFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4.5rem 2rem;
  text-align: center;
  animation: cardReveal 0.6s var(--ease-out-expo) forwards;
  position: relative;
`;

const EmptyGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 280px;
  height: 200px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 85, 0, 0.06) 0%,
    rgba(255, 85, 0, 0.02) 40%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(20px);
`;

const EmptyIconWrap = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(255, 85, 0, 0.08) 0%, rgba(255, 85, 0, 0.02) 100%);
  border: 1px solid rgba(255, 85, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  animation: ${emptyFloat} 4s ease-in-out infinite;
  z-index: 1;

  svg {
    width: 32px;
    height: 32px;
    color: var(--fox-primary);
    opacity: 0.8;
  }

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 22px;
    border: 1px solid rgba(255, 85, 0, 0.15);
    animation: ${emptyPulse} 3s ease-in-out infinite;
    pointer-events: none;
  }
`;

const EmptySparkle = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 26px;
  height: 26px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--fox-primary), var(--fox-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(255, 85, 0, 0.35);

  svg {
    width: 13px;
    height: 13px;
    color: #fff;
    opacity: 1;
  }
`;

const EmptyTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: #171717;
  margin: 0 0 10px 0;
  letter-spacing: -0.02em;
  z-index: 1;
`;

const EmptyDesc = styled.p`
  font-size: 0.88rem;
  color: #525252;
  margin: 0 0 32px 0;
  max-width: 360px;
  line-height: 1.6;
  z-index: 1;
`;

const EmptyHints = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 1;
`;

const EmptyHintBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 500;
  color: #525252;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  padding: 9px 16px;
  border-radius: 10px;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
    transition: all 0.3s var(--ease-out-expo);
  }

  &:hover {
    color: #171717;
    background: rgba(255, 85, 0, 0.08);
    border-color: rgba(255, 85, 0, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    svg {
      opacity: 1;
      color: var(--fox-primary);
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-top: 1px solid #e5e5e5;
`;

const PageBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  min-height: 44px;
  background: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  color: #171717;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #d4d4d4;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.8rem;
  color: #525252;
  font-weight: 500;
`;

/* =============================================
   MATCH SCORE
   ============================================= */

function computeMatchScore(job: Job, keywords: string, userSkills?: string[]): number {
  const title = (job.title || '').toLowerCase();
  const description = (job.description || '').toLowerCase();
  const jobText = `${title} ${description}`;

  const searchTerms = keywords.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (searchTerms.length === 0) return 85;

  let matched = 0;
  for (const term of searchTerms) {
    if (title.includes(term)) matched += 2;
    else if (jobText.includes(term)) matched += 1;
  }

  let skillMatches = 0;
  if (userSkills && userSkills.length > 0) {
    for (const skill of userSkills) {
      const s = skill.toLowerCase();
      if (jobText.includes(s)) skillMatches++;
    }
  }

  const keywordScore = Math.min((matched / (searchTerms.length * 2)) * 60, 60);
  const skillScore = userSkills && userSkills.length > 0
    ? Math.min((skillMatches / userSkills.length) * 40, 40)
    : 25;

  return Math.round(Math.min(Math.max(keywordScore + skillScore, 72), 99));
}

/* =============================================
   COMPONENT
   ============================================= */

const ITEMS_PER_PAGE = 4;

export const JobListings: React.FC<JobListingsProps> = ({
  headline,
  occupation,
  skills,
  location,
  isPCD = false,
  onLocationChange,
}) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [editedKeywords, setEditedKeywords] = useState('');
  const [savedHeadline, setSavedHeadline] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const escapePressedRef = useRef(false);

  const locationInfo = parseLocation(location);

  const getSearchKeywords = useCallback((): string => {
    const keywords: string[] = [];
    const currentHeadline = savedHeadline !== null ? savedHeadline : headline;

    if (currentHeadline) keywords.push(currentHeadline.trim());
    if (!keywords.length && occupation) keywords.push(occupation.trim());

    if (isPCD) {
      const pcdKeywords = [
        'PCD',
        t('recommendedJobs.pcdTerms.personWithDisability'),
        t('recommendedJobs.pcdTerms.disability'),
      ];
      keywords.push(...pcdKeywords);
    }

    return keywords.slice(0, isPCD ? 5 : 3).join(' ') || (isPCD ? `${t('recommendedJobs.pcdTerms.pcd')} Developer` : 'Developer');
  }, [headline, savedHeadline, occupation, isPCD, t]);

  const searchJobs = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const keywords = getSearchKeywords();
      setSearchKeywords(keywords);

      const locationInfo = parseLocation(location);
      const locationString = formatLocationForApi(locationInfo);

      const { data, error: fnError } = await jobsSupabase.functions.invoke('search-linkedin-jobs', {
        body: { keywords, limit: 10, page, location: locationString, country: locationInfo.countryCode }
      });

      if (fnError || data?.error) {
        setError(data?.error || t('recommendedJobs.errors.fetchError'));
        return;
      }

      let fetchedJobs = data.jobs || [];

      if (isPCD) {
        const pcdTerms = [
          'pcd',
          t('recommendedJobs.pcdTerms.personWithDisability').toLowerCase(),
          t('recommendedJobs.pcdTerms.disability').toLowerCase(),
          t('recommendedJobs.pcdTerms.disabled').toLowerCase(),
          t('recommendedJobs.pcdTerms.inclusion').toLowerCase(),
          t('recommendedJobs.pcdTerms.inclusive').toLowerCase(),
          'disability', 'disabled', 'inclusion', 'inclusive', 'pwd', 'person with disability',
          'discapacidad', 'discapacitado', 'inclusión', 'inclusivo',
          'handicap', 'handicapé', 'inclusion', 'inclusif',
        ];
        fetchedJobs = fetchedJobs.filter((job: Job) => {
          const title = (job.title || '').toLowerCase();
          const description = (job.description || '').toLowerCase();
          const company = (job.company_name || job.company || '').toLowerCase();
          const jobText = `${title} ${description} ${company}`;
          return pcdTerms.some(term => term && jobText.includes(term.toLowerCase()));
        });
      }

      setAllJobs(fetchedJobs);
      const total = Math.ceil(fetchedJobs.length / ITEMS_PER_PAGE);
      setTotalPages(total || 1);
      setCurrentPage(1);
      setJobs(fetchedJobs.slice(0, ITEMS_PER_PAGE));
      setPageKey((prev) => prev + 1);
    } catch (err) {
      setError(t('recommendedJobs.errors.fetchError'));
    } finally {
      setIsLoading(false);
    }
  }, [getSearchKeywords, location, t, isPCD]);

  const handleSaveKeywords = async () => {
    if (!editedKeywords.trim()) return;

    const newTitle = editedKeywords.trim();
    setSearchKeywords(newTitle);
    setSavedHeadline(newTitle);
    setIsEditingRole(false);

    if (currentUser && db) {
      try {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        await setDoc(profileRef, {
          professionalTitle: newTitle,
          updatedAt: Timestamp.now(),
        }, { merge: true });
      } catch (error) {
        console.error('Erro ao atualizar título do perfil:', error);
      }
    }

    searchJobsWithKeywords(newTitle, 1);
  };

  const searchJobsWithKeywords = useCallback(async (keywords: string, page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const locationInfo = parseLocation(location);
      const locationString = formatLocationForApi(locationInfo);

      const { data, error: fnError } = await jobsSupabase.functions.invoke('search-linkedin-jobs', {
        body: { keywords, limit: 10, page, location: locationString, country: locationInfo.countryCode }
      });

      if (fnError || data?.error) {
        setError(data?.error || t('recommendedJobs.errors.fetchError'));
        return;
      }

      let fetchedJobs = data.jobs || [];

      if (isPCD) {
        const pcdTerms = [
          'pcd',
          t('recommendedJobs.pcdTerms.personWithDisability').toLowerCase(),
          t('recommendedJobs.pcdTerms.disability').toLowerCase(),
          t('recommendedJobs.pcdTerms.disabled').toLowerCase(),
          t('recommendedJobs.pcdTerms.inclusion').toLowerCase(),
          t('recommendedJobs.pcdTerms.inclusive').toLowerCase(),
          'disability', 'disabled', 'inclusion', 'inclusive', 'pwd', 'person with disability',
          'discapacidad', 'discapacitado', 'inclusión', 'inclusivo',
          'handicap', 'handicapé', 'inclusion', 'inclusif',
        ];
        fetchedJobs = fetchedJobs.filter((job: Job) => {
          const title = (job.title || '').toLowerCase();
          const description = (job.description || '').toLowerCase();
          const company = (job.company_name || job.company || '').toLowerCase();
          const jobText = `${title} ${description} ${company}`;
          return pcdTerms.some(term => term && jobText.includes(term.toLowerCase()));
        });
      }

      setAllJobs(fetchedJobs);
      const total = Math.ceil(fetchedJobs.length / ITEMS_PER_PAGE);
      setTotalPages(total || 1);
      setCurrentPage(1);
      setJobs(fetchedJobs.slice(0, ITEMS_PER_PAGE));
      setPageKey((prev) => prev + 1);
    } catch (err) {
      setError(t('recommendedJobs.errors.fetchError'));
    } finally {
      setIsLoading(false);
    }
  }, [location, t, isPCD]);

  useEffect(() => {
    if (savedHeadline === null && headline) {
      const keywords = getSearchKeywords();
      if (keywords !== searchKeywords) {
        setSearchKeywords(keywords);
        setEditedKeywords(keywords);
      }
    }
  }, [headline, savedHeadline, getSearchKeywords, searchKeywords]);

  useEffect(() => {
    if (searchKeywords) setEditedKeywords(searchKeywords);
  }, [searchKeywords]);

  useEffect(() => {
    if (savedHeadline !== null || !savedHeadline) {
      searchJobs(1);
    }
  }, [headline, occupation, skills, location, searchJobs, savedHeadline]);

  const handleRefresh = () => {
    if (isLoading || isExiting) return;

    setIsExiting(true);

    setTimeout(() => {
      setIsExiting(false);
      searchJobs(1);
    }, 180);
  };

  const navigateToPage = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || isExiting) return;

    setIsExiting(true);

    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setJobs(allJobs.slice(startIndex, endIndex));
      setCurrentPage(page);
      setIsExiting(false);
      setPageKey((prev) => prev + 1);
    }, 300);
  };

  const handleLocationConfirm = (selection: LocationSelection) => {
    onLocationChange?.(selection);
  };

  return (
    <>
      <AppPanel>
        <PanelHeader>
          <PanelTitleGroup>
            <PanelIcon>
              <Briefcase size={20} />
            </PanelIcon>
            <PanelTitleText>
              <h2>{t('recommendedJobs.title')}</h2>
              <p>{t('recommendedJobs.subtitle')}</p>
            </PanelTitleText>
          </PanelTitleGroup>
          <BtnRefresh onClick={handleRefresh} disabled={isLoading || isExiting} $isLoading={isLoading} title={t('recommendedJobs.refresh')}>
            <RefreshCw size={16} />
          </BtnRefresh>
        </PanelHeader>

        <PanelFilterRow>
          <FilterLabel>{t('recommendedJobs.jobTypeLabel')}</FilterLabel>
          {isEditingRole ? (
            <EditableRole style={{ borderStyle: 'solid', borderColor: 'var(--fox-primary)', background: 'rgba(255, 85, 0, 0.04)' }}>
              <EditableRoleInput
                type="text"
                value={editedKeywords}
                onChange={(e) => setEditedKeywords(e.target.value)}
                placeholder={t('recommendedJobs.jobTitlePlaceholder')}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    escapePressedRef.current = false;
                    handleSaveKeywords();
                  } else if (e.key === 'Escape') {
                    escapePressedRef.current = true;
                    setEditedKeywords(searchKeywords);
                    setIsEditingRole(false);
                  }
                }}
                onBlur={() => {
                  if (!escapePressedRef.current) handleSaveKeywords();
                  escapePressedRef.current = false;
                }}
              />
              <Pen size={14} />
            </EditableRole>
          ) : (
            <EditableRole onClick={() => setIsEditingRole(true)}>
              {editedKeywords || occupation || 'Developer'}
              <Edit3 size={14} />
            </EditableRole>
          )}
        </PanelFilterRow>

        <PanelBody>
          <AlertBanner>
            <AlertLeftGroup>
              <AlertIcon>
                <AlertCircle size={18} />
              </AlertIcon>
              <AlertTextWrapper>
                <p>{t('recommendedJobs.locationInfo.message')}</p>
                <AlertSubtext>{t('recommendedJobs.locationInfo.changeCountry')}</AlertSubtext>
              </AlertTextWrapper>
            </AlertLeftGroup>
            <LocationBadge onClick={(e) => {
              e.stopPropagation();
              if (!isLocationModalOpen) setIsLocationModalOpen(true);
            }}>
              <MapPin size={12} />
              {formatLocationForDisplay(locationInfo)}
              <Edit3 size={10} className="badge-edit-icon" />
            </LocationBadge>
          </AlertBanner>

          {isLoading && (
            <JobsList>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} $index={i}>
                  <SkeletonRow>
                    <Shimmer $w="44px" $h="44px" $r="11px" $shrink />
                    <SkeletonTextGroup>
                      <Shimmer $w="65%" $h="14px" />
                      <Shimmer $w="45%" $h="10px" />
                    </SkeletonTextGroup>
                  </SkeletonRow>
                  <SkeletonPills>
                    <Shimmer $w="48px" $h="26px" $r="7px" />
                    <Shimmer $w="72px" $h="26px" $r="7px" />
                    <Shimmer $w="88px" $h="26px" $r="7px" />
                  </SkeletonPills>
                </SkeletonCard>
              ))}
            </JobsList>
          )}

          {error && !isLoading && (
            <ErrorState>
              <AlertCircle />
              <p>{error}</p>
            </ErrorState>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <EmptyState>
              <EmptyGlow />
              <EmptyIconWrap>
                <SearchX />
                <EmptySparkle><Sparkles /></EmptySparkle>
              </EmptyIconWrap>
              <EmptyTitle>{t('recommendedJobs.empty.title')}</EmptyTitle>
              <EmptyDesc>{t('recommendedJobs.empty.description')}</EmptyDesc>
              <EmptyHints>
                <EmptyHintBtn onClick={() => setIsLocationModalOpen(true)}>
                  <Globe />
                  {t('recommendedJobs.empty.hints.location', { defaultValue: 'Alterar localização' })}
                </EmptyHintBtn>
                <EmptyHintBtn onClick={() => setIsEditingRole(true)}>
                  <KeyRound />
                  {t('recommendedJobs.empty.hints.keywords', { defaultValue: 'Mudar palavras-chave' })}
                </EmptyHintBtn>
                <EmptyHintBtn onClick={() => window.location.href = '/profile'}>
                  <UserCog />
                  {t('recommendedJobs.empty.hints.profile', { defaultValue: 'Completar perfil' })}
                </EmptyHintBtn>
              </EmptyHints>
            </EmptyState>
          )}

          {!isLoading && !error && jobs.length > 0 && (
            <JobsList $exiting={isExiting}>
              {jobs.map((job, index) => (
                <JobCard
                  key={`${pageKey}-${job.job_id || index}`}
                  title={job.title}
                  company={job.company}
                  companyLogo={job.company_logo}
                  location={job.location}
                  postedDate={job.posted_date}
                  jobUrl={job.job_url}
                  employmentType={job.employment_type}
                  salaryRange={job.salary_range}
                  matchScore={computeMatchScore(job, searchKeywords, skills)}
                  index={index}
                  baseDelay={pageKey === 0 ? 0.3 : 0}
                />
              ))}
            </JobsList>
          )}
        </PanelBody>

        {!error && jobs.length > 0 && (
          <Pagination>
            <PageBtn onClick={() => navigateToPage(currentPage - 1)} disabled={currentPage <= 1 || isExiting || isLoading}>
              <ChevronLeft size={16} />
              {t('recommendedJobs.pagination.previous')}
            </PageBtn>
            <PageInfo>{t('recommendedJobs.pagination.page')} {currentPage} / {totalPages}</PageInfo>
            <PageBtn onClick={() => navigateToPage(currentPage + 1)} disabled={currentPage >= totalPages || isExiting || isLoading}>
              {t('recommendedJobs.pagination.next')}
              <ChevronRight size={16} />
            </PageBtn>
          </Pagination>
        )}
      </AppPanel>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
      />
    </>
  );
};
