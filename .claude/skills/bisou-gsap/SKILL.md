---
name: bisou-gsap
description: Animations GSAP pour BISOU — Next.js 14 App Router + React 18 + Tailwind. Patterns React-safe (useGSAP, gsap.context, cleanup), ScrollTrigger pour le scroll storytelling, tokens BISOU (gold #D4AF37, easing luxury), respect de `prefers-reduced-motion`. Charge ce skill dès qu'on touche à une animation, transition complexe, scroll-jack, hero, product reveal, ou hover gold-glow.
when_to_use: Hero text reveal, hover des ProductCard, scroll storytelling collections, animation des compteurs (316L / 48h / COD), shimmer doré, transitions de page, micro-interactions checkout.
---

# BISOU — GSAP Skill

> Toutes les animations BISOU passent par GSAP 3.12+ avec le hook officiel `@gsap/react`.
> Pas de Framer Motion sur ce projet — single source of truth pour la timeline et le scroll.

---

## 1. Installation

```bash
# Côté repo BISOU (master)
pnpm add gsap @gsap/react
```

**Plugins gratuits** déjà inclus dans le bundle `gsap` standard :
- `ScrollTrigger` ✅ (essentiel pour BISOU)
- `Observer`, `Draggable`, `Flip`, `MotionPathPlugin`, `TextPlugin`, `EaselPlugin`, `PixiPlugin`, `ScrollToPlugin`

**Plugins Club GSAP** (payants, à acheter en `Business Green` si besoin) :
- `SplitText` (pratique mais on peut s'en passer avec un splitter maison)
- `MorphSVG`, `DrawSVGPlugin`, `MotionPathHelper`, `Physics2D`, `Inertia`, `ScrollSmoother`

> **Règle BISOU :** Pas de plugin payant tant qu'un fallback gratuit fonctionne.
> SplitText → utiliser `splitTextToWords()` maison (snippet plus bas).

### Enregistrement (UNE seule fois côté client)

Crée `src/lib/gsap.ts` :

```ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// BISOU — GSAP setup centralisé
// Importé depuis tout composant client qui anime quelque chose.
// Évite de re-registerPlugin() partout.
// ─────────────────────────────────────────────────────────────────────────────
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Defaults BISOU — appliqués à toutes les tweens sans surcharge
  gsap.defaults({
    duration: 0.8,
    ease: 'power3.out',
  });
  // Performance : lag smoothing à off (Next.js + RSC se charge déjà du throttle)
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, useGSAP };
```

Puis dans un composant client :

```ts
'use client';
import { gsap, useGSAP } from '@/lib/gsap';
```

---

## 2. Tokens d'animation BISOU

Centraliser **toutes** les durées/easings dans `src/lib/motion-tokens.ts` :

```ts
// ─────────────────────────────────────────────────────────────────────────────
// BISOU — Motion tokens. Ne JAMAIS hardcoder durée/ease ailleurs.
// ─────────────────────────────────────────────────────────────────────────────
export const DUR = {
  micro: 0.18,    // hover, focus
  fast: 0.32,     // boutons, cards
  base: 0.6,      // reveal standard
  slow: 1.0,      // hero, scroll
  cinema: 1.6,    // brand intro
} as const;

export const EASE = {
  // Luxury = même courbe que tokens.ts Remotion → cohérence vidéo / web
  luxury: 'cubic-bezier(0.4, 0, 0.2, 1)',
  reveal: 'cubic-bezier(0, 0, 0.2, 1)',
  snap:   'cubic-bezier(0.8, 0, 1, 1)',
  soft:   'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

export const STAGGER = {
  cards: 0.08,
  letters: 0.025,
  words: 0.06,
  list: 0.05,
} as const;

// Couleurs BISOU réutilisables dans les tweens (gold sweep, glow…)
export const COLORS = {
  gold: '#D4AF37',
  goldLight: '#F5E6A3',
  goldDark: '#A8862E',
  black: '#0D0D0D',
  cream: '#FDF6E3',
} as const;
```

---

## 3. Pattern obligatoire : `useGSAP` + scope

**Toujours** scope les animations à un container ref pour que `useGSAP` puisse cleanup automatiquement au unmount (ou au re-render React Strict Mode).

```tsx
'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, EASE } from '@/lib/motion-tokens';

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Tout sélecteur ici est scopé à `root` → safe
      gsap.from('.hero-eyebrow', { y: 12, opacity: 0, duration: DUR.fast });
      gsap.from('.hero-title-top', { y: 40, opacity: 0, duration: DUR.base, delay: 0.1 });
      gsap.from('.hero-title-bottom', { y: 40, opacity: 0, duration: DUR.base, delay: 0.25 });
      gsap.from('.hero-subtitle', { opacity: 0, duration: DUR.slow, delay: 0.5 });
      gsap.from('.hero-cta', { y: 16, opacity: 0, stagger: 0.08, duration: DUR.fast, delay: 0.65 });
    },
    { scope: root }, // ← cleanup auto + sélecteurs scopés
  );

  return <section ref={root} className="...">...</section>;
}
```

### Pourquoi pas `useEffect` directement ?
1. `useGSAP` reverte automatiquement les tweens au unmount (zéro leak).
2. Compatible React 18 Strict Mode (double-mount en dev).
3. Évite les `gsap.killTweensOf` manuels.

---

## 4. Patterns BISOU types

### 4.1 Hero text reveal (Cormorant Garamond)

```tsx
<h1 ref={root} className="font-serif text-5xl">
  <span className="hero-line block overflow-hidden">
    <span className="hero-line-inner block">L&apos;or qui</span>
  </span>
  <span className="hero-line block overflow-hidden">
    <span className="hero-line-inner block italic text-gold-gradient">t&apos;embrasse</span>
  </span>
</h1>
```

```ts
useGSAP(() => {
  gsap.from('.hero-line-inner', {
    yPercent: 110,        // sort par le bas du masque overflow-hidden
    duration: DUR.slow,
    ease: 'expo.out',
    stagger: 0.12,
  });
}, { scope: root });
```

### 4.2 Product card — hover lift + gold glow

Solution **CSS-first** (plus performant) avec GSAP juste pour les micro-interactions custom (ex : tilt 3D au mouse-move).

```tsx
const card = useRef<HTMLDivElement>(null);

useGSAP(() => {
  const el = card.current!;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * 0.04);
    yTo((e.clientY - r.top - r.height / 2) * 0.04);
  };
  const onLeave = () => { xTo(0); yTo(0); };
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  };
}, { scope: card });
```

> `gsap.quickTo` est LE pattern pour les events souris à 60 fps — il throttle et réutilise la même tween.

### 4.3 ScrollTrigger — sections collections pinned

```tsx
'use client';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export function CollectionsScroller() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.cat-card').forEach((card, i) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: DUR.base,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        delay: i * 0.05,
      });
    });
  }, { scope: root });

  return <div ref={root}>...</div>;
}
```

**Refresh ScrollTrigger sur navigation Next.js** (App Router) :

```ts
// src/app/(shop)/layout.tsx OU dans un composant <ScrollTriggerRefresher />
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from '@/lib/gsap';

export function ScrollTriggerRefresher() {
  const pathname = usePathname();
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);
  return null;
}
```

### 4.4 Compteurs animés (316L / 48h / COD)

```ts
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('.stat-num').forEach((el) => {
    const target = Number(el.dataset.value ?? 0);
    gsap.fromTo(el,
      { innerText: 0 },
      {
        innerText: target,
        duration: DUR.slow,
        ease: 'power1.out',
        snap: { innerText: 1 },
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        onUpdate() {
          el.textContent = Math.round(Number(el.textContent ?? 0)).toString();
        },
      },
    );
  });
}, { scope: root });
```

Pour les stats **non-numériques** (`316L`, `COD`), faire un fade + lettre par lettre :

```ts
gsap.from('.stat-text > span', {
  opacity: 0, y: 8, stagger: STAGGER.letters, duration: DUR.fast,
  scrollTrigger: { trigger: '.stat-text', start: 'top 85%', once: true },
});
```

### 4.5 Gold shimmer / sweep (signature BISOU)

Ne JAMAIS animer `background-position` en CSS — passer par GSAP qui peut interpoler `--shimmer-x`.

```tsx
<button className="btn-gold relative overflow-hidden">
  <span className="btn-shimmer pointer-events-none absolute inset-0" />
  Commander
</button>
```

```css
.btn-shimmer {
  background: linear-gradient(
    100deg,
    transparent 30%,
    rgba(245, 230, 163, 0.45) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  will-change: transform;
}
```

```ts
useGSAP(() => {
  gsap.to('.btn-shimmer', {
    x: '200%',
    duration: 1.4,
    ease: 'power2.inOut',
    repeat: -1,
    repeatDelay: 2.4,
  });
}, { scope: root });
```

### 4.6 Splitter de texte maison (sans SplitText payant)

```ts
// src/lib/split-text.ts
export function splitToWords(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.innerHTML = text
    .split(/(\s+)/)
    .map((chunk) =>
      chunk.trim()
        ? `<span class="word inline-block will-change-transform">${chunk}</span>`
        : chunk,
    )
    .join('');
  return Array.from(el.querySelectorAll<HTMLElement>('.word'));
}
```

Usage :

```ts
useGSAP(() => {
  const words = splitToWords(titleRef.current!);
  gsap.from(words, {
    yPercent: 100,
    opacity: 0,
    duration: DUR.base,
    ease: 'expo.out',
    stagger: STAGGER.words,
  });
}, { scope: root });
```

---

## 5. Accessibilité — `prefers-reduced-motion`

**Obligatoire BISOU.** Toute animation décorative doit être désactivable.

```ts
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Animation complète
    gsap.from('.hero-line-inner', { yPercent: 110, duration: DUR.slow, stagger: 0.12 });
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    // Fallback : juste opacité, durée minime
    gsap.from('.hero-line-inner', { opacity: 0, duration: 0.2 });
  });

  return () => mm.revert();
}, { scope: root });
```

Et au niveau global (`src/app/globals.css`) :

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Performance & SSR

| Règle | Pourquoi |
|---|---|
| **Composants animés = `'use client'`** | GSAP touche le DOM, impossible côté RSC. |
| **Importer depuis `@/lib/gsap`** | Évite le double-register des plugins. |
| **`will-change: transform`** sur les éléments animés | Aide le compositor GPU. À retirer après animation longue. |
| **Animer `transform` + `opacity` uniquement** | Pas de reflow/repaint coûteux. |
| **`gsap.quickTo` pour les events haute fréquence** (mousemove, scroll) | Throttle interne, réutilise la tween. |
| **`ScrollTrigger.refresh()` après changement de layout** | Sinon les triggers se calent au mauvais Y. |
| **`gsap.context`** ou `useGSAP({ scope })` | Cleanup auto, zéro leak entre routes. |
| **Pas de tween infini sans condition d'arrêt** | Coût CPU même hors viewport. Coupler à `ScrollTrigger`. |

---

## 7. Anti-patterns (à proscrire)

```ts
// ❌ NON — leak garanti, sélecteur global
useEffect(() => {
  gsap.from('.hero-title', { y: 40 });
}, []);

// ✅ OUI
const root = useRef(null);
useGSAP(() => {
  gsap.from('.hero-title', { y: 40 });
}, { scope: root });
```

```ts
// ❌ NON — anime le layout, jank
gsap.to(el, { width: '100%', height: 200 });

// ✅ OUI — anime via transform + scaleX/scaleY
gsap.from(el, { scaleX: 0, transformOrigin: 'left' });
```

```ts
// ❌ NON — Framer Motion en plus de GSAP
import { motion } from 'framer-motion';

// ✅ OUI — UNE seule lib d'animation sur BISOU
import { gsap } from '@/lib/gsap';
```

```ts
// ❌ NON — registerPlugin réinvoqué dans chaque composant
gsap.registerPlugin(ScrollTrigger);

// ✅ OUI — une seule fois dans src/lib/gsap.ts
```

---

## 8. Cas d'usage BISOU prioritaires

| Page / composant | Animation | Skill section |
|---|---|---|
| `Hero.tsx` (homepage) | Text reveal mask + CTA stagger | 4.1 |
| `ProductCard.tsx` (hover) | Lift + gold-glow + tilt léger | 4.2 |
| `CategoryCard.tsx` (collections) | Scroll fade-up + scale | 4.3 |
| `BestsellersSection.tsx` | Stagger reveal cards au scroll | 4.3 |
| `Testimonials.tsx` | Carrousel + lettres au scroll | 4.6 + 4.3 |
| Brand stats (316L, 48h, COD) | Compteur + lettre par lettre | 4.4 |
| `<Button variant="gold">` | Shimmer doré loopé | 4.5 |
| Page transitions | Fade + slide via `ScrollTrigger.refresh()` | 4.3 |
| `/checkout` validation | Shake horizontal sur champ invalide | `gsap.fromTo(el, {x:-6}, {x:0, duration:0.3, ease:'elastic'})` |
| `/merci/[id]` | Confetti dorés + scale check icon | `repeat: 0` + `ease: 'back.out(1.7)'` |

---

## 9. Quick reference

```ts
// Ease BISOU recommandés
'power1.out'   // micro-interactions
'power2.out'   // cards, listes
'power3.out'   // hero, reveal (DEFAULT)
'expo.out'     // text mask reveal
'back.out(1.7)'// confirmation, success states
'elastic.out(1, 0.3)' // erreurs, attention

// Durées BISOU
DUR.micro (0.18) → hover
DUR.fast  (0.32) → boutons
DUR.base  (0.6)  → reveal standard ← DEFAULT
DUR.slow  (1.0)  → hero, scroll
DUR.cinema (1.6) → intro de marque

// Délais standards
0.0 → premier élément
+0.08 par enfant pour stagger
+0.15 entre titre et sous-titre
```

---

## 10. Checklist avant commit d'une animation

- [ ] Composant marqué `'use client'`
- [ ] Import depuis `@/lib/gsap` (pas direct `gsap`)
- [ ] `useGSAP` avec `{ scope: ref }` — jamais `useEffect` brut
- [ ] Durées/eases issues de `motion-tokens.ts`
- [ ] `gsap.matchMedia` pour `prefers-reduced-motion`
- [ ] Aucun sélecteur global (`document.querySelector`) sans scope
- [ ] `ScrollTrigger.refresh()` câblé sur `usePathname` si layout change
- [ ] `pnpm typecheck` OK + `pnpm build` OK (pas de `window` en SSR)
- [ ] Lighthouse mobile : pas de régression Perf vs avant l'anim
