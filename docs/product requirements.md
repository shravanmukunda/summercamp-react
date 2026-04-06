# Product Requirements — Summer Camp / FindMyCoach Directory

**Document type:** Product requirements (living document)  
**Product:** Public discovery site for summer camps, sports academies, music schools, art programs, and tuition centers (primary focus: Indian cities).  
**Related:** See `PROJECT_OVERVIEW.md` for architecture and backend integration notes.

---

## 1. Vision and goals

### 1.1 Vision

Help families discover trusted programs (camps, academies, schools) by city, category, and sport; help academy owners gain visibility and leads through listings and optional paid plans.

### 1.2 Business goals

- Grow searchable, trustworthy institution coverage in target cities.
- Capture inbound interest from families (contact) and from academies (listing applications).
- Support future monetization (Basic / Pro style plans) and owner self-service without redeploying static content.

### 1.3 Success metrics (indicative)

- Listings viewed and detail-page engagement.
- Contact form and “list your academy” conversion rates.
- Time-to-publish for new institutions after application (admin workflow).

---

## 2. Users and personas

| Persona | Needs |
|--------|--------|
| **Parent / student** | Search and filter programs, compare basics, open rich profiles, contact or reach out via shown channels. |
| **Academy owner** | Get listed, upgrade visibility, optionally manage profile and see basic analytics (future). |
| **Platform admin** | Review listing applications, create/update/deactivate institutions, moderate content, read contact submissions, configure featured listings. |

---

## 3. Public site — functional requirements

### 3.1 Home and institution listing

- **FR-LIST-1:** Display a hero area with promotional carousel content.
- **FR-LIST-2:** Provide search and filters aligned with domain data: text search, area/location, and sport type (and category where applicable).
- **FR-LIST-3:** Show institutions as cards with key fields (name, type/category, location, rating, imagery, tagline, starting price).
- **FR-LIST-4:** Support browsing at least the following categories: music, art, tuition, sports.
- **FR-LIST-5:** Listing data may be loaded from static assets or from an API; when using the API, support **server-side filters** (e.g. category, city, area, text query `q`, minimum rating) and **pagination** with page size limits appropriate for the UI.

### 3.2 Institution detail

- **FR-DETAIL-1:** Each institution has a routable detail page (`/institution/:id`).
- **FR-DETAIL-2:** Detail view exposes overview copy, programs, instructors, facilities, schedules, policies, gallery, and contact-style fields (phone, email, address, website) as available in the data model.
- **FR-DETAIL-3:** Handle missing institutions with a clear not-found or error state.

### 3.3 Packages (monetization positioning)

- **FR-PKG-1:** Present at least two tiers (e.g. Basic vs Pro) with INR pricing.
- **FR-PKG-2:** Allow switching billing period (e.g. monthly, multi-month, yearly) for display pricing.
- **FR-PKG-3:** Communicate planned owner benefits (visibility, search, contact/WhatsApp, analytics dashboard, verified badge, marketing touches)—**checkout and entitlement enforcement are out of scope** until billing is integrated.

### 3.4 Blog

- **FR-BLOG-1:** Provide a blog route with content suitable for SEO and trust-building.
- **FR-BLOG-2:** Long-term: support CMS or API-driven posts (`GET /api/posts` or headless CMS); initial implementation may be static placeholder content.

### 3.5 Contact

- **FR-CONTACT-1:** Public form: name, email, message with validation and user feedback on success/failure.
- **FR-CONTACT-2:** Submissions may be sent via a third-party form endpoint or **first-party API** that persists messages and optionally triggers email notifications.

### 3.6 “List your academy” (lead capture)

- **FR-LEAD-1:** Prominent CTAs (e.g. header/footer) for academy owners to apply for listing.
- **FR-LEAD-2:** Capture structured application data: academy name, contact name, email, phone, city, category, optional message and website.
- **FR-LEAD-3:** First-party flow should post to a dedicated API and return confirmation; external forms (e.g. Google Forms) are acceptable during transition.

### 3.7 Global chrome

- **FR-NAV-1:** Persistent header with primary navigation and mobile-friendly menu behavior.
- **FR-NAV-2:** Footer with quick links and social placeholders as appropriate.
- **FR-A11Y-1:** Reasonable keyboard and responsive layout targets (specific WCAG level can be set in a future accessibility requirements pass).

---

## 4. Admin dashboard — functional requirements

The admin experience is **required for operations** but may ship incrementally. It should be **authenticated** and **role-restricted** (admin-only).

### 4.1 Authentication and access

- **FR-ADM-AUTH-1:** Secure login for staff (session, JWT, or identity provider—TBD).
- **FR-ADM-AUTH-2:** No public access to mutate institutions or read PII from applications/messages without auth.

### 4.2 Institution management

- **FR-ADM-INST-1:** List institutions with filters (active, featured, city, category) and search.
- **FR-ADM-INST-2:** Create and edit institution records, including fields needed for card and detail views (including JSON or structured fields for programs, facilities, gallery, etc., aligned with the product schema).
- **FR-ADM-INST-3:** Toggle **active** and **featured** status to control visibility and merchandising.
- **FR-ADM-INST-4:** Soft-delete or deactivate listings without losing history where required.

### 4.3 Listing application pipeline

- **FR-ADM-APP-1:** Queue of applications with status (e.g. pending, approved, rejected).
- **FR-ADM-APP-2:** View full application payload and timestamps.
- **FR-ADM-APP-3:** On approve: create or link an `Institution` record and optionally notify the applicant (email).
- **FR-ADM-APP-4:** On reject: record reason and notify optionally.

### 4.4 Contact / inquiries

- **FR-ADM-MSG-1:** List contact messages with pagination.
- **FR-ADM-MSG-2:** View message detail; mark as read or handled (optional).

### 4.5 Analytics and reporting (phase 2)

- **FR-ADM-AN-1:** Aggregate counts: applications by status, messages over time, institution impressions/clicks if event tracking exists.
- **FR-ADM-AN-2:** Per-institution metrics for paying customers (aligns with Packages copy: “basic analytics dashboard”).

---

## 5. Backend and API (aligned requirements)

### 5.1 Public read APIs

- **GET** institutions list with query filters and paginated response (items, total, page, page size, has-next).
- **GET** single institution by id for detail view.

### 5.2 Public write APIs (rate-limited in production)

- **POST** contact message — persist and optional async email notification.
- **POST** listing application — persist with confirmation response.

### 5.3 Admin APIs (future)

- Authenticated CRUD for institutions and workflow endpoints for applications and contact triage.

### 5.4 Cross-cutting

- **CORS** restricted to known frontend origins.
- **Health** endpoint for load balancers and monitoring.
- **Input validation** on all write endpoints; **rate limiting** on public POST endpoints in production.

---

## 6. Non-functional requirements

| Area | Requirement |
|------|-------------|
| **Performance** | List and detail endpoints should meet typical SPA expectations; paginate large lists. |
| **Security** | HTTPS; secrets not in client code; validate and sanitize inputs; protect admin routes. |
| **Privacy** | Treat emails and phone numbers as PII; limit retention and access per policy. |
| **Reliability** | Health checks; idempotent or safe retries for form posts where applicable. |
| **Observability** | Structured logging for API errors; optional metrics for traffic and errors. |

---

## 7. Implementation status (snapshot)

This section summarizes **current direction** in the repo; it should be updated as features ship.

| Area | Status |
|------|--------|
| Public SPA (home, detail, blog, contact, packages) | Implemented in `fe/` |
| Institution list/detail data | Frontend may use static JSON; backend exposes filtered list + detail |
| Contact form | Frontend may use Formspree; backend supports `POST /api/contact` |
| List your academy | External Google Form linked; backend supports `POST /api/listing-applications` |
| Admin dashboard UI | **Not present in SPA routes** — requirements above define target scope |
| Payments / subscriptions | **Not implemented** — Packages page is display-only |
| Blog CMS | Static placeholder; API/CMS optional later |

---

## 9. Open decisions

- Admin UI: separate SPA vs. embedded admin vs. off-the-shelf admin on FastAPI.
- Auth mechanism for admins and (later) academy owners.
- Email provider and templates for notifications.
- Image storage (CDN, presigned uploads) for institution media.

---

*End of document.*
