import { z } from 'zod'

import type {
  BlogPostBySlugQuery,
  ProjectBySlugQuery,
  ServiceBySlugQuery,
} from './generated/graphql'

/**
 * The boundary between Contentful's GraphQL response and the app's own types.
 *
 * Contentful marks *every* content field nullable in its GraphQL schema, no
 * matter what the content model requires. That is not a modelling mistake to be
 * fixed in a migration — one schema serves both the Delivery and the Preview
 * API, and a draft legitimately has its required fields empty, so the schema
 * cannot promise otherwise. The result is that `commonName` arrives as
 * `string | null` even though a plant physically cannot be published without one.
 *
 * Taking the generated fragment as the domain type therefore pushed a null check
 * into every component that touched a CMS field. This layer moves those checks
 * to the one place they belong: an entry is validated once on the way in, and
 * what comes out the other side has the shape the content model guarantees.
 *
 * Two rules decide what stays nullable:
 *
 *   1. A field the model marks required becomes non-null here. If it is missing,
 *      the entry is broken — it is dropped with a warning naming the field, so
 *      one bad entry cannot take a whole page down.
 *   2. An **asset link** stays nullable regardless, because Contentful allows an
 *      entry to be published while a linked asset is not, and returns `null` for
 *      it. `CmsImage` already renders its placeholder for that case, so this is
 *      a real state to carry — not an error to drop the entry over.
 */

// ── primitives ────────────────────────────────────────────────────────────────

/** `__typename` is dropped for `sys`: only the entry-level one is a discriminant. */
const sys = z.object({ id: z.string().min(1) })

/**
 * Every field on an asset is genuinely optional at the API level — an asset can
 * exist before its file has finished processing — so none of these tighten.
 */
const asset = z.object({
  url: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  contentType: z.string().nullable(),
  sys,
})

export type CmsAsset = z.infer<typeof asset>

/** See rule 2 above: a link to an unpublished asset resolves to null. */
const assetLink = asset.nullable()

/** A required text field. An empty string is as absent as a null. */
const text = z.string().min(1)

/** An optional text field. Contentful returns null, never an empty string. */
const optionalText = z.string().nullable()

/**
 * Validated rather than trusted: `sitemap.ts` and the card meta both feed this
 * straight to `new Date()`, and an unparseable value would surface as the string
 * "Invalid Date" on the page instead of failing here.
 */
const date = text.refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'is not a parseable date',
})

/** Mirrors the regexp validation in migration 001 — a bad slug is a broken URL. */
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'is not a valid slug' })

const order = z.number().int()

// ── card schemas ──────────────────────────────────────────────────────────────

const plant = z.object({
  __typename: z.literal('Plant'),
  sys,
  commonName: text,
  latinName: text,
  // Left as plain strings rather than narrowed to the model's allowed values:
  // the filter buttons match on substrings, and adding an option in Contentful
  // should not start silently dropping entries here.
  lightTag: text,
  waterTag: text,
  isNative: z.boolean(),
  featured: z.boolean(),
  order,
  photo: assetLink,
  photoAltText: text,
  photoCaption: optionalText,
})

const project = z.object({
  __typename: z.literal('Project'),
  sys,
  title: text,
  slug,
  caption: text,
  location: text,
  date,
  beforeImage: assetLink,
  // The before photo is optional in the model, so its description is too.
  beforeImageAltText: optionalText,
  beforeImageCaption: optionalText,
  afterImage: assetLink,
  afterImageAltText: text,
  afterImageCaption: optionalText,
})

const blogPost = z.object({
  __typename: z.literal('BlogPost'),
  sys,
  title: text,
  slug,
  excerpt: text,
  date,
  author: text,
  readingMinutes: order.min(1),
  thumbnail: assetLink,
  thumbnailAltText: text,
  thumbnailCaption: optionalText,
})

const testimonial = z.object({
  __typename: z.literal('Testimonial'),
  sys,
  quote: text,
  attribution: text,
  town: text,
  order,
})

const service = z.object({
  __typename: z.literal('Service'),
  sys,
  name: text,
  slug,
  summary: text,
  iconKey: text,
  order,
})

const siteSettings = z.object({
  __typename: z.literal('SiteSettings'),
  sys,
  internalName: text,
  heroImageDesktop: assetLink,
  heroImageDesktopAltText: text,
  heroImageDesktopCaption: optionalText,
  heroImageMobile: assetLink,
  heroImageMobileAltText: text,
  heroImageMobileCaption: optionalText,
  portrait: assetLink,
  portraitAltText: text,
  portraitCaption: optionalText,
})

export type PlantEntry = z.infer<typeof plant>
export type ProjectEntry = z.infer<typeof project>
export type BlogPostEntry = z.infer<typeof blogPost>
export type TestimonialEntry = z.infer<typeof testimonial>
export type ServiceEntry = z.infer<typeof service>
export type SiteSettingsEntry = z.infer<typeof siteSettings>

/**
 * The Projects & Blog grid renders two entry types in one flow. Modelling it as
 * a union discriminated on `__typename` — rather than a shared "post" shape — is
 * what lets the card dispatcher switch exhaustively and lets each type keep the
 * fields that are genuinely its own.
 */
export type FeedEntry = ProjectEntry | BlogPostEntry

// ── detail schemas ────────────────────────────────────────────────────────────

const projectDetail = project.extend({
  summary: optionalText,
  metaDescription: optionalText,
  leadImage: assetLink,
  leadImageAltText: optionalText,
  leadImageCaption: optionalText,
  ctaHeading: optionalText,
  ctaBody: optionalText,
  ctaLabel: optionalText,
})

const blogPostDetail = blogPost.extend({
  metaDescription: optionalText,
  ctaHeading: optionalText,
  ctaBody: optionalText,
  ctaLabel: optionalText,
})

const serviceDetail = service.extend({
  intro: text,
  metaTitle: optionalText,
  metaDescription: optionalText,
  ctaHeading: optionalText,
  ctaBody: optionalText,
})

type RawProjectDetail = NonNullable<
  NonNullable<ProjectBySlugQuery['projectCollection']>['items'][number]
>
type RawBlogPostDetail = NonNullable<
  NonNullable<BlogPostBySlugQuery['blogPostCollection']>['items'][number]
>
type RawServiceDetail = NonNullable<
  NonNullable<ServiceBySlugQuery['serviceCollection']>['items'][number]
>

/**
 * Rich-text bodies pass through untouched, keeping the generated type.
 *
 * They are deliberately outside the schemas above. Contentful's `json` is an
 * opaque `JSON` scalar with no shape to validate against, and `RichText` already
 * guards it at the point of use — it checks for a document node and renders
 * nothing if it does not find one. Re-describing that here would be a second,
 * weaker copy of a check that already exists.
 */
export type ProjectDetailEntry = z.infer<typeof projectDetail> & {
  readonly body: RawProjectDetail['body']
}
export type BlogPostDetailEntry = z.infer<typeof blogPostDetail> & {
  readonly body: RawBlogPostDetail['body']
}
export type ServiceDetailEntry = z.infer<typeof serviceDetail> & {
  readonly body: RawServiceDetail['body']
}

// ── parsing ───────────────────────────────────────────────────────────────────

/**
 * Names the entry and the exact fields that failed.
 *
 * The id is what makes this actionable: it is the last segment of the entry's
 * URL in the Contentful web app, so whoever sees this in the build log can open
 * the offending entry directly.
 */
function reportInvalid(kind: string, id: string, error: z.ZodError): void {
  const fields = error.issues
    .map((issue) => `${issue.path.join('.') || kind} ${issue.message}`)
    .join('; ')

  console.warn(`[contentful] Skipped ${kind} "${id}" — ${fields}.`)
}

/**
 * Validates a collection, dropping entries that do not match.
 *
 * Contentful puts `null` in `items` for an entry it cannot resolve at all (an
 * unpublished link, usually), which is why the null filter lives here too rather
 * than in a separate pass.
 */
function parseList<Entry>(
  kind: string,
  schema: z.ZodType<Entry>,
  items: readonly ({ readonly sys: { readonly id: string } } | null)[],
): readonly Entry[] {
  const parsed: Entry[] = []

  for (const raw of items) {
    if (raw === null) continue

    const result = schema.safeParse(raw)
    if (result.success) parsed.push(result.data)
    else reportInvalid(kind, raw.sys.id, result.error)
  }

  return parsed
}

/** A single entry, or null if it is missing or does not validate. */
function parseOne<Entry>(
  kind: string,
  schema: z.ZodType<Entry>,
  raw: { readonly sys: { readonly id: string } } | null | undefined,
): Entry | null {
  if (raw === null || raw === undefined) return null

  const result = schema.safeParse(raw)
  if (result.success) return result.data

  reportInvalid(kind, raw.sys.id, result.error)
  return null
}

export const parsePlants = (
  items: readonly ({ readonly sys: { readonly id: string } } | null)[],
): readonly PlantEntry[] => parseList('plant', plant, items)

export const parseProjects = (
  items: readonly ({ readonly sys: { readonly id: string } } | null)[],
): readonly ProjectEntry[] => parseList('project', project, items)

export const parseBlogPosts = (
  items: readonly ({ readonly sys: { readonly id: string } } | null)[],
): readonly BlogPostEntry[] => parseList('blog post', blogPost, items)

export const parseTestimonials = (
  items: readonly ({ readonly sys: { readonly id: string } } | null)[],
): readonly TestimonialEntry[] => parseList('testimonial', testimonial, items)

export const parseServices = (
  items: readonly ({ readonly sys: { readonly id: string } } | null)[],
): readonly ServiceEntry[] => parseList('service', service, items)

export const parseSiteSettings = (
  raw: { readonly sys: { readonly id: string } } | null | undefined,
): SiteSettingsEntry | null => parseOne('site settings', siteSettings, raw)

/** The body is re-attached after validation; see `ProjectDetailEntry` above. */
export function parseProjectDetail(
  raw: RawProjectDetail | null | undefined,
): ProjectDetailEntry | null {
  const parsed = parseOne('project', projectDetail, raw)
  return parsed === null || raw === null || raw === undefined ? null : { ...parsed, body: raw.body }
}

export function parseBlogPostDetail(
  raw: RawBlogPostDetail | null | undefined,
): BlogPostDetailEntry | null {
  const parsed = parseOne('blog post', blogPostDetail, raw)
  return parsed === null || raw === null || raw === undefined ? null : { ...parsed, body: raw.body }
}

export function parseServiceDetail(
  raw: RawServiceDetail | null | undefined,
): ServiceDetailEntry | null {
  const parsed = parseOne('service', serviceDetail, raw)
  return parsed === null || raw === null || raw === undefined ? null : { ...parsed, body: raw.body }
}
