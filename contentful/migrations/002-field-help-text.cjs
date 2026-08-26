/**
 * Plain-language help text for every field, shown under the input in the entry
 * editor (D14).
 *
 * Separate from 001 on purpose. Interleaving `changeFieldControl` with
 * `createField` makes contentful-migration update and republish the content type
 * around every single field — roughly a hundred extra API calls, and a plan so
 * long the real error scrolls off the top if anything goes wrong. Applying the
 * editor interface in one pass per content type avoids both, and means a failure
 * here cannot leave the content model half-built.
 *
 * Run after 001:
 *   npx contentful-migration@latest --space-id $CONTENTFUL_SPACE_ID \
 *     --environment-id $CONTENTFUL_ENVIRONMENT \
 *     --access-token <content management token> \
 *     contentful/migrations/002-field-help-text.cjs
 *
 * Safe to re-run: it only sets editor interfaces, never content.
 */

/** The editor widget has to match the field type or Contentful rejects it. */
const WIDGET = {
  text: 'singleLine',
  longText: 'multipleLine',
  rich: 'richTextEditor',
  bool: 'boolean',
  number: 'numberEditor',
  date: 'datePicker',
  image: 'assetLinkEditor',
  choice: 'dropdown',
}

const slug = (example) =>
  `The end of the web address: ${example}. Lowercase, words joined by hyphens, no ` +
  'spaces. Once this has been published, changing it breaks any link anyone has already shared.'

const META =
  'Optional. The grey summary under your link in Google results. Up to 155 characters. ' +
  'Leave it empty and the short description is used instead.'

const ORDER =
  'Lower numbers come first. Use 10, 20, 30 rather than 1, 2, 3 — that way you can slot ' +
  'something new in between later without renumbering everything.'

const CTA_HEADING = (where) =>
  `Optional. The bold line in the pink box at the end of ${where} — “Want a border like this?” ` +
  'Leave empty for the standard wording.'

const CTA_BODY =
  'Optional. The line underneath — “A free 15-minute call is the easiest way to start.”'

const CTA_LABEL =
  'Optional. What the button says. Defaults to “Book a Consultation”. Three or four words at most.'

const CAPTION_UNUSED = 'Optional, and not shown at the moment — you can leave this empty.'

/** contentTypeId → fieldId → [widget kind, help text] */
const HELP = {
  plant: {
    commonName: [
      'text',
      'The everyday name — the one you would say out loud. “Black-Eyed Susan ‘Goldsturm’”. ' +
        'Shown as the card heading; long names are fine, the card grows to fit.',
    ],
    latinName: [
      'text',
      'The Latin name, shown in italics underneath. Very long ones fit — this card was designed ' +
        'around “Rudbeckia fulgida var. sullivantii ‘Goldsturm’”.',
    ],
    photo: [
      'image',
      'A photo of the plant. It is shown as a square cropped from the middle, so keep the plant ' +
        'roughly centred.',
    ],
    photoAltText: [
      'text',
      'Describe what is in the photo, for visitors using a screen reader and for Google. ' +
        '“Golden black-eyed Susans in full flower along a sunny border.”',
    ],
    photoCaption: ['text', CAPTION_UNUSED],
    lightTag: [
      'choice',
      'Pick the closest match. The buttons on the Favorite Plants page filter on this, which is ' +
        'why it is a list rather than free text — the Shade button finds both Shade and Part shade.',
    ],
    waterTag: [
      'choice',
      'Pick the closest match. The Low water button finds both Low water and Very low water.',
    ],
    isNative: [
      'bool',
      'Turn on if the plant is native to Michigan. This is what the “Michigan native” button ' +
        'filters on.',
    ],
    featured: [
      'bool',
      'Turn on to include this plant in the short row on the home page. Around five works well. ' +
        'The rest still appear on the Favorite Plants page.',
    ],
    order: ['number', ORDER],
  },

  project: {
    title: [
      'text',
      'What you call this job — “Shade border, reborn”. Used as the card heading and the page title.',
    ],
    slug: ['text', slug('/projects-blog/shade-border-reborn')],
    caption: [
      'text',
      'One to three sentences shown on the card. It will not cut you off mid-sentence — the card ' +
        'grows. The town is added at the end automatically, so no need to repeat it here.',
    ],
    location: [
      'text',
      'Just the town — “Royal Oak”. Shown at the end of the short description, and above the title ' +
        'on the project page.',
    ],
    date: [
      'date',
      'When the work finished. Projects and blog posts share one list, newest first, so this ' +
        'decides where it lands.',
    ],
    summary: [
      'text',
      'Optional. Sits under the heading on the project page — “Completed June 2026 · Design, ' +
        'planting & first-season care”. Leave it empty and the month and year are shown instead.',
    ],
    beforeImage: [
      'image',
      'Optional. With one, the card shows before and after side by side. Without one, the after ' +
        'photo fills the card on its own and still looks right — so do not feel you have to go ' +
        'hunting for an old picture.',
    ],
    beforeImageAltText: [
      'text',
      'Describe the space as it was. “Bare soil and patchy grass under two mature maples.”',
    ],
    beforeImageCaption: [
      'text',
      'Optional. Small text under the photo on the project page — “Bare soil and struggling grass, May.”',
    ],
    afterImage: ['image', 'The finished garden. Required — it is what the card shows.'],
    afterImageAltText: [
      'text',
      'Describe the finished planting. “The same shaded corner filled with layered ferns, ' +
        'hellebores and hostas.”',
    ],
    afterImageCaption: [
      'text',
      'Optional. Small text under the photo on the project page — “The same corner, one season on.”',
    ],
    leadImage: [
      'image',
      'Optional. The wide photo across the top of this project’s own page. Leave it empty and the ' +
        'after photo is used — only add one if you have a nicer shot of the finished garden.',
    ],
    leadImageAltText: ['text', 'Describe the photo.'],
    leadImageCaption: ['text', 'Optional. Small text shown underneath, centred.'],
    body: [
      'rich',
      'Optional. What the space was like, what you did and why, and how it is looked after. ' +
        'Headings and lists are fine. Leave it empty and the page still works — it just shows the ' +
        'photos and the invitation.',
    ],
    metaDescription: ['text', META],
    ctaHeading: ['text', CTA_HEADING('the project page')],
    ctaBody: ['text', CTA_BODY],
    ctaLabel: ['text', CTA_LABEL],
  },

  blogPost: {
    title: [
      'text',
      'The headline — “What to plant in clay soil”. Plain and specific beats clever: this is the ' +
        'line people see in Google.',
    ],
    slug: ['text', slug('/projects-blog/what-to-plant-in-clay-soil')],
    excerpt: [
      'text',
      'One or two sentences shown on the card, before anyone clicks. Give away the useful bit ' +
        'rather than teasing it.',
    ],
    date: ['date', 'Decides where the post sits in the list — newest first.'],
    author: ['text', 'Almost always “Edyta Phillips”. Shown under the title.'],
    readingMinutes: [
      'number',
      'Roughly how long it takes to read — about 200 words a minute, so a 600-word post is 3. ' +
        'It is not worked out for you.',
    ],
    thumbnail: ['image', 'Shown on the card and across the top of the post.'],
    thumbnailAltText: [
      'text',
      'Describe what is in the photo. “A handful of damp grey clay soil held over a newly dug bed.”',
    ],
    thumbnailCaption: ['text', 'Optional. Small text under the photo on the post page.'],
    body: [
      'rich',
      'The article itself. Headings break it up, lists work well for “five plants that…”, and you ' +
        'can drop photos in between paragraphs.',
    ],
    metaDescription: ['text', META],
    ctaHeading: ['text', CTA_HEADING('the post')],
    ctaBody: ['text', CTA_BODY],
    ctaLabel: ['text', CTA_LABEL],
  },

  testimonial: {
    quote: [
      'longText',
      'Their words, as they said them. Do not add quotation marks — those are drawn for you. ' +
        'Two or three sentences reads best.',
    ],
    attribution: [
      'text',
      'First name and last initial — “Margaret K.”. Please check they are happy to be quoted ' +
        'before this goes live.',
    ],
    town: ['text', 'Shown after their name — “Royal Oak”.'],
    order: ['number', ORDER],
  },

  service: {
    name: [
      'text',
      'What this service is called — “Soil Testing”. Shown inside the circle and as the page heading.',
    ],
    slug: [
      'text',
      slug('/services/soil-testing') +
        ' The six services have set addresses already — check docs/CONTENTFUL_SETUP.md rather than ' +
        'inventing new ones.',
    ],
    summary: [
      'text',
      'The sentence inside the circle on the home page. About ten words — “Find out what your ' +
        'soil actually needs before you plant.”',
    ],
    iconKey: [
      'choice',
      'The small drawing inside the circle. There is one for each service — pick whichever suits.',
    ],
    order: ['number', ORDER],
    intro: [
      'longText',
      'The paragraph under the heading on this service’s page. Say what actually happens and what ' +
        'the person ends up with.',
    ],
    body: [
      'rich',
      'Optional. The detail — what happens on the visit, what they get afterwards, what it does ' +
        'not cover. Headings help people skim.',
    ],
    metaTitle: [
      'text',
      'Optional. The blue link text in Google results. Worth naming the area — “Garden Soil ' +
        'Testing in Metro Detroit”. Leave empty and the service name is used.',
    ],
    metaDescription: ['text', META],
    ctaHeading: [
      'text',
      'Optional. The bold line in the pink box at the end of the page — “Not sure what your soil is?”',
    ],
    ctaBody: ['text', 'Optional. The line underneath — “A soil test tells you in a week.”'],
  },

  siteSettings: {
    internalName: [
      'text',
      'Only so this entry has a name in the list — “Site photos” is fine. Not shown anywhere on ' +
        'the website.',
    ],
    heroImageDesktop: [
      'image',
      'The big photo across the top of the home page on laptops and desktops. Landscape, roughly ' +
        'twice as wide as it is tall. Check that you and the flower bed are both in frame.',
    ],
    heroImageDesktopAltText: [
      'text',
      'Describe the photo. “Edyta smiling in a late-summer garden bed of black-eyed Susans and ' +
        'coneflowers.”',
    ],
    heroImageDesktopCaption: ['text', CAPTION_UNUSED],
    heroImageMobile: [
      'image',
      'The same scene as an upright crop, roughly four wide by five tall. A wide photo shrunk ' +
        'onto a phone loses your face, which is why this is separate.',
    ],
    heroImageMobileAltText: [
      'text',
      'Describe the photo — usually the same wording as the laptop version.',
    ],
    heroImageMobileCaption: ['text', CAPTION_UNUSED],
    portrait: [
      'image',
      'The portrait beside “Meet Edyta” on the home page. Upright, roughly four wide by five ' +
        'tall. It is shown inside a soft organic shape, so leave a little room around your head.',
    ],
    portraitAltText: ['text', 'Describe the photo. “Portrait of Edyta Phillips in her garden.”'],
    portraitCaption: ['text', CAPTION_UNUSED],
  },
}

module.exports = function (migration) {
  for (const [contentTypeId, fields] of Object.entries(HELP)) {
    const contentType = migration.editContentType(contentTypeId)

    for (const [fieldId, [kind, helpText]] of Object.entries(fields)) {
      contentType.changeFieldControl(fieldId, 'builtin', WIDGET[kind], { helpText })
    }
  }
}
