import { Country as CSCCountry, State as CSCState, City } from 'country-state-city';

/* =============================================
   TYPES
   ============================================= */

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}

export interface LocationSelection {
  country: Country | null;
  state?: State | null;
  city?: string | null;
}

/* =============================================
   FLAG HELPER
   ============================================= */

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

/* =============================================
   COUNTRIES
   ============================================= */

const PRIORITY_COUNTRIES = ['BR', 'US', 'PT', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'AU', 'IE', 'CH', 'SE', 'NO', 'DK', 'FI', 'JP', 'SG', 'NZ'];

const COUNTRY_NAME_OVERRIDES: Record<string, string> = {
  'BR': 'Brasil',
  'US': 'Estados Unidos',
  'PT': 'Portugal',
  'GB': 'Reino Unido',
  'DE': 'Alemanha',
  'FR': 'França',
  'ES': 'Espanha',
  'IT': 'Itália',
  'NL': 'Holanda',
  'AU': 'Austrália',
  'JP': 'Japão',
  'CA': 'Canadá',
  'MX': 'México',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colômbia',
  'PE': 'Peru',
  'IE': 'Irlanda',
  'CH': 'Suíça',
  'AT': 'Áustria',
  'BE': 'Bélgica',
  'SE': 'Suécia',
  'NO': 'Noruega',
  'DK': 'Dinamarca',
  'FI': 'Finlândia',
  'PL': 'Polônia',
  'CZ': 'República Tcheca',
  'NZ': 'Nova Zelândia',
  'SG': 'Cingapura',
  'IN': 'Índia',
  'CN': 'China',
};

export const COUNTRIES: Country[] = (() => {
  const allCountries = CSCCountry.getAllCountries();
  const mapped: Country[] = allCountries.map((c) => ({
    code: c.isoCode,
    name: COUNTRY_NAME_OVERRIDES[c.isoCode] || c.name,
    flag: countryCodeToFlag(c.isoCode),
  }));

  // Priority countries first, then the rest alphabetically
  const priority = PRIORITY_COUNTRIES
    .map((code) => mapped.find((c) => c.code === code))
    .filter(Boolean) as Country[];
  const rest = mapped
    .filter((c) => !PRIORITY_COUNTRIES.includes(c.code))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt'));

  return [...priority, ...rest];
})();

/* =============================================
   STATES
   ============================================= */

const statesCache = new Map<string, State[]>();

export function getStatesByCountry(countryCode: string): State[] {
  const cached = statesCache.get(countryCode);
  if (cached) return cached;

  const states = CSCState.getStatesOfCountry(countryCode);
  const result = states
    .map((s) => ({
      code: s.isoCode,
      name: s.name,
      countryCode: s.countryCode,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt'));

  statesCache.set(countryCode, result);
  return result;
}

/* =============================================
   CITIES
   ============================================= */

const citiesCache = new Map<string, string[]>();

export function getCitiesByState(stateCode: string, countryCode?: string): string[] {
  const cacheKey = `${countryCode || ''}-${stateCode}`;
  const cached = citiesCache.get(cacheKey);
  if (cached) return cached;

  if (!countryCode) {
    // Try to find country from state
    const allCountries = CSCCountry.getAllCountries();
    for (const country of allCountries) {
      const states = CSCState.getStatesOfCountry(country.isoCode);
      if (states.some((s) => s.isoCode === stateCode)) {
        countryCode = country.isoCode;
        break;
      }
    }
  }
  if (!countryCode) return [];

  const cities = City.getCitiesOfState(countryCode, stateCode);
  const result = cities.map((c) => c.name).sort((a, b) => a.localeCompare(b, 'pt'));

  citiesCache.set(cacheKey, result);
  return result;
}

/* =============================================
   FORMATTERS
   ============================================= */

export function formatLocationLabel(selection: LocationSelection): string {
  if (!selection.country) return '';

  const parts: string[] = [];
  if (selection.city) parts.push(selection.city);
  if (selection.state) parts.push(selection.state.code);
  parts.push(selection.country.name);

  return parts.join(', ');
}
