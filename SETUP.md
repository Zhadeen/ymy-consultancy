# SETUP — SEO & conversion hardening

This document lists **everything the owner must supply** for the SEO/conversion
work to be fully live, plus honest status on what's done and what remains.

Nothing in the codebase invents facts. Every gap below corresponds to a
`TODO(owner)` in the source (mostly in [`src/config/site.js`](src/config/site.js)).

---

## 1. What the owner must supply (fill these in)

All of these live in **`src/config/site.js`** unless noted.

| Item | Where | Until supplied |
|------|-------|----------------|
| Founder bio | `SITE.founder.bio` | Person schema omits `description` |
| Founder profile links | `SITE.founder.sameAs` | omitted from schema |
| Public contact email | `SITE.contact.email` | email link hidden on /contact; not in schema |
| Public phone (optional) | `SITE.contact.phone` | omitted |
| Areas served | `SITE.areaServed` | `areaServed` omitted from ProfessionalService schema (placeholder starts with `TODO`, which the schema builder detects and skips) |
| Office address (only if you have a visitable one) | `SITE.address` + `SITE.geo` | **Map/directions component renders nothing** and no address appears in schema — correct for a service-area business |
| Social profile URLs | `SITE.social` | `sameAs` omitted from Organization schema |
| Response-time promise | `SITE.responseTime` | `ResponseTimePromise` renders nothing (no invented number) |
| FAQ answers (5) | `FAQ[].a` | Questions show "Answer coming soon"; **FAQPage JSON-LD is omitted entirely** until real answers exist |
| Case-study / story facts | `STORIES[]` + set `published: true` | /stories shows an honest "coming soon" empty state |
| Per-route OG images (optional) | `/public/og/*.png` + `ROUTE_META[route].og` | all routes use the generic `/public/og/home.png` |

### Reviews (collection mode — intentionally OFF)
No public reviews section or `Review`/`AggregateRating` schema is emitted yet.
To turn reviews on later:
1. **Claim your Google Business Profile** at <https://business.google.com>. Once
   verified, open your profile → **Ask for reviews** / **Get more reviews** to
   copy your short review link (looks like `https://g.page/r/XXXX/review`).
2. Paste it into `SITE.reviewUrl`. This makes the dismissible "leave a review"
   prompt appear on **/thank-you** (nowhere else).
3. Only once you have **real** reviews: pass them to `<ReviewsSection reviews=…>`
   and set `SITE.reviewsEnabled = true`. Add `Review`/`AggregateRating` JSON-LD
   **only** for real, verifiable reviews.

---

## 2. Environment variables

Set these in **Vercel → Settings → Environment Variables** (and `.env` locally):

| Var | Needed for | Notes |
|-----|-----------|-------|
| `VITE_GA_ID` | Google Analytics 4 | **Optional.** GA loads only when set. Unset = analytics fully off. Never commit a real ID. |
| `FIREBASE_SERVICE_ACCOUNT` | Contact form persistence (`api/contact.js`) | **Required for the contact form to store messages.** Paste the service-account JSON, or base64 of it (safer for newline handling). See below. |

### Creating `FIREBASE_SERVICE_ACCOUNT`
1. Firebase Console → Project settings → **Service accounts** → **Generate new
   private key** → downloads a JSON file.
2. Recommended (base64): `base64 -i serviceAccount.json | pbcopy` and paste the
   result as the env value. (The handler accepts raw JSON or base64.)
3. Redeploy. Until this is set, `/api/contact` returns a clear 503 and the form
   surfaces "not fully configured yet."

### Contact email notification — TODO
`api/contact.js` **stores** messages but does **not** email you yet (no provider
credentials are invented). To enable notifications:
- Wire an email provider (e.g. **Resend** or **SendGrid**), and
- Set the destination address. Search `TODO(owner)` in `api/contact.js`.

New contact messages land in the Firestore **`contact_messages`** collection.

---

## 3. What was built (done)

- **Config backbone** `src/config/site.js` — all copy/flags/route metadata, no fake data.
- **Zero-dependency SEO head manager** (`src/seo/`) — react-helmet-async and
  vite-react-ssg both **reject React 19**, so head management is bespoke:
  - `Seo.jsx` sets per-route `<title>`, description, canonical, robots, Open
    Graph + Twitter tags, and JSON-LD. Works client-side now and serialises into
    the prerender later.
  - `RouteHead.jsx` drives every marketing/legal route's head from `ROUTE_META`
    (unique title + description per route — see list below).
  - `jsonLd.js` — Organization, WebSite, ProfessionalService (areaServed, **no
    address** until supplied), BreadcrumbList, FAQPage (**omits empty answers**).
- **Conversion components** (`src/components/conversion/`): `CTA`, `Breadcrumbs`,
  `FAQSection` (native `<details>`, keyboard-friendly), `ResponseTimePromise`
  (hidden until set), `StickyMobileCTA` (<768px, dismissible, keyboard-reachable),
  `ReviewsSection` (wired but OFF), `MapDirections` (gated behind an address).
- **New pages + routes**: `/faq`, `/stories`, `/contact`, `/thank-you`.
- **Contact API**: `api/contact.js` (validates, honeypot, writes to Firestore via
  Admin SDK) → form redirects to `/thank-you` on success.
- **Analytics**: `Analytics.jsx` — GA4 gated on `VITE_GA_ID`.
- **robots.txt** (`/public/robots.txt`) — allows public, disallows app/private
  areas, points to the sitemap.
- **Privacy page**: clearly-labelled **TEMPLATE / "review with counsel"** banner.
- **Owner photo**: moved to `/public/engineer-yusuf.jpg`, referenced from
  `SITE.founder` with singular "Engineer Yusuf" founder copy.
- **Generic OG image**: `/public/og/home.png` (1200×630). Swap-in per route noted above.
- **Internal linking**: new pages added to the shared Footer link groups.

### Unique title + meta description per route (verified distinct)
| Route | Title (before ` · YMY Consultancy`) |
|-------|-------|
| `/` | Book Verified Local Guides Worldwide |
| `/pricing` | Pricing for Local Guides |
| `/visitor-pricing` | Pricing for Travelers |
| `/help` | Help Center |
| `/safety` | Trust & Safety |
| `/cancellation` | Cancellation Policy |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/faq` | Frequently Asked Questions |
| `/stories` | Traveler Stories & Featured Guides |
| `/contact` | Contact Us |
| `/thank-you` | Thank You (noindex) |
| `/search` | Find a Local Guide |
| auth routes | noindex |

Each route's description is distinct (see `ROUTE_META` in `src/config/site.js`).

---

## 4. ⚠️ PENDING — static prerendering (Step 0) and what depends on it

**Status: not yet implemented.** This is the one headline item still open, and
here is the honest reason and the plan.

**Why the spec's tool doesn't work here:** the task suggested `vite-react-ssg`.
It declares a peer dependency of **React Router ^6**, but this app runs **React
Router 7.13.2** (verified `npm install` peer conflict). `react-helmet-async`
likewise caps at **React 18** and rejects this app's **React 19**. Forcing either
with `--legacy-peer-deps` onto a live, auth-hardened marketplace risks subtle
hydration bugs. So prerendering must use a **bespoke, dependency-light** pipeline.

**The plan (equivalent prerender step):**
1. Extract the app tree so it's router-agnostic: a `<AppTree>` that renders the
   providers + routes but **not** the router. Client wraps it in `<BrowserRouter>`;
   the prerender wraps it in `<StaticRouter>`/`createMemoryRouter` per URL.
2. Guard SSR: in `AuthProvider`, start `loading = false` when `typeof window ===
   'undefined'` so pages prerender as their content (today it would prerender the
   `<LoadingSpinner/>`). Effects (`onAuthStateChanged`, Zendesk, IntersectionObserver)
   already don't run during SSR render.
3. Add `entry-server.jsx` that renders a URL with a `HeadProvider` **collector**
   (already built — `src/seo/HeadProvider.jsx`); serialise the collector into the
   `index.html` `<head>` (title, meta, canonical, OG, JSON-LD).
4. `scripts/prerender.mjs`: `vite build` → `vite build --ssr entry-server` →
   loop `PRERENDER_ROUTES` (already exported from `site.js`) → write
   `dist/<route>/index.html`. Emit `dist/404.html`. Generate `dist/sitemap.xml`
   from `PRERENDER_ROUTES`. Wire into `"build"`.
5. `vercel.json`: replace the catch-all `→ /` rewrite so prerendered files are
   served directly and unknown paths return the real **404.html** with a 404
   status (today's rewrite makes everything a 200 SPA shell). Keep `/api/*`
   untouched.

**Items that land only once prerendering is in:**
- OG image + per-route meta visible to crawlers in **static** HTML (they already
  work client-side / for SPA navigation today).
- `sitemap.xml` (generated from `PRERENDER_ROUTES`).
- True `404` status for unknown paths.

Everything in §3 works today client-side; prerendering makes the `<head>` +
JSON-LD present in the raw HTML that crawlers read without running JS.

---

## 5. Pre-existing copy to verify (not introduced by this work)

These marketing claims already existed in the site and should be checked for
truth by the owner (they are outside the no-fake-data scope of the new code, but
worth flagging):
- Home hero stats "500+ / 50+ cities / 10K+ happy travelers".
- Footer "Serving 50+ cities worldwide" and "since 2024".
- The Footer newsletter form is a visual stub (doesn't subscribe anywhere yet).

---

## 6. Acceptance status
- ✅ build + lint pass; no new lint over baseline.
- ✅ No fabricated reviews / address / GA ID / response-time / case-study data.
- ✅ Unique title + description per route (table above).
- ✅ JSON-LD structurally valid; unsupplied fields omitted (FAQPage/areaServed/address).
- ⏳ Prerendered static HTML per route, OG-in-static-head, sitemap.xml, true 404 —
  pending the §4 prerender pipeline.
- ⏳ Lighthouse SEO/a11y — meaningful to measure after prerendering; run
  `npx vite preview` + Lighthouse once §4 lands.
