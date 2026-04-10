import Link from 'next/link';
import Image from 'next/image';
import { Badge, ArrowRightIcon } from '@/components/ui';
import type { BadgeVariant } from '@/components/ui';
import PriceTag from './PriceTag';
import { cn } from '@/lib/cn';

export interface ProductCardData {
  slug: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  badges?: BadgeVariant[];
  description?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
  className?: string;
}

const badgeLabels: Partial<Record<BadgeVariant, string>> = {
  bestseller: 'Bestseller',
  nouveau: 'Nouveau',
  'edition-limitee': 'Édition limitée',
  pack: 'Pack',
};

/**
 * Carte produit BISOU — image, badges, nom, prix, CTA "Voir".
 * Server Component par défaut : lien vers `/produits/[slug]`.
 * Le hover est géré en CSS pur (pas besoin de JS).
 */
export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const href = `/produits/${product.slug}`;
  const imgSrc = product.imageUrl || '/product-placeholder.svg';

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-gold/15 bg-card',
        'transition-all duration-bisou ease-bisou',
        'hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover',
        className,
      )}
    >
      <Link href={href} aria-label={`Voir ${product.name}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-black-soft">
          <Image
            src={imgSrc}
            alt={product.imageAlt || product.name}
            fill
            priority={priority}
            sizes="(max-width: 480px) 90vw, (max-width: 1100px) 45vw, 25vw"
            className="object-cover transition-transform duration-[700ms] ease-bisou group-hover:scale-[1.04]"
          />

          {/* Overlay gold on hover */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-bisou"
          />

          {/* Badges */}
          {product.badges && product.badges.length > 0 ? (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.badges.map((b) => (
                <Badge key={b} variant={b}>
                  {badgeLabels[b] ?? b}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {product.category ? (
            <p className="text-[10px] uppercase tracking-[0.18em] text-gold/70 font-sans">
              {product.category}
            </p>
          ) : null}
          <h3 className="font-serif text-xl leading-tight text-cream group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          {product.description ? (
            <p className="text-xs text-grey line-clamp-2 font-sans">{product.description}</p>
          ) : null}

          <div className="mt-auto flex items-end justify-between pt-2">
            <PriceTag price={product.price} size="md" gold />
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-gold/80 group-hover:text-gold font-sans font-semibold">
              Voir <ArrowRightIcon width={14} height={14} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
