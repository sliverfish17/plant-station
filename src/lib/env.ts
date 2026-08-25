import { z } from 'zod'

/**
 * Environment access, validated once and never read raw again.
 *
 * The shape is a discriminated union rather than a bag of optional strings: a
 * caller cannot reach for a Contentful token without first proving the CMS is
 * configured. That is what lets the app build and run — with the seed content
 * transcribed from the design file — before a space exists, and switch to live
 * content by adding credentials and nothing else.
 */

const optionalString = z
  .string()
  .trim()
  .min(1)
  .optional()
  .catch(undefined)
  // Vercel and .env files both surface an unset variable as an empty string.
  .transform((value) => (value === '' ? undefined : value))

const rawEnv = z
  .object({
    CONTENTFUL_SPACE_ID: optionalString,
    CONTENTFUL_ENVIRONMENT: z.string().trim().min(1).catch('master'),
    CONTENTFUL_DELIVERY_TOKEN: optionalString,
    CONTENTFUL_PREVIEW_TOKEN: optionalString,
    CONTENTFUL_REVALIDATE_SECRET: optionalString,
    CONTENTFUL_PREVIEW_SECRET: optionalString,

    RESEND_API_KEY: optionalString,
    RESEND_FROM_EMAIL: optionalString,

    TURNSTILE_SECRET_KEY: optionalString,
  })
  .parse({
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_DELIVERY_TOKEN: process.env.CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_PREVIEW_TOKEN: process.env.CONTENTFUL_PREVIEW_TOKEN,
    CONTENTFUL_REVALIDATE_SECRET: process.env.CONTENTFUL_REVALIDATE_SECRET,
    CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  })

/** Where content comes from. `fixtures` is the seed content from the design file. */
export type ContentSource =
  | {
      readonly mode: 'live'
      readonly spaceId: string
      readonly environment: string
      readonly deliveryToken: string
      readonly previewToken: string | undefined
      readonly revalidateSecret: string | undefined
      readonly previewSecret: string | undefined
    }
  | { readonly mode: 'fixtures'; readonly reason: string }

function resolveContentSource(): ContentSource {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN } = rawEnv

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_DELIVERY_TOKEN) {
    return {
      mode: 'fixtures',
      reason: 'CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN are not both set',
    }
  }

  return {
    mode: 'live',
    spaceId: CONTENTFUL_SPACE_ID,
    environment: rawEnv.CONTENTFUL_ENVIRONMENT,
    deliveryToken: CONTENTFUL_DELIVERY_TOKEN,
    previewToken: rawEnv.CONTENTFUL_PREVIEW_TOKEN,
    revalidateSecret: rawEnv.CONTENTFUL_REVALIDATE_SECRET,
    previewSecret: rawEnv.CONTENTFUL_PREVIEW_SECRET,
  }
}

export const contentSource: ContentSource = resolveContentSource()

/** TODO(D5): the delivery target — a store can be added alongside it. */
export type MailDelivery =
  | { readonly mode: 'resend'; readonly apiKey: string; readonly from: string }
  | { readonly mode: 'log'; readonly reason: string }

function resolveMailDelivery(): MailDelivery {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = rawEnv

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return { mode: 'log', reason: 'RESEND_API_KEY and RESEND_FROM_EMAIL are not both set' }
  }

  return { mode: 'resend', apiKey: RESEND_API_KEY, from: RESEND_FROM_EMAIL }
}

export const mailDelivery: MailDelivery = resolveMailDelivery()

/**
 * TODO(D7): with no keys configured the widget is not rendered and verification
 * is skipped, so the JavaScript-free submission path keeps working in dev and CI.
 */
export type TurnstileConfig =
  | { readonly mode: 'enabled'; readonly siteKey: string; readonly secretKey: string }
  | { readonly mode: 'disabled' }

function resolveTurnstile(): TurnstileConfig {
  // NEXT_PUBLIC_* must be referenced statically for the value to be inlined.
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const secretKey = rawEnv.TURNSTILE_SECRET_KEY

  if (!siteKey || !secretKey) return { mode: 'disabled' }
  return { mode: 'enabled', siteKey, secretKey }
}

export const turnstile: TurnstileConfig = resolveTurnstile()
