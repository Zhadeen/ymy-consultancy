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

## 4. Static prerendering (Step 0) — DONE

**Implemented and verified.** `vite-react-ssg` is incompatible with React Router
7 and `react-helmet-async` with React 19 (both verified via `npm install` peer
conflicts), so prerendering uses a **bespoke, zero-runtime-dependency** Vite-SSR
pipeline:

- `src/App.jsx` exports a router-agnostic **`AppTree`**; the client wraps it in
  `<BrowserRouter>`, the prerender in `<MemoryRouter>`.
- `AuthProvider` starts `loading = false` on the server (no auth to wait for) so
  pages prerender as their content, not a spinner — and its global loading gate
  was removed so the client hydrates the same markup cleanly. Protected routes
  still wait for auth via `ProtectedRoute` / `DashboardRouter`.
- `src/entry-server.jsx` renders a URL with a `HeadProvider` **collector**;
  `scripts/prerender.mjs` serialises that head (title, description, canonical,
  robots, OG/Twitter, JSON-LD) into the built `index.html` and writes
  `dist/<route>/index.html` for every route in `PRERENDER_ROUTES`.
- It also emits **`dist/404.html`**, **`dist/sitemap.xml`** (indexable routes
  only — `/thank-you` is excluded), and **`dist/app.html`** (empty shell for
  client-only routes so they don't hydrate-mismatch the home prerender).
- Build: `npm run build` = `vite build && vite build --ssr … && node
  scripts/prerender.mjs`.
- `vercel.json` serves prerendered files directly, rewrites the **client-only**
  routes (`/search`, `/guide/:id`, dashboards, auth, `/admin`…) to `/app.html`,
  leaves `/api/*` alone, and lets unknown paths fall through to **404.html with a
  real 404 status** (no soft 200 shell).

**Verified:** every public route emits static HTML with exactly one `<title>`,
unique meta, canonical, robots, OG, and JSON-LD in the raw `<head>`; the client
**hydrates with no console errors**; SPA navigation and client-only routes work;
`/nonexistent` returns a 404 status.

**Known minor note:** content wrapped in the existing `ScrollReveal` component
prerenders at `opacity:0` (it animates in on scroll via IntersectionObserver).
The text is present in the HTML for crawlers, but users with JavaScript disabled
won't see those specific sections. Mostly affects Terms/Privacy; the new pages
don't use ScrollReveal. Optional future tweak: default `ScrollReveal` to visible
when there's no IntersectionObserver.

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
- ✅ Prerender emits static HTML per public route (verified in `dist/`).
- ✅ No fabricated reviews / address / GA ID / response-time / case-study data.
- ✅ Unique title + description per route (table above).
- ✅ OG image resolves in the **prerendered** `<head>` (absolute URL), not only client-injected.
- ✅ JSON-LD structurally valid; unsupplied fields omitted (FAQPage/areaServed/address).
- ✅ `sitemap.xml` (indexable routes only) + `robots.txt` + real 404 status for unknown paths.
- ⏳ **Lighthouse SEO/a11y** — run it against a deploy (or `npm run build` then a
  static serve): `npx lighthouse https://<preview-url>/ --only-categories=seo,accessibility`.
  Expected strong SEO (per-route title/meta/canonical, crawlable static content,
  sitemap, valid structured data). Likely a11y follow-ups: color-contrast on muted
  gold-on-dark text, and a couple of pre-existing decorative images' alt text
  (new components already use proper `alt` / `aria-hidden`).

## 7. Running the prerender locally
```bash
npm run build          # client build + SSR build + prerender -> dist/
# serve dist/ with clean-URL + directory-index resolution to preview, e.g.:
npx serve dist         # or any static server that maps /faq -> faq/index.html
```
