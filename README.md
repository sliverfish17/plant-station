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

| Script                  | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Dev server (Turbopack)                                |
| `npm run build`         | Production build                                      |
| `npm run typecheck`     | `tsc --noEmit`                                        |
| `npm run lint`          | ESLint (`next lint` is gone in Next 16)               |
| `npm run format`        | Prettier write                                        |
| `npm run test`          | Vitest unit tests                                     |
| `npm run test:e2e`      | Build, then Playwright + axe                          |
| `npm run test:e2e:only` | Playwright against an existing build                  |
| `npm run lighthouse`    | Lighthouse CI budget (needs a build first)            |
| `npm run codegen`       | Regenerate Contentful types from `.graphql` documents |
| `npm run verify`        | typecheck + lint + unit tests                         |

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
2. **`"use client"` appears in exactly four files** — the menu drawer, the
   testimonial slider, the shared filtered listing (used by both listing pages)
   and the contact form. Hooks and leaf components like `FilterChip` carry no
   directive of their own — they join the client graph through their importer, so
   the four directives mark the four islands rather than every module inside
   them. `rg -l "^'use client'" src` is the check.
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

## Content

The content model lives in `contentful/migrations/001-initial-content-model.cjs`
— an executable migration, so the space can be recreated from scratch:

```bash
npx contentful-migration --space-id $CONTENTFUL_SPACE_ID \
  --environment-id $CONTENTFUL_ENVIRONMENT \
  contentful/migrations/001-initial-content-model.cjs
```

Reads go through `src/lib/contentful/read.ts`. Underneath it:

- `documents/*.graphql` are the queries; `npm run codegen` turns them into types
  and `TypedDocumentString`s, so there is no GraphQL client at runtime and no
  hand-written response interface anywhere.
- `queries.ts` is the cached layer — one `"use cache"` boundary per query, each
  tagging every entry `sys.id` it returned plus its collection tag, with
  `cacheLife('max')`. Nothing expires on a clock; a publish webhook is the only
  thing that invalidates.
- `POST /api/revalidate` takes the Contentful webhook, checks a shared secret in
  constant time, and revalidates the entry tag plus its collection tag.
- `/api/preview` enables draft mode; draft reads bypass the cache and hit the
  Preview API.

**Contentful is optional in development.** With no credentials, reads return the
seed content in `src/lib/contentful/seed/` — the copy from the design canvas,
typed against the _generated_ types, so components are built against the exact
shape the CDA returns. Adding credentials flips one discriminated union in
`src/lib/env.ts` and nothing else moves.

## Note on iCloud Drive

The project lives under `~/Documents`, which iCloud syncs. Build directories
churn thousands of files, and when iCloud cannot reconcile two versions it keeps
both — naming the second `app 2`, `chunks 3`, `page 2.tsx`. That has already
broken this repo twice: once filling `.next` until `rm -rf` hung on it, and once
leaving a duplicate route group under `src/app` that made the build fail with
"two parallel pages resolve to the same path" — an error that says nothing about
iCloud.

```bash
npm run icloud:shield   # tell the file provider to ignore build output (run once per clone)
npm run check:icloud    # fail if any conflict copy exists — also part of `npm run verify` and CI
```

`.gitignore` also refuses the `* 2` pattern, so a conflict copy can never be
committed.

## Note on the lockfile

`package-lock.json` must contain the optional platform variants for Linux as well
as macOS, or `npm ci` fails on CI while succeeding locally. If you add a
dependency on a Mac, regenerate the lockfile for Linux before pushing:

```bash
npm run relock   # regenerates the lockfile under linux/amd64, then commit it
```

The symptom is `npm ci` failing on the runner with `Missing: @emnapi/runtime from
lock file` while working fine locally. npm records optional dependencies for the
platform it runs on, so a macOS `npm install` silently prunes the Linux-only
ones.

## What is verified, and where

The requirements that are easy to claim and hard to keep are pinned by tests
rather than by review:

| Requirement                                                                | Where it is checked                                                                                                          |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Fluid scale hits the artboard values at 390 / 1440 / 1920                  | `src/styles/fluid-scale.test.ts` evaluates the real `clamp()` expressions; `e2e/fidelity.spec.ts` measures the rendered page |
| Tap targets ≥ 48px                                                         | `e2e/fidelity.spec.ts`, at all four widths                                                                                   |
| Drawer: Escape, focus trap, focus restored                                 | `use-disclosure.test.ts` for the logic, `e2e/interaction.spec.ts` against a real browser                                     |
| Slider clamps, no autoplay, no drag needed                                 | `use-carousel.test.ts`, `e2e/interaction.spec.ts`                                                                            |
| Before-image-absent project card                                           | `feed-card.test.tsx`                                                                                                         |
| Grids at 2 and 6 entries, equal heights                                    | `plant-card.test.tsx`, `e2e/acceptance.spec.ts`                                                                              |
| `tel:` / `mailto:` in all five places                                      | `e2e/acceptance.spec.ts`                                                                                                     |
| 3px focus ring at 2px offset                                               | `e2e/acceptance.spec.ts`                                                                                                     |
| `prefers-reduced-motion`                                                   | `e2e/interaction.spec.ts` (asserts the emulation applied first)                                                              |
| Contact form works with JavaScript disabled                                | `e2e/contact.spec.ts`, in a project with JS off                                                                              |
| Webhook 401s without the shared secret                                     | `src/app/api/revalidate/route.test.ts`                                                                                       |
| Titles, descriptions ≤ 155, canonicals, JSON-LD, sitemap, robots, OG cards | `e2e/seo.spec.ts`, against the rendered HTML                                                                                 |
| Lighthouse SEO / Accessibility ≥ 95, CLS ≈ 0                               | `lighthouserc.json`, six routes, in CI                                                                                       |

Latest run: accessibility **100**, SEO **100**, CLS **0.000** on every route;
performance 93–100.

## Parked decisions

Several business decisions are genuinely open. They are **not** guessed and
**not** blocking: each has a stated default, and `src/config/site.ts` holds every
unresolved value so resolving one is a one-file change.

- **`docs/DECISIONS.md`** — the register: question, default in force, what it
  touches, what changes on resolution.
- **`rg "TODO\(D"`** — every line in the codebase that an open decision touches.

Two are marked **BLOCKING LAUNCH**: D1 (brand name and domain) and D2 (real
phone and email — the current values are `555-01xx` placeholders from the mock).
