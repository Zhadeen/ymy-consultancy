import { useSyncExternalStore } from 'react';
import { getConsent, subscribeConsent } from './consentStore';

// Returns the current consent value ('accepted' | 'rejected' | null). On the
// server it's always null (undecided), and the client updates after hydration
// without a mismatch warning — useSyncExternalStore is built for exactly this.
export function useConsent() {
  return useSyncExternalStore(subscribeConsent, getConsent, () => null);
}
