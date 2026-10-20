// Legal content, config-driven.
//
// The DRAFT banner was removed at the owner's request (Oct 2026). The texts have
// not been reviewed by a lawyer; nothing here is described as "compliant".
// Values the owner must supply are written as
// `[OWNER MUST PROVIDE: X]` and listed in COMPLIANCE.md — never invent them.
//
// The privacy + cookies text reflects the ACTUAL data flows found in the Phase 1
// audit (see COMPLIANCE.md §1-§2): Firebase, Cloudinary (incl. ID documents),
// Stripe, Zendesk, Google Analytics (only if enabled), Google Fonts, Unsplash.

const P = (x) => `[OWNER MUST PROVIDE: ${x}]`;

// Set once the MERSİS number is issued (mirrors company.mersis).
const MERSIS = null;
const LEGAL_MERSIS = MERSIS ? ` MERSİS: ${MERSIS}.` : '';

export const LEGAL = {
  // --- Owner / controller identity (all placeholders until supplied) ---------
  company: {
    entityName: 'Yusuf Muhammad YAHYA',
    tradingName: 'YMY Consultancy',
    address: 'Bulgurlu Mah. Karlidere Cad. No: 46C Daire: 10, Üsküdar, İstanbul, Türkiye',
    country: 'Türkiye',
    companyNumber: P('company registration number'),
    // Turkish merchant identifiers — required on the Distance Sale Contract and
    // shown on /about for payment-provider (iyzico) review.
    taxOffice: 'Ümraniye',
    taxNumber: '9281115033',
    // TODO(owner): MERSİS number not yet obtained — set it here once issued;
    // /about and the Distance Sale Contract show it only when non-null.
    mersis: MERSIS,
    phone: '+90 543 508 28 86',
    privacyEmail: 'ymyahyaa@gmail.com',
    generalEmail: 'ymyahyaa@gmail.com',
    dpo: P('Data Protection Officer / EU-UK representative, or state "not appointed — confirm if required"'),
  },

  // Shown as "Last updated" on every legal page (Istanbul time).
  lastUpdated: '21 October 2026, 02:55 (TRT)',

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
          `The platform is operated by Yusuf Muhammad YAHYA ("YMY"), Bulgurlu Mah. Karlidere Cad. No: 46C Daire: 10, Üsküdar, İstanbul, Türkiye.`,
          `For any privacy question or to exercise your rights, contact ymyahyaa@gmail.com.`,
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
          `To exercise them, contact ymyahyaa@gmail.com. A self-service data export/deletion feature is not yet available; requests are handled manually.`,
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
        body: [`Questions or complaints: ymyahyaa@gmail.com. You may also have the right to complain to your local data-protection authority.`],
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
      { h: '12. Contact', body: [`Questions: ymyahyaa@gmail.com.`] },
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
    title: 'Delivery, Cancellation & Refund Policy',
    subtitle: 'How services are delivered, and how cancellations and refunds work.',
    intro:
      'At YMY Cons, we understand that travel and business plans can change. Our cancellation policy is designed to be fair to both customers and local experts. YMY sells services, not physical goods: guided experiences performed in person by independent local experts, and digital subscription plans for guides. Nothing is shipped. This policy explains how each is delivered and how cancellations and refunds work.',
    sections: [
      {
        h: 'Delivery of guided experiences',
        body: [
          'Once your payment is confirmed, your booking confirmation is delivered immediately on screen and in your YMY dashboard, and the guide is notified. You can message your guide through the platform to agree the meeting point and details.',
          'The service itself is delivered in person by the guide on the date, at the time, and for the duration shown in your booking. No physical item is shipped and no shipping fee applies.',
          `If a booking confirmation does not appear within ${P('confirmation time, e.g. 1 hour')}, contact ymyahyaa@gmail.com.`,
        ],
      },
      {
        h: 'Delivery of guide subscription plans',
        body: [
          'Paid guide plans are digital services. They are activated on your account immediately after successful payment and remain active for the billing period you selected.',
        ],
      },
      {
        // Owner-supplied cancellation terms (Oct 2026).
        h: 'Customer cancellation',
        body: [
          { list: [
            'More than 72 hours before the booking: 100% refund.',
            '24–72 hours before the booking: 50% refund.',
            'Less than 24 hours before the booking: no refund.',
            'Within 24 hours of booking: full refund, provided the booking is more than 72 hours away.',
          ] },
        ],
      },
      { h: 'Rescheduling', body: ['Customers may request to change their booking date, subject to the local expert’s availability.'] },
      { h: 'If a local expert cancels', body: ['If a local expert cancels a confirmed booking, the customer will receive a full refund or may choose another available verified expert.'] },
      {
        // Owner-supplied policy text (Oct 2026).
        h: 'Emergency & exceptional circumstances',
        body: [
          'YMY Cons understands that unexpected events may affect travel and bookings. If an extraordinary event makes it impossible or unsafe to provide or attend a booked service, YMY Cons may offer a full refund or free rescheduling.',
          'Eligible circumstances may include:',
          { list: [
            'Government-imposed travel restrictions or entry bans',
            'War, armed conflict, or significant civil unrest',
            'Natural disasters such as earthquakes, floods, or severe storms',
            'Major security emergencies or officially declared emergencies',
            'Government or airport closures that prevent travel',
            'Other serious events beyond the reasonable control of the customer, local expert, or YMY Cons',
          ] },
          'YMY Cons will review each situation individually and may request reasonable supporting information where necessary.',
          'Where an emergency situation is confirmed, the customer may choose between:',
          { ordered: true, list: [
            'A full refund, or',
            'Rescheduling the booking to a later available date.',
          ] },
          'This policy does not apply to ordinary changes of personal plans, missed flights, personal emergencies, or failure to attend the booking where the service remains available.',
          'YMY Cons reserves the right to assess each case fairly based on the circumstances and available information.',
        ],
      },
      { h: 'Service problems and returns', body: ['Because guided experiences are services performed on a set date, they cannot be “returned” once performed. If the booked service is not provided as described or the local expert does not attend, customers may contact YMY Cons for a review and possible full or partial refund.'] },
      { h: 'Refund processing', body: ['Approved refunds will be returned through the original payment method. Processing times may vary depending on the payment provider or bank.'] },
      { h: 'Statutory rights', body: ['Consumer-protection and distance-selling laws in your country may give you additional cancellation/refund rights that override this policy. Nothing here limits those rights. See also our [Distance Sale Contract](/distance-sales-contract).'] },
      { h: 'Disputes', body: [`To raise a delivery or refund issue, contact ymyahyaa@gmail.com or +90 543 508 28 86.`] },
      { h: 'Acceptance', body: ['By completing a booking, the customer agrees to this Cancellation & Refund Policy.'] },
    ],
  },

  // ---------------------------------------------------------------------------
  // Mesafeli Satış Sözleşmesi — short form, structured after Turkish Law No. 6502
  // and the Distance Contracts Regulation. Required by iyzico's merchant website
  // criteria. Counsel must still confirm the withdrawal exemption (section 4)
  // and governing law for non-Turkish consumers.
  distanceSales: {
    title: 'Distance Sale Contract',
    subtitle: 'The short contract that applies when you book or buy on YMY.',
    intro:
      'You (the Buyer) accept this contract by ticking the acceptance box when you send a booking request, and it takes effect when you pay. The service, date and price shown on the booking page and in your confirmation are part of it.',
    sections: [
      {
        h: '1. Parties',
        body: [
          { list: [
            `Seller: Yusuf Muhammad YAHYA, trading as YMY Consultancy. Bulgurlu Mah. Karlidere Cad. No: 46C Daire: 10, Üsküdar, İstanbul, Türkiye. Tax office / no: Ümraniye / 9281115033.${LEGAL_MERSIS} Email: [ymyahyaa@gmail.com](mailto:ymyahyaa@gmail.com). Phone: [+90 543 508 28 86](tel:+905435082886).`,
            'Service provider: the independent local expert named in your booking.',
            'Buyer: the person who sends the booking request and pays.',
          ] },
        ],
      },
      {
        h: '2. Service and price',
        body: [
          'A private guided experience (or a guide subscription plan) as described on the booking page. The total price shown before you pay includes all taxes and fees; there is no delivery fee. YMY keeps a 15% platform fee and the local expert receives 85%. Payment is by card through our payment provider; we never see or store your card details.',
        ],
      },
      {
        h: '3. Delivery',
        body: [
          'Your payment confirmation appears in your dashboard right after payment. The experience is delivered in person on the booked date and time; subscription plans start immediately.',
        ],
      },
      {
        h: '4. Right of withdrawal',
        body: [
          'Guided experiences booked for a fixed date are leisure services and are exempt from the 14-day right of withdrawal under the Distance Contracts Regulation, so the cancellation terms in section 5 apply instead. Guide subscription plans can be withdrawn within 14 days unless already used.',
        ],
      },
      {
        h: '5. Cancellation and refunds',
        body: [
          { list: [
            'More than 72 hours before the booking: 100% refund.',
            '24–72 hours before: 50% refund.',
            'Less than 24 hours before: no refund.',
            'Within 24 hours of booking: full refund, if the booking is more than 72 hours away.',
          ] },
          'If the local expert cancels, you get a full refund or may choose another available verified expert. If a confirmed emergency (such as a travel ban or natural disaster) makes the service impossible or unsafe, you may choose a full refund or rescheduling. Refunds go back to your original payment method. Full terms: [Delivery, Cancellation & Refund Policy](/refunds).',
        ],
      },
      {
        h: '6. Complaints and disputes',
        body: [
          'Contact [ymyahyaa@gmail.com](mailto:ymyahyaa@gmail.com). Consumers in Türkiye may also apply to the Consumer Arbitration Committee or Consumer Court, within the limits set each year by the Ministry of Trade. Personal data is handled as described in our [Privacy Policy](/privacy).',
        ],
      },
    ],
  },
};
