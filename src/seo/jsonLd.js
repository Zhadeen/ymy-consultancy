import { SITE } from '../config/site';

// JSON-LD builders. RULE: never emit a fabricated or empty field. Anything the
// owner hasn't supplied (address, geo, reviews, sameAs) is OMITTED, not faked.
// Helpers return plain objects; <Seo> serialises them into <script type=
// "application/ld+json"> both on the client and in the prerendered head.

const absolute = (path) => (path?.startsWith('http') ? path : SITE.url + (path || ''));

// The marketplace as an Organization, with Engineer Yusuf as founder.
export function organizationLd() {
  const founder = SITE.founder?.name
    ? {
        '@type': 'Person',
        name: SITE.founder.name,
        ...(SITE.founder.role ? { jobTitle: SITE.founder.role } : {}),
        ...(SITE.founder.photo ? { image: absolute(SITE.founder.photo) } : {}),
        ...(SITE.founder.sameAs?.length ? { sameAs: SITE.founder.sameAs } : {}),
      }
    : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absolute('/favicon.png'),
    description: SITE.description,
    ...(SITE.social?.length ? { sameAs: SITE.social } : {}),
    ...(founder ? { founder } : {}),
  };
}

// Service-area business: ProfessionalService with areaServed and NO street
// address/geo unless the owner has supplied a real one.
export function localBusinessLd() {
  const hasRealArea =
    Array.isArray(SITE.areaServed) &&
    SITE.areaServed.length > 0 &&
    !String(SITE.areaServed[0]).startsWith('TODO');

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    image: absolute('/favicon.png'),
    description: SITE.description,
    ...(hasRealArea ? { areaServed: SITE.areaServed } : {}),
    ...(SITE.address
      ? { address: { '@type': 'PostalAddress', ...SITE.address } }
      : {}),
    ...(SITE.geo ? { geo: { '@type': 'GeoCoordinates', ...SITE.geo } } : {}),
    ...(SITE.contact?.email ? { email: SITE.contact.email } : {}),
    ...(SITE.contact?.phone ? { telephone: SITE.contact.phone } : {}),
    // NOTE: no aggregateRating/review is emitted — reviews are in collection
    // mode until the owner supplies real ones and flips SITE.reviewsEnabled.
  };
}

export function webSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
  };
}

// items: [{ name, path }]. Produces BreadcrumbList with absolute URLs.
export function breadcrumbLd(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}

// Only questions with a real (non-null) answer make it into the schema —
// FAQPage with empty answers is invalid/misleading.
export function faqPageLd(faq) {
  const answered = (faq || []).filter((f) => f.q && f.a);
  if (!answered.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
