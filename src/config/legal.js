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
  lastUpdated: '21 October 2026, 03:04 (TRT)',

  // ---------------------------------------------------------------------------
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How YMY collects, uses, shares and protects your personal data.',
    intro:
      'YMY respects your privacy. This policy explains how Yusuf Muhammad YAHYA, trading as YMY Consultancy ("YMY", "we", "us"), collects, uses, shares and protects personal data when you use the YMY website and marketplace (the "Services"), and the choices and rights you have.',
    sections: [
      {
        h: '1. Who is responsible for your data',
        body: [
          'YMY is the data controller for personal data processed through the Services, including under Turkish Law No. 6698 on the Protection of Personal Data (KVKK).',
          { list: [
            'Yusuf Muhammad YAHYA, trading as YMY Consultancy',
            'Bulgurlu Mah. Karlidere Cad. No: 46C Daire: 10, Üsküdar, İstanbul, Türkiye',
            'Email: [ymyahyaa@gmail.com](mailto:ymyahyaa@gmail.com)',
          ] },
        ],
      },
      {
        h: '2. Personal data we collect',
        body: [
          'Information you give us:',
          { list: [
            'Account details: your name and email address, or the name and email from Google if you sign in with Google. Passwords are handled by Firebase Authentication; we never see or store them.',
            'Booking details: your name, email, booking date, tour type, number of guests, price, the purpose of your visit and any experience notes or special requests, and the time you accepted our Distance Sale Contract.',
            'Messages you send to guides or to us through the platform chat, the contact form, live chat or WhatsApp.',
            'Reviews you write about guides or travelers.',
            'If you are a guide or apply to be one: your name, email, phone number, country and city, bio, specialties, languages, prices, photos, and a copy of a government identity document (such as a passport) for verification.',
          ] },
          'Guide profiles, tour details, photos and reviews are shown publicly on the site. If you give us information about another person, such as a fellow traveler, please only do so with their permission.',
          'Information collected automatically: your IP address, browser and device type, pages visited, and dates and times of visits. Analytics data is collected only if you accept non-essential cookies.',
          'Information from others: sign-in details from Google if you use Google sign-in, and payment status (amount, result and transaction reference) from our payment provider.',
        ],
      },
      {
        h: '3. How we use your data',
        body: [
          { list: [
            'to create, run and secure your account;',
            'to show guide profiles and let travelers find, message and book guides;',
            'to process bookings, payments, refunds and guide subscriptions;',
            'to review guide applications and verify guide identity;',
            'to answer questions, complaints and disputes;',
            'to send messages about your account and bookings;',
            'to keep the marketplace safe, including reviewing platform messages to prevent fraud and misuse;',
            'to understand how the site is used and improve it (only with your cookie consent); and',
            'to keep business and tax records and meet our legal obligations.',
          ] },
          'Our legal bases are: performing our contract with you (or steps before it), our legitimate interests in running a safe and working marketplace, compliance with legal obligations, and your consent (for analytics and the live-chat widget). You can withdraw consent at any time; this does not affect processing done before.',
        ],
      },
      {
        h: '4. Signing in with Google',
        body: [
          'If you sign in with Google, we receive your name, email address and Google account identifier. We use them only to create and secure your YMY account.',
        ],
      },
      {
        h: '5. Payments and identity verification',
        body: [
          'Card payments are handled by our payment provider (Stripe, and iyzico once enabled). You enter your card details directly with the provider; we never see or store your full card number. We receive the payment amount, status and a transaction reference, which we use to manage your booking, refunds and records.',
          'Guide identity documents are sensitive. We use them only to verify that a guide is who they say they are. The document is uploaded to our file host (Cloudinary), and the link to it is saved in your guide application, which only you and our admin team can view. We keep it only as long as needed for verification, safety and legal obligations.',
        ],
      },
      {
        h: '6. Customer support and communications',
        body: [
          'When you contact us, we use your contact details, account and booking information and your message to respond. Contact-form messages are stored in our database. Live chat is provided by Zendesk and loads only if you accept non-essential cookies. If you message us on WhatsApp, WhatsApp’s own privacy policy also applies.',
        ],
      },
      {
        h: '7. Cookies and analytics',
        body: [
          'We use a strictly necessary cookie to keep you signed in. Google Analytics and the Zendesk live chat load only after you click "Accept all" in the cookie banner, and you can reject them just as easily. We do not use advertising cookies. Details are in our [Cookies Policy](/cookies).',
        ],
      },
      {
        h: '8. Who we share your data with',
        body: [
          { list: [
            'Other users, where needed for a booking: for example, a guide sees your name, booking details and messages.',
            'Service providers who run the Services for us: Firebase / Google Cloud (accounts and database), Vercel (website hosting), Cloudinary (photos and uploaded documents), Stripe and iyzico (payments), Zendesk (live chat), Google Analytics (only with consent), and Google Fonts and Unsplash (fonts and images, which may receive your IP address).',
            'Authorities, courts or advisers, where required by law or to protect rights and safety.',
            'A buyer or successor, if the business is sold or restructured.',
            'Anyone else you ask us to share with.',
          ] },
          'We do not sell your personal data.',
        ],
      },
      {
        h: '9. How long we keep your data',
        body: [
          'We keep personal data only as long as needed for the purposes above: to run your account and bookings, provide support, keep tax and accounting records, prevent fraud, resolve disputes and meet legal obligations. How long depends on the type of data and the law that applies. When data is no longer needed, we delete or anonymise it. You can ask us to delete your data at any time (see section 12).',
        ],
      },
      {
        h: '10. International transfers',
        body: [
          'Some of our service providers (such as Google, Vercel, Cloudinary, Stripe and Zendesk) store or process data outside Türkiye, including in the United States and the EU. Where Turkish law (KVKK) or other applicable law requires, we rely on the transfer safeguards it allows. Contact us for more information.',
        ],
      },
      {
        h: '11. Security',
        body: [
          'We use reasonable technical and organisational safeguards, including encrypted connections (HTTPS), sign-in protection and database rules that restrict who can read each record. No system is completely secure, so please keep your password safe and tell us straight away if you think your account has been accessed without permission.',
        ],
      },
      {
        h: '12. Your rights',
        body: [
          'Depending on where you live (including under KVKK article 11 and the GDPR), you may have the right to:',
          { list: [
            'find out whether we process your data and get a copy of it;',
            'correct inaccurate or incomplete data;',
            'ask us to delete your data;',
            'receive certain data in a portable format;',
            'object to or restrict certain processing;',
            'withdraw consent; and',
            'complain to a data-protection authority (in Türkiye, the Personal Data Protection Authority, KVKK).',
          ] },
          'To use any of these rights, email [ymyahyaa@gmail.com](mailto:ymyahyaa@gmail.com). We may ask for information to confirm your identity first, and we will respond within the time the law requires.',
        ],
      },
      {
        h: '13. Children',
        body: ['The Services are not intended for children under 18, and we do not knowingly collect their personal data.'],
      },
      {
        h: '14. Third-party websites',
        body: ['The site links to other services, such as WhatsApp and social media. Their own privacy policies apply when you use them.'],
      },
      {
        h: '15. Changes to this policy',
        body: ['We may update this policy when our Services, technology or legal requirements change, and will post the updated version here. The "Last updated" date at the top shows when it last changed.'],
      },
      {
        h: '16. Contact us',
        body: [
          'For questions about this policy or your data, contact Yusuf Muhammad YAHYA (YMY Consultancy), Bulgurlu Mah. Karlidere Cad. No: 46C Daire: 10, Üsküdar, İstanbul, Türkiye. Email: [ymyahyaa@gmail.com](mailto:ymyahyaa@gmail.com).',
        ],
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
