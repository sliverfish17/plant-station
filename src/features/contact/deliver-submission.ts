import 'server-only'

import { Resend } from 'resend'

import { SITE } from '@/config/site'
import { mailDelivery } from '@/lib/env'

import type { ContactInput } from './schema'

/**
 * The persistence boundary (D5).
 *
 * Every delivery target lives behind this one function. Adding a CRM, a
 * Contentful entry or a spreadsheet row means editing here — the form, the
 * server action and the schema do not change, and none of them learn where a
 * submission ends up.
 */

export type DeliveryResult = { readonly ok: true } | { readonly ok: false; readonly reason: string }

function asPlainText(submission: ContactInput): string {
  return [
    `Name: ${submission.name}`,
    `Email: ${submission.email ?? '—'}`,
    `Phone: ${submission.phone ?? '—'}`,
    '',
    submission.message ?? '(no message)',
  ].join('\n')
}

export async function deliverSubmission(submission: ContactInput): Promise<DeliveryResult> {
  if (mailDelivery.mode !== 'resend') {
    // Development and CI: no credentials, so the submission is logged rather
    // than silently dropped, and the form still exercises its whole path.
    console.info('[contact] submission (no mail transport configured)\n%s', asPlainText(submission))
    return { ok: true }
  }

  const resend = new Resend(mailDelivery.apiKey)

  const { error } = await resend.emails.send({
    from: mailDelivery.from,
    // TODO(D2): the destination is the placeholder address until real contact
    // details are confirmed.
    to: SITE.email,
    subject: `New enquiry from ${submission.name}`,
    text: asPlainText(submission),
    // So a reply goes to the enquirer, not into the sending domain.
    ...(submission.email === undefined ? {} : { replyTo: submission.email }),
  })

  if (error) {
    return { ok: false, reason: error.message }
  }

  return { ok: true }
}
