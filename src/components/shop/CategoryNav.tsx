import Link from 'next/link';
import { cn } from '@/lib/cn';

interface CategoryNavProps {
  categories: Array<{ slug: string; name: string }>;
  activeSlug?: string;
  className?: string;
}

/**
 * Nav catégories horizontale — utilisée en haut des pages `/collections/*`.
 * Scrollable sur mobile.
 */
export function CategoryNav({ categories, activeSlug, className }: CategoryNavProps) {
  return (
    <nav aria-label="Catégories de produits" className={cn('w-full', className)}>
      <ul className="flex gap-2 overflow-x-auto pb-2 md:justify-center md:overflow-visible scrollbar-thin">
        <li>
          <Link
            href="/collections"
            className={cn(
              'inline-flex whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans transition-colors duration-bisou',
              !activeSlug
                ? 'border-gold text-gold bg-gold/10'
                : 'border-white/10 text-grey hover:border-gold/50 hover:text-cream',
            )}
          >
            Toutes
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/collections/${c.slug}`}
              className={cn(
                'inline-flex whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans transition-colors duration-bisou',
                activeSlug === c.slug
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-white/10 text-grey hover:border-gold/50 hover:text-cream',
              )}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CategoryNav;
