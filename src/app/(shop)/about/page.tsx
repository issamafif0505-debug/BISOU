import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Testimonials } from '@/components/shop/Testimonials';

export const metadata: Metadata = {
  title: 'Notre histoire — BISOU Maroc',
  description:
    'BISOU est née à Marrakech d\'une passion pour les bijoux accessibles. Découvrez notre histoire, nos valeurs et notre engagement pour un luxe authentique au Maroc.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black pb-0">
      <BreadcrumbSchema
        items={[{ name: 'Accueil', url: '/' }, { name: 'Notre histoire' }]}
      />

      {/* Hero */}
      <section className="relative py-24 md:py-36 bg-gradient-to-b from-black-soft to-black overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-dark-radial opacity-40" />
        <Container className="relative z-10 max-w-2xl">
          <div className="text-center flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold/80 font-sans">
              <span className="h-px w-8 bg-gold/60" />
              Maison BISOU
              <span className="h-px w-8 bg-gold/60" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-cream font-light leading-tight">
              Né à Marrakech,{' '}
              <em className="italic text-gold-gradient not-italic">porté partout</em>
            </h1>
            <p className="text-grey font-sans text-base leading-relaxed max-w-lg">
              BISOU est une maison de bijoux plaqués or pensée pour la femme marocaine moderne — celle qui veut
              briller sans se ruiner, qui refuse de choisir entre luxe et praticité.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <Container className="max-w-3xl py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6 font-sans text-grey text-sm leading-relaxed">
            <h2 className="font-serif text-2xl text-cream">L&apos;or comme langage</h2>
            <p>
              BISOU est née d&apos;une conviction simple : une femme marocaine mérite des bijoux beaux, durables
              et accessibles. Pas de compromis entre le prix et la qualité. Pas d&apos;allergie. Pas de rouille
              après la douche.
            </p>
            <p>
              Chaque pièce BISOU est forgée en <strong className="text-cream">acier inoxydable 316L</strong>,
              le même métal que les instruments chirurgicaux — hypoallergénique, waterproof, anti-ternissement.
              Puis plaqué d&apos;un bain d&apos;or 18 carats.
            </p>
            <p>
              Le résultat ? L&apos;éclat de l&apos;or véritable, à un prix qui respecte les familles marocaines.
            </p>
          </div>

          <div className="flex flex-col gap-6 font-sans text-grey text-sm leading-relaxed">
            <h2 className="font-serif text-2xl text-cream">Notre promesse COD</h2>
            <p>
              Au Maroc, la confiance se mérite. C&apos;est pourquoi BISOU a fait le choix du{' '}
              <strong className="text-cream">paiement à la livraison uniquement</strong>. Vous voyez le bijou,
              vous le touchez, vous payez — ou vous refusez. Sans risque.
            </p>
            <p>
              Notre taux de satisfaction client est de 97%. Notre engagement : si votre bijou n&apos;est pas
              conforme à la photo, nous vous remboursons ou remplaçons immédiatement.
            </p>
            <p>
              Garantie 6 mois offerte sur chaque pièce. Livraison 48-72h partout au Maroc.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Accessibilité', body: 'Du luxe pensé pour toutes les bourses. Prix directs, sans intermédiaires.' },
            { title: 'Qualité', body: 'Acier 316L, plaqué or 18K, contrôle qualité sur chaque pièce.' },
            { title: 'Confiance', body: 'Paiement uniquement à la livraison. Garantie 6 mois. Service 7j/7.' },
          ].map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-3 rounded-[12px] border border-gold/15 bg-card p-6">
              <h3 className="font-serif text-lg text-cream">{title}</h3>
              <p className="text-sm text-grey font-sans leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Container>

      <Testimonials />
    </main>
  );
}
