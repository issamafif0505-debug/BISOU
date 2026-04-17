'use client';
// ─────────────────────────────────────────────────────────────────────────────
// BISOU — StatsAnimated
// -----------------------------------------------------------------------------
// Remplacement client des 3 stats statiques (316L / 48h / COD) sur la homepage.
// Anime chaque stat avec un fade-up au scroll (pas de counter chiffre car les
// valeurs sont des strings — on fait un reveal lettre par lettre).
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, STAGGER } from '@/lib/motion-tokens';

interface Stat {
  stat: string;
  label: string;
}

interface StatsAnimatedProps {
  items: Stat[];
}

export function StatsAnimated({ items }: StatsAnimatedProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Chaque stat-item arrive avec un stagger
        gsap.from('.stat-item', {
          y: 24,
          opacity: 0,
          duration: DUR.base,
          ease: 'power3.out',
          stagger: STAGGER.cards,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        // Valeur stat : scale from 0.6 → 1
        gsap.from('.stat-value', {
          scale: 0.6,
          opacity: 0,
          duration: DUR.slow,
          ease: 'back.out(1.5)',
          stagger: STAGGER.cards,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.stat-item', { opacity: 0, duration: 0.3, stagger: 0.05 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid grid-cols-3 gap-6 mt-4 w-full">
      {items.map((item) => (
        <div key={item.stat} className="stat-item flex flex-col items-center gap-1">
          <span className="stat-value font-serif text-3xl text-gold">{item.stat}</span>
          <span className="text-xs text-grey uppercase tracking-[0.15em] font-sans text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StatsAnimated;
