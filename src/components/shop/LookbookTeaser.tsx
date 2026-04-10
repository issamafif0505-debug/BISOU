import Link from 'next/link';
import { Container, ArrowRightIcon } from '@/components/ui';

/**
 * Section teaser éditos / lookbook.
 * Layout 2-cols : image stylisée à gauche, texte + CTA à droite.
 * SVG décoratif en fallback jusqu'à ce que l'image Cloudinary arrive.
 */
export function LookbookTeaser() {
  return (
    <section className="relative py-20 md:py-28 bg-black-soft overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Visual */}
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gradient-to-br from-card to-black border border-gold/15">
            {/* Decorative SVG */}
            <svg
              viewBox="0 0 400 500"
              className="absolute inset-0 w-full h-full text-gold/30"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="lookGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5E6A3" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#A8862E" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Cercles concentriques */}
              <circle cx="200" cy="220" r="140" stroke="url(#lookGrad)" strokeWidth="1.2" />
              <circle cx="200" cy="220" r="100" stroke="url(#lookGrad)" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="200" cy="220" r="60" stroke="url(#lookGrad)" strokeWidth="0.8" />

              {/* Sketch collier */}
              <path
                d="M90 160 Q200 120 310 160 Q310 260 200 280 Q90 260 90 160 Z"
                stroke="url(#lookGrad)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="200" cy="282" r="10" fill="#D4AF37" fillOpacity="0.4" />
              <circle cx="200" cy="282" r="5" fill="#D4AF37" fillOpacity="0.8" />

              {/* Étoiles décoratives */}
              <g fill="#D4AF37" opacity="0.7">
                <circle cx="70" cy="90" r="2" />
                <circle cx="340" cy="110" r="2.5" />
                <circle cx="60" cy="380" r="2" />
                <circle cx="330" cy="400" r="2" />
                <circle cx="200" cy="440" r="3" />
              </g>
            </svg>

            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-sans mb-2">
                Lookbook 2026
              </p>
              <p className="font-serif text-2xl text-cream">Les silhouettes de la saison</p>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.25em] text-gold/80 font-sans">
              Journal BISOU
            </p>
            <h2 className="font-serif text-h1 md:text-display leading-tight text-cream">
              Une ode à la <em className="italic text-gold-gradient not-italic">femme marocaine</em> contemporaine
            </h2>
            <p className="text-base md:text-lg text-grey leading-relaxed font-sans">
              Chaque collection BISOU raconte une histoire. Celle d&apos;une élégance qui se
              porte au quotidien, des médinas de Marrakech aux rooftops de Casa. Des bijoux
              pensés pour durer, fabriqués en acier 316L plaqué or 18K.
            </p>
            <ul className="flex flex-col gap-3 text-sm text-cream font-sans">
              <li className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold" /> Finitions inspirées de l&apos;artisanat marocain
              </li>
              <li className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold" /> Éditions limitées numérotées
              </li>
              <li className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold" /> Emballage cadeau BISOU offert
              </li>
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-sans text-sm uppercase tracking-[0.18em] w-fit mt-2"
            >
              Notre histoire
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default LookbookTeaser;
