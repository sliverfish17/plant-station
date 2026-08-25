/**
 * Contentful content model, per design/README.md § CMS Content Model plus the
 * additions registered as D8 in docs/DECISIONS.md.
 *
 * Run with:
 *   npx contentful-migration --space-id $CONTENTFUL_SPACE_ID \
 *     --environment-id $CONTENTFUL_ENVIRONMENT \
 *     contentful/migrations/001-initial-content-model.cjs
 *
 * Two conventions hold throughout:
 *   1. Every asset field is followed by `<field>AltText` (required) and
 *      `<field>Caption` (optional). Alt text is required at the model level so
 *      an image physically cannot be published without it.
 *   2. Phone, email and social profiles are deliberately absent. They live in
 *      src/config/site.ts as the single source of truth (D2); duplicating them
 *      into the CMS would create a second one.
 */

const LIGHT_TAGS = ['Full sun', 'Part shade', 'Shade']
const WATER_TAGS = ['Very low water', 'Low water', 'Average water', 'Moist soil']
const SERVICE_ICONS = ['consulting', 'planters', 'soil', 'houseplants', 'design', 'maintenance']

/** Adds the altText / caption pair that every asset field carries. */
function assetWithMetadata(type, fieldId, name, { required = true } = {}) {
  type
    .createField(fieldId)
    .name(name)
    .type('Link')
    .linkType('Asset')
    .required(required)
    .validations([{ linkMimetypeGroup: ['image'] }])

  type
    .createField(`${fieldId}AltText`)
    .name(`${name} — alt text`)
    .type('Symbol')
    .required(required)
    .validations([{ size: { max: 160 } }])

  type
    .createField(`${fieldId}Caption`)
    .name(`${name} — caption`)
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 200 } }])
}

/** The contextual CTA card that closes every detail page. */
function ctaFields(type) {
  type.createField('ctaHeading').name('CTA heading').type('Symbol').required(false)
  type.createField('ctaBody').name('CTA body').type('Symbol').required(false)
  type.createField('ctaLabel').name('CTA button label').type('Symbol').required(false)
}

module.exports = function (migration) {
  // ── plant ──────────────────────────────────────────────────────────────────
  const plant = migration
    .createContentType('plant')
    .name('Plant')
    .description('A plant on the Favorite Plants page and the home band.')
    .displayField('commonName')

  plant.createField('commonName').name('Common name').type('Symbol').required(true)
  plant
    .createField('latinName')
    .name('Latin name')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 120 } }])
  assetWithMetadata(plant, 'photo', 'Photo (1:1)')
  plant
    .createField('lightTag')
    .name('Light')
    .type('Symbol')
    .required(true)
    .validations([{ in: LIGHT_TAGS }])
  plant
    .createField('waterTag')
    .name('Water / soil')
    .type('Symbol')
    .required(true)
    .validations([{ in: WATER_TAGS }])
  plant.createField('isNative').name('Michigan native').type('Boolean').required(true)
  plant.createField('featured').name('Featured on the home page').type('Boolean').required(true)
  plant
    .createField('order')
    .name('Order')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])

  plant.changeFieldControl('lightTag', 'builtin', 'dropdown')
  plant.changeFieldControl('waterTag', 'builtin', 'dropdown')

  // ── project ────────────────────────────────────────────────────────────────
  const project = migration
    .createContentType('project')
    .name('Project')
    .description('A completed garden, shown as a before/after card and a detail page.')
    .displayField('title')

  project.createField('title').name('Title').type('Symbol').required(true)
  project
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])
  project
    .createField('caption')
    .name('Caption')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 240 } }])
  project.createField('location').name('Location').type('Symbol').required(true)
  project.createField('date').name('Completed').type('Date').required(true)
  project
    .createField('summary')
    .name('Meta line')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 160 } }])

  // The before image is genuinely optional: an after-only project renders one
  // full-width tile cropped to the same media height as the pair.
  assetWithMetadata(project, 'beforeImage', 'Before (3:2)', { required: false })
  assetWithMetadata(project, 'afterImage', 'After (3:2)')

  // The detail page's lead shot. Optional, because most projects will not have a
  // separate hero photograph — the after image stands in when this is empty.
  assetWithMetadata(project, 'leadImage', 'Lead image (3:2)', { required: false })

  project.createField('body').name('Body').type('RichText').required(false)
  project
    .createField('metaDescription')
    .name('Meta description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])
  ctaFields(project)

  // ── blogPost ───────────────────────────────────────────────────────────────
  const blogPost = migration.createContentType('blogPost').name('Blog post').displayField('title')

  blogPost.createField('title').name('Title').type('Symbol').required(true)
  blogPost
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])
  blogPost
    .createField('excerpt')
    .name('Excerpt')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 240 } }])
  blogPost.createField('date').name('Published').type('Date').required(true)
  blogPost.createField('author').name('Author').type('Symbol').required(true)
  blogPost
    .createField('readingMinutes')
    .name('Read time (minutes)')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 1, max: 60 } }])
  assetWithMetadata(blogPost, 'thumbnail', 'Thumbnail (3:2)')
  blogPost.createField('body').name('Body').type('RichText').required(true)
  blogPost
    .createField('metaDescription')
    .name('Meta description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])
  ctaFields(blogPost)

  // ── testimonial ────────────────────────────────────────────────────────────
  const testimonial = migration
    .createContentType('testimonial')
    .name('Testimonial')
    .displayField('attribution')

  testimonial
    .createField('quote')
    .name('Quote')
    .type('Text')
    .required(true)
    .validations([{ size: { max: 400 } }])
  testimonial.createField('attribution').name('Attribution').type('Symbol').required(true)
  testimonial.createField('town').name('Town').type('Symbol').required(true)
  testimonial
    .createField('order')
    .name('Order')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])

  // ── service (D0 — six real pages, not anchors) ─────────────────────────────
  const service = migration
    .createContentType('service')
    .name('Service')
    .description('One of the six services. Drives a bubble on the home page and its own page.')
    .displayField('name')

  service.createField('name').name('Name').type('Symbol').required(true)
  service
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])
  service
    .createField('summary')
    .name('One-liner (shown inside the bubble)')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 120 } }])
  service
    .createField('iconKey')
    .name('Icon')
    .type('Symbol')
    .required(true)
    .validations([{ in: SERVICE_ICONS }])
  service
    .createField('order')
    .name('Order')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])
  service
    .createField('intro')
    .name('Page intro')
    .type('Text')
    .required(true)
    .validations([{ size: { max: 400 } }])
  service.createField('body').name('Body').type('RichText').required(false)
  service
    .createField('metaTitle')
    .name('Meta title')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 70 } }])
  service
    .createField('metaDescription')
    .name('Meta description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])
  service.createField('ctaHeading').name('CTA heading').type('Symbol').required(false)
  service.createField('ctaBody').name('CTA body').type('Symbol').required(false)

  service.changeFieldControl('iconKey', 'builtin', 'dropdown')

  // ── siteSettings ───────────────────────────────────────────────────────────
  const siteSettings = migration
    .createContentType('siteSettings')
    .name('Site settings')
    .description('Single entry. Images only — contact details live in src/config/site.ts (D2).')
    .displayField('internalName')

  siteSettings.createField('internalName').name('Internal name').type('Symbol').required(true)
  assetWithMetadata(siteSettings, 'heroImageDesktop', 'Hero — desktop (16:9)')
  assetWithMetadata(siteSettings, 'heroImageMobile', 'Hero — mobile (4:5)')
  assetWithMetadata(siteSettings, 'portrait', 'Portrait — Edyta (4:5)')
}
