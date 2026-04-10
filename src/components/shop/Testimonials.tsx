import { Container, SectionTitle, Card } from '@/components/ui';

interface Testimonial {
  name: string;
  city: string;
  quote: string;
  rating?: number;
}

const defaults: Testimonial[] = [
  {
    name: 'Salma B.',
    city: 'Casablanca',
    quote:
      "J'ai commandé le collier minimaliste, reçu en 3 jours à Casa. La finition est incroyable pour le prix, aucune allergie après 2 semaines. Je recommande les yeux fermés.",
    rating: 5,
  },
  {
    name: 'Imane L.',
    city: 'Marrakech',
    quote:
      "Vraiment la classe. La bague empilable ne ternit pas, même sous la douche. Le packaging est soigné, parfait pour offrir. BISOU est devenu ma marque préférée.",
    rating: 5,
  },
  {
    name: 'Nada K.',
    city: 'Rabat',
    quote:
      "Paiement à la livraison, un vrai plus pour la confiance. Le livreur était ponctuel, j'ai pu vérifier le coffret avant de payer. Service impeccable.",
    rating: 5,
  },
];

interface TestimonialsProps {
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
 * Section témoignages clientes.
 * TODO(Agent 5 / Payload): remplacer `defaults` par un fetch depuis la collection `Reviews`.
 */
export function Testimonials({ items = defaults }: TestimonialsProps) {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-black to-black-soft">
      <Container>
        <SectionTitle
          eyebrow="Elles nous aiment"
          title={<>Vos <em className="italic text-gold-gradient not-italic">témoignages</em></>}
          subtitle="Elles ont testé, adopté, et recommandé BISOU. Voici ce qu'elles en disent."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((t) => (
            <Card key={t.name} padding="lg" className="flex flex-col gap-4">
              <StarRating rating={t.rating} />
              <blockquote className="font-serif text-lg text-cream leading-relaxed italic">
                « {t.quote} »
              </blockquote>
              <div className="mt-auto pt-4 border-t border-gold/10">
                <p className="text-sm font-sans text-gold font-semibold">{t.name}</p>
                <p className="text-xs text-grey font-sans">{t.city}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;
