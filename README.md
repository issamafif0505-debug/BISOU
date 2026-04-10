# BISOU — Bijoux plaqués or au Maroc

> **L'or qui t'embrasse** — boutique e-commerce COD (paiement à la livraison)
> sur Next.js 14 + Payload CMS 3.0 + PostgreSQL.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![Payload](https://img.shields.io/badge/Payload-3.0-blue)](https://payloadcms.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)

---

## Démarrage rapide

```bash
git clone https://github.com/issamafif0505-debug/BISOU.git
cd BISOU
git checkout master
pnpm install
cp .env.example .env.local    # → remplir les valeurs
pnpm payload:migrate
pnpm seed
pnpm dev
```

- **Front :** http://localhost:3000
- **Admin Payload :** http://localhost:3000/admin

## Documentation

| Document | Rôle |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Documentation technique complète (stack, arborescence, collections Payload, conventions) |
| [`SETUP.md`](./SETUP.md) | Installation locale + déploiement (Railway, Vercel, Cloudflare, Meta, WhatsApp, UpConfirm) |
| [`.env.example`](./.env.example) | Toutes les variables d'environnement requises |
| [`docs/`](./docs) | Stratégie marque, marché Maroc, influenceurs, logistique, réseaux sociaux |
| [`legacy/brand/`](./legacy/brand) | Prototype HTML/CSS/JS vanilla original (archivé, ne plus modifier) |

## Stack

- **Framework :** Next.js 14 App Router + TypeScript strict
- **CMS :** Payload 3.0 (intégré nativement dans `app/(payload)/`)
- **DB :** PostgreSQL (Railway)
- **UI :** Tailwind CSS + design tokens BISOU (or #D4AF37 / noir #0D0D0D)
- **Fonts :** Cormorant Garamond (titres) + Jost (corps)
- **i18n :** next-intl — `fr` primaire, `ar` secondaire (RTL)
- **Validation :** Zod
- **Images :** Cloudinary
- **Déploiement :** Vercel (région `cdg1` Paris) derrière Cloudflare (`bisou.ma`)

## Intégrations

- WhatsApp Business Cloud API (commandes + tracking)
- UpConfirm (confirmation COD automatisée par IA)
- Meta Pixel + Conversions API (tracking server-side)
- Alya Pay BNPL (paiement 3x sans frais)
- Cloudinary (images produits)

## Branche de travail

**`master`** (pas `main`). Tous les commits et PR ciblent `master`.

## Règles critiques

1. **`WA_PHONE_NUMBER` n'apparaît jamais dans le code** — uniquement dans `.env` et lu par `src/lib/whatsapp.ts`
2. **Design tokens stricts** : or/noir, Cormorant + Jost, jamais de nouvelle couleur ad hoc
3. **TypeScript strict** activé, pas de `any` sauf cas documentés
4. **Tests CI** : lint + typecheck + grep `212600000000` + Lighthouse CI avant merge

## Liens

- **Site prod :** https://bisou.ma
- **Admin :** https://bisou.ma/admin
- **GitHub :** https://github.com/issamafif0505-debug/BISOU
- **Prototype legacy (HF Space) :** https://issam0505-bisou-maroc-dashboard.static.hf.space

---

© 2026 BISOU — Fabriqué au Maroc, avec amour.
