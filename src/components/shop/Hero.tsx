import Link from 'next/link';
import { Button, Container, WhatsAppIcon, ArrowRightIcon } from '@/components/ui';

interface HeroProps {
  eyebrow?: string;
  titleTop: string;
  titleBottom: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string; whatsapp?: boolean };
  location?: string;
}

/**
 * Hero principal BISOU — inspiré de `legacy/brand/website-homepage.html`.
 * - Fond radial doré + ornements SVG
 * - Titre en deux lignes, mot clé en <em> doré gradient
 * - Eyebrow uppercase + subtitle + badge location
 * - Deux CTAs (primaire outline or / secondaire WhatsApp)
 *
 * Server Component (aucune interaction).
 */
export function Hero({
  eyebrow = 'Bijoux Plaqués Or',
  titleTop,
  titleBottom,
  subtitle,
  primaryCta,
  secondaryCta,
  location = 'Marrakech · Tout le Maroc',
}: HeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden min-h-[100svh] flex items-center bg-black pt-20 pb-20"
      aria-label="Accueil BISOU"
    >
      {/* Background radial */}
      <div aria-hidden="true" className="absolute inset-0 bg-dark-radial" />

      {/* Ornement doré gauche */}
      <svg
        aria-hidden="true"
        className="absolute -left-40 top-1/4 h-[520px] w-[520px] text-gold/10 blur-[2px]"
        viewBox="0 0 520 520"
        fill="none"
      >
        <circle cx="260" cy="260" r="240" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="260" cy="260" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="260" cy="260" r="120" stroke="currentColor" strokeWidth="0.8" />
      </svg>

      {/* Ornement doré droite */}
      <svg
        aria-hidden="true"
        className="absolute -right-32 -bottom-40 h-[460px] w-[460px] text-gold/10"
        viewBox="0 0 460 460"
        fill="none"
      >
        <circle cx="230" cy="230" r="210" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="230" cy="230" r="150" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
      </svg>

      {/* Lignes horizontales animées */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_49%,rgba(212,175,55,0.06)_50%,transparent_51%,transparent_100%)] bg-[length:100%_120px]"
      />

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center relative">
          {/* Halo derrière le titre */}
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold/80 font-sans">
            <span className="h-px w-8 bg-gold/60" />
            {eyebrow}
            <span className="h-px w-8 bg-gold/60" />
          </div>

          {/* Titre — 2 lignes façon legacy */}
          <h1 className="font-serif leading-[1.05] tracking-tight">
            <span className="block text-[clamp(3rem,8vw,6rem)] font-light text-cream" style={{textShadow: '0 0 40px rgba(253,246,227,0.25), 0 2px 8px rgba(0,0,0,0.8)'}}>
              {titleTop}
            </span>
            <span className="block text-[clamp(3.2rem,9vw,7rem)] font-light italic text-gold-gradient mt-1">
              {titleBottom}
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="mt-6 max-w-xl text-base md:text-lg text-grey font-sans leading-relaxed">
            {subtitle}
          </p>

          {/* Badge location */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black-soft/80 px-4 py-2 text-xs text-cream font-sans backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-gold animate-ping" />
              <span className="relative rounded-full bg-gold h-2 w-2" />
            </span>
            {location}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
            <Button
              as="link"
              href={primaryCta.href}
              variant="secondary"
              size="lg"
              icon={<ArrowRightIcon />}
            >
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                as="a"
                href={secondaryCta.href}
                variant={secondaryCta.whatsapp ? 'whatsapp' : 'primary'}
                size="lg"
                icon={secondaryCta.whatsapp ? <WhatsAppIcon /> : undefined}
                target={secondaryCta.whatsapp ? '_blank' : undefined}
                rel={secondaryCta.whatsapp ? 'noopener noreferrer' : undefined}
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 bottom-10 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold/70 font-sans"
        >
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
          Découvrir
        </div>
      </Container>
    </section>
  );
}

export default Hero;
