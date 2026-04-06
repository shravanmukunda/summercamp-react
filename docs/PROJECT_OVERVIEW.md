# Summer Camp React — Project Overview & Backend Guide

This document describes what the **summercamp-react** application does today, how data and third-party services are wired, and how a proper backend can replace static files and external forms while supporting future features (search, listings, monetization).

---

## 1. What this project is

**Purpose:** A public-facing marketing and discovery site for families looking for **summer camps, sports academies, music schools, art programs, and tuition centers** (primarily in Indian cities such as Bangalore, Chennai, Delhi, etc.). The product positioning aligns with a directory brand such as **FindMyCoach** / “Find My Camp” style listings.

**User-facing capabilities:**

| Area | Behavior |
|------|----------|
| **Home** | Hero carousel, search (text, area/location, sport type), grid of institution cards |
| **Institution detail** | Route `/institution/:id` — rich profile: overview, programs, instructors, facilities, contact, gallery |
| **Packages** | Pricing tiers for *academies* (Basic vs Pro marketing) — UI only, no checkout |
| **Blog** | Static placeholder content in code |
| **Contact** | Simple “send a message” form |

**Tech stack:** React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS 4. There is **no** server-side runtime in this repo; everything ships as a static SPA.

---

## 2. Current architecture (no custom backend)

### 2.1 Institution data (read path)

- List: `public/data/institutions.json`
- Per-institution detail: `public/data/institutions/{id}.json`

The types in `src/types/institution.ts` (`Institution`, `InstitutionDetail`, programs, instructors, facilities, etc.) mirror these JSON shapes.

`src/utils/constants.ts` defines:

```ts
API_ENDPOINTS.INSTITUTIONS → '/data/institutions.json'
API_ENDPOINTS.INSTITUTION_DETAIL(id) → '/data/institutions/{id}.json'
```

`src/utils/api.ts` uses those endpoints. `Home.tsx` currently calls `fetch('/data/institutions.json')` directly; hooks `useInstitutions` / `useInstitutionDetail` use the shared API helpers — a backend can be adopted by **changing only `API_ENDPOINTS`** (plus CORS and env-based base URLs) to point at REST (or GraphQL) URLs.

### 2.2 Contact form (third-party)

The **Contact** page does **not** use Google Forms. It POSTs JSON to **Formspree** (`https://formspree.io/f/...`). That handles delivery to email without a custom server.

### 2.3 “List Your Academy” (Google Forms)

**Header** and **Footer** link to a **Google Form** URL for academy owners who want to get listed. That is the main **Google** integration: onboarding / lead capture for *new listings*, not the contact page.

### 2.4 Search

Search on the home page is **client-side filtering** over the full institution list already loaded in memory. There is no server-side query, pagination from the server, or full-text index.

---

## 3. Why add a backend

Reasons that match this product:

1. **Dynamic listings** — Add/edit/archive institutions without redeploying static JSON.
2. **Replace Google Forms** — Capture listing applications in your own database with structured fields, validation, and workflow (review, approve, reject).
3. **Replace or complement Formspree** — Own contact submissions, spam controls, CRM hooks, and audit trails.
4. **Real search** — Filter by city, category, sport, price range, rating; pagination; optional maps/geo later.
5. **Academy accounts** — Login for owners to update their profile (as promised implicitly by “packages” and “dashboard” copy on the marketing site).
6. **Subscriptions / billing** — The Packages page shows INR pricing; a backend would integrate payment (e.g. Razorpay, Stripe) and entitlements (Basic vs Pro).

---

## 4. Backend feature set (recommended)

Below is a practical breakdown aligned with the current frontend types and pages.

### 4.1 Core APIs (public read)

- **`GET /api/institutions`** — List with query params: `category`, `city`, `area`, `sport`, `q` (search), `minRating`, `maxPrice`, `page`, `pageSize` (see `SearchFilters` in `src/types/institution.ts`).
- **`GET /api/institutions/:id`** — Single institution; same schema as `InstitutionDetail` (or versioned DTOs).
- **Optional:** `GET /api/categories`, `GET /api/cities`, `GET /api/sports` — Derived from DB or config to keep the UI lists in sync.

### 4.2 Listing applications (replaces Google Form)

- **`POST /api/listing-applications`** (public, rate-limited) — Body: academy name, contact name, email, phone, city, category, message, optional URL fields.
- **Admin pipeline:** store as `pending` → staff `approve` / `reject` → on approve, create `Institution` record and notify the applicant.
- **Auth:** Admin-only endpoints or internal tool for review queues.

This replaces the **“List Your Academy”** Google Form with a first-party flow: either a new React page with the same fields or a progressive form embedded in the app.

### 4.3 Contact / inquiries (replaces or augments Formspree)

- **`POST /api/contact`** — Same fields as today: name, email, message.
- Add: honeypot, CAPTCHA (Turnstile / reCAPTCHA), idempotency, optional ticket ID in response.

### 4.4 Academy owner portal (future, ties to Packages)

- **Auth:** Email magic link, OAuth, or phone OTP (common in India).
- **CRUD** for own institution profile (scoped to `ownerId`).
- **Analytics:** “Basic analytics dashboard” mentioned on Packages — track impressions, clicks, contact form leads (requires events API or server logs).

### 4.5 Billing (optional phase)

- Webhooks from payment provider; store `subscription_tier`, `valid_until`.
- Gate features: featured placement, verified badge, marketing services as described on `/packages`.

### 4.6 Content

- **Blog:** Move from hardcoded `Blog.tsx` to `GET /api/posts` and markdown/HTML CMS or headless CMS.

---

## 5. How to implement the backend (high level)

### 5.1 Stack options

| Approach | Notes |
|----------|--------|
| **Node (Express/Fastify/Nest)** + PostgreSQL | Fits TypeScript ecosystem; share types via package or OpenAPI codegen. |
| **Python (FastAPI/Django)** + PostgreSQL | Strong for admin and rapid CRUD. |
| **Supabase / Firebase / Appwrite** | Faster time-to-market; auth + DB + storage; may reduce custom server code. |

### 5.2 Database (minimal entities)

- `institutions` — columns matching `Institution` / `InstitutionDetail` (or JSONB for nested arrays with validation).
- `listing_applications` — Google Form replacement.
- `contact_messages` — Formspree replacement.
- `users` / `academy_owners` — if you add owner login.
- `subscriptions` — if you add paid plans.

### 5.3 Frontend integration steps

1. Add environment variables, e.g. `VITE_API_BASE_URL=https://api.example.com`.
2. Update `API_ENDPOINTS` in `src/utils/constants.ts` to use `${import.meta.env.VITE_API_BASE_URL}/api/institutions` etc.
3. Point **Contact** `fetch` to `POST /api/contact` instead of Formspree (keep same UX).
4. Replace Google Form links with **in-app route** e.g. `/list-your-academy` posting to `POST /api/listing-applications`.
5. Optionally unify **Home** to use `useInstitutions` + server-driven filters instead of loading one large JSON file and filtering in the browser.

### 5.4 Security and operations

- HTTPS everywhere; CORS restricted to your SPA origin(s).
- Rate limiting on public `POST` endpoints.
- Input validation (length limits, email format) on both client and server.
- File uploads (logos, gallery) via presigned URLs to object storage (S3-compatible) if you move images off hotlinked URLs.

---

## 6. Summary

| Today | Tomorrow (with backend) |
|-------|-------------------------|
| Static JSON in `public/data/` | Database + REST APIs; optional CDN for images |
| Formspree for contact | `POST /api/contact` + email/CRM |
| Google Form for “List Your Academy” | `POST /api/listing-applications` + admin workflow |
| Client-only search | Server-side filter + pagination + better relevance |
| Packages page (display only) | Subscriptions + owner dashboard |

This repo is already structured with **`API_ENDPOINTS`** and shared **`Institution` types**, which keeps the move to a real API mostly a configuration and contract exercise on top of new server and data layers.
