// Legal content — DRAFT templates, config-driven.
//
// ⚠️ Every document here is a STARTING-POINT TEMPLATE, not legal advice, and is
// rendered with a visible "DRAFT — review with counsel" banner. Nothing here is
// described as "compliant". Values the owner must supply are written as
// `[OWNER MUST PROVIDE: X]` and listed in COMPLIANCE.md — never invent them.
//
// The privacy + cookies text reflects the ACTUAL data flows found in the Phase 1
// audit (see COMPLIANCE.md §1-§2): Firebase, Cloudinary (incl. ID documents),
// Stripe, Zendesk, Google Analytics (only if enabled), Google Fonts, Unsplash.

const P = (x) => `[OWNER MUST PROVIDE: ${x}]`;

export const LEGAL = {
  // --- Owner / controller identity (all placeholders until supplied) ---------
  company: {
    entityName: P('registered legal entity name'),
    tradingName: 'YMY Consultancy',
    address: P('registered business address'),
    country: P('country of establishment (determines home data-protection law, e.g. KVKK / NDPR)'),
    companyNumber: P('company registration number'),
    privacyEmail: P('privacy/data-protection contact email'),
    generalEmail: P('general contact email'),
    dpo: P('Data Protection Officer / EU-UK representative, or state "not appointed — confirm if required"'),
  },

  // Shown on every legal page; also mirrored in COMPLIANCE.md.
  draftNotice:
    'This is a DRAFT template, not legal advice. It has not been reviewed by a lawyer and does not certify compliance with any law. Have it reviewed and finalised by qualified legal counsel in your relevant jurisdiction(s) before relying on it.',

  lastUpdated: P('effective date'),

  // ---------------------------------------------------------------------------
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How YMY collects, uses, shares, and protects personal data.',
    intro:
      'This policy describes how the YMY local-guide marketplace ("we", "us") handles personal data. It reflects how the platform is currently built. Where a detail depends on the operator, a clearly-marked placeholder appears until the owner supplies it.',
    sections: [
      {
        h: 'Who we are',
        body: [
          `The platform is operated by ${P('registered legal entity name')} ("YMY"), ${P('registered business address')}.`,
          `For any privacy question or to exercise your rights, contact ${P('privacy/data-protection contact email')}.`,
        ],
      },
      {
        h: 'What we collect',
        body: [
          'Account data: your name and email address (via email/password or Google sign-in). Passwords are handled by Firebase Authentication and are never stored by us.',
          'Guide onboarding data: first/last name, email, phone number, country and city, a short bio, specialties and pricing, and — for identity verification — a copy of a government identity document (e.g. passport) that you upload.',
          'Booking data: your name, email, number of guests, the amount, and any free-text you provide (purpose of visit, experience notes, special requests).',
          'Messages: the content of chats you send to guides or to support.',
          'Contact form: your name, email, and message.',
          'Technical data: standard server/log and device data, and — only where enabled — analytics data (see “Cookies & analytics”).',
        ],
      },
      {
        h: 'Identity documents (sensitive data)',
        body: [
          'To verify guides, we collect a government identity document. This is sensitive data and is treated as such.',
          `Retention and access: ${P('ID-document retention period, who may view it, and when it is deleted')}. We are working to ensure these documents are stored with restricted, authenticated access rather than public links.`,
        ],
      },
      {
        h: 'Why we use it and our legal basis',
        body: [
          'To provide the service (create your account, list guides, process bookings, enable messaging): performance of a contract.',
          'To verify guide identity and keep the marketplace safe: our legitimate interests and, where applicable, legal obligation.',
          'To process payments: performance of a contract (via Stripe).',
          `Legal-basis mapping should be confirmed with counsel for your jurisdiction: ${P('confirmed lawful-basis mapping')}.`,
        ],
      },
      {
        h: 'Who we share it with',
        body: [
          'Firebase / Google Cloud — authentication, database, and file storage (data hosted on Google infrastructure).',
          'Cloudinary — image and document hosting (including uploaded identity documents).',
          'Stripe — payment processing. We share your email and booking details necessary to take payment. Card details are entered directly with Stripe; we never see or store them.',
          'Zendesk — the “Live Chat” support widget, if you use it.',
          'Google Analytics — only if analytics is enabled and you have consented (see “Cookies & analytics”).',
          'Google Fonts and image providers (e.g. Unsplash) — serving fonts/images may transfer your IP address to those providers.',
          'Note: platform administrators can access booking records and, for support and safety, message content. See our Cookies Policy for the trackers involved.',
        ],
      },
      {
        h: 'International transfers',
        body: [
          'Several providers above are based in the United States, so your data may be transferred internationally.',
          `The transfer mechanism (e.g. Standard Contractual Clauses / adequacy) must be confirmed with counsel: ${P('cross-border transfer mechanism')}.`,
        ],
      },
      {
        h: 'How long we keep it',
        body: [
          `Retention periods per data category (accounts, bookings, messages, identity documents, contact messages, applications): ${P('retention schedule per data category')}.`,
        ],
      },
      {
        h: 'Your rights',
        body: [
          'Depending on where you live, you may have rights to access, correct, delete, restrict, or port your data, and to object to certain processing.',
          `To exercise them, contact ${P('privacy/data-protection contact email')}. A self-service data export/deletion feature is not yet available; requests are handled manually.`,
        ],
      },
      {
        h: 'Cookies & analytics',
        body: [
          'We use strictly-necessary cookies to keep you signed in. Non-essential cookies/trackers (analytics, the chat widget) load only after you consent via our cookie banner. See the Cookies Policy for the full list.',
        ],
      },
      {
        h: 'Contact',
        body: [`Questions or complaints: ${P('privacy/data-protection contact email')}. You may also have the right to complain to your local data-protection authority.`],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  terms: {
    title: 'Terms of Service',
    subtitle: 'The agreement governing use of the YMY marketplace.',
    intro:
      'These terms govern your use of the YMY marketplace, which connects travelers with independent local guides. By using the platform you agree to them.',
    sections: [
      { h: '1. The service', body: ['YMY is a marketplace that connects travelers with independent local guides. YMY is not the provider of the guiding services and does not employ the guides; guides are independent third parties.'] },
      { h: '2. Accounts', body: ['You must provide accurate information and keep your credentials secure. You are responsible for activity under your account. Guides must complete identity verification before listing.'] },
      { h: '3. Bookings', body: ['A booking is a contract for guiding services between the traveler and the guide. YMY facilitates the connection and payment but is not a party to the guiding contract.'] },
      { h: '4. Payments and fees', body: ['Payments are processed by Stripe. YMY retains a platform fee of 15% of each booking; guides receive 85%. Prices are shown before you pay.'] },
      { h: '5. Cancellations and refunds', body: ['Cancellations and refunds are governed by our Refund & Cancellation Policy. Consumer-protection laws in your country may give you additional rights.'] },
      { h: '6. Acceptable use', body: ['Do not misuse the platform, post unlawful content, misrepresent your identity, or attempt to circumvent the platform’s payments.'] },
      { h: '7. Guide obligations', body: ['Guides are responsible for the lawfulness, safety, and quality of the experiences they offer and for any licences or permits their activity requires.'] },
      { h: '8. Liability', body: [`To the extent permitted by law, YMY is not liable for the acts or omissions of guides or travelers or for the guiding experience itself. Nothing limits liability that cannot be limited by law. ${P('liability terms confirmed with counsel')}.`] },
      { h: '9. Intellectual property', body: ['The platform, its branding and content are owned by YMY or its licensors. You retain rights in content you submit but grant YMY a licence to use it to operate the service.'] },
      { h: '10. Termination', body: ['We may suspend or terminate accounts that breach these terms or create risk to the marketplace.'] },
      { h: '11. Governing law', body: [`These terms are governed by the laws of ${P('governing law / jurisdiction')}.`] },
      { h: '12. Contact', body: [`Questions: ${P('general contact email')}.`] },
    ],
  },

  // ---------------------------------------------------------------------------
  cookies: {
    title: 'Cookies Policy',
    subtitle: 'The cookies and trackers this site uses, and your choices.',
    intro:
      'This policy lists the cookies and similar technologies the site uses. Non-essential trackers load only after you accept them in the cookie banner; you can reject them just as easily.',
    sections: [
      {
        h: 'Strictly necessary (always on)',
        body: [
          'Firebase Authentication — keeps you signed in and secures your session. Set when you log in. Without it the site cannot function, so it is not subject to consent.',
        ],
      },
      {
        h: 'Functional (consent required)',
        body: [
          'Zendesk “Live Chat” widget — sets cookies to run the support chat. Loads only after you accept non-essential cookies.',
        ],
      },
      {
        h: 'Analytics (consent required, and only if enabled)',
        body: [
          'Google Analytics 4 — measures site usage. It is disabled unless the operator has configured an analytics ID, and even then loads only after you consent.',
        ],
      },
      {
        h: 'Third-party content (may transfer your IP)',
        body: [
          'Google Fonts — serving fonts may send your IP address to Google.',
          'Image providers (e.g. Unsplash) — loading images may send your IP to the provider.',
          'Google Maps — only if a location is configured (currently off); embeds may set cookies.',
        ],
      },
      {
        h: 'Managing your choices',
        body: ['Use the cookie banner to accept or reject non-essential cookies. You can change your choice at any time by clearing the site’s stored preference and reloading.'],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  refunds: {
    title: 'Refund & Cancellation Policy',
    subtitle: 'How cancellations and refunds work for bookings.',
    intro:
      'This policy explains cancellations and refunds for guide bookings made through YMY. Exact commercial terms are set by the operator and appear where marked.',
    sections: [
      { h: 'Cancellations by travelers', body: [`${P('exact cancellation window and refund percentages')}. As a starting point, the platform currently states that full refunds are available for cancellations made more than 24 hours before the scheduled experience; cancellations within 24 hours are non-refundable.`] },
      { h: 'Cancellations by guides', body: [`If a guide cancels, you are entitled to a full refund. ${P('any additional remedy, e.g. rebooking support')}.`] },
      { h: 'How refunds are issued', body: ['Refunds are returned to your original payment method via Stripe. Processing times depend on your bank/card provider.'] },
      { h: 'Statutory rights', body: ['Consumer-protection and distance-selling laws in your country may give you additional cancellation/refund rights that override this policy. Nothing here limits those rights.'] },
      { h: 'Disputes', body: [`To raise a refund issue, contact ${P('general contact email')}.`] },
    ],
  },
};
