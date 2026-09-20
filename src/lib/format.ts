// Formatting utilities for TradeX

/**
 * Format a number as Indian currency (₹)
 */
export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  // Indian numbering system (lakhs, crores)
  if (absValue >= 10000000) {
    return `${sign}₹${(absValue / 10000000).toFixed(2)} Cr`;
  }
  if (absValue >= 100000) {
    return `${sign}₹${(absValue / 100000).toFixed(2)} L`;
  }
  
  return `${sign}₹${absValue.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a number as Indian currency without abbreviation
 */
export function formatCurrencyFull(value: number): string {
  const sign = value < 0 ? '-' : '';
  return `${sign}₹${Math.abs(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format percentage change
 */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format price change with sign
 */
export function formatChange(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}₹${Math.abs(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format volume (e.g., 5.2M, 1.3K)
 */
export function formatVolume(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

/**
 * Format market cap in crores
 */
export function formatMarketCap(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L Cr`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)} K Cr`;
  return `₹${value.toLocaleString('en-IN')} Cr`;
}

/**
 * Get CSS class for profit/loss coloring
 */
export function getPnLColor(value: number): string {
  if (value > 0) return 'text-profit';
  if (value < 0) return 'text-loss';
  return 'text-muted-foreground';
}

/**
 * Get background CSS class for profit/loss
 */
export function getPnLBgColor(value: number): string {
  if (value > 0) return 'bg-profit-muted';
  if (value < 0) return 'bg-loss-muted';
  return 'bg-muted';
}
