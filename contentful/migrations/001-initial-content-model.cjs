/**
 * Contentful content model, per design/README.md § CMS Content Model plus the
 * additions registered as D8 in docs/DECISIONS.md.
 *
 * Run with:
 *   npx contentful-migration@latest --space-id $CONTENTFUL_SPACE_ID \
 *     --environment-id $CONTENTFUL_ENVIRONMENT \
 *     --access-token <content management token> \
 *     contentful/migrations/001-initial-content-model.cjs
 *
 * Three conventions hold throughout:
 *
 *   1. Fields carry plain-language *labels* for the person who will maintain this
 *      site. Field ids stay technical because the GraphQL queries depend on them.
 *      The help text under each field is applied separately by 002, so a problem
 *      there cannot leave the content model half-built (D14).
 *
 *   2. Every asset field is followed by `<field>AltText` (required) and
 *      `<field>Caption` (optional). Alt text is required at the model level, so an
 *      image physically cannot be published without a description.
 *
 *   3. Phone, email and social profiles are deliberately absent. They live in
 *      src/config/site.ts as the single source of truth (D2); duplicating them
 *      into the CMS would create a second one that could disagree with it.
 */

const LIGHT_TAGS = ['Full sun', 'Part shade', 'Shade']
const WATER_TAGS = ['Very low water', 'Low water', 'Average water', 'Moist soil']
const SERVICE_ICONS = ['consulting', 'planters', 'soil', 'houseplants', 'design', 'maintenance']

/** An image field, plus the alt-text and caption that always accompany it. */
function imageField(type, fieldId, { label, required = true }) {
  type
    .createField(fieldId)
    .name(label)
    .type('Link')
    .linkType('Asset')
    .required(required)
    .validations([{ linkMimetypeGroup: ['image'] }])

  type
    .createField(`${fieldId}AltText`)
    .name(`${label} — description`)
    .type('Symbol')
    .required(required)
    .validations([{ size: { max: 160 } }])

  type
    .createField(`${fieldId}Caption`)
    .name(`${label} — caption`)
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 200 } }])
}

/** The invitation card that closes a detail page. */
function ctaFields(type) {
  type.createField('ctaHeading').name('Invitation — heading').type('Symbol').required(false)

  type.createField('ctaBody').name('Invitation — sentence').type('Symbol').required(false)

  type.createField('ctaLabel').name('Invitation — button').type('Symbol').required(false)
}

module.exports = function (migration) {
  // ── plant ──────────────────────────────────────────────────────────────────
  const plant = migration
    .createContentType('plant')
    .name('Plant')
    .description('A plant on the Favorite Plants page and in the row on the home page.')
    .displayField('commonName')

  plant.createField('commonName').name('Common name').type('Symbol').required(true)

  plant
    .createField('latinName')
    .name('Botanical name')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 120 } }])

  imageField(plant, 'photo', {
    label: 'Photo',
  })

  plant
    .createField('lightTag')
    .name('How much sun')
    .type('Symbol')
    .required(true)
    .validations([{ in: LIGHT_TAGS }])

  plant
    .createField('waterTag')
    .name('How much water')
    .type('Symbol')
    .required(true)
    .validations([{ in: WATER_TAGS }])

  plant.createField('isNative').name('Michigan native').type('Boolean').required(true)

  plant.createField('featured').name('Show on the home page').type('Boolean').required(true)

  plant
    .createField('order')
    .name('Position')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])

  // ── project ────────────────────────────────────────────────────────────────
  const project = migration
    .createContentType('project')
    .name('Project')
    .description('A garden you have worked on. Appears as a card and gets its own page.')
    .displayField('title')

  project.createField('title').name('Project name').type('Symbol').required(true)

  project
    .createField('slug')
    .name('Web address')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])

  project
    .createField('caption')
    .name('Short description')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 240 } }])

  project.createField('location').name('Town').type('Symbol').required(true)

  project.createField('date').name('Date completed').type('Date').required(true)

  project
    .createField('summary')
    .name('Line under the title')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 160 } }])

  imageField(project, 'beforeImage', {
    label: 'Before photo',
    required: false,
  })

  imageField(project, 'afterImage', {
    label: 'After photo',
  })

  imageField(project, 'leadImage', {
    label: 'Main photo for the project page',
    required: false,
  })

  project.createField('body').name('The story').type('RichText').required(false)

  project
    .createField('metaDescription')
    .name('Google description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])

  ctaFields(project)

  // ── blogPost ───────────────────────────────────────────────────────────────
  const blogPost = migration
    .createContentType('blogPost')
    .name('Blog post')
    .description('A written piece. Appears in the same list as projects, newest first.')
    .displayField('title')

  blogPost.createField('title').name('Title').type('Symbol').required(true)

  blogPost
    .createField('slug')
    .name('Web address')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])

  blogPost
    .createField('excerpt')
    .name('Preview sentence')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 240 } }])

  blogPost.createField('date').name('Date published').type('Date').required(true)

  blogPost.createField('author').name('Written by').type('Symbol').required(true)

  blogPost
    .createField('readingMinutes')
    .name('Read time in minutes')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 1, max: 60 } }])

  imageField(blogPost, 'thumbnail', {
    label: 'Photo',
  })

  blogPost.createField('body').name('The post').type('RichText').required(true)

  blogPost
    .createField('metaDescription')
    .name('Google description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])

  ctaFields(blogPost)

  // ── testimonial ────────────────────────────────────────────────────────────
  const testimonial = migration
    .createContentType('testimonial')
    .name('Kind words')
    .description('A quote from a client, shown in the slider on the home page.')
    .displayField('attribution')

  testimonial
    .createField('quote')
    .name('What they said')
    .type('Text')
    .required(true)
    .validations([{ size: { max: 400 } }])

  testimonial.createField('attribution').name('Who said it').type('Symbol').required(true)

  testimonial.createField('town').name('Their town').type('Symbol').required(true)

  testimonial
    .createField('order')
    .name('Position')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])

  // ── service (D0 — six real pages, not anchors) ─────────────────────────────
  const service = migration
    .createContentType('service')
    .name('Service')
    .description(
      'One of the six things you offer. Shows as a circle on the home page and has a page of its own.',
    )
    .displayField('name')

  service.createField('name').name('Service name').type('Symbol').required(true)

  service
    .createField('slug')
    .name('Web address')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])

  service
    .createField('summary')
    .name('One-line description')
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
    .name('Position')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])

  service
    .createField('intro')
    .name('Opening paragraph')
    .type('Text')
    .required(true)
    .validations([{ size: { max: 400 } }])

  service.createField('body').name('Full description').type('RichText').required(false)

  service
    .createField('metaTitle')
    .name('Google title')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 70 } }])

  service
    .createField('metaDescription')
    .name('Google description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])

  service.createField('ctaHeading').name('Invitation — heading').type('Symbol').required(false)

  service.createField('ctaBody').name('Invitation — sentence').type('Symbol').required(false)

  // ── siteSettings ───────────────────────────────────────────────────────────
  const siteSettings = migration
    .createContentType('siteSettings')
    .name('Site photos')
    .description(
      'The three photos used across the whole site. There should only ever be one of these — edit it rather than creating a second.',
    )
    .displayField('internalName')

  siteSettings.createField('internalName').name('Label').type('Symbol').required(true)

  imageField(siteSettings, 'heroImageDesktop', {
    label: 'Main photo — laptops',
  })

  imageField(siteSettings, 'heroImageMobile', {
    label: 'Main photo — phones',
  })

  imageField(siteSettings, 'portrait', {
    label: 'Photo of you',
  })
}
