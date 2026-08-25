# Plant Station — marketing site for Edyta Phillips

Production rebuild of the design canvas in `design/`, for an independent garden
designer and plant consultant in Metro Detroit, Michigan.

The audience is 45–75, mostly on phones and laptops, often reading outdoors in
bright light. **Readability, obvious controls and accessibility outrank visual
trendiness in every trade-off.** All content is CMS-driven via Contentful, and
organic search is a primary acquisition channel — SEO is a first-class
requirement, not a final polish pass.

## Stack

|           |                                                                                |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Next.js 16.3 App Router, `cacheComponents`, Turbopack                          |
| Runtime   | React 19.2, Node 22 (see D9)                                                   |
| Language  | TypeScript strict — zero `any`, zero non-null assertions, zero silencing casts |
| Styling   | Tailwind CSS v4, CSS-first `@theme`; no palette in a config file               |
| CMS       | Contentful GraphQL Content Delivery API + graphql-codegen                      |
| Forms     | Server Actions + Zod v4, delivery via Resend                                   |
| Tests     | Vitest + Testing Library (unit), Playwright + axe-core (e2e/a11y)              |
| Deploy    | Vercel                                                                         |

## Getting started

```bash
nvm use              # Node 22
npm install
cp .env.example .env.local   # fill in Contentful + Resend credentials
npm run dev
```

## Scripts

| Script              | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                                |
| `npm run build`     | Production build                                      |
| `npm run typecheck` | `tsc --noEmit`                                        |
| `npm run lint`      | ESLint (`next lint` is gone in Next 16)               |
| `npm run format`    | Prettier write                                        |
| `npm run test`      | Vitest unit tests                                     |
| `npm run test:e2e`  | Playwright + axe                                      |
| `npm run codegen`   | Regenerate Contentful types from `.graphql` documents |
| `npm run verify`    | typecheck + lint + unit tests                         |

## Architecture

Feature-first, not type-first. Each feature co-locates its component, headless
hook, types and tests.

```
src/
  app/(site)/…                    routes
  app/api/revalidate/route.ts     Contentful webhook → revalidateTag
  app/sitemap.ts  app/robots.ts   generated from CMS entries
  features/{navigation,services,plants,feed,testimonials,contact}/
  components/ui/                  Button, Chip, Section, ImageSlot, CmsImage
  lib/contentful/  lib/seo/  lib/image-loader.ts
  config/site.ts                  every unresolved business value
  styles/theme.css                design tokens
```

Rules that hold throughout:

1. **State is separate from markup.** Every interactive island is a
   presentational component plus a headless hook (`useDisclosure`,
   `useCarousel`, `useFeedFilter`) that knows nothing about DOM structure and is
   unit-tested without rendering.
2. **`"use client"` appears in exactly four components** — the menu drawer, the
   testimonial slider, the shared filter grid (used by both listing pages) and
   the contact form. A fifth needs justifying.
3. **Composition over prop explosions.** `Section` owns the
   full-bleed-background / capped-content-column pattern once; cards expose
   slots via `children`.
4. **No hardcoded design values in components.** Colors, spacing, radii and
   shadows come from tokens only.
5. Comments explain _why_, never _what_.

## Design tokens

`src/styles/theme.css` is the transcription of the handoff's token table into a
Tailwind v4 `@theme` block, so every token exists as both a CSS custom property
and a utility class.

The type and spacing scale is **fluid**, not stepped. The artboards are
snapshots at 390 / 1440 / 1920, and the ramp between them is not a straight line
— type grows faster from 390→1440 than from 1440→1920. Each step is therefore a
`clamp()` over two linear segments composed with `min()` or `max()`, continuous
across 360–1920 and exact at every artboard anchor.
`src/styles/fluid-scale.test.ts` evaluates the real CSS expressions and asserts
those anchors, so a mistyped coefficient fails CI rather than shipping.

## Parked decisions

Several business decisions are genuinely open. They are **not** guessed and
**not** blocking: each has a stated default, and `src/config/site.ts` holds every
unresolved value so resolving one is a one-file change.

- **`docs/DECISIONS.md`** — the register: question, default in force, what it
  touches, what changes on resolution.
- **`rg "TODO\(D"`** — every line in the codebase that an open decision touches.

Two are marked **BLOCKING LAUNCH**: D1 (brand name and domain) and D2 (real
phone and email — the current values are `555-01xx` placeholders from the mock).
