import React, { useState, useEffect, useMemo } from 'react';
import { Country, State, City } from 'country-state-city';
import type { ICountry } from 'country-state-city';
import styled from 'styled-components';

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e0e0e0'};
  border-radius: 0.375rem;
  background: ${({ theme }) => theme?.colors?.background || '#fff'};
  color: ${({ theme }) => theme?.colors?.text || '#333'};
  cursor: pointer;
  appearance: auto;
  min-height: 2.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme?.colors?.text || '#333'};
  margin-bottom: 0.25rem;
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export interface LocationValue {
  countryCode: string;
  stateCode?: string;
  cityName?: string;
}

/** Formata LocationValue para string única (ex.: "São Paulo, SP, BR" ou "BR") */
export function formatLocationValue(v: LocationValue): string {
  const parts: string[] = [];
  if (v.cityName?.trim()) parts.push(v.cityName.trim());
  if (v.stateCode?.trim()) parts.push(v.stateCode.trim().toUpperCase());
  if (v.countryCode?.trim()) parts.push(v.countryCode.trim().toUpperCase());
  return parts.length ? parts.join(', ') : '';
}

/** Parseia string salva (ex.: "São Paulo, SP, BR") para LocationValue */
export function parseLocationString(value: string | undefined): LocationValue {
  const result: LocationValue = { countryCode: '' };
  if (!value || !value.trim()) return result;

  const parts = value.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return result;

  const last = parts[parts.length - 1];
  const countryCode = last.length === 2 ? last.toUpperCase() : undefined;
  const countries = Country.getAllCountries();
  let matchedCountry: ICountry | undefined;

  if (countryCode) {
    matchedCountry = countries.find((c) => c.isoCode === countryCode);
  }
  if (!matchedCountry && last) {
    matchedCountry = countries.find(
      (c) => c.name.toLowerCase() === last.toLowerCase()
    );
  }
  if (matchedCountry) {
    result.countryCode = matchedCountry.isoCode;
    if (parts.length >= 2) {
      const second = parts[parts.length - 2];
      const states = State.getStatesOfCountry(matchedCountry.isoCode);
      const stateByCode = states.find(
        (s) => s.isoCode === second || s.isoCode === second.toUpperCase()
      );
      const stateByName = states.find(
        (s) => s.name.toLowerCase() === second.toLowerCase()
      );
      const state = stateByCode || stateByName;
      if (state) {
        result.stateCode = state.isoCode;
        if (parts.length >= 3) {
          result.cityName = parts.slice(0, -2).join(', ').trim() || undefined;
        }
      } else if (parts.length === 2) {
        result.stateCode = second.length <= 3 ? second.toUpperCase() : undefined;
        if (!result.stateCode) result.cityName = second;
      } else if (parts.length >= 3) {
        result.cityName = parts.slice(0, -1).join(', ').trim();
      }
    }
  } else if (parts.length === 1) {
    const one = parts[0];
    if (one.length === 2) {
      const c = countries.find((x) => x.isoCode === one.toUpperCase());
      if (c) result.countryCode = c.isoCode;
    } else {
      const c = countries.find(
        (x) => x.name.toLowerCase() === one.toLowerCase()
      );
      if (c) result.countryCode = c.isoCode;
    }
  }
  return result;
}

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  countryLabel?: string;
  stateLabel?: string;
  cityLabel?: string;
  placeholderCountry?: string;
  placeholderState?: string;
  placeholderCity?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  disabled = false,
  countryLabel = 'País',
  stateLabel = 'Estado / Província',
  cityLabel = 'Cidade',
  placeholderCountry = 'Selecione o país',
  placeholderState = 'Selecione o estado',
  placeholderCity = 'Selecione a cidade',
}) => {
  const parsed = useMemo(() => parseLocationString(value), [value]);
  const [countryCode, setCountryCode] = useState(parsed.countryCode);
  const [stateCode, setStateCode] = useState(parsed.stateCode || '');
  const [cityName, setCityName] = useState(parsed.cityName || '');

  useEffect(() => {
    setCountryCode(parsed.countryCode);
    setStateCode(parsed.stateCode || '');
    setCityName(parsed.cityName || '');
  }, [value, parsed.countryCode, parsed.stateCode, parsed.cityName]);

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () => (countryCode ? State.getStatesOfCountry(countryCode) : []),
    [countryCode]
  );
  const cities = useMemo(() => {
    if (!countryCode) return [];
    if (stateCode) return City.getCitiesOfState(countryCode, stateCode);
    return City.getCitiesOfCountry(countryCode).slice(0, 1500);
  }, [countryCode, stateCode]);

  const emitChange = (next: LocationValue) => {
    onChange(formatLocationValue(next));
  };

  const handleCountryChange = (isoCode: string) => {
    setCountryCode(isoCode);
    setStateCode('');
    setCityName('');
    emitChange({ countryCode: isoCode });
  };

  const handleStateChange = (isoCode: string) => {
    setStateCode(isoCode);
    setCityName('');
    emitChange({
      countryCode,
      stateCode: isoCode || undefined,
    });
  };

  const handleCityChange = (name: string) => {
    setCityName(name);
    emitChange({
      countryCode,
      stateCode: stateCode || undefined,
      cityName: name || undefined,
    });
  };

  return (
    <Row>
      <FieldWrap>
        <Label>{countryLabel}</Label>
        <Select
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          disabled={disabled}
          aria-label={countryLabel}
        >
          <option value="">{placeholderCountry}</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.flag} {c.name}
            </option>
          ))}
        </Select>
      </FieldWrap>
      <FieldWrap>
        <Label>{stateLabel}</Label>
        <Select
          value={stateCode}
          onChange={(e) => handleStateChange(e.target.value)}
          disabled={disabled || !countryCode}
          aria-label={stateLabel}
        >
          <option value="">{placeholderState}</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </Select>
      </FieldWrap>
      <FieldWrap>
        <Label>{cityLabel}</Label>
        <Select
          value={cityName}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={disabled || !countryCode}
          aria-label={cityLabel}
        >
          <option value="">{placeholderCity}</option>
          {cities.map((c) => (
            <option key={`${c.stateCode}-${c.name}`} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
      </FieldWrap>
    </Row>
  );
};
