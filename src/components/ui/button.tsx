import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Every pill control on the site: hero CTAs, the header's Get in Touch, CTA
 * cards, Load more, the contact submit.
 *
 * Whether it renders `<a>` or `<button>` is decided by the props themselves —
 * a discriminated union on `href` — rather than by a `component` escape hatch,
 * so it is impossible to produce a link with an onClick and no destination, or a
 * submit button with an href.
 */

export type ButtonVariant =
  | 'primary' // filled pink — the main call to action
  | 'secondary' // filled deep pink — header Get in Touch
  | 'outline' // olive outline on cream
  | 'outline-on-dark' // near-white outline over the hero photo or an olive band

export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-pink-600 text-white hover:bg-pink-800',
  secondary: 'bg-pink-700 text-white hover:bg-pink-800',
  outline: 'border-2 border-olive-700 text-olive-700 hover:bg-leaf-100',
  'outline-on-dark': 'border-2 border-near-white text-near-white hover:bg-near-white/15',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-control-sm px-control-x-sm text-ui',
  md: 'min-h-control-md px-control-x-md text-control-md',
  lg: 'min-h-control-lg px-control-x-lg text-control-lg',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-pill font-semibold no-underline transition-colors duration-(--duration-hover) cursor-pointer'

type CommonProps = {
  readonly variant?: ButtonVariant | undefined
  readonly size?: ButtonSize | undefined
  /** Mobile CTAs stack full-width; desktop ones sit inline. */
  readonly block?: boolean | undefined
  readonly className?: string | undefined
  readonly children: ReactNode
}

type LinkProps = CommonProps & {
  readonly href: string
  readonly type?: never
  readonly disabled?: never
  readonly name?: never
  readonly value?: never
}

type ButtonProps = CommonProps & {
  readonly href?: never
  readonly type: 'button' | 'submit'
  readonly disabled?: boolean | undefined
  readonly name?: string | undefined
  readonly value?: string | undefined
  readonly 'aria-label'?: string | undefined
  readonly 'aria-expanded'?: boolean | undefined
  readonly 'aria-controls'?: string | undefined
}

export type PillProps = LinkProps | ButtonProps

export function Button(props: PillProps) {
  const { variant = 'primary', size = 'md', block = false, className, children } = props

  const classes = [
    BASE,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    block ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={props.type}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      aria-label={props['aria-label']}
      aria-expanded={props['aria-expanded']}
      aria-controls={props['aria-controls']}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {children}
    </button>
  )
}
