/**
 * <ProductRecap />
 * ----------------
 * Summary card displayed at the top of the checkout page showing the
 * product being ordered (name, price, optional thumbnail).
 *
 * Pure presentational server component — no client JS needed.
 */

import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

export interface ProductRecapData {
  name: string;
  price: number;
  imageUrl?: string | null;
  badge?: string;
}

export function ProductRecap({
  product,
  children,
}: {
  product: ProductRecapData;
  children?: ReactNode;
}) {
  return (
    <Card
      padding="none"
      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6"
    >
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-20 w-20 flex-shrink-0 rounded-[10px] border border-gold/20 object-cover"
          loading="eager"
        />
      ) : (
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[10px] border border-gold/20 bg-black-soft text-gold">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2l2.39 4.84L20 8l-4 3.9.94 5.5L12 15l-4.94 2.4L8 11.9 4 8l5.61-1.16L12 2z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold/70">
          Votre commande
        </p>
        <h2 className="font-serif text-xl text-cream">{product.name}</h2>
        {product.badge ? (
          <p className="text-xs text-gold/80">{product.badge}</p>
        ) : null}
      </div>

      <div className="text-right">
        <p className="text-[10px] uppercase tracking-[0.18em] text-grey">Total</p>
        <p className="font-serif text-2xl text-gold">{product.price} MAD</p>
        <p className="text-[10px] text-grey">Paiement à la livraison</p>
      </div>

      {children}
    </Card>
  );
}

export default ProductRecap;
