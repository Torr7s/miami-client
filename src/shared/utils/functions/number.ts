export const toCurrency = (numb: number, locale: string = 'pt-BR'): string => {
  const result: Intl.NumberFormat = new Intl.NumberFormat(locale, {
    style: 'currency', 
    currency: 'USD'
  });

  return result.format(numb);
}