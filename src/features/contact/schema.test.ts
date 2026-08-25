import { describe, expect, it } from 'vitest'

import { contactSchema, toFieldErrors } from './schema'

/**
 * The contact form's one interesting rule: a submission must carry a way to
 * reply. Expressed as a refinement on the whole object rather than as two
 * optional fields, because two optional fields type-check while permitting
 * exactly the submission this form exists to prevent.
 */

const base = {
  name: 'Margaret',
  email: '',
  phone: '',
  message: '',
  website: '',
  turnstileToken: '',
}

function parse(overrides: Partial<Record<string, string>>) {
  return contactSchema.safeParse({ ...base, ...overrides })
}

describe('contactSchema', () => {
  it('accepts a name with an email', () => {
    const result = parse({ email: 'margaret@example.com' })
    expect(result.success).toBe(true)
  })

  it('accepts a name with a phone number', () => {
    const result = parse({ phone: '(248) 555-0142' })
    expect(result.success).toBe(true)
  })

  it('rejects a submission with no way to reply', () => {
    const result = parse({})
    expect(result.success).toBe(false)

    const errors = result.success ? {} : toFieldErrors(result.error.issues)
    expect(errors.contactMethod).toMatch(/email address or a phone number/i)
  })

  it('rejects a missing name', () => {
    const result = parse({ name: '   ', email: 'margaret@example.com' })
    expect(result.success).toBe(false)

    const errors = result.success ? {} : toFieldErrors(result.error.issues)
    expect(errors.name).toBeDefined()
  })

  it('trims whitespace rather than treating it as a value', () => {
    const result = parse({ name: '  Margaret  ', email: '  margaret@example.com  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Margaret')
      expect(result.data.email).toBe('margaret@example.com')
    }
  })

  it('treats an empty optional field as absent, not as an empty string', () => {
    const result = parse({ email: 'margaret@example.com' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phone).toBeUndefined()
      expect(result.data.message).toBeUndefined()
    }
  })

  it('rejects an email that is not one', () => {
    const result = parse({ email: 'margaret at example dot com' })
    expect(result.success).toBe(false)

    const errors = result.success ? {} : toFieldErrors(result.error.issues)
    expect(errors.email).toBeDefined()
  })

  it.each(['(248) 555-0142', '248-555-0142', '+1 248 555 0142', '248.555.0142', '2485550142'])(
    'accepts %s, because people write numbers in many shapes',
    (phone) => {
      // Rejecting a reachable number is a worse failure than accepting an odd one.
      expect(parse({ phone }).success).toBe(true)
    },
  )

  it('rejects a phone field containing letters', () => {
    const result = parse({ phone: 'call me maybe' })
    expect(result.success).toBe(false)
  })

  it('rejects a phone number too short to be one', () => {
    expect(parse({ phone: '12345' }).success).toBe(false)
  })

  it('surfaces the honeypot value so the action can drop the submission', () => {
    const result = parse({ email: 'bot@example.com', website: 'http://spam.example' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.website).toBe('http://spam.example')
  })

  it('caps a very long message rather than accepting unbounded input', () => {
    const result = parse({ email: 'a@b.co', message: 'x'.repeat(4001) })
    expect(result.success).toBe(false)
  })
})

describe('toFieldErrors', () => {
  it('maps each issue to the field that displays it', () => {
    const result = parse({ name: '', email: 'nope' })
    const errors = result.success ? {} : toFieldErrors(result.error.issues)

    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
  })

  it('keeps the first message per field, since later ones are consequences', () => {
    const errors = toFieldErrors([
      { code: 'custom', path: ['name'], message: 'First' },
      { code: 'custom', path: ['name'], message: 'Second' },
    ])

    expect(errors.name).toBe('First')
  })

  it('files an issue with an unrecognised path under the form-level error', () => {
    const errors = toFieldErrors([
      { code: 'custom', path: ['somethingElse'], message: 'Unexpected' },
    ])

    expect(errors.form).toBe('Unexpected')
  })

  it('files an issue with no path under the form-level error', () => {
    const errors = toFieldErrors([{ code: 'custom', path: [], message: 'Whole-form problem' }])
    expect(errors.form).toBe('Whole-form problem')
  })
})
