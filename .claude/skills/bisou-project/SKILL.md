---
name: bisou-project
description: Conventions du repo BISOU — structure, design tokens, règles Git, stack Next.js 14 + Payload 3.0 + PostgreSQL. Charge ce skill dès que tu touches au repo BISOU (package.json, tsconfig, tailwind.config, CLAUDE.md, arborescence src/).
when_to_use: Setup initial, refactor structure, questions sur les conventions, vérification avant commit.
---

# BISOU — Project Skill

## Stack
- **Next.js 14.2** App Router + TypeScript strict + pnpm
- **Payload CMS 3.0** monté dans `src/app/(payload)/admin`
- **PostgreSQL** via Railway (adapter `@payloadcms/db-postgres`)
- **Tailwind 3.4** + `tailwindcss-rtl` + design tokens BISOU
- **Fonts :** Cormorant Garamond (titres) + Jost (corps) via `next/font/google`

## Arborescence
```
src/
├── app/
│   ├── layout.tsx           # Root — fonts + metadata
│   ├── globals.css          # Tokens CSS + Tailwind directives
│   ├── (payload)/admin/     # Admin Payload auto-monté
│   ├── (shop)/              # Routes publiques e-commerce
│   └── api/                 # Routes API
├── collections/             # Payload collections
├── components/{ui,shop,checkout,layout,marketing,seo,tracking}/
├── lib/
├── seed/
├── messages/{fr,ar}.json
└── types/payload-types.ts   # Auto-généré
```

## Design tokens (STRICTS — ne jamais dévier)
- **Or :** `#D4AF37` (primaire). Variantes : `light #F5E6A3`, `mid #C9A84C`, `dark #A8862E`
- **Noir :** `#0D0D0D` (fond). Soft : `#1A1A1A`
- **Cream :** `#FDF6E3` (texte clair)
- **WhatsApp :** `#25D366`
- **Rayon :** `12px` par défaut
- **Transition :** `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Breakpoints :** `sm:480` `md:768` `lg:1100`

Tailwind : utilise `gold`, `black`, `cream`, `whatsapp`, `card` — définis dans `tailwind.config.ts`. Aucun `#hex` ad hoc dans les composants.

## Fonts
```tsx
import { Cormorant_Garamond, Jost } from 'next/font/google';
const cormorant = Cormorant_Garamond({ weight: ['300','400','500','600','700'], variable: '--font-cormorant' });
const jost = Jost({ weight: ['200','300','400','500','600','700'], variable: '--font-jost' });
```
Titres → `font-serif`. Corps → `font-sans`. Classes Tailwind mappées sur les variables CSS.

## Git
- **Branche :** `master` (pas `main`)
- **Repo :** https://github.com/issamafif0505-debug/BISOU
- **User :** `issamafif0505-debug`
- Commits en français, format présent narratif. Pas de signature auto.
- Hooks CI : `pnpm lint && pnpm typecheck && pnpm check-wa`

## Règles absolues
1. **`WA_PHONE_NUMBER` uniquement dans `.env`** — lu par `src/lib/whatsapp.ts`. Jamais `212600000000` ni `wa.me/` ailleurs. CI bloque.
2. **TypeScript strict.** Pas de `any`.
3. **Pas de `<img>` brut** — `next/image` ou Cloudinary.
4. **Pas de `<link>` Google Fonts** — `next/font/google`.
5. **`generateMetadata()`** sur chaque route publique.
6. **Validation Zod** sur toute entrée utilisateur.
7. **Localization :** `src/messages/fr.json` primaire, `ar.json` secondaire (RTL).

## Scripts
- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm typecheck` / `pnpm check-wa`
- `pnpm seed` / `pnpm generate-types` / `pnpm payload:migrate`

## Legacy
Le prototype HTML original vit dans `legacy/brand/` — ne pas modifier, sert de référence visuelle pour Agent 3.
