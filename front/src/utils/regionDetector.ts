export type Region = 'BR' | 'EU' | 'OTHER';

export interface RegionConfig {
  region: Region;
  currency: 'BRL' | 'EUR' | 'USD';
  currencySymbol: 'R$' | '€' | '$';
  price: number;
  priceDisplay: string;
}

const EUROPEAN_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE', 'GB', 'IS', 'LI', 'NO', 'CH', 'AD', 'MC', 'SM', 'VA'
];

const BRAZIL_TIMEZONES = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Recife',
  'America/Fortaleza',
  'America/Belem',
  'America/Cuiaba',
  'America/Campo_Grande',
  'America/Araguaina',
  'America/Maceio',
  'America/Bahia',
  'America/Noronha'
];

const EUROPE_TIMEZONES = [
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid',
  'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna', 'Europe/Prague',
  'Europe/Warsaw', 'Europe/Stockholm', 'Europe/Copenhagen', 'Europe/Helsinki',
  'Europe/Dublin', 'Europe/Lisbon', 'Europe/Athens', 'Europe/Budapest',
  'Europe/Bucharest', 'Europe/Sofia', 'Europe/Zagreb', 'Europe/Bratislava',
  'Europe/Ljubljana', 'Europe/Riga', 'Europe/Tallinn', 'Europe/Vilnius',
  'Europe/Luxembourg', 'Europe/Malta', 'Europe/Nicosia', 'Europe/Valletta'
];

export function detectRegion(): Region {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    const countryCode = locale.split('-')[1]?.toUpperCase();

    if (BRAZIL_TIMEZONES.includes(timezone)) {
      return 'BR';
    }

    if (countryCode && EUROPEAN_COUNTRIES.includes(countryCode)) {
      return 'EU';
    }

    if (EUROPE_TIMEZONES.includes(timezone)) {
      return 'EU';
    }

    if (locale.toLowerCase().includes('pt-br') || countryCode === 'BR') {
      return 'BR';
    }

    if (locale.toLowerCase().includes('pt-pt') || locale.toLowerCase().includes('es-es') || 
        locale.toLowerCase().includes('fr-fr') || locale.toLowerCase().includes('de-de') ||
        locale.toLowerCase().includes('it-it') || locale.toLowerCase().includes('nl-nl')) {
      return 'EU';
    }

    return 'OTHER';
  } catch (error) {
    console.warn('Erro ao detectar região:', error);
    return 'OTHER';
  }
}

export async function detectCountry(): Promise<string | undefined> {
  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
      });
      
      if (position.coords.latitude && position.coords.longitude) {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          );
          const data = await response.json();
          if (data.countryCode) {
            return data.countryCode.toUpperCase();
          }
        } catch (error) {
          console.warn('Erro ao buscar país via geolocalização:', error);
        }
      }
    } catch (error) {
      console.warn('Geolocalização não disponível:', error);
    }
  }

  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.country_code) {
        return data.country_code.toUpperCase();
      }
    }
  } catch (error) {
    console.warn('Erro ao buscar país via IP:', error);
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    const countryCode = locale.split('-')[1]?.toUpperCase();

    if (BRAZIL_TIMEZONES.includes(timezone)) {
      return 'BR';
    }

    if (countryCode && countryCode.length === 2) {
      return countryCode;
    }
    const timezoneToCountry: Record<string, string> = {
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
      'America/Chicago': 'US',
      'America/Denver': 'US',
      'Europe/London': 'GB',
      'Europe/Paris': 'FR',
      'Europe/Berlin': 'DE',
      'Europe/Madrid': 'ES',
      'Europe/Rome': 'IT',
      'Europe/Amsterdam': 'NL',
      'Europe/Lisbon': 'PT',
      'Europe/Stockholm': 'SE',
      'Europe/Copenhagen': 'DK',
      'Europe/Helsinki': 'FI',
      'Europe/Dublin': 'IE',
      'Europe/Vienna': 'AT',
      'Europe/Brussels': 'BE',
      'Europe/Warsaw': 'PL',
      'Europe/Prague': 'CZ',
      'Asia/Tokyo': 'JP',
      'Asia/Shanghai': 'CN',
      'Asia/Hong_Kong': 'HK',
      'Asia/Singapore': 'SG',
      'Australia/Sydney': 'AU',
      'Australia/Melbourne': 'AU',
      'America/Toronto': 'CA',
      'America/Vancouver': 'CA',
      'America/Mexico_City': 'MX',
      'America/Buenos_Aires': 'AR',
      'America/Santiago': 'CL',
    };

    if (timezone in timezoneToCountry) {
      return timezoneToCountry[timezone];
    }
  } catch (error) {
    console.warn('Erro ao detectar país via timezone:', error);
  }

  return undefined;
}

/**
 * Versão síncrona simplificada que retorna país baseado apenas em locale/timezone
 * Útil quando não podemos fazer chamadas assíncronas
 */
export function detectCountrySync(): string | undefined {
  try {
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    const countryCode = locale.split('-')[1]?.toUpperCase();
    
    if (countryCode && countryCode.length === 2) {
      return countryCode;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (BRAZIL_TIMEZONES.includes(timezone)) {
      return 'BR';
    }
  } catch (error) {
    console.warn('Erro ao detectar país síncrono:', error);
  }

  return undefined;
}

export function getRegionConfig(): RegionConfig {
  const region = detectRegion();

  switch (region) {
    case 'BR':
      return {
        region: 'BR',
        currency: 'BRL',
        currencySymbol: 'R$',
        price: 3990,
        priceDisplay: '39,90',
      };
    case 'EU':
      return {
        region: 'EU',
        currency: 'EUR',
        currencySymbol: '€',
        price: 990,
        priceDisplay: '9,90',
      };
    default:
      return {
        region: 'OTHER',
        currency: 'USD',
        currencySymbol: '$',
        price: 990,
        priceDisplay: '9.90',
      };
  }
}

export function getPlanPrice(region: Region, planType: 'monthly' | 'quarterly' | 'lifetime'): { price: number; priceDisplay: string } {
  switch (region) {
    case 'BR':
      if (planType === 'lifetime') {
        return { price: 7980, priceDisplay: '79,80' };
      }
      if (planType === 'quarterly') {
        return { price: 7980, priceDisplay: '79,80' };
      }
      return { price: 3990, priceDisplay: '39,90' };
    case 'EU':
      if (planType === 'lifetime') {
        return { price: 2990, priceDisplay: '29,90' };
      }
      if (planType === 'quarterly') {
        return { price: 1580, priceDisplay: '15,80' };
      }
      return { price: 990, priceDisplay: '9,90' };
    default:
      if (planType === 'lifetime') {
        return { price: 2990, priceDisplay: '29.90' };
      }
      if (planType === 'quarterly') {
        return { price: 1580, priceDisplay: '15.80' };
      }
      return { price: 990, priceDisplay: '9.90' };
  }
}
