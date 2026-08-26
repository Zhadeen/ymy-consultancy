// Exact money, cents included. The dashboard previously rounded to whole
// dollars here while the revenue chart floored the same value, so a single
// $49.99 booking showed as "$50" in one place and "$49" in the other.
export function formatCurrency(amt) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amt || 0);
}

// Short form for tight spots like chart bar labels. Derived from the same
// formatter so identical values can never render two different ways.
export function formatCurrencyCompact(amt) {
  const value = amt || 0;
  if (value === 0) return '$0';
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return formatCurrency(value);
}
