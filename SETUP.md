# BISOU — Guide d'installation & déploiement

Ce document couvre l'installation locale **et** le déploiement en production
(Railway PostgreSQL, Vercel, Cloudflare DNS, Meta Business, WhatsApp BSP,
UpConfirm, Alya Pay) pour quelqu'un qui clone le repo à blanc.

Tout le projet est sur la branche **`master`** (pas `main`).

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Base de données — Railway PostgreSQL](#2-base-de-données--railway-postgresql)
3. [Installation locale](#3-installation-locale)
4. [Déploiement Vercel](#4-déploiement-vercel)
5. [Cloudflare — DNS, SSL, WAF](#5-cloudflare--dns-ssl-waf)
6. [Meta Business + WhatsApp Cloud API](#6-meta-business--whatsapp-cloud-api)
7. [UpConfirm — confirmation COD IA](#7-upconfirm--confirmation-cod-ia)
8. [Alya Pay — BNPL 3x](#8-alya-pay--bnpl-3x)
9. [Cloudinary — hébergement images](#9-cloudinary--hébergement-images)
10. [Vérifications post-déploiement](#10-vérifications-post-déploiement)

---

## 1. Prérequis

| Outil | Version min. | Pourquoi |
|---|---|---|
| Node.js | 20.9+ | Runtime Next 14 + Payload 3 |
| pnpm | 9.0+ | Gestionnaire de paquets (plus rapide que npm) |
| Git | 2.40+ | `git checkout master` |
| Compte GitHub | — | Repo [issamafif0505-debug/BISOU](https://github.com/issamafif0505-debug/BISOU) |
| Compte Vercel | — | Hébergement Next + Payload |
| Compte Railway | — | PostgreSQL managée |
| Compte Cloudflare | — | DNS + WAF + CDN `bisou.ma` |
| Compte Meta Business | — | WhatsApp Cloud API + Pixel |
| Compte Cloudinary | — | Images produits (gratuit jusqu'à 25 GB) |
| Compte UpConfirm | — | Confirmation COD automatisée |
| Compte Alya Pay | — | Paiement 3x (optionnel Phase 2) |

Installer pnpm si besoin :
```bash
npm install -g pnpm@latest
```

---

## 2. Base de données — Railway PostgreSQL

1. Aller sur [railway.app](https://railway.app) → « New Project »
2. Choisir **« Provision PostgreSQL »**
3. Une fois la base créée, ouvrir l'onglet **« Variables »**
4. Copier la valeur de `DATABASE_URL` (format : `postgres://user:pass@host:port/dbname`)
5. Dans `.env.local`, renseigner :
   ```bash
   DATABASE_URI=postgres://user:pass@host:port/dbname
   ```
6. Dans l'onglet **« Settings »** de la base Railway :
   - Activer « Public Networking » (nécessaire pour Vercel)
   - Noter le **connection limit** (par défaut 20 sur le plan hobby)
7. Railway applique le paiement à l'usage : prévoir ~5-10 USD/mois au démarrage

> Alternative : Supabase, Neon, ou PostgreSQL auto-hébergé. Adapter `DATABASE_URI`.

---

## 3. Installation locale

```bash
# 1. Cloner le repo
git clone https://github.com/issamafif0505-debug/BISOU.git
cd BISOU
git checkout master

# 2. Installer les dépendances
pnpm install

# 3. Copier le template d'env
cp .env.example .env.local
# → éditer .env.local et remplir au moins :
#   DATABASE_URI, PAYLOAD_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 4. Générer le schéma Payload (premiers migrations)
pnpm payload:migrate

# 5. Seed — 22 produits, 6 catégories, 16 villes, 5 articles blog
pnpm seed

# 6. Lancer le serveur de dev
pnpm dev
```

- Front public : [http://localhost:3000](http://localhost:3000)
- Admin Payload : [http://localhost:3000/admin](http://localhost:3000/admin)
  - Login avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` du `.env.local`

### Scripts utiles

| Commande | Rôle |
|---|---|
| `pnpm dev` | Next dev server + HMR |
| `pnpm build` | Build production |
| `pnpm start` | Démarrer build production en local |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm seed` | Re-seed la base (idempotent) |
| `pnpm generate-types` | Régénérer `src/types/payload-types.ts` |
| `pnpm payload:migrate` | Appliquer les migrations Payload |
| `pnpm payload:migrate:create` | Créer une nouvelle migration |

---

## 4. Déploiement Vercel

1. Aller sur [vercel.com](https://vercel.com) → « Add New » → « Project »
2. Importer depuis GitHub → sélectionner `issamafif0505-debug/BISOU`
3. Configuration :
   - **Framework Preset :** Next.js (auto-détecté)
   - **Root Directory :** `./`
   - **Build Command :** `pnpm build`
   - **Install Command :** `pnpm install`
   - **Output Directory :** `.next`
   - **Production Branch :** `master`
4. Dans « Environment Variables », ajouter **toutes** les clés de `.env.example`
   (sans valeurs par défaut — récupérer chaque vraie valeur)
5. **Regions :** sélectionner `Paris (cdg1)` pour la proximité avec le Maroc
6. Cliquer « Deploy »
7. Après le premier build : `vercel.app` domain actif → tester
8. Ajouter le domaine custom :
   - Settings → Domains → « Add » → `bisou.ma`
   - Suivre les instructions DNS (voir section 5 Cloudflare)

### Redéploiement automatique
Chaque push sur `master` déclenche un nouveau build Vercel. Les PR créent
des preview deployments automatiquement.

---

## 5. Cloudflare — DNS, SSL, WAF

1. Créer un compte sur [cloudflare.com](https://cloudflare.com)
2. « Add a Site » → entrer `bisou.ma` → choisir plan **Free**
3. Cloudflare scanne les DNS existants → **remplacer les name servers** du domaine
   chez le registrar (ex : Genious.ma, OVH Maroc, Namecheap) par ceux fournis par Cloudflare
4. Attendre la propagation (~15 min à 24 h) — email de confirmation reçu
5. **Configurer les DNS records :**

   | Type | Name | Content | Proxy |
   |---|---|---|---|
   | A | `@` | `76.76.21.21` (IP Vercel) | Proxied (orange cloud) |
   | CNAME | `www` | `cname.vercel-dns.com` | Proxied |
   | CNAME | `admin` | `cname.vercel-dns.com` | DNS only (gris) |

6. **SSL/TLS** → Overview → Mode : **Full (strict)**
7. **SSL/TLS → Edge Certificates :**
   - Always Use HTTPS : ON
   - Automatic HTTPS Rewrites : ON
   - Minimum TLS Version : 1.2
8. **Rules → Page Rules :**
   - `bisou.ma/admin/*` → Cache Level : Bypass
   - `bisou.ma/api/*` → Cache Level : Bypass
9. **Security → WAF → Rate limiting rules :**
   - Créer une règle : `/api/orders` → 10 requêtes/minute/IP → Block 1 minute
10. Retourner sur Vercel → Domains → valider `bisou.ma` et `www.bisou.ma`

---

## 6. Meta Business + WhatsApp Cloud API

> L'approbation BSP Meta peut prendre 1 à 2 semaines — commencer dès la Phase 0.

1. Aller sur [business.facebook.com](https://business.facebook.com)
2. Créer un compte Meta Business Manager pour BISOU
3. **Ajouter une App :** Developer Meta → My Apps → Create App → type « Business »
4. **Activer WhatsApp** dans l'app → « Add Product » → WhatsApp → Setup
5. **Ajouter un numéro** → entrer le vrai numéro marocain BISOU → vérification OTP
6. Récupérer depuis WhatsApp → API Setup :
   - `WA_PHONE_NUMBER_ID` (ID du numéro)
   - `WA_BUSINESS_ACCOUNT_ID` (WABA ID)
   - Temporary access token → **générer un token permanent** via System User
7. Renseigner dans Vercel + `.env.local` :
   ```bash
   WA_PHONE_NUMBER=212XXXXXXXXX     # vrai numéro BISOU
   WA_PHONE_NUMBER_ID=...
   WA_BUSINESS_ACCOUNT_ID=...
   WA_ACCESS_TOKEN=...
   WA_APP_SECRET=...                 # depuis App Dashboard → Settings → Basic
   WA_WEBHOOK_VERIFY_TOKEN=un-secret-aleatoire-a-inventer
   ```
8. **Webhook :** WhatsApp → Configuration :
   - Callback URL : `https://bisou.ma/api/webhooks/whatsapp`
   - Verify Token : même valeur que `WA_WEBHOOK_VERIFY_TOKEN`
   - Souscrire aux champs : `messages`, `message_status`
9. **Créer les templates de messages** dans WhatsApp Manager :
   - `cod_confirmation_fr` — confirmation commande
   - `cod_tracking_fr` — notification expédition
10. **Meta Pixel (pour Conversions API) :**
    - Events Manager → Connect Data Source → Web → Meta Pixel
    - Noter le `Pixel ID` → `NEXT_PUBLIC_META_PIXEL_ID`
    - Générer Access Token CAPI → `META_CAPI_ACCESS_TOKEN`
    - Mode test : générer `TEST_EVENT_CODE` → `META_CAPI_TEST_EVENT_CODE`

---

## 7. UpConfirm — confirmation COD IA

1. Créer compte sur [upconfirm.com](https://upconfirm.com) (ou équivalent marocain)
2. Workspace BISOU → récupérer :
   - `UPCONFIRM_API_KEY`
   - `UPCONFIRM_WORKSPACE_ID`
   - `UPCONFIRM_WEBHOOK_SECRET` (pour signer les callbacks)
3. Configurer le webhook dans UpConfirm :
   - URL : `https://bisou.ma/api/webhooks/upconfirm`
   - Events : `order.confirmed`, `order.refused`, `order.no_answer`
4. Renseigner les 3 variables dans Vercel + `.env.local`
5. Paramétrer le script d'appel IA (français darija) dans l'interface UpConfirm
6. Tester avec une commande réelle avant de passer en prod

---

## 8. Alya Pay — BNPL 3x

> Optionnel — Phase 2. Nécessaire uniquement si paniers > 400 MAD.

1. Onboarding marchand sur [alyapay.com](https://alyapay.com)
2. Fournir : ICE, RC, RIB, statuts société
3. Sandbox d'abord → récupérer `ALYA_PAY_MERCHANT_ID`, `ALYA_PAY_API_KEY`,
   `ALYA_PAY_WEBHOOK_SECRET`
4. Définir `ALYA_PAY_ENVIRONMENT=sandbox` puis `production` après validation
5. Webhook : `https://bisou.ma/api/webhooks/alya-pay`
6. Tester : commande > 400 MAD → choisir « Payer en 3x » → flow BNPL

---

## 9. Cloudinary — hébergement images

1. Créer compte gratuit sur [cloudinary.com](https://cloudinary.com)
2. Dashboard → récupérer :
   - `cloud_name` → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `api_key` → `CLOUDINARY_API_KEY`
   - `api_secret` → `CLOUDINARY_API_SECRET`
3. Settings → Upload → Add upload preset :
   - Name : `bisou_products`
   - Mode : Unsigned
   - Folder : `bisou/products`
   - Transformations : auto-format, auto-quality
4. Renseigner dans Vercel + `.env.local`
5. L'adapter Payload `Media` uploadera automatiquement vers Cloudinary

---

## 10. Vérifications post-déploiement

Après que `bisou.ma` est live, valider chacun de ces points :

- [ ] `https://bisou.ma/` charge en < 2s (Lighthouse > 90)
- [ ] `https://bisou.ma/admin` → login Payload fonctionne
- [ ] 22 produits visibles dans l'admin Payload
- [ ] `/collections/colliers` affiche les 5 colliers
- [ ] PDP `/produits/collier-minimaliste-or` → JSON-LD Product valide
  (tester sur [Google Rich Results Test](https://search.google.com/test/rich-results))
- [ ] Formulaire `/checkout` → soumission crée une commande `CMD-001` dans Payload
- [ ] WhatsApp s'ouvre automatiquement après commande avec le bon template
- [ ] UpConfirm reçoit le webhook (voir son dashboard)
- [ ] Meta Pixel reçoit les events (Events Manager → Test Events)
- [ ] `/sitemap.xml` liste toutes les routes publiques
- [ ] `/robots.txt` autorise tout sauf `/admin` et `/api`
- [ ] `/cgv`, `/mentions-legales`, `/politique-confidentialite` accessibles
- [ ] HTTPS OK avec certificat Cloudflare (pas d'erreur mixed content)
- [ ] Rate-limit Cloudflare actif sur `/api/orders` (test avec curl en boucle)
- [ ] `grep -r "212600000000" src/` → aucun résultat hors `src/lib/whatsapp.ts`
- [ ] `grep -r "wa.me" src/` → aucun résultat hors `src/lib/whatsapp.ts`

### Rollback si problème

- Vercel → Deployments → cliquer le deploy précédent → « Promote to Production »
- Railway : snapshots automatiques des bases — restauration en 1 clic

---

## Dépannage

| Erreur | Solution |
|---|---|
| `Module not found: @payload-config` | Vérifier `paths` dans `tsconfig.json` |
| `DATABASE_URI not set` | Copier `.env.example` → `.env.local` et remplir |
| Admin Payload 404 | Lancer `pnpm payload:migrate` |
| WhatsApp webhook rejected | Vérifier que `WA_WEBHOOK_VERIFY_TOKEN` matche des deux côtés |
| Cloudinary uploads fail | Vérifier que le preset `bisou_products` est « Unsigned » |
| Vercel build timeout | Réduire la taille du seed ou désactiver le seed sur Vercel |

---

**Repo :** https://github.com/issamafif0505-debug/BISOU (branche `master`)
**Domaine :** https://bisou.ma
**Support :** voir `CLAUDE.md` pour la documentation technique complète
