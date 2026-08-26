// Growth of a cumulative total against its value at the start of the current
// month. Returns null when there is no baseline to compare against, so callers
// can show nothing rather than invent a percentage: with no prior data every
// first record is an infinite increase, and 0 to 1 user is not "+100% growth"
// in any sense worth putting on a dashboard.
export function growthPercent(current, atStartOfPeriod) {
  if (!atStartOfPeriod || atStartOfPeriod <= 0) return null;
  if (current === atStartOfPeriod) return 0;
  return ((current - atStartOfPeriod) / atStartOfPeriod) * 100;
}

// First moment of the current month, in the viewer's local timezone.
export function startOfCurrentMonth(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

// How many of `records` existed before `cutoff`, based on a date field that may
// be a Firestore Timestamp, an ISO string, or missing. `toDate` is injected so
// this stays free of infrastructure imports.
export function countBefore(records, cutoff, dateField, toDate) {
  return records.reduce((n, record) => {
    const d = toDate(record[dateField]);
    return d && d < cutoff ? n + 1 : n;
  }, 0);
}

// Same idea for money: total of `amountField` over records dated before cutoff.
export function sumBefore(records, cutoff, dateField, amountField, toDate) {
  return records.reduce((total, record) => {
    const d = toDate(record[dateField]);
    return d && d < cutoff ? total + (record[amountField] || 0) : total;
  }, 0);
}
