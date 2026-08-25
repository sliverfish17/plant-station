import { z } from 'zod'

/**
 * The contact form's contract.
 *
 * "Name, plus at least one of email or phone" is expressed as a refinement on
 * the whole object rather than as two independently optional fields. Two
 * optional fields would type-check while permitting a submission with no way to
 * reply — the exact failure this form exists to prevent — and would have nowhere
 * to attach the error message.
 */

const trimmed = z.string().trim()

/** Empty strings arrive from unfilled inputs; treat them as absent. */
const optionalText = trimmed.transform((value) => (value === '' ? undefined : value)).optional()

export const contactSchema = z
  .object({
    name: trimmed.min(1, 'Please tell me your name.').max(120, 'That name is too long.'),

    email: optionalText.pipe(
      z.email('That email address does not look right.').max(254).optional(),
    ),

    phone: optionalText.pipe(
      trimmed
        .min(7, 'That phone number looks too short.')
        .max(30, 'That phone number looks too long.')
        // Deliberately permissive: people write numbers in many shapes, and
        // rejecting a reachable number is a worse failure than accepting an odd one.
        .regex(/^[\d\s()+.\-–—]+$/u, 'Please use digits, spaces and ( ) + - only.')
        .optional(),
    ),

    message: optionalText.pipe(trimmed.max(4000, 'That message is a little too long.').optional()),

    /** Bot bait. A real person never sees this field, so a value means a bot. */
    website: optionalText,

    /** Turnstile token, absent when JavaScript is off (D7). */
    turnstileToken: optionalText,
  })
  .refine((values) => values.email !== undefined || values.phone !== undefined, {
    message: 'Please add an email address or a phone number so I can reply.',
    path: ['contactMethod'],
  })

export type ContactInput = z.infer<typeof contactSchema>

/** Fields an error can be attached to, including the cross-field one. */
export const ERROR_FIELDS = ['name', 'email', 'phone', 'message', 'contactMethod', 'form'] as const

export type ErrorField = (typeof ERROR_FIELDS)[number]

export type FieldErrors = Partial<Record<ErrorField, string>>

/**
 * The state a `<form action>` renders from. A discriminated union rather than a
 * bag of optionals: "submitted successfully" and "has errors" are different
 * states, and the form should not be able to represent both at once.
 */
export type ContactState =
  | { readonly status: 'idle' }
  | {
      readonly status: 'error'
      readonly errors: FieldErrors
      /** Echoed back so a no-JavaScript submission does not empty the form. */
      readonly values: Readonly<Record<string, string>>
    }
  | { readonly status: 'success' }

export const IDLE_STATE: ContactState = { status: 'idle' }

/** Maps a Zod issue path onto the field that displays it. */
export function toFieldErrors(issues: readonly z.core.$ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {}

  for (const issue of issues) {
    const [first] = issue.path
    const field = typeof first === 'string' ? first : 'form'
    const known = ERROR_FIELDS.find((candidate) => candidate === field) ?? 'form'
    // First message per field wins; later ones are usually consequences.
    errors[known] ??= issue.message
  }

  return errors
}
