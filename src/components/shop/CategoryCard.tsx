import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface CategoryCardData {
  slug: string;
  name: string;
  description?: string;
  productCount?: number;
  /** Nom d'icône ou SVG personnalisé — fallback à un cercle doré. */
  icon?: React.ReactNode;
}

interface CategoryCardProps {
  category: CategoryCardData;
  className?: string;
}

/**
 * Carte catégorie — utilisée sur la homepage et `/collections`.
 * Effet gold border + scale au hover.
 */
export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/collections/${category.slug}`}
      className={cn(
        'group relative flex flex-col items-start gap-4 overflow-hidden rounded-lg border border-gold/15',
        'bg-gradient-to-br from-card to-black p-8 min-h-[220px]',
        'transition-all duration-bisou ease-bisou',
        'hover:border-gold/55 hover:shadow-card-hover hover:-translate-y-1',
        className,
      )}
    >
      {/* Glow spot */}
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-bisou"
      />

      <div className="text-gold">
        {category.icon ?? (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="18" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.7" />
          </svg>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-serif text-2xl text-cream group-hover:text-gold-gradient transition-colors">
          {category.name}
        </h3>
        {category.description ? (
          <p className="text-sm text-grey leading-relaxed font-sans line-clamp-2">
            {category.description}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between w-full pt-2 border-t border-gold/10">
        {typeof category.productCount === 'number' ? (
          <span className="text-xs uppercase tracking-wider text-grey font-sans">
            {category.productCount} pièce{category.productCount > 1 ? 's' : ''}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-gold font-sans font-semibold">
          Voir <ArrowRightIcon width={14} height={14} />
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;
