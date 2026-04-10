# BISOU Maroc — Next.js 14 + Payload CMS 3.0

> Boutique e-commerce COD de bijoux plaqués or. Migration du prototype HTML vanilla vers une vraie stack production-ready. Branche de travail : **`master`**.

---

## Vue d'ensemble

BISOU est une marque marocaine de bijoux plaqués or, positionnée « luxe accessible ». La boutique fonctionne en **COD (contre-remboursement)** — modèle dominant au Maroc — avec confirmation WhatsApp automatisée et upsell progressif via Alya Pay (BNPL 3x).

**Source de vérité design :** les 14 modules HTML legacy dans `legacy/brand/` restent la référence visuelle. Toute migration Next.js doit reproduire fidèlement les écrans existants avant d'y ajouter de la logique serveur.

---

## Stack technique

| Couche | Techno |
|---|---|
| Framework | **Next.js 14.2** App Router + Server Components |
| Langage | **TypeScript 5.5** (`strict: true`, `noUncheckedIndexedAccess`) |
| CMS | **Payload 3.0** monté nativement dans `src/app/(payload)/` |
| Base de données | **PostgreSQL** (Railway, adapter `@payloadcms/db-postgres`) |
| UI | **Tailwind CSS 3.4** + tokens design BISOU + `tailwindcss-rtl` |
| Typographie | **Cormorant Garamond** (titres) + **Jost** (corps) via `next/font/google` |
| Validation | **Zod** (regex téléphone MA, schémas API) |
| i18n | **next-intl** (fr par défaut, `/ar/*` pour arabe + RTL) |
| Images | **Cloudinary** (adapter Payload Media) |
| Déploiement | **Vercel** (région `cdg1` Paris) derrière **Cloudflare** |
| Rich text | `@payloadcms/richtext-lexical` |
| Package manager | **pnpm 9** |

Aucune dépendance front externe non listée. Pas de UI kit importé (shadcn/radix autorisés si besoin côté Agent 3).

---

## Arborescence cible

```
BISOU/
├── .env.example                      # Toutes les variables d'env
├── .gitignore
├── CLAUDE.md                         # Ce fichier
├── README.md                         # Intro + démarrage rapide
├── SETUP.md                          # Railway + Vercel + Cloudflare pas à pas
├── package.json                      # pnpm scripts
├── tsconfig.json                     # strict mode, paths @/* → src/*
├── next.config.mjs                   # withPayload + images Cloudinary
├── tailwind.config.ts                # Tokens BISOU (or, noir, fonts)
├── postcss.config.mjs
├── middleware.ts                     # next-intl + protection /admin
├── vercel.json                       # cdg1 + headers cache/securite
├── payload.config.ts                 # Config Payload (AGENT 2)
│
├── .claude/
│   └── skills/                       # 6 skills custom BISOU
│       ├── bisou-project/SKILL.md
│       ├── bisou-cod-whatsapp/SKILL.md
│       ├── bisou-meta-pixel/SKILL.md
│       ├── bisou-seo-ecommerce/SKILL.md
│       ├── bisou-payload-collections/SKILL.md
│       └── bisou-luxury-copy/SKILL.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout — fonts + metadata
│   │   ├── globals.css               # Tailwind directives + variables CSS
│   │   ├── (payload)/                # Admin auto-monte par Payload (AGENT 2)
│   │   ├── (shop)/                   # Routes publiques (AGENT 3)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── collections/
│   │   │   ├── produits/
│   │   │   ├── checkout/             # AGENT 4
│   │   │   ├── merci/                # AGENT 4
│   │   │   ├── blog/                 # AGENT 5
│   │   │   ├── cgv/                  # AGENT 6
│   │   │   ├── mentions-legales/     # AGENT 6
│   │   │   └── politique-confidentialite/
│   │   ├── api/
│   │   │   ├── orders/               # AGENT 4
│   │   │   ├── webhooks/             # AGENT 4
│   │   │   ├── pixel/track/          # AGENT 5
│   │   │   └── health/
│   │   ├── sitemap.ts                # AGENT 5
│   │   ├── robots.ts                 # AGENT 5
│   │   ├── manifest.ts               # AGENT 6
│   │   └── opengraph-image.tsx       # AGENT 5
│   │
│   ├── collections/                  # Payload collections (AGENT 2)
│   │   ├── Products.ts               # 22 produits
│   │   ├── Categories.ts             # 6 categories
│   │   ├── Orders.ts                 # COD + hook CMD-###
│   │   ├── Cities.ts                 # 16 villes Maroc
│   │   ├── Influencers.ts
│   │   ├── LogisticsPartners.ts
│   │   ├── BlogPosts.ts              # 5 articles SEO
│   │   ├── Pages.ts                  # CGV, mentions...
│   │   ├── Media.ts                  # Cloudinary
│   │   └── Users.ts
│   │
│   ├── components/
│   │   ├── ui/                       # AGENT 3 — Button, Input, Select, Card
│   │   ├── shop/                     # AGENT 3 — ProductCard, Grid, WhatsAppFloating
│   │   ├── checkout/                 # AGENT 4 — CheckoutForm, CitySelect
│   │   ├── layout/                   # AGENT 3 — Header, Footer, MobileMenu
│   │   ├── marketing/                # AGENT 3 — Hero, Testimonials
│   │   ├── seo/                      # AGENT 5 — JsonLd, ProductSchema
│   │   └── tracking/                 # AGENT 5 — MetaPixel, CAPIClient
│   │
│   ├── lib/
│   │   ├── payload.ts                # getPayload() (AGENT 2)
│   │   ├── whatsapp.ts               # AGENT 4 — SEUL endroit qui lit WA_PHONE_NUMBER
│   │   ├── upconfirm.ts              # AGENT 4
│   │   ├── meta-capi.ts              # AGENT 5
│   │   ├── cloudinary.ts
│   │   ├── alya-pay.ts               # AGENT 6
│   │   ├── seo.ts                    # AGENT 5
│   │   ├── i18n.ts
│   │   └── validation.ts             # AGENT 4 — Zod schemas (phone MA)
│   │
│   ├── hooks/
│   ├── types/
│   │   └── payload-types.ts          # Auto-genere par AGENT 2
│   ├── seed/                         # AGENT 2
│   │   ├── seed.ts
│   │   ├── products.seed.ts          # 22 produits
│   │   ├── categories.seed.ts
│   │   ├── cities.seed.ts
│   │   ├── blog.seed.ts
│   │   ├── partners.seed.ts
│   │   └── influencers.seed.ts
│   │
│   └── messages/
│       ├── fr.json                   # i18n primaire
│       └── ar.json                   # i18n secondaire RTL
│
├── public/
│   ├── logo.svg                      # Migre depuis legacy/brand/assets/
│   ├── logo-alternate.svg
│   ├── logo-monogram.svg
│   ├── icons/                        # PWA icons (AGENT 6)
│   └── og/                           # OG fallback (AGENT 5)
│
├── docs/                             # Strategie, marche, influenceurs, reseaux
│   ├── brand-strategy.md
│   ├── strategie-maroc.md
│   ├── maroc-market-intel.md
│   ├── influencers-database.md
│   ├── logistics-partners.md
│   ├── whatsapp-strategy.md
│   ├── bisou-instagram-strategy.md
│   ├── bisou-facebook-strategy.md
│   ├── bisou-tiktok-strategy.md
│   ├── instagram-30days.md
│   ├── instagram-content-assets.md
│   └── hf-deployment.md              # Archive legacy HF Space
│
└── legacy/
    └── brand/                        # 14 modules HTML prototype original
        ├── index.html
        ├── brand-guide.html
        ├── lookbook.html
        ├── product-catalog.html      # Source de verite : 22 produits
        ├── website-homepage.html
        ├── landing-marrakech.html
        ├── checkout-cod.html         # Reference UX checkout
        ├── cod-dashboard.html
        ├── social-media-kit.html
        ├── email-newsletter.html
        ├── packs-marketing.html
        ├── press-kit.html
        ├── strategie-maroc.html
        ├── hf-app.html
        ├── ugc-studio.html
        ├── assets/                   # Logos originaux
        ├── google-apps-script.js     # Ancien backend (a deprecier)
        ├── SETUP-BISOU.md
        └── writer.js
```

---

## Design system

### Couleurs (CSS custom properties + Tailwind tokens)

```css
--gold: #D4AF37;         /* Primaire */
--gold-light: #F5E6A3;
--gold-mid: #C9A84C;
--gold-dark: #A8862E;
--black: #0D0D0D;        /* Fond principal */
--black-soft: #1A1A1A;
--card: #111111;
--cream: #FDF6E3;        /* Texte clair */
--rose: #F2D7D5;
--whatsapp: #25D366;
--grey: #AAAAAA;
--status-green: #2ECC71;
--status-red: #E74C3C;
--status-orange: #F39C12;
--status-blue: #3498DB;
```

### Typographie
- **Cormorant Garamond** 300–700 (serif, titres) via `next/font/google`
- **Jost** 200–700 (sans, corps) via `next/font/google`
- Variables CSS : `--font-cormorant`, `--font-jost`

### Breakpoints Tailwind
```
sm: 480px
md: 768px
lg: 1100px
```

### Composants
- Cartes : fond `#1A1A1A`, bordure `rgba(212,175,55,0.2)`, lueur dorée au hover
- Rayon : 12px par défaut
- Transition : 300ms `cubic-bezier(0.4, 0, 0.2, 1)`

---

## Scripts pnpm

| Commande | Rôle |
|---|---|
| `pnpm dev` | Next dev server (HMR) sur http://localhost:3000 |
| `pnpm build` | Build production |
| `pnpm start` | Servir le build production |
| `pnpm lint` | ESLint (next/core-web-vitals) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm seed` | Re-seed la base PostgreSQL (22 produits + catégories + villes + blog) |
| `pnpm generate-types` | Régénère `src/types/payload-types.ts` |
| `pnpm payload:migrate` | Applique les migrations Payload |
| `pnpm payload:migrate:create` | Crée une nouvelle migration |
| `pnpm check-wa` | Grep `212600000000` / `wa.me/` hors `lib/whatsapp.ts` |

---

## Payload collections (résumé)

| Collection | Rôle | Seed |
|---|---|---|
| `Products` | 22 bijoux, relation vers `Categories`, champs i18n `_fr`/`_ar` | `products.seed.ts` |
| `Categories` | Colliers, Bagues, Boucles, Bracelets, Coffrets, Éditions (6) | `categories.seed.ts` |
| `Orders` | Commandes COD — 13 champs miroir Google Sheets + hook `CMD-###` | — |
| `Cities` | 16 villes Maroc (Marrakech, Casablanca, Rabat…) | `cities.seed.ts` |
| `Influencers` | CRM influenceurs | `influencers.seed.ts` |
| `LogisticsPartners` | Amana, Glovo, Aramex, CTM… | `partners.seed.ts` |
| `BlogPosts` | 5 articles SEO long-tail marché Maroc | `blog.seed.ts` |
| `Pages` | CGV, mentions légales, politique | — |
| `Media` | Adapter Cloudinary | — |
| `Users` | Admin Payload | 1 admin initial |

### Flux de données COD (résumé)

1. Client remplit `/checkout` → validation client (Zod)
2. `POST /api/orders` → validation serveur + création Payload (`Orders`)
3. Hook `beforeChange` génère l'ID (`CMD-001`, `CMD-002`…)
4. Server déclenche en parallèle :
   - Ouverture WhatsApp côté client (lien construit par `src/lib/whatsapp.ts`)
   - Envoi à UpConfirm pour confirmation IA
   - Meta CAPI server-side (`InitiateCheckout` + `Purchase`)
5. Redirection vers `/merci/[orderId]` (page confirmation)
6. Webhook UpConfirm (`/api/webhooks/upconfirm`) → met à jour `statut`
7. Webhook WhatsApp (`/api/webhooks/whatsapp`) → messages entrants

---

## Règles absolues

1. **Branche Git :** `master` uniquement. Pas de `main`.
2. **`WA_PHONE_NUMBER` jamais hardcodé.**
   - Autorisé uniquement dans `.env` et lu par `src/lib/whatsapp.ts`.
   - Script CI `pnpm check-wa` bloque tout commit contenant `212600000000` ou `wa.me/` hors de ce fichier.
3. **TypeScript strict.** Pas de `any` sauf commentaire `// @ts-expect-error — raison`.
4. **Design tokens uniquement.** Pas de couleur ad hoc — passer par `tailwind.config.ts` + variables CSS.
5. **Fonts via `next/font/google`.** Pas de `<link>` Google Fonts.
6. **Images via `next/image` ou Cloudinary.** Jamais de `<img>` brut sauf cas documentés.
7. **Metadata via `generateMetadata()`.** Un titre/description par route.
8. **Zod pour toute entrée utilisateur** (API routes, forms, webhooks).
9. **Payload est la seule source de vérité** pour produits, commandes, blog, pages.
10. **Pas de `localStorage` pour données critiques** — ça c'était le prototype legacy.

---

## Skills Claude Code

6 skills custom vivent dans `.claude/skills/` :

| Skill | Quand l'utiliser |
|---|---|
| `bisou-project` | Conventions repo, structure, design tokens, règles git |
| `bisou-cod-whatsapp` | Flow COD + WhatsApp Cloud API + UpConfirm |
| `bisou-meta-pixel` | Meta Pixel browser + CAPI server-side, dedup event ID |
| `bisou-seo-ecommerce` | Schema.org, sitemap dynamique, Core Web Vitals |
| `bisou-payload-collections` | Patterns Payload 3.0 (hooks, auth, relations, migrations) |
| `bisou-luxury-copy` | Copywriting français luxe bijoux |

Skills globaux utilisables aussi : `payload`, `next-best-practices`, `frontend-design`, `analytics-tracking`.

---

## Workflow multi-agents (plan de build)

| # | Agent | Périmètre |
|---|---|---|
| 1 | **ARCHITECT** | Structure projet + docs racine (ce fichier, SETUP.md, package.json, tailwind, middleware) |
| 2 | **CMS ENGINEER** | `payload.config.ts` + toutes les collections + seeds |
| 3 | **FRONTEND DESIGNER** | Pages publiques shop, composants UI, copywriting luxe |
| 4 | **CHECKOUT ENGINEER** | Tunnel COD, API orders, WhatsApp, UpConfirm, validation |
| 5 | **SEO & TRACKING** | Sitemap, robots, Schema.org, Meta Pixel/CAPI, 5 articles blog |
| 6 | **DEVOPS** | Vercel, PWA, pages légales, CI/CD, Cloudflare |

Agents 1 et 2 travaillent d'abord. 3/4/5 en parallèle ensuite. 6 en dernier.

---

## Commandes locales utiles

```bash
# Serveur de dev
pnpm dev

# Base de données Payload (apres avoir rempli .env.local)
pnpm payload:migrate
pnpm seed

# Regenerer les types
pnpm generate-types

# Checks avant commit
pnpm lint
pnpm typecheck
pnpm check-wa

# Acceder au legacy prototype (pour reference design)
python -m http.server 3001 --directory legacy/brand
# puis http://localhost:3001
```

---

## Liens

- **Site prod :** https://bisou.ma
- **Admin :** https://bisou.ma/admin
- **GitHub :** https://github.com/issamafif0505-debug/BISOU (branche `master`)
- **Legacy HF Space :** https://issam0505-bisou-maroc-dashboard.static.hf.space (à décommissionner après validation Vercel)
- **Documentation Next.js :** https://nextjs.org/docs
- **Documentation Payload 3 :** https://payloadcms.com/docs

---

## État actuel du projet

- [x] Structure racine (package.json, tsconfig, tailwind, next.config, middleware) — **Agent 1**
- [x] Documentation (CLAUDE.md, README.md, SETUP.md, .env.example) — **Agent 1**
- [x] Skills custom squelettes — **Agent 1**
- [x] Migration legacy → `legacy/brand/` + `docs/` — **Agent 1**
- [ ] `payload.config.ts` + collections + seeds — **Agent 2**
- [ ] Pages publiques shop + composants UI — **Agent 3**
- [ ] Tunnel COD + WhatsApp + UpConfirm — **Agent 4**
- [ ] SEO, Schema.org, Meta Pixel, blog — **Agent 5**
- [ ] PWA, pages légales, Vercel, Cloudflare — **Agent 6**
