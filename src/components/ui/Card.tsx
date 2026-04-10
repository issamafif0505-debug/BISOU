import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Active le hover doré (léger lift + glow). */
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Conteneur sombre BISOU — fond `#111`, bordure gold doux.
 * Utilisé par les cartes produit, catégorie, témoignage, feature.
 */
export function Card({
  children,
  interactive = false,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-gold/15 bg-card',
        'shadow-card',
        interactive &&
          'transition-all duration-bisou ease-bisou hover:-translate-y-1 hover:border-gold/45 hover:shadow-card-hover',
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
