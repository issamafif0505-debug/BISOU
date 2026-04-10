import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'whatsapp' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  /** Icône optionnelle affichée à gauche du label. */
  icon?: ReactNode;
}

/**
 * Mapping design tokens BISOU.
 * primary : gradient doré sur noir (CTA principaux)
 * secondary : outline doré (CTA secondaires)
 * whatsapp : vert WhatsApp (CTA conversationnels)
 * ghost : texte doré sans fond (liens discrets)
 */
const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gold-gradient text-black hover:shadow-gold-glow-lg hover:-translate-y-0.5 active:translate-y-0 font-semibold',
  secondary:
    'border border-gold/60 text-gold hover:bg-gold/10 hover:border-gold hover:shadow-gold-glow font-medium',
  whatsapp:
    'bg-whatsapp text-white hover:brightness-110 hover:shadow-[0_8px_24px_rgba(37,211,102,0.35)] font-semibold',
  ghost:
    'text-gold hover:text-gold-light underline-offset-4 hover:underline font-medium',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-[10px]',
  md: 'px-6 py-3 text-base rounded-[12px]',
  lg: 'px-8 py-4 text-lg rounded-[14px]',
};

const base =
  'inline-flex items-center justify-center gap-2 font-sans tracking-wide transition-all duration-bisou ease-bisou focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    as?: 'button';
    href?: never;
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    as: 'a';
    href: string;
  };

type ButtonAsLink = CommonProps & {
  as: 'link';
  href: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon,
    children,
    className,
  } = props;

  const classes = cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  );

  const inner = (
    <>
      {icon ? <span aria-hidden="true" className="inline-flex">{icon}</span> : null}
      <span>{children}</span>
    </>
  );

  if (props.as === 'a') {
    const { as: _as, variant: _v, size: _s, fullWidth: _f, icon: _i, children: _c, className: _cn, ...rest } = props;
    return (
      <a className={classes} {...rest}>
        {inner}
      </a>
    );
  }

  if (props.as === 'link') {
    const { href, target, rel } = props;
    return (
      <Link href={href} className={classes} target={target} rel={rel} aria-label={props['aria-label']}>
        {inner}
      </Link>
    );
  }

  const { as: _as, variant: _v, size: _s, fullWidth: _f, icon: _i, children: _c, className: _cn, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {inner}
    </button>
  );
}

export default Button;
