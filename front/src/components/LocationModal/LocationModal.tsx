import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';
import { Globe, X, Search, Check, ChevronRight, ArrowLeft, MapPin } from 'lucide-react';
import {
  type Country,
  type State,
  type LocationSelection,
  COUNTRIES,
  getStatesByCountry,
  getCitiesByState,
} from '../../data/locations';

/* =============================================
   TYPES
   ============================================= */

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selection: LocationSelection) => void;
  initialSelection?: LocationSelection;
}

/* =============================================
   STYLED COMPONENTS
   ============================================= */

const Overlay = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${({ $isClosing }) =>
    $isClosing ? 'modalOverlayOut' : 'modalOverlayIn'}
    ${({ $isClosing }) => ($isClosing ? '0.18s' : '0.25s')}
    var(--ease-out-expo) forwards;
`;

const Container = styled.div<{ $isClosing: boolean }>`
  width: min(780px, 93vw);
  max-height: min(600px, 85vh);
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${({ $isClosing }) =>
    $isClosing ? 'modalContentOut' : 'modalContentIn'}
    ${({ $isClosing }) => ($isClosing ? '0.18s' : '0.3s')}
    var(--ease-out-expo) forwards;
  opacity: 0;

  @media (max-width: 768px) {
    width: min(480px, calc(100vw - 32px));
    height: calc(100dvh - 64px);
    max-height: calc(100dvh - 64px);
    border-radius: 16px;
  }
`;

/* --- Header --- */

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const HeaderIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.12) 0%, rgba(255, 85, 0, 0.04) 100%);
  border: 1px solid rgba(255, 85, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fox-primary);
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const HeaderTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: #171717;
  letter-spacing: -0.01em;
`;

const HeaderSubtitle = styled.span`
  font-size: 0.74rem;
  color: #525252;
  letter-spacing: 0.01em;
`;

const CloseBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover {
    color: #171717;
    background: #f5f5f5;
    border-color: #e5e5e5;
  }
`;

/* --- Scope banner --- */

const ScopeBanner = styled.div<{ $hasSelection: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  border-bottom: 1px solid #e5e5e5;
  background: ${({ $hasSelection }) =>
    $hasSelection
      ? 'linear-gradient(90deg, rgba(255, 85, 0, 0.06) 0%, transparent 60%)'
      : 'transparent'};
  transition: background 0.4s var(--ease-out-expo);
`;

const ScopeDot = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? 'var(--fox-primary)' : '#d4d4d4')};
  flex-shrink: 0;
  transition: var(--transition-fast);
`;

const ScopeText = styled.span`
  font-size: 0.76rem;
  color: #525252;
  line-height: 1;

  strong {
    color: #171717;
    font-weight: 500;
  }
`;

/* --- Mobile breadcrumb --- */

const MobileBreadcrumb = styled.div`
  display: none;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-bottom: 1px solid #e5e5e5;
  font-size: 0.78rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const BreadcrumbItem = styled.button<{ $active?: boolean; $completed?: boolean }>`
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, $completed }) =>
    $active
      ? 'var(--fox-primary)'
      : $completed
        ? '#525252'
        : '#a3a3a3'};
  cursor: ${({ $completed }) => ($completed ? 'pointer' : 'default')};
  padding: 4px 8px;
  border-radius: 6px;
  transition: var(--transition-fast);

  &:hover {
    ${({ $completed }) =>
      $completed &&
      `background: #f5f5f5;`}
  }
`;

const BreadcrumbSep = styled.span`
  color: #d4d4d4;
`;

const MobileBackBtn = styled.button`
  background: none;
  border: none;
  color: #525252;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: var(--transition-fast);
  margin-right: 4px;

  &:hover {
    color: #171717;
    background: #f5f5f5;
  }
`;

/* --- Columns --- */

const ColumnsWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    position: relative;
    min-height: 200px;
  }
`;

const Column = styled.div<{ $mobileVisible?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;

  & + & {
    border-left: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    position: absolute;
    inset: 0;
    display: ${({ $mobileVisible }) => ($mobileVisible ? 'flex' : 'none')};

    & + & {
      border-left: none;
    }
  }
`;

const ColumnHeader = styled.div`
  padding: 16px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
`;

const ColumnTitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

const ColumnTitleLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const ColumnTitle = styled.span`
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: #171717;
  letter-spacing: -0.01em;
`;

const optionalStyle = css`
  font-size: 0.65rem;
  font-weight: 500;
  color: #737373;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: #f5f5f5;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
`;

const ColumnOptional = styled.span`
  ${optionalStyle}
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--fox-primary);
  cursor: pointer;
  padding: 3px 10px;
  border-radius: 6px;
  opacity: 1;
  background: rgba(255, 85, 0, 0.08);
  border: 1px solid rgba(255, 85, 0, 0.15);
  transition: var(--transition-fast);

  &:hover {
    opacity: 1;
    background: rgba(255, 85, 0, 0.08);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconEl = styled.div`
  position: absolute;
  left: 11px;
  color: #737373;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchField = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 12px 0 34px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  color: #171717;
  font-family: var(--font-body);
  font-size: 0.8rem;
  outline: none;
  transition: var(--transition-fast);

  &::placeholder {
    color: #a3a3a3;
  }

  &:focus {
    border-color: var(--fox-primary, #FF5500);
    background: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* --- List --- */

const ColumnList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 8px 8px;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d4d4d4;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a3a3a3;
  }
`;

const ListItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${({ $selected }) =>
    $selected ? 'rgba(255, 85, 0, 0.08)' : 'transparent'};
  border: none;
  border-left: none;
  border-radius: 8px;
  color: ${({ $selected }) =>
    $selected ? '#171717' : '#525252'};
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  transition: var(--transition-fast);
  text-align: left;
  animation: listItemIn 0.25s var(--ease-out-expo) forwards;
  opacity: 0;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? 'rgba(255, 85, 0, 0.12)' : '#f5f5f5'};
    color: #171717;
  }
`;

const ItemFlag = styled.span`
  font-size: 1.05rem;
  line-height: 1;
  flex-shrink: 0;
`;

const ItemLabel = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemCheck = styled.div`
  color: var(--fox-primary);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const ItemChevron = styled.div`
  color: #a3a3a3;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media (min-width: 769px) {
    display: none;
  }
`;

/* --- Empty state --- */

const EmptyColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 2rem;
  text-align: center;
`;

const EmptyDot = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  border: 1px dashed #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a3a3a3;
`;

const EmptyTitle = styled.span`
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 500;
  color: #737373;
  letter-spacing: -0.01em;
`;

const EmptyHint = styled.span`
  font-size: 0.7rem;
  color: #a3a3a3;
  max-width: 160px;
  line-height: 1.5;
`;

/* --- Footer --- */

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e5e5;
  gap: 16px;
`;

const SelectionSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;

  svg {
    flex-shrink: 0;
    color: #737373;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SummaryText = styled.span`
  font-size: 0.78rem;
  color: #525252;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  strong {
    color: #171717;
    font-weight: 500;
  }
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
`;

const BtnCancel = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover {
    color: #171717;
    background: #fafafa;
    border-color: #e5e5e5;
  }
`;

const BtnConfirm = styled.button<{ $disabled?: boolean }>`
  padding: 10px 22px;
  background: var(--fox-primary);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: var(--transition-fast);
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
  display: flex;
  align-items: center;
  gap: 7px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: var(--fox-secondary);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

/* =============================================
   COMPONENT
   ============================================= */

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialSelection,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    initialSelection?.country || null
  );
  const [selectedState, setSelectedState] = useState<State | null>(
    initialSelection?.state || null
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    initialSelection?.city || null
  );
  const [searchCountry, setSearchCountry] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [mobileStep, setMobileStep] = useState<0 | 1 | 2>(0);
  const [listKey, setListKey] = useState(0);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);
  const closingRef = useRef(false);

  // Synchronous state reset BEFORE paint
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setIsClosing(false);
    closingRef.current = false;
    setSelectedCountry(initialSelection?.country || null);
    setSelectedState(initialSelection?.state || null);
    setSelectedCity(initialSelection?.city || null);
    setSearchCountry('');
    setSearchState('');
    setSearchCity('');
    setMobileStep(0);
    setListKey((prev) => prev + 1);
  }
  if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => countrySearchRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    setTimeout(() => { onClose(); }, 190);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && !closingRef.current) handleClose();
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setSearchState('');
    setSearchCity('');
    setListKey((prev) => prev + 1);
    setMobileStep(1);
  };

  const handleStateSelect = (state: State) => {
    setSelectedState(state);
    setSelectedCity(null);
    setSearchCity('');
    setListKey((prev) => prev + 1);
    setMobileStep(2);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleConfirm = () => {
    if (!selectedCountry) return;
    onConfirm({ country: selectedCountry, state: selectedState, city: selectedCity });
    handleClose();
  };

  // Filtered data (memoized to avoid recalculation on every render)
  const filteredCountries = useMemo(
    () => COUNTRIES.filter((c) => c.name.toLowerCase().includes(searchCountry.toLowerCase())),
    [searchCountry]
  );
  const states = useMemo(
    () => (selectedCountry ? getStatesByCountry(selectedCountry.code) : []),
    [selectedCountry]
  );
  const filteredStates = useMemo(
    () => states.filter((s) => s.name.toLowerCase().includes(searchState.toLowerCase())),
    [states, searchState]
  );
  const cities = useMemo(
    () => (selectedState && selectedCountry ? getCitiesByState(selectedState.code, selectedCountry.code) : []),
    [selectedState, selectedCountry]
  );
  const filteredCities = useMemo(
    () => cities.filter((c) => c.toLowerCase().includes(searchCity.toLowerCase())),
    [cities, searchCity]
  );

  // Scope
  const getScopeBanner = () => {
    if (!selectedCountry) return 'Selecione um país para começar';
    if (selectedCity && selectedState)
      return <span>Vagas em <strong>{selectedCity}, {selectedState.code}</strong></span>;
    if (selectedState)
      return <span>Vagas em <strong>{selectedState.name}, {selectedCountry.name}</strong></span>;
    return <span>Vagas de <strong>todo o {selectedCountry.name}</strong></span>;
  };

  const getFooterSummary = () => {
    if (!selectedCountry) return null;
    if (selectedCity && selectedState)
      return <span><strong>{selectedCity}</strong>, {selectedState.code} — {selectedCountry.name}</span>;
    if (selectedState)
      return <span><strong>{selectedState.name}</strong> — {selectedCountry.name}</span>;
    return <span>Todo o <strong>{selectedCountry.name}</strong></span>;
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay ref={overlayRef} $isClosing={isClosing} onClick={handleOverlayClick} onMouseDown={(e) => e.stopPropagation()}>
      <Container $isClosing={isClosing} role="dialog" aria-modal="true">
        <ModalHeader>
          <HeaderLeft>
            <HeaderIcon>
              <Globe size={19} />
            </HeaderIcon>
            <HeaderTitleGroup>
              <HeaderTitle>Selecionar Localização</HeaderTitle>
              <HeaderSubtitle>Escolha o país e, se quiser, filtre por estado e cidade.</HeaderSubtitle>
            </HeaderTitleGroup>
          </HeaderLeft>
          <CloseBtn onClick={handleClose} aria-label="Fechar">
            <X size={16} />
          </CloseBtn>
        </ModalHeader>

        <MobileBreadcrumb>
          {mobileStep > 0 && (
            <MobileBackBtn onClick={() => setMobileStep((prev) => Math.max(0, prev - 1) as 0 | 1 | 2)}>
              <ArrowLeft size={16} />
            </MobileBackBtn>
          )}
          <BreadcrumbItem $active={mobileStep === 0} $completed={!!selectedCountry} onClick={() => setMobileStep(0)}>
            País
          </BreadcrumbItem>
          <BreadcrumbSep><ChevronRight size={12} /></BreadcrumbSep>
          <BreadcrumbItem $active={mobileStep === 1} $completed={!!selectedState} onClick={() => selectedCountry && setMobileStep(1)}>
            Estado
          </BreadcrumbItem>
          <BreadcrumbSep><ChevronRight size={12} /></BreadcrumbSep>
          <BreadcrumbItem $active={mobileStep === 2} onClick={() => selectedState && setMobileStep(2)}>
            Cidade
          </BreadcrumbItem>
        </MobileBreadcrumb>

        <ScopeBanner $hasSelection={!!selectedCountry}>
          <ScopeDot $active={!!selectedCountry} />
          <ScopeText>{getScopeBanner()}</ScopeText>
        </ScopeBanner>

        <ColumnsWrapper>
          {/* ---- País ---- */}
          <Column $mobileVisible={mobileStep === 0}>
            <ColumnHeader>
              <ColumnTitleRow>
                <ColumnTitle>País</ColumnTitle>
              </ColumnTitleRow>
              <SearchWrapper>
                <SearchIconEl><Search size={14} /></SearchIconEl>
                <SearchField
                  ref={countrySearchRef}
                  placeholder="Buscar país..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                />
              </SearchWrapper>
            </ColumnHeader>
            <ColumnList>
              {filteredCountries.map((country, i) => (
                <ListItem
                  key={country.code}
                  $selected={selectedCountry?.code === country.code}
                  style={{ animationDelay: `${Math.min(i * 0.02, 0.4)}s` }}
                  onClick={() => handleCountrySelect(country)}
                >
                  <ItemFlag>{country.flag}</ItemFlag>
                  <ItemLabel>{country.name}</ItemLabel>
                  {selectedCountry?.code === country.code ? (
                    <ItemCheck><Check size={15} /></ItemCheck>
                  ) : (
                    <ItemChevron><ChevronRight size={14} /></ItemChevron>
                  )}
                </ListItem>
              ))}
            </ColumnList>
          </Column>

          {/* ---- Estado ---- */}
          <Column $mobileVisible={mobileStep === 1}>
            <ColumnHeader>
              <ColumnTitleRow>
                <ColumnTitleLeft>
                  <ColumnTitle>Estado</ColumnTitle>
                  <ColumnOptional>opcional</ColumnOptional>
                </ColumnTitleLeft>
                {selectedState && (
                  <ClearBtn onClick={() => {
                    setSelectedState(null);
                    setSelectedCity(null);
                    setSearchCity('');
                    setListKey((prev) => prev + 1);
                  }}>
                    limpar
                  </ClearBtn>
                )}
              </ColumnTitleRow>
              <SearchWrapper>
                <SearchIconEl><Search size={14} /></SearchIconEl>
                <SearchField
                  placeholder="Buscar estado..."
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                  disabled={!selectedCountry}
                />
              </SearchWrapper>
            </ColumnHeader>
            {selectedCountry && filteredStates.length > 0 ? (
              <ColumnList key={`states-${listKey}`}>
                {filteredStates.map((state, i) => (
                  <ListItem
                    key={state.code}
                    $selected={selectedState?.code === state.code}
                    style={{ animationDelay: `${Math.min(i * 0.02, 0.4)}s` }}
                    onClick={() => handleStateSelect(state)}
                  >
                    <ItemLabel>{state.name}</ItemLabel>
                    {selectedState?.code === state.code ? (
                      <ItemCheck><Check size={15} /></ItemCheck>
                    ) : (
                      <ItemChevron><ChevronRight size={14} /></ItemChevron>
                    )}
                  </ListItem>
                ))}
              </ColumnList>
            ) : (
              <EmptyColumn>
                <EmptyDot>
                  <ChevronRight size={16} />
                </EmptyDot>
                <EmptyTitle>
                  {selectedCountry ? 'Nenhum estado encontrado' : 'Selecione um país'}
                </EmptyTitle>
                <EmptyHint>
                  {selectedCountry
                    ? 'Tente outra busca ou confirme apenas com o país'
                    : 'Escolha um país na primeira coluna para refinar'}
                </EmptyHint>
              </EmptyColumn>
            )}
          </Column>

          {/* ---- Cidade ---- */}
          <Column $mobileVisible={mobileStep === 2}>
            <ColumnHeader>
              <ColumnTitleRow>
                <ColumnTitleLeft>
                  <ColumnTitle>Cidade</ColumnTitle>
                  <ColumnOptional>opcional</ColumnOptional>
                </ColumnTitleLeft>
                {selectedCity && (
                  <ClearBtn onClick={() => setSelectedCity(null)}>
                    limpar
                  </ClearBtn>
                )}
              </ColumnTitleRow>
              <SearchWrapper>
                <SearchIconEl><Search size={14} /></SearchIconEl>
                <SearchField
                  placeholder="Buscar cidade..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  disabled={!selectedState}
                />
              </SearchWrapper>
            </ColumnHeader>
            {selectedState && filteredCities.length > 0 ? (
              <ColumnList key={`cities-${listKey}`}>
                {filteredCities.map((city, i) => (
                  <ListItem
                    key={city}
                    $selected={selectedCity === city}
                    style={{ animationDelay: `${Math.min(i * 0.02, 0.4)}s` }}
                    onClick={() => handleCitySelect(city)}
                  >
                    <ItemLabel>{city}</ItemLabel>
                    {selectedCity === city && (
                      <ItemCheck><Check size={15} /></ItemCheck>
                    )}
                  </ListItem>
                ))}
              </ColumnList>
            ) : (
              <EmptyColumn>
                <EmptyDot>
                  <ChevronRight size={16} />
                </EmptyDot>
                <EmptyTitle>
                  {selectedState ? 'Nenhuma cidade encontrada' : 'Selecione um estado'}
                </EmptyTitle>
                <EmptyHint>
                  {selectedState
                    ? 'Tente outra busca ou confirme com o estado'
                    : 'Escolha um estado para filtrar por cidade'}
                </EmptyHint>
              </EmptyColumn>
            )}
          </Column>
        </ColumnsWrapper>

        <Footer>
          <SelectionSummary>
            <MapPin size={13} />
            <SummaryText>
              {getFooterSummary() || 'Nenhuma localização selecionada'}
            </SummaryText>
          </SelectionSummary>
          <FooterActions>
            <BtnCancel onClick={handleClose}>Cancelar</BtnCancel>
            <BtnConfirm
              $disabled={!selectedCountry}
              disabled={!selectedCountry}
              onClick={handleConfirm}
            >
              Confirmar
            </BtnConfirm>
          </FooterActions>
        </Footer>
      </Container>
    </Overlay>,
    document.body
  );
};

export default LocationModal;
