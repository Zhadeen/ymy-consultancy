import { useEffect } from 'react';
import { SITE } from '../../config/site';
import { useConsent } from '../../consent/useConsent';

// GA4 loads ONLY when BOTH: VITE_GA_ID is set at build time, AND the visitor has
// accepted cookies. When unset or not consented, nothing is injected — analytics
// never fires before consent, and never with a placeholder/invented ID.
export default function Analytics() {
  const id = SITE.gaId;
  const consent = useConsent();
  useEffect(() => {
    if (!id || consent !== 'accepted') return;
    if (document.getElementById('ga4-src')) return;

    const s = document.createElement('script');
    s.id = 'ga4-src';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
  }, [id, consent]);

  return null;
}
