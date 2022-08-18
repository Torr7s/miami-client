export const toCurrency = (numb: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(numb);
}

export function format(numb: number): string {
  return new Intl.NumberFormat('pt-BR').format(numb);
}