import type {
  AssetFieldsFragment,
  BlogPostBySlugQuery,
  BlogPostCardFragment,
  PlantCardFragment,
  ProjectBySlugQuery,
  ProjectCardFragment,
  ServiceBySlugQuery,
  ServiceCardFragment,
  SiteSettingsQuery,
  TestimonialFieldsFragment,
} from '../generated/graphql'
import { bulletList, heading, paragraph, richText } from './rich-text'

/**
 * Seed content, transcribed verbatim from the design canvas.
 *
 * This is not mock data in the throwaway sense: it is the copy the design was
 * laid out around, typed against the *generated* Contentful types, so every
 * component is built and tested against the exact shape the CDA will return.
 * When credentials land, `contentSource` flips to `live` and nothing else moves.
 *
 * Assets carry `url: null` wherever no photograph exists yet. That is the same
 * shape a published-but-unshot entry has in the real space, and it is what makes
 * `ImageSlot` render the sage placeholder rather than a broken image.
 */

const NO_ASSET_YET = (id: string): AssetFieldsFragment => ({
  __typename: 'Asset',
  sys: { __typename: 'Sys', id },
  url: null,
  width: null,
  height: null,
  contentType: null,
})

/** The one real photograph in the bundle. Portrait source, cropped per breakpoint. */
const HERO_PHOTO: AssetFieldsFragment = {
  __typename: 'Asset',
  sys: { __typename: 'Sys', id: 'asset-hero-edyta-garden' },
  url: '/hero-edyta-garden.jpeg',
  width: 1536,
  height: 2048,
  contentType: 'image/jpeg',
}

// ── plants ────────────────────────────────────────────────────────────────────

type PlantSeed = Omit<PlantCardFragment, '__typename' | 'sys' | 'photo'> & {
  readonly id: string
}

const PLANT_SEEDS: readonly PlantSeed[] = [
  {
    id: 'plant-black-eyed-susan',
    commonName: "Black-Eyed Susan 'Goldsturm'",
    // The longest realistic name pair — card 1 exists to prove it still fits.
    latinName: "Rudbeckia fulgida var. sullivantii 'Goldsturm'",
    lightTag: 'Full sun',
    waterTag: 'Low water',
    isNative: true,
    featured: true,
    order: 10,
    photoAltText: 'Clumps of golden black-eyed Susans in full flower along a sunny border.',
    photoCaption: null,
  },
  {
    id: 'plant-little-bluestem',
    commonName: 'Little Bluestem',
    latinName: 'Schizachyrium scoparium',
    lightTag: 'Full sun',
    waterTag: 'Very low water',
    isNative: true,
    featured: true,
    order: 20,
    photoAltText: 'Upright blue-green stems of little bluestem catching low afternoon light.',
    photoCaption: null,
  },
  {
    id: 'plant-ostrich-fern',
    commonName: 'Ostrich Fern',
    latinName: 'Matteuccia struthiopteris',
    lightTag: 'Shade',
    waterTag: 'Moist soil',
    isNative: true,
    featured: true,
    order: 30,
    photoAltText: 'Tall arching ostrich fern fronds in a shaded, damp corner of a garden.',
    photoCaption: null,
  },
  {
    id: 'plant-purple-coneflower',
    commonName: 'Purple Coneflower',
    latinName: 'Echinacea purpurea',
    lightTag: 'Full sun',
    waterTag: 'Low water',
    isNative: true,
    featured: true,
    order: 40,
    photoAltText: 'Pink-purple coneflowers with copper centres, a bee on the nearest bloom.',
    photoCaption: null,
  },
  {
    id: 'plant-bottlebrush-buckeye',
    commonName: 'Bottlebrush Buckeye',
    latinName: 'Aesculus parviflora',
    lightTag: 'Part shade',
    waterTag: 'Average water',
    // Native to the south-eastern US, not to Michigan — so the "Michigan native"
    // filter has something real to exclude.
    isNative: false,
    featured: true,
    order: 50,
    photoAltText: 'A broad bottlebrush buckeye shrub covered in white upright flower spikes.',
    photoCaption: null,
  },
  {
    id: 'plant-wild-bergamot',
    commonName: 'Wild Bergamot',
    latinName: 'Monarda fistulosa',
    lightTag: 'Full sun',
    waterTag: 'Low water',
    isNative: true,
    featured: false,
    order: 60,
    photoAltText: 'Lavender wild bergamot flowers massed in a sunny meadow planting.',
    photoCaption: null,
  },
  {
    id: 'plant-pagoda-dogwood',
    commonName: 'Pagoda Dogwood',
    latinName: 'Cornus alternifolia',
    lightTag: 'Part shade',
    waterTag: 'Average water',
    isNative: true,
    featured: false,
    order: 70,
    photoAltText: 'The horizontal tiered branches of a pagoda dogwood at the edge of woodland.',
    photoCaption: null,
  },
  {
    id: 'plant-prairie-dropseed',
    commonName: 'Prairie Dropseed',
    latinName: 'Sporobolus heterolepis',
    lightTag: 'Full sun',
    waterTag: 'Very low water',
    isNative: true,
    featured: false,
    order: 80,
    photoAltText: 'Fine-textured prairie dropseed forming soft green fountains along a path.',
    photoCaption: null,
  },
]

export const seedPlants: readonly PlantCardFragment[] = PLANT_SEEDS.map(({ id, ...fields }) => ({
  __typename: 'Plant',
  sys: { __typename: 'Sys', id },
  photo: NO_ASSET_YET(`asset-${id}`),
  ...fields,
}))

// ── projects ──────────────────────────────────────────────────────────────────

type ProjectDetail = NonNullable<
  NonNullable<ProjectBySlugQuery['projectCollection']>['items'][number]
>

const shadeBorder: ProjectDetail = {
  __typename: 'Project',
  sys: { __typename: 'Sys', id: 'project-shade-border-reborn' },
  title: 'Shade border, reborn',
  slug: 'shade-border-reborn',
  // The three-line caption case the home gallery is designed to absorb.
  caption:
    'Ferns and hellebores under old maples — a caption can run to three full lines here and the card simply grows taller.',
  location: 'Royal Oak',
  date: '2026-06-15',
  summary: 'Completed June 2026 · Design, planting & first-season care',
  beforeImage: NO_ASSET_YET('asset-project-shade-border-before'),
  beforeImageAltText: 'Bare soil and patchy grass under two mature maples before planting.',
  beforeImageCaption: 'Bare soil and struggling grass, May.',
  afterImage: NO_ASSET_YET('asset-project-shade-border-after'),
  afterImageAltText: 'The same shaded corner filled with layered ferns, hellebores and hostas.',
  afterImageCaption: 'The same corner, one season on.',
  metaDescription:
    'A dry-shade border in Royal Oak rebuilt with ferns, hellebores and epimedium that close over the soil by year two.',
  ctaHeading: 'Want a border like this?',
  ctaBody: 'A free 15-minute call is the easiest way to start.',
  ctaLabel: 'Book a Consultation',
  body: {
    __typename: 'ProjectBody',
    json: richText(
      paragraph(
        "This backyard sat under two old maples that made grass impossible and left the beds bare by midsummer. The owners wanted something green and layered that wouldn't need weekly attention.",
      ),
      paragraph(
        'We built the border around plants that genuinely like dry shade — ostrich ferns, hellebores, and epimedium — with spring bulbs tucked between for early color. Everything is spaced to close over the soil by year two, which is what actually keeps the weeding down.',
      ),
      heading('Before & after'),
      paragraph(
        'Care is a spring cutback and one mulch top-up — the owners handle it themselves with a checklist I left behind.',
      ),
    ),
    links: {
      __typename: 'ProjectBodyLinks',
      assets: { __typename: 'ProjectBodyAssets', block: [], hyperlink: [] },
    },
  },
}

const frontWalk: ProjectDetail = {
  __typename: 'Project',
  sys: { __typename: 'Sys', id: 'project-front-walk-refresh' },
  title: 'Front walk refresh',
  slug: 'front-walk-refresh',
  caption: 'Natives along a new bluestone path.',
  location: 'Grosse Pointe',
  date: '2026-05-02',
  summary: 'Completed May 2026 · Design & planting',
  beforeImage: NO_ASSET_YET('asset-project-front-walk-before'),
  beforeImageAltText: 'A cracked concrete front walk with overgrown foundation shrubs.',
  beforeImageCaption: 'The original walk and tired foundation planting.',
  afterImage: NO_ASSET_YET('asset-project-front-walk-after'),
  afterImageAltText:
    'A bluestone path edged with coneflowers and little bluestem leading to a front door.',
  afterImageCaption: 'Bluestone, and a planting that carries into October.',
  metaDescription:
    'A Grosse Pointe front walk rebuilt in bluestone and edged with Michigan natives that hold their looks into autumn.',
  ctaHeading: 'Thinking about your own front entry?',
  ctaBody: 'A free 15-minute call is the easiest way to start.',
  ctaLabel: 'Book a Consultation',
  body: {
    __typename: 'ProjectBody',
    json: richText(
      paragraph(
        'The old walk was too narrow for two people and the foundation shrubs had swallowed the front windows. We widened the path in bluestone and replanted the whole strip.',
      ),
      paragraph(
        'Coneflower, little bluestem and prairie dropseed carry the planting from June into October, and none of it needs cutting back until spring.',
      ),
    ),
    links: {
      __typename: 'ProjectBodyLinks',
      assets: { __typename: 'ProjectBodyAssets', block: [], hyperlink: [] },
    },
  },
}

/** The before-image-absent case, which the card and detail template must both handle. */
const patioPollinator: ProjectDetail = {
  __typename: 'Project',
  sys: { __typename: 'Sys', id: 'project-patio-pollinator-garden' },
  title: 'Patio pollinator garden',
  slug: 'patio-pollinator-garden',
  caption: 'One-line caption.',
  location: 'Birmingham',
  date: '2025-08-20',
  summary: 'Completed August 2025 · Planting',
  beforeImage: null,
  beforeImageAltText: null,
  beforeImageCaption: null,
  afterImage: NO_ASSET_YET('asset-project-patio-pollinator-after'),
  afterImageAltText: 'A patio edge planted with bergamot and coneflower, bees working the flowers.',
  afterImageCaption: 'Midsummer, with the bergamot at its peak.',
  metaDescription:
    'A Birmingham patio edge replanted for pollinators with bergamot, coneflower and mountain mint.',
  ctaHeading: 'Want more life in your yard?',
  ctaBody: 'A free 15-minute call is the easiest way to start.',
  ctaLabel: 'Book a Consultation',
  body: {
    __typename: 'ProjectBody',
    json: richText(
      paragraph(
        'A narrow strip along a patio, baking in full sun and previously home to annuals that needed watering every evening.',
      ),
      paragraph(
        'Bergamot, coneflower and mountain mint replaced them. It has not been watered since the first season.',
      ),
    ),
    links: {
      __typename: 'ProjectBodyLinks',
      assets: { __typename: 'ProjectBodyAssets', block: [], hyperlink: [] },
    },
  },
}

export const seedProjectDetails: readonly ProjectDetail[] = [
  shadeBorder,
  frontWalk,
  patioPollinator,
]

export const seedProjects: readonly ProjectCardFragment[] = seedProjectDetails

// ── blog posts ────────────────────────────────────────────────────────────────

type BlogPostDetail = NonNullable<
  NonNullable<BlogPostBySlugQuery['blogPostCollection']>['items'][number]
>

const claySoil: BlogPostDetail = {
  __typename: 'BlogPost',
  sys: { __typename: 'Sys', id: 'post-what-to-plant-in-clay-soil' },
  title: 'What to plant in clay soil',
  slug: 'what-to-plant-in-clay-soil',
  excerpt: "Our heavy soil is a gift once you stop fighting it. Here's what thrives.",
  date: '2026-05-12',
  author: 'Edyta Phillips',
  readingMinutes: 4,
  thumbnail: NO_ASSET_YET('asset-post-clay-soil'),
  thumbnailAltText: 'A handful of damp grey clay soil held over a newly dug bed.',
  thumbnailCaption: null,
  metaDescription:
    'Most of Metro Detroit sits on heavy clay. Five Michigan natives that root straight through it — and what to stop planting.',
  ctaHeading: 'Not sure what your soil is?',
  ctaBody: 'A soil test tells you in a week.',
  ctaLabel: 'Book a Soil Test',
  body: {
    __typename: 'BlogPostBody',
    json: richText(
      paragraph(
        "Most of Metro Detroit sits on heavy clay, and most planting advice pretends it doesn't. The good news: clay holds water and nutrients better than sandy soil ever will.",
      ),
      paragraph(
        'Stop fighting it. Skip the plants that demand sharp drainage and lean into the ones that evolved for exactly this ground.',
      ),
      heading('Five that thrive'),
      paragraph('These all root straight through clay — and all five are Michigan natives.'),
      bulletList([
        'Black-eyed Susan (Rudbeckia fulgida)',
        'Purple coneflower (Echinacea purpurea)',
        'Wild bergamot (Monarda fistulosa)',
        'Switchgrass (Panicum virgatum)',
        'Swamp milkweed (Asclepias incarnata)',
      ]),
    ),
    links: {
      __typename: 'BlogPostBodyLinks',
      assets: { __typename: 'BlogPostBodyAssets', block: [], hyperlink: [] },
    },
  },
}

const winterPlanters: BlogPostDetail = {
  __typename: 'BlogPost',
  sys: { __typename: 'Sys', id: 'post-planters-that-survive-a-michigan-winter' },
  title: 'Planters that survive a Michigan winter',
  slug: 'planters-that-survive-a-michigan-winter',
  excerpt: 'Evergreens, twigs, and berries that look good through the freeze.',
  date: '2026-03-04',
  author: 'Edyta Phillips',
  readingMinutes: 3,
  thumbnail: NO_ASSET_YET('asset-post-winter-planters'),
  thumbnailAltText: 'A front-door planter of spruce tips, red dogwood stems and winterberry.',
  thumbnailCaption: null,
  metaDescription:
    'What actually holds up in a Michigan winter planter: spruce tips, red twig dogwood, winterberry — and why the container matters more than the plants.',
  ctaHeading: 'Want your planters handled?',
  ctaBody: 'I refresh containers four times a year.',
  ctaLabel: 'Book a Consultation',
  body: {
    __typename: 'BlogPostBody',
    json: richText(
      paragraph(
        'A winter planter is not a planting — nothing is rooting in January. It is an arrangement, and it only has to do one thing: look alive from the sidewalk.',
      ),
      heading('Start with the container'),
      paragraph(
        'Terracotta cracks. Thin plastic goes brittle. Fiberglass and thick-walled resin survive a Michigan freeze-thaw cycle, and that decision matters more than anything you put in them.',
      ),
      heading('Then the three layers'),
      paragraph(
        'Spruce or fir tips for mass, red twig dogwood or curly willow for height, and winterberry for the one bright note. Push everything in deep before the soil freezes solid.',
      ),
    ),
    links: {
      __typename: 'BlogPostBodyLinks',
      assets: { __typename: 'BlogPostBodyAssets', block: [], hyperlink: [] },
    },
  },
}

const fallTidying: BlogPostDetail = {
  __typename: 'BlogPost',
  sys: { __typename: 'Sys', id: 'post-when-to-stop-tidying-your-fall-garden' },
  title: 'When to stop tidying your fall garden',
  slug: 'when-to-stop-tidying-your-fall-garden',
  excerpt: 'Seed heads and stems feed the birds — and save you a weekend.',
  date: '2025-10-08',
  author: 'Edyta Phillips',
  readingMinutes: 3,
  thumbnail: NO_ASSET_YET('asset-post-fall-tidying'),
  thumbnailAltText: 'Frosted coneflower seed heads and dry grass stems left standing in autumn.',
  thumbnailCaption: null,
  metaDescription:
    'Leaving stems and seed heads standing over winter feeds the birds, shelters pollinators, and saves you a weekend of autumn work.',
  ctaHeading: 'Want a garden that needs less of this?',
  ctaBody: 'A free 15-minute call is the easiest way to start.',
  ctaLabel: 'Book a Consultation',
  body: {
    __typename: 'BlogPostBody',
    json: richText(
      paragraph(
        'The instinct to cut everything to the ground in October is inherited, not horticultural. Most of it can wait until spring, and the garden is better for the wait.',
      ),
      heading('What to leave'),
      paragraph(
        'Coneflower and rudbeckia seed heads feed goldfinches through December. Hollow stems shelter native bees. Grasses hold snow and give the beds structure in the one season they would otherwise have none.',
      ),
      heading('What to cut'),
      paragraph(
        'Anything that had disease this year — peony foliage, bee balm with mildew, hosta leaves. That material leaves the garden, and it does not go in the compost.',
      ),
    ),
    links: {
      __typename: 'BlogPostBodyLinks',
      assets: { __typename: 'BlogPostBodyAssets', block: [], hyperlink: [] },
    },
  },
}

export const seedBlogPostDetails: readonly BlogPostDetail[] = [
  claySoil,
  winterPlanters,
  fallTidying,
]

export const seedBlogPosts: readonly BlogPostCardFragment[] = seedBlogPostDetails

// ── testimonials (D4: rendered, but no Review schema until confirmed) ─────────

export const seedTestimonials: readonly TestimonialFieldsFragment[] = [
  {
    __typename: 'Testimonial',
    sys: { __typename: 'Sys', id: 'testimonial-margaret-k' },
    quote:
      "Edyta listened to how we actually use the yard and gave us a garden we can keep up with. It's the first summer we've enjoyed being out there.",
    attribution: 'Margaret K.',
    town: 'Royal Oak',
    order: 10,
  },
  {
    __typename: 'Testimonial',
    sys: { __typename: 'Sys', id: 'testimonial-tom-d' },
    quote: 'The soil test alone saved us hundreds in plants that would never have made it.',
    attribution: 'Tom D.',
    town: 'Livonia',
    order: 20,
  },
  {
    __typename: 'Testimonial',
    sys: { __typename: 'Sys', id: 'testimonial-diane-s' },
    quote: 'Our porch planters look wonderful every single season. Neighbors ask who does them.',
    attribution: 'Diane S.',
    town: 'Troy',
    order: 30,
  },
  {
    __typename: 'Testimonial',
    sys: { __typename: 'Sys', id: 'testimonial-susan-bill-r' },
    quote:
      "Edyta turned our bare new-build lot into something that feels like it's been here forever.",
    attribution: 'Susan & Bill R.',
    town: 'Northville',
    order: 40,
  },
  {
    __typename: 'Testimonial',
    sys: { __typename: 'Sys', id: 'testimonial-carol-m' },
    quote: 'She checks in every season and the garden just keeps getting better.',
    attribution: 'Carol M.',
    town: 'Plymouth',
    order: 50,
  },
]

// ── services (D0: six real pages, not anchors) ────────────────────────────────

type ServiceDetail = NonNullable<
  NonNullable<ServiceBySlugQuery['serviceCollection']>['items'][number]
>

const SERVICE_DETAILS: readonly ServiceDetail[] = [
  {
    __typename: 'Service',
    sys: { __typename: 'Sys', id: 'service-consulting' },
    name: 'Consulting',
    slug: 'consulting',
    summary: 'A walk-through of your space with a clear plan you can act on.',
    iconKey: 'consulting',
    order: 10,
    intro:
      'We walk your yard together, I tell you what I see, and you leave with a written plan you can act on at your own pace — whether that means hiring me, hiring someone else, or doing it yourself over three seasons.',
    metaTitle: 'Garden Consulting in Metro Detroit',
    metaDescription:
      'A walk-through of your yard with a written plan you can act on. Garden consulting across Metro Detroit, starting with a free 15-minute call.',
    ctaHeading: 'Not sure where to start?',
    ctaBody: 'A free 15-minute call is the easiest way to find out.',
    body: {
      __typename: 'ServiceBody',
      json: richText(
        heading('What happens on the visit'),
        paragraph(
          'We spend an hour or two walking the whole property. I ask how you actually use it — where you sit, what you look at from the kitchen window, what you have already tried and given up on.',
        ),
        heading('What you get afterwards'),
        paragraph(
          'A written plan: what to remove, what to plant where, in what order, and roughly what each stage costs. It is yours to use however you like.',
        ),
      ),
      links: {
        __typename: 'ServiceBodyLinks',
        assets: { __typename: 'ServiceBodyAssets', block: [], hyperlink: [] },
      },
    },
  },
  {
    __typename: 'Service',
    sys: { __typename: 'Sys', id: 'service-seasonal-planters' },
    name: 'Planters for Every Season',
    slug: 'seasonal-planters',
    summary: 'Containers refreshed for spring, summer, fall, and winter.',
    iconKey: 'planters',
    order: 20,
    intro:
      'Four visits a year. Your containers get replanted for the season, the spent material is taken away, and you do not think about them in between.',
    metaTitle: 'Seasonal Planters & Containers in Metro Detroit',
    metaDescription:
      'Containers replanted four times a year for spring, summer, fall and winter — designed for Michigan weather and taken care of for you.',
    ctaHeading: 'Want your planters handled?',
    ctaBody: 'Tell me how many you have and where they sit.',
    body: {
      __typename: 'ServiceBody',
      json: richText(
        heading('Four changes a year'),
        paragraph(
          'Spring bulbs and pansies, summer annuals chosen for your light, autumn grasses and mums, and a winter arrangement of evergreen, twig and berry that holds until March.',
        ),
        heading('Built for the freeze'),
        paragraph(
          'Container choice matters more than plant choice in a Michigan winter. If yours crack every year, we start there.',
        ),
      ),
      links: {
        __typename: 'ServiceBodyLinks',
        assets: { __typename: 'ServiceBodyAssets', block: [], hyperlink: [] },
      },
    },
  },
  {
    __typename: 'Service',
    sys: { __typename: 'Sys', id: 'service-soil-testing' },
    name: 'Soil Testing',
    slug: 'soil-testing',
    summary: 'Find out what your soil actually needs before you plant.',
    iconKey: 'soil',
    order: 30,
    intro:
      'Most failed plantings are a soil problem, not a plant problem. A test tells you what you are working with in about a week, and it costs far less than replacing everything twice.',
    metaTitle: 'Garden Soil Testing in Metro Detroit',
    metaDescription:
      'Know your pH, texture and nutrients before you plant. Soil testing across Metro Detroit with plain-language results and a planting list.',
    ctaHeading: 'Not sure what your soil is?',
    ctaBody: 'A soil test tells you in a week.',
    body: {
      __typename: 'ServiceBody',
      json: richText(
        heading('What gets tested'),
        paragraph(
          'pH, organic matter, texture, and the major nutrients. I pull samples from several spots, because one yard can easily be three different soils.',
        ),
        heading('What you do with it'),
        paragraph(
          'You get the results in plain language and a planting list that suits them — not a bag of amendments and a hope that it works.',
        ),
      ),
      links: {
        __typename: 'ServiceBodyLinks',
        assets: { __typename: 'ServiceBodyAssets', block: [], hyperlink: [] },
      },
    },
  },
  {
    __typename: 'Service',
    sys: { __typename: 'Sys', id: 'service-house-plants' },
    name: 'House Plants',
    slug: 'house-plants',
    summary: 'The right indoor plants for your light, plus care you can keep up with.',
    iconKey: 'houseplants',
    order: 40,
    intro:
      'Indoor plants fail for one reason far more often than any other: they were chosen for the room rather than the light. We measure the light first and choose second.',
    metaTitle: 'House Plant Consulting in Metro Detroit',
    metaDescription:
      'Indoor plants matched to the light you actually have, with a watering routine you can keep up with. House plant help across Metro Detroit.',
    ctaHeading: 'Tired of replacing the same plant?',
    ctaBody: 'A free 15-minute call is the easiest way to start.',
    body: {
      __typename: 'ServiceBody',
      json: richText(
        heading('Light first'),
        paragraph(
          'North, east, south or west, how far from the glass, and what is outside the window. That is the whole brief, and it rules out most of what the garden centre will sell you.',
        ),
        heading('Then a routine'),
        paragraph(
          'A watering schedule that fits how often you are actually home, and honest advice about which plants forgive being forgotten.',
        ),
      ),
      links: {
        __typename: 'ServiceBodyLinks',
        assets: { __typename: 'ServiceBodyAssets', block: [], hyperlink: [] },
      },
    },
  },
  {
    __typename: 'Service',
    sys: { __typename: 'Sys', id: 'service-garden-design' },
    name: 'Yard, Patio & Garden Design',
    slug: 'garden-design',
    summary: 'A full plan for the outdoor space you want to spend time in.',
    iconKey: 'design',
    order: 50,
    intro:
      'A complete design for the whole property or one part of it — drawn to scale, planted for Michigan conditions, and staged so you can build it over one season or five.',
    metaTitle: 'Garden & Patio Design in Metro Detroit',
    metaDescription:
      'Scaled garden, yard and patio design for Metro Detroit homes — planted for our clay and winters, and staged to build at your own pace.',
    ctaHeading: 'Ready to plan the whole thing?',
    ctaBody: 'A free 15-minute call is the easiest way to start.',
    body: {
      __typename: 'ServiceBody',
      json: richText(
        heading('How a design works'),
        paragraph(
          'A site visit and measurement, then a scaled plan with a full planting list. We go through it together and change what you do not like before anything is ordered.',
        ),
        heading('Built in stages'),
        paragraph(
          'Almost nobody builds a garden in one go. The plan is drawn so that each stage looks finished on its own, whatever order you get to them in.',
        ),
      ),
      links: {
        __typename: 'ServiceBodyLinks',
        assets: { __typename: 'ServiceBodyAssets', block: [], hyperlink: [] },
      },
    },
  },
  {
    __typename: 'Service',
    sys: { __typename: 'Sys', id: 'service-yard-maintenance' },
    name: 'Yard Maintenance',
    slug: 'yard-maintenance',
    summary: 'Seasonal care that keeps everything looking its best.',
    iconKey: 'maintenance',
    order: 60,
    intro:
      'Not mowing — the gardening. Cutting back at the right time, dividing what has outgrown its spot, editing what is taking over, and topping up mulch where it has thinned.',
    metaTitle: 'Seasonal Garden Maintenance in Metro Detroit',
    metaDescription:
      'Seasonal garden care across Metro Detroit: spring cutback, summer editing, autumn division and mulch — timed for how Michigan gardens actually grow.',
    ctaHeading: 'Want it kept up without keeping it up?',
    ctaBody: 'A free 15-minute call is the easiest way to start.',
    body: {
      __typename: 'ServiceBody',
      json: richText(
        heading('Spring'),
        paragraph(
          'Cutback once the soil has warmed and the overwintering insects have moved on — usually later than people expect. Mulch top-up where it has thinned.',
        ),
        heading('Summer and autumn'),
        paragraph(
          'Editing rather than tidying: dividing what has outgrown its spot, pulling what is taking over, and leaving the seed heads that earn their keep over winter.',
        ),
      ),
      links: {
        __typename: 'ServiceBodyLinks',
        assets: { __typename: 'ServiceBodyAssets', block: [], hyperlink: [] },
      },
    },
  },
]

export const seedServiceDetails: readonly ServiceDetail[] = SERVICE_DETAILS

export const seedServices: readonly ServiceCardFragment[] = SERVICE_DETAILS

// ── site settings ─────────────────────────────────────────────────────────────

type SiteSettingsEntry = NonNullable<
  NonNullable<SiteSettingsQuery['siteSettingsCollection']>['items'][number]
>

export const seedSiteSettings: SiteSettingsEntry = {
  __typename: 'SiteSettings',
  sys: { __typename: 'Sys', id: 'site-settings' },
  internalName: 'Site settings',
  // Both hero crops come from the same portrait source until separate crops are
  // uploaded; the crop focus differs per breakpoint, not the file.
  heroImageDesktop: HERO_PHOTO,
  heroImageDesktopAltText:
    'Edyta Phillips smiling in a late-summer garden bed of black-eyed Susans and coneflowers.',
  heroImageDesktopCaption: null,
  heroImageMobile: HERO_PHOTO,
  heroImageMobileAltText:
    'Edyta Phillips smiling in a late-summer garden bed of black-eyed Susans and coneflowers.',
  heroImageMobileCaption: null,
  portrait: NO_ASSET_YET('asset-portrait-edyta'),
  portraitAltText: 'Portrait of Edyta Phillips.',
  portraitCaption: null,
}
