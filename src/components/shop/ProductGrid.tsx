import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import ProductCard, { type ProductCardData } from './ProductCard';

interface ProductGridProps {
  products: ProductCardData[];
  columns?: 2 | 3 | 4;
  className?: string;
  emptyState?: ReactNode;
  priorityCount?: number;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

/**
 * Grille responsive de `ProductCard`.
 * `priorityCount` : nombre de cartes avec `priority` (LCP optimisation).
 */
export function ProductGrid({
  products,
  columns = 4,
  className,
  emptyState,
  priorityCount = 2,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border border-gold/15 bg-card p-12 text-center">
        {emptyState ?? (
          <p className="text-grey font-sans">Aucun produit à afficher pour le moment.</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6 md:gap-8', columnClasses[columns], className)}>
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}

export default ProductGrid;
