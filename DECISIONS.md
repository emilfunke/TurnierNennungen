# DECISIONS.md

Small, reversible decisions made while building Startplatz-Börse. Larger product
questions are still asked before implementation.

## Milestone M1 + M2 (setup, data model, seed, "Biete")

### Accounts and identity
- **No auth in v1.** There is no `User` table. Contact details are stored
  directly on each `Offer`/`Request` (`contactName`, `contactMethod`, `contact*`).
  When accounts arrive, these move to a `User` relation. _Reversible._
- **Contact is revealed to everyone**, including anonymous visitors. Implemented
  behind `ContactService` (`src/lib/contact/contact-service.ts`). `getContactService()`
  currently returns `RevealToEveryoneContactService`; `AuthGatedContactService`
  already exists for a one-line swap later.

### Admin and moderation
- **No admin UI in v1.** Disciplines, classes, cities and venues are edited via
  the seed script or directly in the database. An admin panel waits for auth.
- **Report button deferred to v2.**
- Contact publishing requires an explicit consent checkbox on the offer form.

### Location
- Hierarchy is **Region > Canton > City > Venue**.
- Cantons and regions are seeded (26 / 7). Cities and venues are
  **find-or-created from free text** (`src/lib/location.ts`) because there is no
  curation UI yet. Filtering can target any level; region matches all its cantons.

### Events
- An `Offer` always references an `Event`. Choosing an existing event links to it;
  entering one manually creates an event with `source = USER`.
- Event import from the official calendar is not implemented; `Event.source`
  (`ADMIN | USER | IMPORT`) and `externalId` are the extension point.

### Money, dates and formatting
- Amounts are stored as **integer cents** in CHF. Input accepts `80`, `80.50`, `80,50`.
- Date-only values are anchored at **12:00 UTC** so the calendar date is stable
  regardless of server/client time zone. Display uses **Europe/Zurich**, `dd.mm.yyyy`.
- Asking above the original fee only **warns**, gated by `WARN_PRICE_ABOVE_ORIGINAL`
  (soft nudge, never a hard rule).

### Taxonomy granularity
- Difficulty classes are **graded** wherever the real exam is graded: Springen and
  Cross by jump height (`B80`), Dressur by test number (`A3`), Reining by division,
  Distanzreiten by distance/CEI star, Vielseitigkeit by level plus international
  stars. Fahren and Voltige keep the E–S level scale, which is their full
  granularity.
- The grade lives in the class **name**; there is **no separate height field**. The
  height is inferred from the selected class, which is simpler for users.
- All of this is plain data in `prisma/seed.ts`; edit the lists there and re-run
  `npm run db:seed`. No form code changes are needed.

### Filtering
- `matchesOfferFilter` (`src/lib/offers/filter.ts`) is a pure, DB-free predicate with
  unit tests. The list/calendar UI and DB query wiring land in M3.

### Expiry
- `Offer.expiresAt` is set to the event date. Automatically flipping expired offers
  to `EXPIRED` is a scheduled/script task that is not wired up yet.

### Stack
- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind v4, Prisma 6, PostgreSQL
  (Docker Compose locally). Pages that read the database use
  `export const dynamic = "force-dynamic"`.
- **Prisma pinned to 6.19.3.** The npm `latest` tag for the `prisma` package
  currently points at `8.0.0-rc`, which conflicts with `@prisma/client@7.x`.
  Pinning 6.x keeps the stable `prisma-client-js` generator. The `package.json#prisma`
  seed config triggers a Prisma 7 deprecation warning that is safe to ignore for now.
- **i18n without a framework.** Typed message bundles in `src/i18n/` (German only,
  `fr`/`it` slots prepared) instead of `next-intl`, to keep the app simple and
  avoid locale routing. All UI strings live in `src/i18n/de.ts`.
- **Light theme only** for now; the scaffold's dark-mode override was removed.
- `@rolldown/binding-darwin-arm64` is pinned in devDependencies to work around the
  npm optional-dependency bug that breaks Vitest on Apple Silicon.

### Tests
- Vitest covers the pure filter predicate, offer form validation and formatting.

## Known follow-ups
- M3: list + calendar view with filters and the contact flow.
- M4: wanted requests and matching.
- M5: i18n polish, README, deployment; admin/moderation once auth exists.
