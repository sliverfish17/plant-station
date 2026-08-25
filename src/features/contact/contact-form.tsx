'use client'

import { useActionState, useId } from 'react'

import { Button } from '@/components/ui/button'

import { submitContact } from './actions'
import { IDLE_STATE, type ContactState, type FieldErrors } from './schema'

/**
 * Client island 4 of 4: the contact form.
 *
 * `useActionState` wraps the Server Action rather than replacing it — the
 * `<form action>` is the action itself, so a browser with JavaScript disabled
 * posts and gets a rendered response. Enhancement adds the pending state and
 * keeps the page from reloading; it is not what makes the form work.
 *
 * Errors are textual and attached to their field with `aria-describedby`, never
 * signalled by colour alone.
 */

export function ContactForm({ turnstileSiteKey }: { readonly turnstileSiteKey?: string }) {
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    IDLE_STATE,
  )

  const ids = useFieldIds()

  if (state.status === 'success') {
    return (
      <div
        // Focusable so that after a JavaScript submit the confirmation can be
        // reached and announced, rather than replacing the form in silence.
        tabIndex={-1}
        role="status"
        className="rounded-card bg-cream-page p-6 lg:p-8"
      >
        <h3 className="font-serif text-cta-heading text-olive-700">
          Thank you — that&rsquo;s sent.
        </h3>
        <p className="mt-2 text-body leading-normal text-espresso">
          I read every message myself and usually reply within a day or two. If it&rsquo;s urgent,
          calling is faster.
        </p>
      </div>
    )
  }

  const errors: FieldErrors = state.status === 'error' ? state.errors : {}
  const values = state.status === 'error' ? state.values : {}
  const hasErrors = Object.keys(errors).length > 0

  return (
    <form action={formAction} noValidate className="grid gap-4 sm:grid-cols-2">
      {hasErrors ? (
        <div
          role="alert"
          tabIndex={-1}
          className="rounded-input border-2 border-pink-300 bg-pink-100 p-4 sm:col-span-2"
        >
          <p className="text-body-sm font-semibold text-pink-800">
            Please check the form —{' '}
            {Object.keys(errors).length === 1 ? 'one field needs' : 'some fields need'} your
            attention.
          </p>
          <ul className="mt-2 list-disc pl-5 text-body-sm text-espresso">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Field
        id={ids.name}
        name="name"
        label="Name"
        required
        autoComplete="name"
        error={errors.name}
        defaultValue={values.name}
      />
      <Field
        id={ids.email}
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        error={errors.email ?? errors.contactMethod}
        defaultValue={values.email}
      />
      <Field
        id={ids.phone}
        name="phone"
        type="tel"
        label="Phone"
        autoComplete="tel"
        className="sm:col-span-2"
        error={errors.phone}
        defaultValue={values.phone}
      />

      <div className="sm:col-span-2">
        <label htmlFor={ids.message} className="block text-body-sm font-semibold text-near-white">
          Tell me about your space
        </label>
        <textarea
          id={ids.message}
          name="message"
          rows={5}
          defaultValue={values.message}
          aria-invalid={errors.message === undefined ? undefined : true}
          aria-describedby={errors.message === undefined ? undefined : `${ids.message}-error`}
          className="mt-1.5 w-full rounded-input border border-sage-500 bg-cream-page px-4 py-3.5 text-body leading-normal text-espresso"
        />
        {errors.message === undefined ? null : (
          <FieldError id={`${ids.message}-error`}>{errors.message}</FieldError>
        )}
      </div>

      {/* Honeypot: off-screen rather than display:none, so a bot filling every
          visible field still finds it, and labelled + aria-hidden so no real
          user or screen reader is ever offered it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={ids.website}>Leave this field empty</label>
        <input id={ids.website} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey === undefined ? null : (
        <div className="cf-turnstile sm:col-span-2" data-sitekey={turnstileSiteKey} />
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" block disabled={isPending}>
          {isPending ? 'Sending…' : 'Send My Request'}
        </Button>
      </div>
    </form>
  )
}

function useFieldIds() {
  const prefix = useId()
  return {
    name: `${prefix}-name`,
    email: `${prefix}-email`,
    phone: `${prefix}-phone`,
    message: `${prefix}-message`,
    website: `${prefix}-website`,
  }
}

function Field({
  id,
  name,
  label,
  type = 'text',
  required = false,
  autoComplete,
  className,
  error,
  defaultValue,
}: {
  readonly id: string
  readonly name: string
  readonly label: string
  readonly type?: 'text' | 'email' | 'tel'
  readonly required?: boolean
  readonly autoComplete?: string
  readonly className?: string
  readonly error?: string | undefined
  readonly defaultValue?: string | undefined
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-body-sm font-semibold text-near-white">
        {label}
        {required ? (
          <>
            {' '}
            <span className="text-pink-on-dark">(required)</span>
          </>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error === undefined ? undefined : true}
        aria-describedby={error === undefined ? undefined : `${id}-error`}
        className="mt-1.5 h-input w-full rounded-input border border-sage-500 bg-cream-page px-4 text-body text-espresso"
      />
      {error === undefined ? null : <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

function FieldError({ id, children }: { readonly id: string; readonly children: string }) {
  return (
    <p id={id} className="mt-1.5 text-body-sm font-semibold text-pink-on-dark">
      {children}
    </p>
  )
}
