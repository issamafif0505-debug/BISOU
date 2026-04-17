// ─────────────────────────────────────────────────────────────────────────────
// BISOU — Motion tokens
// -----------------------------------------------------------------------------
// Centralise TOUTES les durées / easings / délais d'animation.
// Ne JAMAIS hardcoder une durée ou un cubic-bezier ailleurs dans le code.
//
// Cohérent avec `BISOU-Videos/src/lib/tokens.ts` (Remotion) → identité visuelle
// commune entre vidéos sociales et site web.
//
// Voir `.claude/skills/bisou-gsap/SKILL.md` pour les patterns d'usage.
// ─────────────────────────────────────────────────────────────────────────────

/** Durées d'animation, en secondes (compatibles GSAP). */
export const DUR = {
  micro: 0.18, // hover, focus, ripples
  fast: 0.32, // boutons, cards, micro-transitions
  base: 0.6, // reveal standard ← DEFAULT GSAP
  slow: 1.0, // hero, ScrollTrigger
  cinema: 1.6, // brand intro, transitions de page
} as const;

/** Easings cubic-bezier. Strings GSAP-friendly. */
export const EASE = {
  /** Courbe BISOU principale, identique à `Remotion EASE.luxury`. */
  luxury: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Reveal entrant, démarrage immédiat. */
  reveal: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Sortie nette, snap. */
  snap: 'cubic-bezier(0.8, 0, 1, 1)',
  /** Soft, élégant — pour les compteurs et stats. */
  soft: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

/** Délais entre éléments d'un stagger (en secondes). */
export const STAGGER = {
  cards: 0.08,
  letters: 0.025,
  words: 0.06,
  list: 0.05,
} as const;

/** Couleurs BISOU réutilisables dans les tweens (gold sweep, glow…). */
export const COLORS = {
  gold: '#D4AF37',
  goldLight: '#F5E6A3',
  goldMid: '#C9A84C',
  goldDark: '#A8862E',
  black: '#0D0D0D',
  blackSoft: '#1A1A1A',
  cream: '#FDF6E3',
  whatsapp: '#25D366',
} as const;

/** Distances de translation standards (en px) pour reveal. */
export const TRANSLATE = {
  micro: 8,
  small: 16,
  base: 40,
  large: 80,
} as const;

/**
 * Helper : retourne `true` si l'utilisateur a demandé `prefers-reduced-motion`.
 * À utiliser conjointement avec `gsap.matchMedia()` côté client.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
