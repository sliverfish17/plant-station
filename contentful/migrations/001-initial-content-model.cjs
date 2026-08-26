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
 *   1. Every field carries a plain-language label and help text, written for the
 *      person who will actually maintain this site rather than for a developer.
 *      The field *ids* stay technical because the GraphQL queries depend on them;
 *      only what she reads changes. This is the single biggest thing that makes a
 *      CMS usable by its owner, and it is far cheaper to do here than to retrofit
 *      once entries exist (D14).
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

/**
 * The editor widget has to match the field type or Contentful rejects the
 * migration, so the mapping lives here rather than at every call site.
 */
const WIDGET_FOR = {
  Symbol: 'singleLine',
  Text: 'multipleLine',
  RichText: 'richTextEditor',
  Boolean: 'boolean',
  Integer: 'numberEditor',
  Date: 'datePicker',
  Asset: 'assetLinkEditor',
  Dropdown: 'dropdown',
}

/** Sets the help text shown under a field in the entry editor. */
function explain(contentType, fieldId, kind, helpText) {
  contentType.changeFieldControl(fieldId, 'builtin', WIDGET_FOR[kind], { helpText })
}

/** An image field, plus the alt-text and caption that always accompany it. */
function imageField(type, fieldId, { label, help, altHelp, captionHelp, required = true }) {
  type
    .createField(fieldId)
    .name(label)
    .type('Link')
    .linkType('Asset')
    .required(required)
    .validations([{ linkMimetypeGroup: ['image'] }])
  explain(type, fieldId, 'Asset', help)

  type
    .createField(`${fieldId}AltText`)
    .name(`${label} — description`)
    .type('Symbol')
    .required(required)
    .validations([{ size: { max: 160 } }])
  explain(type, `${fieldId}AltText`, 'Symbol', altHelp)

  type
    .createField(`${fieldId}Caption`)
    .name(`${label} — caption`)
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 200 } }])
  explain(type, `${fieldId}Caption`, 'Symbol', captionHelp)
}

/** The invitation card that closes a detail page. */
function ctaFields(type, where) {
  type.createField('ctaHeading').name('Invitation — heading').type('Symbol').required(false)
  explain(
    type,
    'ctaHeading',
    'Symbol',
    `Optional. The bold line in the pink box at the end of ${where} — "Want a border like this?" Leave empty for the standard wording.`,
  )

  type.createField('ctaBody').name('Invitation — sentence').type('Symbol').required(false)
  explain(
    type,
    'ctaBody',
    'Symbol',
    'Optional. The line underneath — "A free 15-minute call is the easiest way to start."',
  )

  type.createField('ctaLabel').name('Invitation — button').type('Symbol').required(false)
  explain(
    type,
    'ctaLabel',
    'Symbol',
    'Optional. What the button says. Defaults to "Book a Consultation". Three or four words at most.',
  )
}

const slugHelp = (example) =>
  `The end of the web address: ${example}. Lowercase, words joined by hyphens, no spaces. ` +
  'Once this has been published, changing it breaks any link anyone has already shared.'

const META_HELP =
  'Optional. The grey summary under your link in Google results. Up to 155 characters. ' +
  'Leave it empty and the short description is used instead.'

const ORDER_HELP =
  'Lower numbers come first. Use 10, 20, 30 rather than 1, 2, 3 — that way you can slot ' +
  'something new in between later without renumbering everything.'

module.exports = function (migration) {
  // ── plant ──────────────────────────────────────────────────────────────────
  const plant = migration
    .createContentType('plant')
    .name('Plant')
    .description('A plant on the Favorite Plants page and in the row on the home page.')
    .displayField('commonName')

  plant.createField('commonName').name('Common name').type('Symbol').required(true)
  explain(
    plant,
    'commonName',
    'Symbol',
    'The everyday name — the one you would say out loud. "Black-Eyed Susan \'Goldsturm\'". Shown as the card heading; long names are fine, the card grows to fit.',
  )

  plant
    .createField('latinName')
    .name('Botanical name')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 120 } }])
  explain(
    plant,
    'latinName',
    'Symbol',
    'The Latin name, shown in italics underneath. Very long ones fit — "Rudbeckia fulgida var. sullivantii \'Goldsturm\'" was the one this card was designed around.',
  )

  imageField(plant, 'photo', {
    label: 'Photo',
    help: 'A photo of the plant. It is shown as a square cropped from the middle, so keep the plant roughly centred.',
    altHelp:
      'Describe what is in the photo, for visitors using a screen reader and for Google. "Golden black-eyed Susans in full flower along a sunny border."',
    captionHelp: 'Optional, and not shown on plant cards at the moment — you can leave this empty.',
  })

  plant
    .createField('lightTag')
    .name('How much sun')
    .type('Symbol')
    .required(true)
    .validations([{ in: LIGHT_TAGS }])
  explain(
    plant,
    'lightTag',
    'Dropdown',
    'Pick the closest match. The buttons on the Favorite Plants page filter on this, which is why it is a list rather than free text — the Shade button finds both Shade and Part shade.',
  )

  plant
    .createField('waterTag')
    .name('How much water')
    .type('Symbol')
    .required(true)
    .validations([{ in: WATER_TAGS }])
  explain(
    plant,
    'waterTag',
    'Dropdown',
    'Pick the closest match. The Low water button finds both Low water and Very low water.',
  )

  plant.createField('isNative').name('Michigan native').type('Boolean').required(true)
  explain(
    plant,
    'isNative',
    'Boolean',
    'Turn on if the plant is native to Michigan. This is what the "Michigan native" button filters on.',
  )

  plant.createField('featured').name('Show on the home page').type('Boolean').required(true)
  explain(
    plant,
    'featured',
    'Boolean',
    'Turn on to include this plant in the short row on the home page. Around five works well. The rest still appear on the Favorite Plants page.',
  )

  plant
    .createField('order')
    .name('Position')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])
  explain(plant, 'order', 'Integer', ORDER_HELP)

  // ── project ────────────────────────────────────────────────────────────────
  const project = migration
    .createContentType('project')
    .name('Project')
    .description('A garden you have worked on. Appears as a card and gets its own page.')
    .displayField('title')

  project.createField('title').name('Project name').type('Symbol').required(true)
  explain(
    project,
    'title',
    'Symbol',
    'What you call this job — "Shade border, reborn". Used as the card heading and the page title.',
  )

  project
    .createField('slug')
    .name('Web address')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])
  explain(project, 'slug', 'Symbol', slugHelp('/projects-blog/shade-border-reborn'))

  project
    .createField('caption')
    .name('Short description')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 240 } }])
  explain(
    project,
    'caption',
    'Symbol',
    'One to three sentences shown on the card. It will not cut you off mid-sentence — the card grows. The town is added at the end automatically, so no need to repeat it here.',
  )

  project.createField('location').name('Town').type('Symbol').required(true)
  explain(
    project,
    'location',
    'Symbol',
    'Just the town — "Royal Oak". Shown at the end of the short description, and above the title on the project page.',
  )

  project.createField('date').name('Date completed').type('Date').required(true)
  explain(
    project,
    'date',
    'Date',
    'When the work finished. Projects and blog posts share one list, newest first, so this decides where it lands.',
  )

  project
    .createField('summary')
    .name('Line under the title')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 160 } }])
  explain(
    project,
    'summary',
    'Symbol',
    'Optional. Sits under the heading on the project page — "Completed June 2026 · Design, planting & first-season care". Leave it empty and the month and year are shown instead.',
  )

  imageField(project, 'beforeImage', {
    label: 'Before photo',
    required: false,
    help: 'Optional. With one, the card shows before and after side by side. Without one, the after photo fills the card on its own and still looks right — so do not feel you have to go hunting for an old picture.',
    altHelp: 'Describe the space as it was. "Bare soil and patchy grass under two mature maples."',
    captionHelp:
      'Optional. Small text under the photo on the project page — "Bare soil and struggling grass, May."',
  })

  imageField(project, 'afterImage', {
    label: 'After photo',
    help: 'The finished garden. This one is required — it is what the card shows.',
    altHelp:
      'Describe the finished planting. "The same shaded corner filled with layered ferns, hellebores and hostas."',
    captionHelp:
      'Optional. Small text under the photo on the project page — "The same corner, one season on."',
  })

  imageField(project, 'leadImage', {
    label: 'Main photo for the project page',
    required: false,
    help: "Optional. The wide photo across the top of this project's own page. Leave it empty and the after photo is used — only add one if you have a nicer shot of the finished garden.",
    altHelp: 'Describe the photo.',
    captionHelp: 'Optional. Small text shown underneath, centred.',
  })

  project.createField('body').name('The story').type('RichText').required(false)
  explain(
    project,
    'body',
    'RichText',
    'Optional. What the space was like, what you did and why, and how it is looked after. Headings and lists are fine. Leave it empty and the page still works — it just shows the photos and the invitation.',
  )

  project
    .createField('metaDescription')
    .name('Google description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])
  explain(project, 'metaDescription', 'Symbol', META_HELP)

  ctaFields(project, 'the project page')

  // ── blogPost ───────────────────────────────────────────────────────────────
  const blogPost = migration
    .createContentType('blogPost')
    .name('Blog post')
    .description('A written piece. Appears in the same list as projects, newest first.')
    .displayField('title')

  blogPost.createField('title').name('Title').type('Symbol').required(true)
  explain(
    blogPost,
    'title',
    'Symbol',
    'The headline — "What to plant in clay soil". Plain and specific beats clever: this is the line people see in Google.',
  )

  blogPost
    .createField('slug')
    .name('Web address')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])
  explain(blogPost, 'slug', 'Symbol', slugHelp('/projects-blog/what-to-plant-in-clay-soil'))

  blogPost
    .createField('excerpt')
    .name('Preview sentence')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 240 } }])
  explain(
    blogPost,
    'excerpt',
    'Symbol',
    'One or two sentences shown on the card, before anyone clicks. Give away the useful bit rather than teasing it.',
  )

  blogPost.createField('date').name('Date published').type('Date').required(true)
  explain(blogPost, 'date', 'Date', 'Decides where the post sits in the list — newest first.')

  blogPost.createField('author').name('Written by').type('Symbol').required(true)
  explain(blogPost, 'author', 'Symbol', 'Almost always "Edyta Phillips". Shown under the title.')

  blogPost
    .createField('readingMinutes')
    .name('Read time in minutes')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 1, max: 60 } }])
  explain(
    blogPost,
    'readingMinutes',
    'Integer',
    'Roughly how long it takes to read — about 200 words a minute, so a 600-word post is 3. It is not worked out for you.',
  )

  imageField(blogPost, 'thumbnail', {
    label: 'Photo',
    help: 'Shown on the card and across the top of the post.',
    altHelp:
      'Describe what is in the photo. "A handful of damp grey clay soil held over a newly dug bed."',
    captionHelp: 'Optional. Small text under the photo on the post page.',
  })

  blogPost.createField('body').name('The post').type('RichText').required(true)
  explain(
    blogPost,
    'body',
    'RichText',
    'The article itself. Headings break it up, lists work well for "five plants that…", and you can drop photos in between paragraphs.',
  )

  blogPost
    .createField('metaDescription')
    .name('Google description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])
  explain(blogPost, 'metaDescription', 'Symbol', META_HELP)

  ctaFields(blogPost, 'the post')

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
  explain(
    testimonial,
    'quote',
    'Text',
    'Their words, as they said them. Do not add quotation marks — those are drawn for you. Two or three sentences reads best.',
  )

  testimonial.createField('attribution').name('Who said it').type('Symbol').required(true)
  explain(
    testimonial,
    'attribution',
    'Symbol',
    'First name and last initial — "Margaret K.". Please check they are happy to be quoted before this goes live.',
  )

  testimonial.createField('town').name('Their town').type('Symbol').required(true)
  explain(testimonial, 'town', 'Symbol', 'Shown after their name — "Royal Oak".')

  testimonial
    .createField('order')
    .name('Position')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])
  explain(testimonial, 'order', 'Integer', ORDER_HELP)

  // ── service (D0 — six real pages, not anchors) ─────────────────────────────
  const service = migration
    .createContentType('service')
    .name('Service')
    .description(
      'One of the six things you offer. Shows as a circle on the home page and has a page of its own.',
    )
    .displayField('name')

  service.createField('name').name('Service name').type('Symbol').required(true)
  explain(
    service,
    'name',
    'Symbol',
    'What this service is called — "Soil Testing". Shown inside the circle and as the page heading.',
  )

  service
    .createField('slug')
    .name('Web address')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }])
  explain(
    service,
    'slug',
    'Symbol',
    `${slugHelp('/services/soil-testing')} The six services have set addresses already — check docs/CONTENTFUL_SETUP.md rather than inventing new ones.`,
  )

  service
    .createField('summary')
    .name('One-line description')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 120 } }])
  explain(
    service,
    'summary',
    'Symbol',
    'The sentence inside the circle on the home page. About ten words — "Find out what your soil actually needs before you plant."',
  )

  service
    .createField('iconKey')
    .name('Icon')
    .type('Symbol')
    .required(true)
    .validations([{ in: SERVICE_ICONS }])
  explain(
    service,
    'iconKey',
    'Dropdown',
    'The small drawing inside the circle. There is one for each service — pick whichever suits.',
  )

  service
    .createField('order')
    .name('Position')
    .type('Integer')
    .required(true)
    .validations([{ range: { min: 0 } }])
  explain(service, 'order', 'Integer', ORDER_HELP)

  service
    .createField('intro')
    .name('Opening paragraph')
    .type('Text')
    .required(true)
    .validations([{ size: { max: 400 } }])
  explain(
    service,
    'intro',
    'Text',
    "The paragraph under the heading on this service's page. Say what actually happens and what the person ends up with.",
  )

  service.createField('body').name('Full description').type('RichText').required(false)
  explain(
    service,
    'body',
    'RichText',
    'Optional. The detail — what happens on the visit, what they get afterwards, what it does not cover. Headings help people skim.',
  )

  service
    .createField('metaTitle')
    .name('Google title')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 70 } }])
  explain(
    service,
    'metaTitle',
    'Symbol',
    'Optional. The blue link text in Google results. Worth naming the area — "Garden Soil Testing in Metro Detroit". Leave empty and the service name is used.',
  )

  service
    .createField('metaDescription')
    .name('Google description')
    .type('Symbol')
    .required(false)
    .validations([{ size: { max: 155 } }])
  explain(service, 'metaDescription', 'Symbol', META_HELP)

  service.createField('ctaHeading').name('Invitation — heading').type('Symbol').required(false)
  explain(
    service,
    'ctaHeading',
    'Symbol',
    'Optional. The bold line in the pink box at the end of the page — "Not sure what your soil is?"',
  )

  service.createField('ctaBody').name('Invitation — sentence').type('Symbol').required(false)
  explain(
    service,
    'ctaBody',
    'Symbol',
    'Optional. The line underneath — "A soil test tells you in a week."',
  )

  // ── siteSettings ───────────────────────────────────────────────────────────
  const siteSettings = migration
    .createContentType('siteSettings')
    .name('Site photos')
    .description(
      'The three photos used across the whole site. There should only ever be one of these — edit it rather than creating a second.',
    )
    .displayField('internalName')

  siteSettings.createField('internalName').name('Label').type('Symbol').required(true)
  explain(
    siteSettings,
    'internalName',
    'Symbol',
    'Only so this entry has a name in the list — "Site photos" is fine. Not shown anywhere on the website.',
  )

  imageField(siteSettings, 'heroImageDesktop', {
    label: 'Main photo — laptops',
    help: 'The big photo across the top of the home page on laptops and desktops. Landscape, roughly twice as wide as it is tall. Check that you and the flower bed are both in frame.',
    altHelp:
      'Describe the photo. "Edyta smiling in a late-summer garden bed of black-eyed Susans and coneflowers."',
    captionHelp: 'Optional, and not shown on the home page — you can leave this empty.',
  })

  imageField(siteSettings, 'heroImageMobile', {
    label: 'Main photo — phones',
    help: 'The same scene as an upright crop, roughly four wide by five tall. A wide photo shrunk onto a phone loses your face, which is why this is separate.',
    altHelp: 'Describe the photo — usually the same wording as the laptop version.',
    captionHelp: 'Optional, and not shown — you can leave this empty.',
  })

  imageField(siteSettings, 'portrait', {
    label: 'Photo of you',
    help: 'The portrait beside "Meet Edyta" on the home page. Upright, roughly four wide by five tall. It is shown inside a soft organic shape, so leave a little room around your head.',
    altHelp: 'Describe the photo. "Portrait of Edyta Phillips in her garden."',
    captionHelp: 'Optional, and not shown — you can leave this empty.',
  })
}
