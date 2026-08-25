'use server'

import { deliverSubmission } from './deliver-submission'
import { contactSchema, toFieldErrors, type ContactState } from './schema'
import { verifyTurnstile } from './verify-turnstile'

/**
 * The contact Server Action.
 *
 * It is the form's `action` directly, so a browser with JavaScript disabled
 * posts to it and gets a rendered response — the progressive enhancement is that
 * React intercepts the submit when it can, not that the form only works when it
 * does.
 */

/** Fields echoed back on error. The honeypot and token are deliberately not. */
const ECHOED_FIELDS = ['name', 'email', 'phone', 'message'] as const

function readString(data: FormData, key: string): string {
  const value = data.get(key)
  return typeof value === 'string' ? value : ''
}

function echo(data: FormData): Record<string, string> {
  const values: Record<string, string> = {}
  for (const field of ECHOED_FIELDS) values[field] = readString(data, field)
  return values
}

export async function submitContact(
  _previous: ContactState,
  data: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: readString(data, 'name'),
    email: readString(data, 'email'),
    phone: readString(data, 'phone'),
    message: readString(data, 'message'),
    website: readString(data, 'website'),
    turnstileToken: readString(data, 'cf-turnstile-response'),
  })

  if (!parsed.success) {
    return { status: 'error', errors: toFieldErrors(parsed.error.issues), values: echo(data) }
  }

  // A filled honeypot means a bot filled every field it could see. Report
  // success: telling a bot which signal caught it only helps it next time.
  if (parsed.data.website !== undefined) {
    return { status: 'success' }
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken))) {
    return {
      status: 'error',
      errors: { form: 'That submission could not be verified. Please try again.' },
      values: echo(data),
    }
  }

  const delivery = await deliverSubmission(parsed.data)

  if (!delivery.ok) {
    console.error('[contact] delivery failed: %s', delivery.reason)
    return {
      status: 'error',
      errors: {
        // The visitor cannot act on a transport error, so they get the fallback
        // that always works: the phone number and address beside the form.
        form: 'Something went wrong sending your message. Please call or email me instead.',
      },
      values: echo(data),
    }
  }

  return { status: 'success' }
}
