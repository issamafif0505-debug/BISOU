'use client';
// ─────────────────────────────────────────────────────────────────────────────
// BISOU — Hero GSAP Animations
// -----------------------------------------------------------------------------
// Thin "island" client component posé sur le Hero server-side.
// Anime via useGSAP (cleanup auto) les éléments du Hero sans les re-rendre.
//
// Pattern : Server Component Hero → ajoute <HeroAnimations /> en dernier enfant.
// GSAP cible les classes CSS existantes via le scope `document.querySelector`.
// Pas de state React → zéro re-render → aucune hydration cost.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, STAGGER } from '@/lib/motion-tokens';

export function HeroAnimations() {
  const dummy = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Le Hero est rendu côté serveur — on cible ses classes depuis le parent.
      // Tous les sélecteurs sont scopés au section#hero-root via document.
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.from('.hero-eyebrow', {
          y: 10,
          opacity: 0,
          duration: DUR.fast,
        })
          .from(
            '.hero-title-top',
            { y: 50, opacity: 0, duration: DUR.slow },
            '-=0.05',
          )
          .from(
            '.hero-title-bottom',
            { y: 50, opacity: 0, duration: DUR.slow },
            '-=0.55',
          )
          .from(
            '.hero-subtitle',
            { opacity: 0, y: 16, duration: DUR.base },
            '-=0.4',
          )
          .from(
            '.hero-location',
            { opacity: 0, scale: 0.92, duration: DUR.fast },
            '-=0.3',
          )
          .from(
            '.hero-cta',
            {
              y: 20,
              opacity: 0,
              stagger: STAGGER.cards,
              duration: DUR.fast,
            },
            '-=0.25',
          )
          .from(
            '.hero-scroll-indicator',
            { opacity: 0, duration: DUR.base },
            '-=0.1',
          );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from(
          ['.hero-eyebrow', '.hero-title-top', '.hero-title-bottom', '.hero-subtitle', '.hero-cta'],
          { opacity: 0, duration: 0.3, stagger: 0.05 },
        );
      });

      return () => mm.revert();
    },
    { scope: dummy },
  );

  // Ce composant ne rend rien de visible — juste un anchor ref invisible.
  return <div ref={dummy} aria-hidden="true" className="sr-only pointer-events-none" />;
}

export default HeroAnimations;
