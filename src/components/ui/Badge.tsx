import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'bestseller' | 'nouveau' | 'edition-limitee' | 'pack' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  bestseller: 'bg-gold text-black shadow-gold-glow',
  nouveau: 'bg-rose text-black',
  'edition-limitee': 'bg-black-soft text-gold border border-gold/60',
  pack: 'bg-status-blue/20 text-status-blue border border-status-blue/40',
  neutral: 'bg-black-soft text-cream border border-white/10',
};

const variantLabels: Partial<Record<BadgeVariant, string>> = {
  bestseller: 'Bestseller',
  nouveau: 'Nouveau',
  'edition-limitee': 'Édition limitée',
  pack: 'Pack',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] font-sans',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Helper — affiche un badge pré-formaté selon la variante. */
export function BadgeFromValue({ value }: { value: BadgeVariant }) {
  return <Badge variant={value}>{variantLabels[value] ?? value}</Badge>;
}

export default Badge;
