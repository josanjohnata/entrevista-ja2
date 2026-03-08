export const formatMonthYear = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  const limited = numbers.slice(0, 6);
  
  if (limited.length <= 2) {
    return limited;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }
};

export const validateMonthYear = (value: string): boolean => {
  if (!value || value.length < 7) {
    return false;
  }

  const parts = value.split('/');
  if (parts.length !== 2) {
    return false;
  }

  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10);

  if (isNaN(month) || month < 1 || month > 12) {
    return false;
  }

  if (isNaN(year) || year < 1900 || year > 2099) {
    return false;
  }

  return true;
};

export const parseMonthYear = (value: string): Date | null => {
  if (!validateMonthYear(value)) {
    return null;
  }

  const parts = value.split('/');
  const month = parseInt(parts[0], 10) - 1;
  const year = parseInt(parts[1], 10);

  return new Date(year, month, 1);
};

export const formatDateToMonthYear = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${month}/${year}`;
};
