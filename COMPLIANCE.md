# COMPLIANCE.md — Legal-risk & compliance audit (Phase 1)

> **DRAFT — NOT LEGAL ADVICE. REVIEW WITH COUNSEL.**
> This document is an engineering risk audit and a set of starting points. It is
> **not** a legal determination and does **not** certify the site as compliant
> with any law. Nothing here should be published or relied upon until a qualified
> lawyer in the relevant jurisdiction(s) has reviewed it. Severity labels are
> engineering judgement, not legal opinion.

Audit date: 2026-09-06 · Scope: `ymy-consultancy` (Vite/React SPA + Vercel
serverless `api/` + Firebase/Firestore + Stripe + Cloudinary). Method: static
review of the repository. **No code was changed in this phase** — remediation is
Phase 2, after you review these findings.

---

## 0. Summary

| Sev | Count | Themes |
|-----|-------|--------|
| 🔴 Critical | 3 | Passport scans at public URLs; inaccurate privacy policy + dead consent links; trackers firing with no consent |
| 🟠 High | 6 | Unsubstantiated/false stats; real faces as fake guides; over-sharing PII to Stripe; undocumented image licenses; contrast + label a11y failures |
| 🟡 Medium | 7 | New contact form has no consent; admin reads private chats; free-text PII; dead newsletter form; misc policy inaccuracies; no DSAR/deletion; no retention |

**Good news, confirmed:** there are **no fake or seeded reviews** in the codebase
(`src/data/mockData.js:298` → `mockReviews = []`; `mockGuides`, `mockBookings`,
`mockChatMessages` all empty; no hardcoded testimonials; the `<ReviewsSection>`
is wired OFF). No Review/AggregateRating schema is emitted. Item 5 is clean.

---

## 1. Data collection inventory

Every personal field the app collects and where it goes.

| Data | Collected at | Stored / sent to | Notes |
|------|--------------|------------------|-------|
| Name, email | Register (`RegisterPage.jsx:111-115`), Google sign-in (`authService.js:47-50`), Firestore `users` (`authService.js:63`) | Firebase Auth + Firestore | — |
| Password | Register/Login/Guide-reg | **Firebase Auth only** (the app never stores it) | Policy wrongly says "encrypted passwords" (M5) |
| **Government ID scan (passport etc.) + ID type** | Guide onboarding (`GuideRegistration.jsx:29`, `:142`) | **Cloudinary (public URL)** + Firestore `guide_applications.idDocumentUrl` (`:164`) | 🔴 C1 — sensitive doc at public URL |
| First/last name, phone (+code), country, city | Guide onboarding (`GuideRegistration.jsx:26-29`, `:153-169`) | Firestore `guide_applications` | — |
| Bio, specialties, prices | Guide onboarding / profile | Firestore `guides` | Free-text (M3) |
| Booking: visitorName, visitorEmail, guests, totalPrice, **visitPurpose, localExperience, specialRequests** | Booking flow (`bookingService.js:50-59`) | Firestore `bookings` **and Stripe metadata** (`create-checkout-session.js:45-56`) | 🟠 H3 — free-text purpose/experience shipped to Stripe |
| Chat messages | Chat (`messagesRepository.js:31`) | Firestore `chats/*/messages` | Admin-readable (M2) |
| Contact: name, email, message | `/contact` (`ContactPage.jsx`) | Firestore `contact_messages` (via `api/contact.js`) | No consent checkbox (M1) |
| Newsletter email | Footer (`Footer.jsx:112-123`) | **Nowhere — stub** | 🟡 M4 — collected, unused |

---

## 2. Third-party data flows (each must be disclosed in the privacy/cookies policy)

| Service | What it receives | Evidence | Sets cookies / phones home |
|---------|------------------|----------|----------------------------|
| **Firebase** (Auth, Firestore, Storage) | Account data, all app data, ID-doc metadata | `src/config/firebase.js` | Auth token in storage; Google (US) infra |
| **Cloudinary** | Uploaded images **and ID documents** | `cloudinaryUpload.js:62` | Public asset URLs; IP on upload/serve |
| **Stripe** | Payment + `customer_email`, visitorName, visitPurpose, localExperience | `api/create-checkout-session.js:42-56` | Payment processor; card data handled by Stripe (good) |
| **Zendesk** (chat widget) | Anything typed into Live Chat; loads on **every page** | `src/hooks/useZendesk.js:18`, mounted in `App.jsx` | ✅ Sets cookies; loads **pre-consent** |
| **Google Analytics 4** | Page views, device/IP (if `VITE_GA_ID` set) | `Analytics.jsx:16-23` | ✅ Sets cookies; fires **pre-consent** |
| **Google Fonts** | Visitor IP to Google on every load | `index.html:10-12` | IP transfer pre-consent |
| **Unsplash** (hotlinked images) | Visitor IP to Unsplash on every load | 15 URLs incl. `mockData.js:275` | IP transfer pre-consent |
| **Google Maps** (embed) | IP + location query — **gated behind an address, currently off** | `MapDirections.jsx:33` | Only if an address is configured |
| WhatsApp | Link only (no embed) | `FloatingContact.jsx`, `Footer.jsx` | Off-site link |

---

## 3. Findings by severity (with evidence)

### 🔴 CRITICAL

**C1 — Government ID documents stored at public, unauthenticated URLs.**
Guide onboarding collects a passport/ID scan (`GuideRegistration.jsx:29` `idDocument`, uploaded at `:142`) and stores it via the **unsigned Cloudinary** path (`cloudinaryUpload.js:62`), which returns a public `secure_url` anyone with the link can open. The URL is saved on the application record (`:164`). ID documents are among the most sensitive personal data; storing them where access depends only on URL secrecy, with no retention/deletion policy, is a serious exposure. *(Cross-ref: security audit finding F3.)*
→ Counsel + engineering: move ID docs to authenticated delivery (signed URLs) or private storage; define retention + deletion; document lawful basis.

**C2 — Privacy policy is inaccurate and its consent links are dead.**
`PrivacyPage.jsx:31` claims the site collects "**geolocation** necessary for city-specific searches," but the app uses **no geolocation API** (`navigator.geolocation` appears nowhere). A policy describing collection the app doesn't do is a misstatement. Separately, the registration consent text links Terms/Privacy to **`href="#"`** (`RegisterPage.jsx:136`) — users "agree" to documents they cannot open. Inaccurate disclosure + consent to unreadable terms undermines the consent's validity.
→ Rewrite the policy to reflect actual flows (§1/§2); point consent links to `/terms` and `/privacy`.

**C3 — Non-essential trackers load before any consent, and there is no consent mechanism.**
No cookie-consent component exists anywhere in `src/`. GA4 (`Analytics.jsx:9-23`), Zendesk (`useZendesk.js`, mounted globally in `App.jsx`), Google Fonts (`index.html:10-12`) and hotlinked Unsplash all fire on page load, setting cookies / transferring IPs **before** the visitor can choose. For EU/UK visitors this is an ePrivacy/GDPR consent breach (see Phase 3).
→ If EU/UK/consent-required users are in scope: add a consent gate that blocks GA + Zendesk + non-essential embeds until opt-in, with reject-all as easy as accept-all; self-host fonts or gate them.

### 🟠 HIGH

**H1 — Unsubstantiated marketing claims; at least one is currently false.**
`Hero.jsx:156-158` shows "**500+**", "**50+**", "**10K+ Happy Travelers**"; `Footer.jsx:143` "**Serving 50+ cities worldwide**"; `Footer.jsx:30` "**since 2024**" + "**Premium**"; `Hero.jsx:62` "**Verified Local Expert**" / "**No Commission**". The platform database was wiped to a fresh state (0 guides/travelers), so "10K+ Happy Travelers" and "500+/50+" are not just unsubstantiated but **false today**. Unbacked superlatives/stats create FTC / UK ASA / consumer-protection exposure.
→ Remove or replace with truthful, substantiable figures; keep only claims you can evidence.

**H2 — Real people's faces used as placeholder "guide" avatars.**
`mockData.js:275-287` `GUIDE_PHOTOS` = 12 Unsplash "crop=face" portraits of real individuals, used as fallback guide/peer photos (`bookingService.js`, `AdminPanel.jsx`, `ChatPage.jsx`, `ChatInbox.jsx`). Depicting real people as "verified local guides" they are not is a misrepresentation and a personality/publicity-rights risk (Unsplash's licence does not grant the right to imply a depicted person endorses or provides your service).
→ Replace with clearly-illustrative/abstract placeholders or licensed model-released imagery; never imply a stock face is a real guide.

**H3 — More PII than necessary is transmitted to Stripe.**
`create-checkout-session.js:45-56` sends `visitorName`, `visitorEmail`, and free-text `visitPurpose` / `localExperience` as Stripe **metadata**. `customer_email` is defensible; the free-text purpose/experience fields are unlikely to be necessary for payment and expand the data shared with a processor.
→ Minimise: send only what payment needs; drop `visitPurpose`/`localExperience` from Stripe metadata.

**H4 — Image licence/provenance is undocumented (takedown risk).**
No `LICENSE`/`CREDITS`/`ATTRIBUTION` file exists. `logo.png` and `world-map.jpg` (`src/assets/`) have no in-repo provenance, and 15 Unsplash URLs are hotlinked. Do **not** assume these are cleared.
→ `[OWNER MUST PROVIDE]` licence/source for the logo, the world-map image, and any non-Unsplash imagery; record them in an attribution file.

**H5 — Accessibility: colour-contrast failures (WCAG AA).**
`text-muted-dark` = `#6B6B6B` (`tailwind.config.js`) on `dark-900 #000000` / `dark-800 #0a0a0a` yields ≈ **3.9:1**, below the 4.5:1 AA threshold for normal/small text; it's used ~**100×**, often on small captions, dates, breadcrumb separators, and footer text. `text-cream/50` also drops below AA.
→ Phase 2: lift muted-dark (or restrict it to ≥18px/bold large-text contexts) to reach AA.

**H6 — Accessibility: form fields labelled only by placeholder.**
Register (`RegisterPage.jsx:111-126`), Login (`LoginPage.jsx:112-116`), and much of Guide onboarding (`GuideRegistration.jsx`, ~7 labels for ~12 inputs) rely on `placeholder` with no associated `<label htmlFor>`. Placeholders are not accessible names (they vanish on input) — WCAG 1.3.1 / 3.3.2 / 4.1.2.
→ Phase 2: add real `<label>`s (visible or visually-hidden) tied to each input `id`.

### 🟡 MEDIUM

- **M1 — New contact form lacks consent.** `ContactPage.jsx` collects name/email/message with no consent checkbox or `/privacy` link. Add explicit, unchecked consent (Phase 2).
- **M2 — Platform staff can read private chats.** `firestore.rules` grants admins read on all `chats`/messages (an intentional tradeoff for the wipe tool, documented in the rules). This must be **disclosed** in the privacy policy — users' private messages are accessible to the operator.
- **M3 — Unstructured free-text PII.** `visitPurpose`, `localExperience`, `specialRequests`, `bio` may capture arbitrary personal data. Ensure the policy covers it and retention is defined.
- **M4 — Dead newsletter form collects email for nothing.** `Footer.jsx:112-123` takes an email and only shows "✓" (`setSubscribed`), storing nothing. Either wire it to a real, consented mailing list or remove the field (data-minimisation + honesty).
- **M5 — "encrypted passwords" misstatement.** `PrivacyPage.jsx:31` — the app doesn't store passwords; Firebase Auth does (hashed). Reword.
- **M6 — No data-subject-rights mechanism.** No self-serve access/export/deletion; users can't delete their own account/data. GDPR Arts 15-17 gap.
- **M7 — No defined retention.** Bookings, chats, ID documents, contact messages, applications persist indefinitely with no stated retention/deletion schedule.

---

## 4. Accessibility — before state (baseline for Phase 2 before/after)

| Check | Baseline finding |
|-------|------------------|
| **Alt text** | All 20 `<img>` have an `alt` attribute (good). Quality/decorative-vs-informative not yet audited per-image; a few use generic alt (e.g. "ID Document Preview"). New SEO/conversion components use proper `alt`/`aria-hidden`. |
| **Contrast** | ❌ `text-muted-dark` (#6B6B6B) ~3.9:1 fails AA; ~100 uses. `text-cream/50` fails. (H5) |
| **Labels** | ❌ Register/Login/Guide-onboarding inputs placeholder-only. (H6) |
| **Keyboard** | Mostly native `<button>`/`<a>`/`<Link>` (reachable). Custom controls to spot-check in Phase 2: FloatingContact, image-upload dropzone, star-rating in ReviewModal. |
| **Button labels** | No generic "Submit/Click here" found — labels are specific ("Create Account", "Send message"). Good. |

Phase 2 will report the **after** state for alt/contrast/keyboard/labels.

---

## 5. Phase 3 — Jurisdiction flags (LIKELY-APPLIES, confirm with counsel — not a determination)

The marketplace is marketed "worldwide", handles personal data + payments, and
plausibly has cross-border users. The following **likely** apply:

- **GDPR / UK-GDPR** — *likely applies* if any EU/UK travelers or guides use the
  site. Gaps against current state: no lawful-basis mapping; no consent for
  non-essential cookies (C3); no DSAR/access/deletion mechanism (M6); sensitive
  ID-document processing without safeguards (C1); cross-border transfers to US
  processors (Firebase/Cloudinary/Stripe) with no stated transfer mechanism
  (SCCs); possible Art. 27 representative / DPO assessment. *Confirm with counsel.*
- **ePrivacy (cookie consent)** — *likely applies* alongside GDPR: prior consent
  for GA/Zendesk cookies. *Confirm.*
- **Consumer protection / distance selling** (bookings) — EU Consumer Rights
  Directive / UK Consumer Contracts Regs / equivalents: pre-contract info,
  cancellation/refund rights, clear pricing. Your `/cancellation` + `/refunds`
  terms must match. *Confirm.*
- **Owner's home data-protection regime** — applies based on where the entity is
  **established** (e.g. Turkey **KVKK** or Nigeria **NDPR** depending on the
  registered entity — this session has seen signals of both). *Confirm which,
  and the establishment.*
- **PCI-DSS** — largely offloaded to Stripe (no card data touches the app/servers
  — good). *Confirm SAQ-A eligibility with Stripe.*
- **Marketplace/advertising truthfulness** — "Verified", "No Commission", stats
  (H1) must be literally true given how the platform actually operates.

---

## 6. `[OWNER MUST PROVIDE]` checklist (blocks the legal pages)

- [ ] Legal entity name, registered company number, and registered address.
- [ ] Country of establishment (determines home regime — KVKK? NDPR? other?).
- [ ] Privacy contact email (and whether a DPO / EU-UK representative is required).
- [ ] Jurisdictions actually targeted / users expected (drives GDPR applicability).
- [ ] Retention periods per data category (accounts, bookings, chats, **ID docs**, contact messages, applications).
- [ ] ID-document handling: purpose, lawful basis, retention, deletion, who can view.
- [ ] Exact refund / cancellation terms (beyond the current "free >24h before").
- [ ] Substantiation for every stat/claim in H1, or instruction to remove.
- [ ] Licence/source evidence for `logo.png`, `world-map.jpg`, and any non-Unsplash image.
- [ ] Whether the newsletter (M4) should be built (with a real, consented list) or removed.
- [ ] Decision on the Unsplash "guide face" placeholders (H2) — replace with what?

## 7. "Confirm with counsel" checklist

- [ ] All four legal pages (privacy, terms, cookies, refunds) reviewed & approved by a lawyer.
- [ ] GDPR/UK-GDPR applicability and the lawful basis for each processing purpose.
- [ ] Cookie-consent design (is a banner required? scope of "strictly necessary"?).
- [ ] Cross-border transfer mechanism (SCCs / adequacy) for US processors.
- [ ] ID-document processing (special-category assessment / DPIA if applicable).
- [ ] Consumer cancellation/refund rights for the booking flow.
- [ ] Truthfulness of "Verified", "No Commission", and all statistics.

---

## 8. Proposed Phase 2 scope (for your approval — NOT yet done)

Once you've reviewed the above, Phase 2 would: create `src/config/legal.js` (owner
placeholders) + DRAFT-bannered `/privacy`, `/terms`, `/cookies`, `/refunds`
reflecting the **actual** flows in §1-§2; add a consent gate that blocks GA +
Zendesk + non-essential embeds until opt-in (reject-all == accept-all); add
unchecked consent checkboxes linking to `/privacy` on the register + contact
forms and fix the dead `href="#"` links; remove the false/unsupported claims
(H1) and the real-face placeholders (H2); trim Stripe metadata (H3); fix contrast
(H5) and form labels (H6); and either wire or remove the newsletter (M4). Every
legal page will carry the DRAFT banner and nothing will be described as
"compliant".
