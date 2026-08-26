# Contentful setup

How to take this site from seed content to live CMS content, once.

Until Contentful is configured the site runs on the seed content in
`src/lib/contentful/seed/` — the copy transcribed from the design canvas. That is
deliberate, and it means every step below can be done at your own pace without
the site going down. The switch happens when two environment variables appear;
nothing else in the code changes.

**The one thing that must not be skipped is step 5.** Everything else can be
corrected later.

---

## 1 · Create the space

1. In Contentful, create a space (the free Community tier is enough for this).
2. **Settings → General settings** — copy the **Space ID**.

## 2 · Get the three tokens

Contentful has three different tokens and they are not interchangeable.

| Token                  | Where                                                                               | Used for                                            |
| ---------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Content Delivery**   | Settings → API keys → _Add API key_                                                 | Published content. The site reads with this.        |
| **Content Preview**    | Same screen as the delivery key                                                     | Draft content, for the preview route only.          |
| **Content Management** | Settings → API keys → **Content management tokens** tab → _Generate personal token_ | Creating the content model in step 3. Nothing else. |

The management token can create and destroy content types. It is only needed for
step 3 — do not put it in `.env.local` and never give it to the deployed site.

## 3 · Create the content model

Set the two values once, so there is nothing to paste into the middle of a long
command:

```bash
export CONTENTFUL_SPACE_ID=your-space-id
export CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-your-token
```

Then:

```bash
npm run contentful:migrate
```

That checks the credentials, warns if the space already has content types, runs
both migrations, and — if anything fails — pulls the error out of the log rather
than leaving it to scroll past.

**If it complains about the token:** a management token always starts with
`CFPAT-`. If yours doesn't, you've picked up the Content Delivery token, which
sits on the same screen and can read content but cannot create content types.
Get the right one at **Settings → API keys → Content management tokens**.

**If it can't find the space:** the space **ID** is not its name. It's in the
browser URL while you're in the space:
`app.contentful.com/spaces/`**`this-part`**`/...`. Run `npm run contentful:check`
to list every space your token can actually reach.

**If a previous attempt got part-way**, the script says which content types
already exist. Delete them in Content model → each type → Delete, then run it
again.

### What it creates

Six content types — `plant`, `project`, `blogPost`, `testimonial`, `service`,
`siteSettings` — with validation in place, then a second pass that adds the
plain-language help text under every field.

The model is code rather than clicks because the field IDs have to match the
GraphQL queries exactly, and a typo made in the UI surfaces much later as a blank
area on a page rather than as an error.

## 4 · Point the app at the space

Create `.env.local` (copy `.env.example`) and fill in:

```bash
CONTENTFUL_SPACE_ID=<space id from step 1>
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_DELIVERY_TOKEN=<delivery token from step 2>
CONTENTFUL_PREVIEW_TOKEN=<preview token from step 2>
CONTENTFUL_REVALIDATE_SECRET=<invent one: openssl rand -hex 32>
CONTENTFUL_PREVIEW_SECRET=<invent another>
```

`.env.local` is gitignored. The two secrets are yours to invent — they are shared
passwords between Contentful and the site, not values Contentful gives you.

The moment `CONTENTFUL_SPACE_ID` and `CONTENTFUL_DELIVERY_TOKEN` are both set,
the app stops using seed content and reads from the space. **Empty content types
now render as empty sections**, so expect a sparse site until step 6.

## 5 · Regenerate the types from the real schema

**Do not skip this.**

```bash
CONTENTFUL_SCHEMA_FROM_API=1 npm run codegen
npm run typecheck
```

Every type in the app is generated from `src/lib/contentful/schema.graphql`, a
snapshot written before the space existed. It has never been checked against the
real API. This command replaces the guess with the truth.

If `git diff` shows changes to `src/lib/contentful/generated/graphql.ts`, or
`typecheck` fails, that is the snapshot having been wrong — which is exactly what
generating types instead of hand-writing them is for. Fix the fallout now, while
it is a handful of nullability errors, rather than after content is authored.
This is decision **D10** in `docs/DECISIONS.md`.

## 6 · Add content

Order matters a little: `siteSettings` and `service` first, since the home page
and navigation depend on them.

### siteSettings — exactly one entry

The only singleton. Create one entry, publish it, and never create a second.

| Field            | Notes                                                             |
| ---------------- | ----------------------------------------------------------------- |
| Internal name    | Anything, e.g. "Site settings"                                    |
| Hero — desktop   | **16:9**. Landscape crop with Edyta and the flower bed in frame.  |
| Hero — mobile    | **4:5**. A separate portrait crop, not the same file letterboxed. |
| Portrait — Edyta | **4:5**. Masked to an organic shape on the page.                  |

Each image field has an **alt text** field beside it that is required — an image
cannot be published without a description. Write what is in the photograph, not
"hero image".

### service — exactly six entries

The slugs are load-bearing. `/services/{slug}` is a real page per service, and
the sitemap test asserts these exact six:

| Name                        | slug                | iconKey       |
| --------------------------- | ------------------- | ------------- |
| Consulting                  | `consulting`        | `consulting`  |
| Planters for Every Season   | `seasonal-planters` | `planters`    |
| Soil Testing                | `soil-testing`      | `soil`        |
| House Plants                | `house-plants`      | `houseplants` |
| Yard, Patio & Garden Design | `garden-design`     | `design`      |
| Yard Maintenance            | `yard-maintenance`  | `maintenance` |

`iconKey` is a dropdown of exactly those six values — it chooses which glyph
draws in the bubble. `order` controls the left-to-right sequence on the home page
(use 10, 20, 30… so you can insert later without renumbering).

The seed content in `src/lib/contentful/seed/index.ts` has finished copy for all
six — intro, body, CTA — worth copying across rather than rewriting.

### plant

| Field           | Notes                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Light           | Dropdown: **Full sun · Part shade · Shade**                           |
| Water / soil    | Dropdown: **Very low water · Low water · Average water · Moist soil** |
| Michigan native | Drives the "Michigan native" filter chip                              |
| Featured        | Shows it in the band on the home page                                 |
| Photo           | **1:1**                                                               |

Those dropdown values are what the filters on `/favorite-plants` match against.
"Shade" catches both _Shade_ and _Part shade_; "Low water" catches _Low water_
and _Very low water_. Free-typing a value would silently drop the plant out of
its filter, which is why they are dropdowns.

The plant card is built to survive a two-line common name alongside a Latin name
as long as _Rudbeckia fulgida var. sullivantii 'Goldsturm'_ — no need to
abbreviate.

### project

| Field            | Notes                                                                       |
| ---------------- | --------------------------------------------------------------------------- |
| Before (3:2)     | **Optional.** Without it the after image fills the card at the same height. |
| After (3:2)      | Required                                                                    |
| Lead image (3:2) | Optional. The hero shot on the detail page; falls back to the after image.  |
| Caption          | One to three lines. The card grows; it will not truncate.                   |
| Slug             | Lowercase, hyphens. Becomes `/projects-blog/<slug>`.                        |

### blogPost

Body is rich text. Headings, lists, quotes and embedded images all render with
the site's own typography — 19px at 1.75 over a 68-character measure. Read time
is a number you set; it is not calculated.

### testimonial

`quote`, `attribution` ("Margaret K."), `town` ("Royal Oak"), `order`.

**Before publishing these, see decision D4.** The site renders testimonials but
deliberately emits no `Review` or `AggregateRating` structured data, because
review markup that cannot be substantiated is a site-wide manual-action risk with
Google. Once the quotes are confirmed real, attributable and permissioned, flip
`emitReviewSchema` in `src/config/site.ts`.

## 7 · Wire up instant publishing

Without this, publishing in Contentful changes nothing on the live site until the
next deploy — pages are cached with no time-based expiry, by design.

**Settings → Webhooks → Add webhook**

- **URL** — `POST` to `https://<your-domain>/api/revalidate`
- **Triggers** — Publish and Unpublish, for Entry and Asset
- **Headers** — add a custom header:
  - Name `x-revalidate-secret`
  - Value: the same `CONTENTFUL_REVALIDATE_SECRET` from step 4

The site refuses any request without that header, so a wrong or missing value
shows up as `401` in Contentful's webhook activity log.

The endpoint reads the entry's id from the payload and refreshes exactly the
pages that render it, plus the listings it appears in. Publishing should be
visible within seconds.

## 8 · Wire up preview

**Settings → Content preview → Add content preview**, one URL per content type:

| Content type      | Preview URL                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| project, blogPost | `https://<domain>/api/preview?secret=<CONTENTFUL_PREVIEW_SECRET>&path=/projects-blog/{entry.fields.slug}` |
| service           | `https://<domain>/api/preview?secret=<CONTENTFUL_PREVIEW_SECRET>&path=/services/{entry.fields.slug}`      |

An "Open preview" button then appears on the entry, and it shows unpublished
drafts by reading through the Preview API instead of the cache.

## 9 · Deploy

Add the same five variables from step 4 to the Vercel project (Settings →
Environment Variables), for Production and Preview. Redeploy.

Note that `CONTENTFUL_ENVIRONMENT` should stay `master` unless you deliberately
create a separate Contentful environment for staging.

---

## Afterwards — worth checking

```bash
npm run verify      # types, lint, 229 unit tests
npm run test:e2e    # 174 browser tests across 360–3840px
```

Then, on the live site:

- The home page hero shows the real photograph at both a phone and a desktop width
- `/services` lists six services and each links to a real page
- Publishing an edit in Contentful appears within seconds
- `/sitemap.xml` lists every entry you created

## Still open before launch

Two decisions in `docs/DECISIONS.md` block launch and are unrelated to
Contentful — both are single-line changes in `src/config/site.ts`:

- **D1** — the brand name. The design uses three: "Plant Station" in the header,
  "Edyta Phillips" in the footer, "Edyta Phillips Gardening" in the copyright.
  Changing it after the site is indexed forfeits accumulated search authority.
- **D2** — the phone number and email are still `555-01xx` placeholders from the
  mock. Inconsistent contact details are an active local-search negative.
