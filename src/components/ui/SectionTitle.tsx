import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  /** Affiche le <em> en gradient doré sur le titre pour effet luxe. */
  gradient?: boolean;
  className?: string;
}

/**
 * Titre de section BISOU — eyebrow uppercase + titre Cormorant Garamond + sous-titre.
 * Inspiré du style `section-header` de `legacy/brand/website-homepage.html`.
 */
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  gradient = false,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14 flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-gold/80 font-sans">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'font-serif font-light text-h1 md:text-display leading-[1.1] text-cream max-w-3xl',
          gradient && 'text-gold-gradient',
        )}
      >
        {title}
      </h2>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-base md:text-lg text-grey leading-relaxed font-sans">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default SectionTitle;
