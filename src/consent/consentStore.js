// Cookie-consent store, read via useSyncExternalStore so it's SSR-safe and
// hydration-clean. Value is 'accepted' | 'rejected' | null (undecided).
//
// Non-essential trackers (Google Analytics, Zendesk) must not load until the
// value is 'accepted'. Rejecting is as easy as accepting — both are one click.
const KEY = 'ymy_cookie_consent';
const listeners = new Set();

export function getConsent() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function setConsent(value) {
  try { localStorage.setItem(KEY, value); } catch { /* private mode: fine */ }
  listeners.forEach((l) => l());
}

export function subscribeConsent(cb) {
  listeners.add(cb);
  if (typeof window !== 'undefined') window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    if (typeof window !== 'undefined') window.removeEventListener('storage', cb);
  };
}
