# Handoff: Plant Station — Marketing Website

## Overview
Marketing website for **Edyta Phillips**, an independent garden designer and plant consultant in Metro Detroit, Michigan (brand/wordmark: **Plant Station**, domain plant-station.com). Solo-practitioner brand: personal, warm, trustworthy. Primary audience is 45–75 years old on phones and laptops, often outdoors in bright light — the design prioritizes large readable type, obvious buttons, and generous tap targets over trendy aesthetics. All content (plants, projects, blog posts, testimonials, images) is CMS-driven via **Contentful**.

## About the Design Files
The file in this bundle (`Edyta Phillips Site.dc.html`) is a **design reference created in HTML** — a canvas of artboards showing intended look and behavior, not production code to copy. Your task is to **recreate these designs in a real web stack** (e.g. Next.js/Astro + Contentful, or whatever the project chooses) using proper semantic HTML, responsive CSS, and the CMS content model below. The design file renders artboards at fixed widths; the real site must be fluidly responsive between the three reference breakpoints.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and states are final. Recreate pixel-faithfully, but implement real responsive behavior (the artboards are fixed-width snapshots of 390 / 1440 / 1920).

## Artboard Map (inside the design file)
Newest rows first on the canvas:
- **4a/4b** — Project / Blog detail page template (1440 project variant / 390 blog variant)
- **3a** — SEO & accessibility spec (read it; it is part of the requirements)
- **2a/2c** — Projects & Blog page (1440 / 390)
- **2b/2d** — Favorite Plants page (1440 / 390)
- **1a/1b/1c** — Home page (390 / 1440 / 1920)
- **1d** — Burger menu open (desktop 420px right drawer + mobile full-screen)
- **1e** — Service bubble states (default / hover / active+focus)

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| olive-900 | `#3d431d` | Footer background |
| olive-700 (primary) | `#515927` | Headings, dark bands (Favorite Plants band, Contact band), icons, borders on buttons |
| sage-500 | `#828d51` | Card rings/borders, secondary borders |
| sage-300 | `#c5cc8a` | Subtle borders on light backgrounds |
| leaf-200 | `#dce2a4` / `#dfe4a8` | Image-placeholder tint |
| leaf-100 | `#eef0c8` | Tag chip background (sun/shade), section tint |
| cream-page | `#fcf5e1` | Page background |
| cream-alt | `#f8efd5` | Alternating section background |
| ivory-card | `#fffcf2` | Card background |
| pink-700 (accent-dark) | `#9d2c5b` | Links, testimonial names, labels, secondary accent (7.2:1 on white) |
| pink-600 (accent CTA) | `#b13268` | Primary buttons, active filter chips (6.0:1 with white) |
| pink-800 (CTA hover) | `#8f2854` | Hover/active state of filled pink buttons |
| pink-300 | `#dd8cab` | Chip borders |
| pink-100 | `#f7dde7` | Pink chip/tint background, pressed states |
| pink-on-dark | `#ecc3d3` / `#f6d7e2` | Pink text/headings on olive bands |
| espresso | `#3b3125` | Body text (never pure black) |
| taupe | `#64543f` | Muted captions |
| taupe-dark | `#5a5138` | Small mono captions inside tinted tiles (5.9:1) |
| on-dark-body | `#dde2bc`→`#e3e8bd` | Body text on olive bands |
| on-dark-muted | `#c6cc8f`, `#aab377` | Small text on olive/footer |
| near-white | `#fdf9e8` / `#fdfaee` | Headings/wordmark on dark |

All pairs pass WCAG AA (≥4.5:1 body, ≥3:1 large text). If you introduce new combinations, verify contrast.

### Typography
- **Headings:** `Source Serif 4` (Google Fonts), weight 600. Scale: h1 hero 38px (mobile) / 62px (1440) / 68px (1920); section h2 30 / 42 / 46px; card titles 19–21px.
- **Body/UI:** `Public Sans`, 400/600. Body minimum **18px mobile / 19–20px desktop**, line-height 1.6–1.75, max line length ~68ch.
- Annotations/captions in the mock use `ui-monospace` — these are design notes, **do not ship them**.
- `font-display: swap`; preconnect to fonts.

### Spacing, radii, shadows
- Section vertical padding: 56px (mobile) / 96px (1440) / 104px (1920). Content column caps at 1140px (1440) / **1280px (1920)** with backgrounds bleeding full width.
- Radii: cards/images 16px (inner images 10–12px), buttons/chips fully rounded (999px), service bubbles 50%.
- Card shadow: `0 4px 14px rgba(70,55,30,.08)`; hover lift shadow: `0 16px 30px rgba(70,72,32,.18)`.
- Breakpoints: 390 (design min), ~768 (tablet: bubbles 2×3), 1440, 1920.

## Screens / Views

### Home
Sections in order:
1. **Sticky top bar** — leaf mark + "Plant Station" wordmark (serif) left; phone link (desktop only), pink "Get in Touch" pill, and a "Menu" button (burger icon + the word Menu, ≥48px tall) right. Burger is used at ALL breakpoints.
2. **Hero** — full-bleed photo (`uploads/20230820_184915.jpeg` is the real asset; Contentful slot "Hero — Edyta in garden", 16:9 desktop / separate 4:5 mobile crop, background-position ~center 47–58% so Edyta + plants are in frame). Left-side dark-olive scrim gradient. h1 "Gardens that grow with you." / sub "Michigan garden design, planting, and plant care, tailored to how you actually live." / buttons: primary pink "Book a Consultation", outlined "See My Services" / trust line "Serving Metro Detroit • 10+ years • Free 15-minute intro call".
3. **Meet Edyta** — organic blob-masked 4:5 portrait + 3 short first-person paragraphs; three pink credential chips (10+ years, 120+ gardens, Michigan-native plant specialist). No "full story" page exists — do not add a link.
4. **How I can help (services)** — heading + intro + phone/email line. **Desktop:** six 250–270px circles, staggered vertical offsets (0/40/12/28/0/36px), sage ring 2px; hover: lift −6px, 3px pink ring, "Learn more →" appears. **Mobile:** compact pill rows (56px round icon badge + name + one-liner) — NOT circles. Services: Consulting; Planters for Every Season; Soil Testing; House Plants; Yard, Patio & Garden Design; Yard Maintenance (copy in design file).
5. **Favorite Plants band** — dark olive `#515927` band, light-pink heading "A few I keep coming back to", auto-fit grid of plant cards on desktop, compact 2-col grid on mobile (see component), link "See all my favorites →" to /favorite-plants.
6. **Recent projects** — 3 equal-height cards in one aligned row; each has Before/After 3:2 tile pair; **before image is optional** — after-only renders one full-width tile cropped to the same media height. Link to /projects-blog.
7. **Kind words (testimonials)** — swipeable slider: 5 quote cards, arrow buttons (52px circles, pink) + range counter ("1–3 of 5" desktop, "1 of 5" mobile); mobile shows 1 card, desktop 3; step 1 card; no autoplay; clamp at ends. Primary CTAs across the site darken to `#8f2854` on hover.
8. **Contact CTA** — full-width olive band, light-pink heading "Let's talk about your garden.", reassurance line, form (Name, Email, Phone, "Tell me about your space" textarea; labels above inputs; inputs ≥52–54px; pink submit "Send My Request") + direct phone/email in large type and service-area note.
9. **Footer** — `#3d431d`, 3 columns → 1 on mobile: wordmark+tagline, five nav links, contact + social circles (44px), copyright.

### Burger menu (all breakpoints)
Desktop: 420px right drawer over dimmed page; mobile: full screen. Cream background, huge leaf watermark (6% opacity), large serif links stacked: Story, Services, Favorite Plants, **Contact (pink)**, Projects & Blog; phone + email pinned at bottom above a divider; ✕ Close button ≥48px.

### Projects & Blog (/projects-blog)
Cream-tint page header with h1, intro, filter chips **All / Projects / Blog** (active = pink fill). One shared 3-col grid (1 col mobile) of equal-height cards, newest first: project cards (before/after tiles, pink "PROJECT" eyebrow, title, caption+location, "See this project →") and blog cards (3:2 thumbnail, olive "BLOG · date" eyebrow, title, excerpt, "Read →"). "Load more" outlined button. Slim footer.

### Favorite Plants (/favorite-plants)
Dark-olive page header (light-pink h1) with filter chips: All / Full sun / Shade / Low water / Michigan native. 4-col grid (2-col mobile) of plant cards. Below: consultation CTA card ("Not sure what fits your yard?" + pink Book a Consultation). Slim footer.

### Detail page (/projects-blog/[slug]) — artboards 4a (project, 1440) & 4b (blog post, 390)
One shared article template for both entry types: breadcrumb "← Back to Projects & Blog", pink uppercase eyebrow (Project · Location / Blog · date), serif h1, meta line, wide lead image with centered CMS caption, body column at 19px/1.75. **Column system:** title/body/CTA on one 860px column; lead image slightly wider at 1000px, shown as a 2:1 center crop of the 3:2 asset. Project variant adds a Before & After image pair with captions; blog variant adds byline + read time. Both end in a pink-tint CTA card (Book a Consultation / contextual CTA) and the slim footer.

## Components (repeatable, CMS-backed)
- **PlantCard** — 1:1 image, serif common name (must survive 2 lines), italic Latin name (can be very long, e.g. *Rudbeckia fulgida var. sullivantii 'Goldsturm'*), two tags: light/sun tag (green chip `#eef0c8`/`#515927`) and water/soil tag (pink chip `#f7dde7`/`#9d2c5b`). Equal-height via flex column, tags pinned bottom.
- **ProjectCard** — before/after 3:2 pair or after-only full-width crop; title; caption 1–3 lines; location. Equal heights.
- **BlogCard** — 3:2 thumbnail, date eyebrow, title, excerpt, Read link.
- **TestimonialCard** — large serif quote (22–23px), pink attribution "First L. · Town", ivory bg, pink-tint border.
- **ServiceBubble** — circle (desktop) / pill row (mobile); states per artboard 1e (default sage ring; hover lift + pink ring + Learn more; active pressed pink tint + focus outline).
- **FilterChip** — 48px pill; active = pink fill white text.
- **ImageSlot placeholders** — until real photos exist: sage-tint block, centered leaf glyph at 15% opacity, small caption naming slot + ratio.

Grids must look right with **2–6 entries** (auto-fit / flow layouts, nothing balanced only at 4).

## Interactions & Behavior
- Burger: slide-in drawer (desktop) / full-screen (mobile), focus-trapped, Esc closes, `aria-expanded` on trigger.
- Service bubbles: hover lift −6px + ring #b13268 + reveal "Learn more →"; whole bubble clickable.
- Testimonial slider: translateX by card+gap step, 350ms ease; buttons have aria-labels; disable/clamp at ends; **no autoplay, no drag required** (buttons suffice).
- Motion is subtle only: gentle fade/rise on scroll allowed; NO parallax, NO auto-sliders. All transitions disabled under `prefers-reduced-motion`.
- Focus: visible 3px `#b13268` outline, offset 2px, on all interactive elements.
- Phone/email are `tel:+12485550142` / `mailto:hello@edytaphillips.com` links everywhere (header, services intro, contact, footer, menu). **These are placeholder contact details — confirm real ones before launch.**

## State Management
- Menu open/closed; testimonial slider index per viewport; filter selection on the two listing pages (client-side filter of CMS entries); "Load more" pagination; form fields + validation (required name + one of email/phone; inline error text below fields, never color-only).
- Data: all lists fetched from Contentful (see model below), rendered statically where possible.

## CMS Content Model (Contentful)
- **plant**: commonName, latinName, photo (1:1), lightTag, waterTag, isNative, featured(bool)
- **project**: title, caption, location, beforeImage (3:2, optional), afterImage (3:2, required), date
- **blogPost**: title, excerpt, body, thumbnail (3:2), date
- **testimonial**: quote, attribution, town
- **siteSettings**: heroImageDesktop (16:9), heroImageMobile (4:5), portrait (4:5), phone, email, socialLinks
- Every image field also has **altText** and **caption** fields. Fixed ratios map to Contentful image transforms; serve WebP/AVIF with srcset 800/1200/1920.

## SEO (from artboard 3a — implement all)
Titles: "Garden Design & Plant Care in Metro Detroit | Plant Station" (home), "Favorite Plants for Michigan Yards | Plant Station", "Garden Projects & Blog | Plant Station". Meta descriptions ≤155 chars. URLs: /services (anchor), /favorite-plants, /projects-blog, /projects-blog/[slug]. LocalBusiness schema (areaServed Metro Detroit, phone) + Article schema on posts. Landmarks header/nav/main/footer; one h1 per page; no skipped heading levels; real buttons/links; labels bound with for/id; lazy-load below-fold images; fixed aspect-ratio boxes to prevent CLS.

## Assets
- `uploads/20230820_184915.jpeg` — real hero photo (Edyta in garden, golden hour). Crop focus: keep her face and the flower bed in frame (see artboard crops).
- Leaf mark: simple SVG path `M12 2C6 8 6 15 12 22C18 15 18 2 12 2Z` — used as logo mark, watermark, and placeholder glyph.
- All other imagery is placeholder — will come from Contentful.

## Getting Started (suggested build order for Claude Code)
1. **Stack**: Next.js (App Router) + Contentful SDK, or Astro if the site stays fully static. CSS: plain CSS modules or Tailwind — either way, define the design tokens above as CSS custom properties (`--olive-700: #515927;` etc.) in one file first.
2. Build the shared shell: layout (header with burger nav, footer), tokens, fonts, focus/reduced-motion global CSS.
3. Build components in isolation: PlantCard, ProjectCard, BlogCard, TestimonialCard/slider, ServiceBubble, FilterChip, ImageSlot placeholder.
4. Assemble Home, then Favorite Plants, then Projects & Blog + the detail template, wiring each list to Contentful (seed with the sample content from the design file).
5. Finish with the SEO layer (metadata, schema, sitemap) from the spec above.

**Acceptance checklist**
- [ ] Fluidly responsive 360–1920px; matches artboards at 390/1440/1920
- [ ] Burger menu at all breakpoints, focus-trapped, Esc closes
- [ ] All grids look right with 2 and 6 CMS entries
- [ ] Before-image-optional project card renders correctly
- [ ] AA contrast, 3px focus rings, prefers-reduced-motion respected
- [ ] tel:/mailto: links present in header, services, contact, footer
- [ ] Lighthouse: SEO + Accessibility ≥ 95, no CLS from images

**Known intentional omissions**: no "full story" page (link removed by design), no individual service pages yet (bubbles can link to /services#anchor), contact form backend TBD, phone/email/social are placeholders.

## Files
- `Edyta Phillips Site.dc.html` + `support.js` — the full design canvas (all artboards listed above). Open the HTML in a browser; pan/zoom canvas.
- `assets/hero-edyta-garden.jpeg` — real hero photo.
