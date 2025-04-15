import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency according to the provided currency code, symbol, and locale
 * @param amount - The numeric amount to format
 * @param currency - The currency information {code, symbol, locale} 
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: { code: string; symbol: string; locale: string } = { code: 'INR', symbol: '₹', locale: 'en-IN' }
): string {
  // Handle undefined or NaN values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currency?.symbol || '₹'}0.00`;
  }

  // Force INR as default (emergency fix)
  if (!currency || !currency.code) {
    return `₹${amount.toFixed(2)}`;
  }

  try {
    // Use Intl.NumberFormat for proper localization
    const formatter = new Intl.NumberFormat(currency.locale || 'en-IN', {
      style: 'currency',
      currency: currency.code || 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  } catch (error) {
    // Fallback in case of formatting error - use INR
    return `₹${amount.toFixed(2)}`;
  }
}
