'use client';
// ─────────────────────────────────────────────────────────────────────────────
// BISOU — GSAP setup centralisé
// -----------------------------------------------------------------------------
// Importé depuis tout composant client qui anime quelque chose.
// Évite de re-registerPlugin() partout et garantit des defaults cohérents.
//
// Usage :
//   'use client';
//   import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
//
// Voir `.claude/skills/bisou-gsap/SKILL.md` pour les patterns BISOU.
// ─────────────────────────────────────────────────────────────────────────────

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  // Enregistre les plugins UNE seule fois (idempotent côté GSAP).
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Defaults BISOU — appliqués à toutes les tweens sans surcharge explicite.
  // Cf. motion-tokens.ts pour les valeurs métier.
  gsap.defaults({
    duration: 0.6, // DUR.base
    ease: 'power3.out',
  });

  // Performance : Next.js + RSC se charge déjà du throttle à navigation,
  // GSAP ne doit pas tenter de "rattraper" les frames perdues.
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, useGSAP };
