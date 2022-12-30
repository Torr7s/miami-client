type Options = {
  currency?: string;
  locale?: string;
}

export const abbrevNumber = (numb: number, options?: Options): string => {
  const currency: string = options?.currency ?? 'USD';
  const locale: string = options?.locale ?? 'en-US';

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 3,
    unitDisplay: 'short',
    style: 'currency'
  }).format(numb);
}

export const formatNumber = (numb: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(numb);
}

export const toCurrency = (numb: number, options?: Options): string => {
  const currency: string = options?.currency ?? 'USD';
  const locale: string = options?.locale ?? 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(numb);
}