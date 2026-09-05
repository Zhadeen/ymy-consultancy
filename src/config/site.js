// Central site configuration and content placeholders.
//
// HARD RULE: nothing in here may be invented. Anything the owner must supply is
// left null / clearly-marked and tagged `TODO(owner): ...`, and every such gap
// is listed in SETUP.md. Components must render gracefully (or hide) when a
// value is still null — never show a fake number, address, or review.

export const SITE = {
  // --- Brand -----------------------------------------------------------------
  name: 'YMY Consultancy',
  legalName: 'YMY Consultancy',
  // Canonical production origin (no trailing slash). Used for canonical URLs,
  // sitemap, and absolute OG image URLs.
  url: 'https://www.ymycons.com',
  tagline: 'Book verified local guides worldwide',
  description:
    'YMY connects travelers with verified, independent local guides for authentic, private guided experiences — booked directly, with no commission surprises.',
  locale: 'en',

  // --- Founder (singular owner copy — "Engineer Yusuf", third person) ---------
  founder: {
    name: 'Engineer Yusuf',
    role: 'Founder',
    photo: '/engineer-yusuf.jpg', // moved into /public from the repo root
    // TODO(owner): supply a 1–3 sentence founder bio for the About/Person schema.
    bio: null,
    // TODO(owner): supply founder profile links (LinkedIn, etc.) if any.
    sameAs: [],
  },

  // --- Contact ---------------------------------------------------------------
  contact: {
    // TODO(owner): supply the public contact email (also the contact-form
    // notification destination — see api/contact.js and SETUP.md).
    email: null,
    // TODO(owner): confirm the public phone number to display, or leave null.
    phone: null,
    // Real WhatsApp business line already used by the on-site FloatingContact
    // widget (src/components/common/FloatingContact.jsx). Digits only, no '+'.
    whatsapp: '905435082886',
  },

  // --- Service-area business (NO street address until supplied) ---------------
  // This is a service-area marketplace, not a storefront. Emit areaServed, never
  // a fake address/geo. Leave address null to omit it from schema and hide the
  // map/directions component entirely.
  address: null, // TODO(owner): supply { streetAddress, addressLocality, addressRegion, postalCode, addressCountry } ONLY if you operate a visitable office.
  geo: null,     // TODO(owner): supply { latitude, longitude } only alongside a real address.
  // TODO(owner): list the areas you actually serve (cities/countries). Until then
  // this stays a single honest placeholder rather than an invented list.
  areaServed: ['TODO(owner): served areas — e.g. "Istanbul", "Turkey", "Worldwide"'],

  // --- Social profiles (Organization.sameAs) ---------------------------------
  // TODO(owner): add real profile URLs. Empty array = omitted from schema.
  social: [],

  // --- Analytics -------------------------------------------------------------
  // GA4 loads ONLY when VITE_GA_ID is set at build time. Never hardcode an ID.
  gaId: import.meta.env.VITE_GA_ID || null,

  // --- Reviews (COLLECTION MODE — none exist yet) ----------------------------
  // Keep OFF until the owner supplies real reviews AND flips this flag. While
  // false: no public reviews section renders and NO Review/AggregateRating
  // schema is emitted.
  reviewsEnabled: false,
  // TODO(owner): after claiming your Google Business Profile, paste the
  // "leave a review" link here (see SETUP.md). Null hides the review prompt.
  reviewUrl: null,

  // --- Response-time promise --------------------------------------------------
  // TODO(owner): set a real, honest response-time promise (e.g. 'within 24 hours').
  // Null hides the component rather than inventing a number.
  responseTime: null,
};

// Per-route <head>. Every title and description MUST be unique. Titles are
// suffixed with the brand at render time. Routes marked index:false get a
// robots noindex tag (auth/private/dynamic app screens).
export const ROUTE_META = {
  '/': {
    title: 'Book Verified Local Guides Worldwide',
    description:
      'Find and book verified, independent local guides for private, authentic experiences. Browse profiles, compare prices, and book directly on YMY.',
    index: true,
    og: '/og/home.png',
  },
  '/pricing': {
    title: 'Pricing for Local Guides',
    description:
      'How YMY pricing works for guides: a simple 15% platform fee, guides keep 85%, secure payouts. No hidden costs. See plans and fees.',
    index: true,
    og: '/og/home.png', // TODO(owner): swap in a pricing-specific OG image at /og/pricing.png
  },
  '/visitor-pricing': {
    title: 'Pricing for Travelers',
    description:
      'What travelers pay on YMY: transparent booking fees, secure checkout, and free cancellation up to 24 hours before your experience.',
    index: true,
    og: '/og/home.png',
  },
  '/help': {
    title: 'Help Center',
    description:
      'Answers to common questions about booking guides, payments, cancellations, and managing your YMY account.',
    index: true,
    og: '/og/home.png',
  },
  '/safety': {
    title: 'Trust & Safety',
    description:
      'How YMY keeps travelers and guides safe: guide verification, secure payments, and support throughout your booking.',
    index: true,
    og: '/og/home.png',
  },
  '/cancellation': {
    title: 'Cancellation Policy',
    description:
      'YMY cancellation terms: full refunds for cancellations made more than 24 hours before your scheduled experience.',
    index: true,
    og: '/og/home.png',
  },
  '/terms': {
    title: 'Terms of Service',
    description:
      'The terms governing the use of the YMY local-guide marketplace, including bookings, payments, fees, and refunds.',
    index: true,
    og: '/og/home.png',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description:
      'How YMY collects, uses, and protects your data. A template policy pending legal review by the owner.',
    index: true,
    og: '/og/home.png',
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    description:
      'Common questions about booking local guides on YMY — how it works, payments, cancellations, and becoming a guide.',
    index: true,
    og: '/og/home.png',
  },
  '/stories': {
    title: 'Traveler Stories & Featured Guides',
    description:
      'Real experiences from the YMY marketplace — featured guides and the trips travelers booked with them.',
    index: true,
    og: '/og/home.png',
  },
  '/contact': {
    title: 'Contact Us',
    description:
      'Get in touch with the YMY team about bookings, becoming a guide, or partnership enquiries. We reply as fast as we can.',
    index: true,
    og: '/og/home.png',
  },
  '/thank-you': {
    title: 'Thank You',
    description: 'Thanks for reaching out to YMY. We have received your message.',
    index: false,
    og: '/og/home.png',
  },
  // Dynamic / auth / private screens — client-rendered and kept out of the index.
  '/search': { title: 'Find a Local Guide', description: 'Search verified local guides by city, language, and price on YMY.', index: true, og: '/og/home.png' },
  '/sign-in': { title: 'Sign In', description: 'Sign in to YMY.', index: false },
  '/login': { title: 'Log In', description: 'Log in to your YMY account.', index: false },
  '/register': { title: 'Create Account', description: 'Create a YMY traveler account.', index: false },
  '/guide-register': { title: 'Become a Local Guide', description: 'Apply to list your services as a verified local guide on YMY.', index: true, og: '/og/home.png' },
};

// The public, prerendered, indexable routes (drives sitemap + SSG route list).
export const PRERENDER_ROUTES = [
  '/', '/pricing', '/visitor-pricing', '/help', '/safety',
  '/cancellation', '/terms', '/privacy', '/faq', '/stories', '/contact', '/thank-you',
];

// FAQ — exactly 5. Technical/marketplace-services framing. Answers are the
// owner's to write; never invent them. A question with a null answer renders as
// "answer coming soon" in the UI and is OMITTED from FAQPage JSON-LD (schema
// must not carry empty answers).
export const FAQ = [
  { q: 'How do I book a local guide on YMY?', a: null }, // TODO(owner): supply answer.
  { q: 'How are guides verified before they can list?', a: null }, // TODO(owner): supply answer.
  { q: 'What are the fees, and how do payouts to guides work?', a: null }, // TODO(owner): supply answer.
  { q: 'What is the cancellation and refund policy?', a: null }, // TODO(owner): supply answer.
  { q: 'How do I become a local guide on the platform?', a: null }, // TODO(owner): supply answer.
];

// Case studies / "stories". Structure only — every fact is a TODO slot. Render
// as templates; do NOT publish invented outcomes. `published: false` keeps a
// card out of the live list until the owner fills it in and flips the flag.
export const STORIES = [
  {
    id: 'story-1',
    published: false,
    title: null,        // TODO(owner): trip/experience title.
    guideName: null,    // TODO(owner): featured guide (with consent).
    location: null,     // TODO(owner): city/country.
    summary: null,      // TODO(owner): 2–3 sentence summary of the experience.
    quote: null,        // TODO(owner): a real traveler quote (with consent).
    image: null,        // TODO(owner): image path in /public.
  },
  {
    id: 'story-2',
    published: false,
    title: null, guideName: null, location: null, summary: null, quote: null, image: null,
  },
  {
    id: 'story-3',
    published: false,
    title: null, guideName: null, location: null, summary: null, quote: null, image: null,
  },
];
