'use client';
// ─────────────────────────────────────────────────────────────────────────────
// BISOU — ScrollReveal
// -----------------------------------------------------------------------------
// Composant client générique pour animer des éléments au scroll via GSAP
// ScrollTrigger. Utilisé dans BestsellersSection, CategoryCards, stats…
//
// Usage :
//   <ScrollReveal selector=".product-card" stagger={0.08} y={40}>
//     {children}
//   </ScrollReveal>
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { DUR } from '@/lib/motion-tokens';

interface ScrollRevealProps {
  children: ReactNode;
  /** CSS selector for the elements to animate (scoped to this container). */
  selector: string;
  /** Vertical translate start value in px. Default 40. */
  y?: number;
  /** Stagger delay between elements in seconds. Default 0.08. */
  stagger?: number;
  /** GSAP ease string. Default 'power2.out'. */
  ease?: string;
  /** Animation duration in seconds. Default DUR.base. */
  duration?: number;
  /** ScrollTrigger start position. Default 'top 85%'. */
  start?: string;
  className?: string;
}

export function ScrollReveal({
  children,
  selector,
  y = 40,
  stagger = 0.08,
  ease = 'power2.out',
  duration = DUR.base,
  start = 'top 85%',
  className,
}: ScrollRevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const elements = gsap.utils.toArray<HTMLElement>(selector, root.current!);
        if (elements.length === 0) return;

        gsap.from(elements, {
          y,
          opacity: 0,
          duration,
          ease,
          stagger,
          scrollTrigger: {
            trigger: root.current,
            start,
            toggleActions: 'play none none reverse',
            once: false,
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const elements = gsap.utils.toArray<HTMLElement>(selector, root.current!);
        gsap.from(elements, { opacity: 0, duration: 0.25, stagger: 0.03 });
      });

      return () => {
        mm.revert();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

export default ScrollReveal;
