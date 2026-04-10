import { cn } from '@/lib/cn';

interface PriceTagProps {
  price: number;
  /** Prix barré avant remise. */
  compareAt?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  currency?: string;
  className?: string;
  gold?: boolean;
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl md:text-4xl',
};

const currencySizeClasses = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
};

/**
 * Affichage prix BISOU — nombre + devise en petit uppercase.
 * Exemples : "229 MAD" · "349 MAD" avec option prix barré.
 */
export function PriceTag({
  price,
  compareAt,
  size = 'md',
  currency = 'MAD',
  className,
  gold = false,
}: PriceTagProps) {
  return (
    <div className={cn('flex items-baseline gap-2 font-sans', className)}>
      <span
        className={cn(
          'font-semibold tabular-nums',
          sizeClasses[size],
          gold ? 'text-gold-gradient' : 'text-cream',
        )}
      >
        {price.toLocaleString('fr-FR')}
      </span>
      <span
        className={cn(
          'uppercase tracking-[0.18em] text-gold/80 font-medium',
          currencySizeClasses[size],
        )}
      >
        {currency}
      </span>
      {compareAt && compareAt > price ? (
        <span className="ml-1 text-xs text-grey line-through">
          {compareAt.toLocaleString('fr-FR')} {currency}
        </span>
      ) : null}
    </div>
  );
}

export default PriceTag;
