import { getPayloadClient } from '@/lib/payload';
import { Container, SectionTitle, Card } from '@/components/ui';

interface Testimonial {
  name: string;
  city?: string;
  quote: string;
  rating?: number;
  verified?: boolean;
}

/**
 * Fallback hard-codé — utilisé quand la collection Reviews est vide
 * ou que Payload n'est pas disponible lors du build.
 * À terme, ces témoignages sont gérés depuis l'admin Payload.
 */
const DEFAULTS: Testimonial[] = [
  {
    name: 'Salma B.',
    city: 'Casablanca',
    quote:
      "J'ai commandé le collier minimaliste, reçu en 3 jours à Casa. La finition est incroyable pour le prix, aucune allergie après 2 semaines. Je recommande les yeux fermés.",
    rating: 5,
    verified: true,
  },
  {
    name: 'Imane L.',
    city: 'Marrakech',
    quote:
      "Vraiment la classe. La bague empilable ne ternit pas, même sous la douche. Le packaging est soigné, parfait pour offrir. BISOU est devenu ma marque préférée.",
    rating: 5,
    verified: true,
  },
  {
    name: 'Nada K.',
    city: 'Rabat',
    quote:
      "Paiement à la livraison, un vrai plus pour la confiance. Le livreur était ponctuel, j'ai pu vérifier le coffret avant de payer. Service impeccable.",
    rating: 5,
    verified: false,
  },
];

interface TestimonialsProps {
  /** Override côté page (ex. PDP avec avis spécifiques). */
  items?: Testimonial[];
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? '#D4AF37' : 'none'}
          stroke="#D4AF37"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Section témoignages — Server Component.
 * Charge les avis approuvés depuis la collection `Reviews` de Payload.
 * Tombe en fallback sur les DEFAULTS si aucun avis n'est encore publié.
 */
async function loadReviews(): Promise<Testimonial[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { approved: { equals: true } },
        ],
      },
      sort: '-publishedAt',
      limit: 6,
      depth: 0,
    });

    if (res.docs.length === 0) return DEFAULTS;

    return res.docs.map((doc) => {
      const raw = doc as unknown as {
        author?: string;
        comment?: string;
        rating?: number;
        verified?: boolean;
      };
      return {
        name: raw.author ?? 'Cliente BISOU',
        quote: raw.comment ?? '',
        rating: raw.rating ?? 5,
        verified: raw.verified ?? false,
      };
    });
  } catch {
    return DEFAULTS;
  }
}

export async function Testimonials({ items }: TestimonialsProps) {
  // items override (par ex. depuis une PDP) > Payload > defaults.
  const testimonials = items ?? (await loadReviews());

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-black to-black-soft">
      <Container>
        <SectionTitle
          eyebrow="Elles nous aiment"
          title={<>Vos <em className="italic text-gold-gradient not-italic">témoignages</em></>}
          subtitle="Elles ont testé, adopté, et recommandé BISOU. Voici ce qu'elles en disent."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <Card key={`${t.name}-${i}`} padding="lg" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <StarRating rating={t.rating} />
                {t.verified && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-status-green font-sans flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                      <path d="M10 3L5 9 2 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Vérifié
                  </span>
                )}
              </div>
              <blockquote className="font-serif text-lg text-cream leading-relaxed italic">
                « {t.quote} »
              </blockquote>
              <div className="mt-auto pt-4 border-t border-gold/10">
                <p className="text-sm font-sans text-gold font-semibold">{t.name}</p>
                {t.city && (
                  <p className="text-xs text-grey font-sans">{t.city}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;
