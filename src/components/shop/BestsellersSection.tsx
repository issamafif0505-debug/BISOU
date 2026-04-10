import Link from 'next/link';
import { Container, SectionTitle, ArrowRightIcon } from '@/components/ui';
import ProductGrid from './ProductGrid';
import type { ProductCardData } from './ProductCard';

interface BestsellersSectionProps {
  products: ProductCardData[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  ctaHref?: string;
}

/**
 * Section "Bestsellers" — titre + grid 4 produits + CTA "Voir toute la collection".
 * Server Component. Prend les produits en prop (fetchés par la page parente).
 */
export function BestsellersSection({
  products,
  title = 'Bestsellers',
  eyebrow = 'Nos pièces favorites',
  subtitle = "Les bijoux que nos clientes marocaines adorent le plus. Livrés partout au royaume, payables à la réception.",
  ctaHref = '/collections',
}: BestsellersSectionProps) {
  return (
    <section className="relative py-20 md:py-28 bg-black">
      <Container>
        <SectionTitle
          eyebrow={eyebrow}
          title={
            <>
              Nos <em className="not-italic text-gold-gradient italic">{title}</em>
            </>
          }
          subtitle={subtitle}
          gradient={false}
        />

        <ProductGrid products={products.slice(0, 4)} columns={4} priorityCount={4} />

        <div className="mt-14 flex justify-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-8 py-3 border border-gold/60 text-gold rounded-[12px] text-sm uppercase tracking-[0.18em] font-sans font-medium hover:bg-gold/10 hover:border-gold transition-all duration-bisou ease-bisou hover:shadow-gold-glow"
          >
            Voir toute la collection
            <ArrowRightIcon />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default BestsellersSection;
