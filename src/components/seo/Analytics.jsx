import { useEffect } from 'react';
import { SITE } from '../../config/site';

// GA4 loads ONLY when VITE_GA_ID is set at build time. When unset, this renders
// nothing and injects no script — analytics is fully disabled, never with a
// placeholder or invented measurement ID.
export default function Analytics() {
  const id = SITE.gaId;
  useEffect(() => {
    if (!id) return;
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
  }, [id]);

  return null;
}
