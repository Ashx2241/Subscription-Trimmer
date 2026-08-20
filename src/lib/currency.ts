/**
 * Indian Rupee (INR) Currency Utility
 */
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

export function formatINR(amount: number | string | null | undefined, options?: { showDecimals?: boolean }): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0.00';
  }

  const num = Number(amount);
  const showDecimals = options?.showDecimals ?? true;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);
}

export function formatAmount(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0.00';
  }
  const num = Number(amount);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
