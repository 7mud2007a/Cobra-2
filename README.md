# COBRA MOTORS — static luxury automotive website

React + Vite + TypeScript. **100% static**: no backend, no database, no API routes, no server runtime,
no external AI. The production build is plain HTML/CSS/JS in `dist/`.

```bash
npm install
npm run dev        # local development
npm run build      # type-check + static build → dist/
npm run preview    # serve dist/ locally
```

**Deploy:** any static host. Build command `npm install && npm run build`, publish directory `dist`
(on Render choose *Static Site*, not *Web Service*). Routing uses hash URLs (`#/vehicle/<id>`), so no
rewrite rules or server configuration are needed.

## Edit things without touching the UI

| What | Where |
| --- | --- |
| Vehicles (add / remove / price / status) | `src/data/vehicles.ts` — status is `available`, `reserved` or `sold` |
| Vehicle photos | `public/images/cars/<id>/1.jpg, 2.jpg, 3.jpg` (list the paths in `images`) |
| Hero photo | `public/images/hero.jpg` (landscape) and `hero-portrait.jpg` (phones) |
| Phone, WhatsApp, e-mail, address, hours | `src/config/site.ts` → `contact` (empty = not shown, never invented) |
| Social links | `src/config/site.ts` → `social` (placeholders point to each platform's home page) |
| About statistics | `src/config/site.ts` → `stats` ("vehicles available" is computed from the inventory) |
| Currency symbol | `src/config/site.ts` → `currency` |
| All wording, Arabic + English | `src/i18n/ar.ts`, `src/i18n/en.ts` |

> The car images currently in `public/images` are **temporary generated placeholders**, not photographs.
> Prices, specifications, statistics and company copy are demonstration values.

## COBRA Assistant (demonstration)

Runs fully in the browser and answers only from `src/data/vehicles.ts`.

- `src/components/assistant/` — chat UI (knows nothing about how answers are made)
- `src/services/assistantService.ts` — local rule-based responder behind the `AssistantProvider` interface
- `src/data/assistantConfig.ts` — name, welcome text, suggested questions, aliases, bilingual wording

To add a real AI later, implement `AssistantProvider.reply()` and change the single `assistantProvider`
export at the bottom of `assistantService.ts`. The chat interface does not change.

## Fonts

`src/assets/fonts/Tajawal-Regular.ttf` (Arabic + Latin) and `Alamani-Regular.ttf` (Arabic display; contains no
Latin letters, so it is restricted to Arabic via `unicode-range`). Both are Regular/400 only, so hierarchy
comes from size, spacing and colour; faux-bold is disabled. See `src/styles/fonts.css`.

## Logo

`public/logo/cobra-logo-original.jpg` is the supplied file, untouched. Its background is a soft vignette
(≈ `#EDF1F2` at the edges, ≈ `#FCFCFC` at the centre). `public/logo/cobra-logo.png` is the *same artwork* with
only that background removed, so it blends into white with no visible rectangle.

## Structure

```
src/
  components/  reusable UI (NavBar, VehicleCard, Gallery, InquiryForm, assistant/…)
  sections/    Hero, Vehicles, About, Contact, Social, Assistant, Footer
  pages/       HomePage, VehiclePage
  data/        vehicles.ts, assistantConfig.ts
  config/      site.ts
  services/    assistantService.ts
  i18n/        ar.ts, en.ts, provider
  lib/ hooks/ styles/
```
