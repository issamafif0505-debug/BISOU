# BISOU Maroc — Projet E-commerce COD Complet

## Vue d'ensemble
BISOU est une marque de bijoux plaqué or marocaine avec un écosystème e-commerce COD (Cash on Delivery) complet de **14 modules HTML**. Le projet est entièrement construit en HTML/CSS/JS vanilla sans framework.

## Déploiement
- **GitHub** : https://github.com/issamafif0505-debug/BISOU
- **HF Space** : https://issam0505-bisou-maroc-dashboard.static.hf.space/index.html
- **HF Token** : stocké dans la mémoire locale Claude (pas dans le repo)
- **HF Space ID** : `issam0505/BISOU-Maroc-Dashboard`

## Architecture

### Stack technique
- **Stack** : HTML/CSS/JS vanilla monolithique (aucun framework)
- **Hub** : `brand/index.html` — Page d'accueil avec 14 cartes modules en grille 3 colonnes
- **Modules** : Chaque module = 1 fichier HTML autonome dans `brand/`
- **Persistance** : localStorage pour toutes les données utilisateur
- **Backend** : Google Apps Script (`brand/google-apps-script.js`) déployé comme web app
- **Serveur local** : `python -m http.server 3000 --directory brand`

### Structure des fichiers
```
BISOU/
├── CLAUDE.md                          # Ce fichier — documentation projet
├── brand/
│   ├── index.html                     # Hub principal (14 cartes modules)
│   ├── assets/
│   │   ├── logo.svg                   # Logo principal
│   │   ├── logo-alternate.svg         # Logo alternatif
│   │   └── logo-monogram.svg          # Monogramme
│   │
│   ├── # ── Modules HTML (14) ────────
│   ├── brand-guide.html               # 1. Guide de marque
│   ├── lookbook.html                  # 2. Lookbook produits
│   ├── product-catalog.html           # 3. Catalogue produits
│   ├── website-homepage.html          # 4. Homepage e-commerce
│   ├── landing-marrakech.html         # 5. Landing page Marrakech
│   ├── checkout-cod.html              # 6. Formulaire checkout COD
│   ├── cod-dashboard.html             # 7. Dashboard commandes COD
│   ├── social-media-kit.html          # 8. Kit réseaux sociaux
│   ├── email-newsletter.html          # 9. Templates email/newsletter
│   ├── packs-marketing.html           # 10. Packs marketing
│   ├── press-kit.html                 # 11. Press kit
│   ├── strategie-maroc.html           # 12. Stratégie Maroc
│   ├── hf-app.html                    # 13. App HF Space
│   ├── ugc-studio.html                # 14. UGC Studio Pro
│   │
│   ├── # ── Backend / Config ─────────
│   ├── google-apps-script.js          # Google Apps Script (doPost/doGet pour Google Sheets)
│   ├── writer.js                      # Stub (console.log(42))
│   ├── SETUP-BISOU.md                 # Guide setup Google Sheets en 3 étapes
│   │
│   ├── # ── Documentation Stratégie ──
│   ├── brand-strategy.md              # Stratégie de marque
│   ├── strategie-maroc.md             # Stratégie de lancement Maroc
│   ├── maroc-market-intel.md          # Intelligence marché Maroc
│   ├── bisou-instagram-strategy.md    # Stratégie Instagram
│   ├── bisou-facebook-strategy.md     # Stratégie Facebook
│   ├── bisou-tiktok-strategy.md       # Stratégie TikTok
│   ├── whatsapp-strategy.md           # Stratégie WhatsApp Business
│   ├── instagram-30days.md            # Plan Instagram 30 jours
│   ├── instagram-content-assets.md    # Assets contenu Instagram
│   ├── influencers-database.md        # Base données influenceurs
│   ├── logistics-partners.md          # Partenaires logistiques
│   └── hf-deployment.md              # Documentation déploiement HF
```

## Design System

### Typographie
- **Titres** : Cormorant Garamond (serif) — weights 300–700
- **Corps** : Jost (sans-serif) — weights 200–700
- **Variantes** : Playfair Display (cod-dashboard), Inter (strategie-maroc)
- **CDN** : Google Fonts uniquement (`fonts.googleapis.com`, `display=swap`)

### Couleurs — Variables CSS
```css
/* Core */
--gold: #D4AF37;          /* Couleur principale de marque */
--black: #0D0D0D;         /* Fond principal */
--card: #1A1A1A;           /* Fond des cartes */
--cream: #FDF6E3;          /* Texte clair / accents */
--white: #FFFFFF;
--rose: #F2D7D5;
--grey: #AAAAAA;

/* Variantes gold (index.html) */
--gold-main, --gold-light, --gold-mid, --gold-dark

/* Statuts (cod-dashboard, strategie-maroc) */
--green: #2ECC71;          /* Livré / succès */
--red: #E74C3C;            /* Refusé / erreur */
--orange: #F39C12;         /* En attente */
--blue: #3498DB;           /* Info */

/* WhatsApp */
--whatsapp: #25D366;       /* Boutons WhatsApp (alias --wa) */

/* Layout */
--radius: 12px;
--transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Composants
- **Cards** : fond `#1A1A1A`, border `rgba(212,175,55,0.2)`, hover gold glow
- **Responsive** : `clamp()` + breakpoints 768px / 1024px
- **Grille hub** : 3 colonnes, gap 40px, max-width 1200px

## Modules (14)

| # | Module | Fichier | Description |
|---|--------|---------|-------------|
| 1 | Brand Guide | `brand-guide.html` | Identité visuelle, logos, couleurs |
| 2 | Lookbook | `lookbook.html` | Galerie produits stylisée |
| 3 | Product Catalog | `product-catalog.html` | Catalogue avec fiches produits |
| 4 | Website Homepage | `website-homepage.html` | Page d'accueil e-commerce complète |
| 5 | Landing Marrakech | `landing-marrakech.html` | Landing page ciblée Marrakech |
| 6 | Checkout COD | `checkout-cod.html` | Formulaire de commande COD + WhatsApp |
| 7 | COD Dashboard | `cod-dashboard.html` | Tableau de bord commandes |
| 8 | Social Media Kit | `social-media-kit.html` | Templates réseaux sociaux |
| 9 | Email Newsletter | `email-newsletter.html` | Templates email marketing |
| 10 | Packs Marketing | `packs-marketing.html` | Packs promotionnels |
| 11 | Press Kit | `press-kit.html` | Kit presse / médias |
| 12 | Stratégie Maroc | `strategie-maroc.html` | Tableau de bord stratégie |
| 13 | HF App | `hf-app.html` | Interface déployée sur HF Space |
| 14 | UGC Studio Pro | `ugc-studio.html` | Gestion contenu UGC / créateurs |

## Produits (22 références)
Bijoux plaqué or — prix 139 à 599 MAD — catégories : Colliers, Bagues, Boucles, Bracelets, Packs, Éditions

## Flux de données

### Commandes COD
1. Client remplit `checkout-cod.html` (prénom, nom, téléphone, ville, adresse, produit)
2. WhatsApp s'ouvre immédiatement avec le récapitulatif
3. `fetch()` silencieux envoie les données au Google Apps Script
4. Le script écrit une ligne dans la Google Sheet "Commandes"
5. `cod-dashboard.html` lit les commandes via `?action=getOrders`

### Google Apps Script (`google-apps-script.js`)
- `doPost(e)` : reçoit les commandes, génère un ID (`CMD-001`, `CMD-002`...)
- `doGet(e)` : retourne toutes les commandes en JSON
- 13 colonnes : N° CMD, Date, Prénom, Nom, Téléphone, Ville, Adresse, Produit, Prix MAD, Note, Statut, Livreur, Payé
- Setup manuel via `SETUP-BISOU.md` (3 étapes)

### localStorage Keys
```
bisou_orders          # Commandes COD (JSON array)
bisou_ugc_videos      # Vidéos UGC Studio
bisou_ugc_calendar    # Calendrier UGC
bisou_ugc_creators    # Profils créateurs
bisou_ugc_collabs     # Données collaborations
bisou_ugc_budget      # Suivi budget UGC
BISOU_WEBHOOK_URL     # URL Google Apps Script (config admin)
BISOU_SHEET_ID        # ID Google Sheet (config admin)
```

## Conventions de développement

### Règles strictes
1. **HTML monolithique** : tout le CSS dans `<style>`, tout le JS dans `<script>` — un seul fichier par module
2. **Pas de dépendances externes** sauf Google Fonts CDN
3. **Design system cohérent** : gold (#D4AF37) sur noir (#0D0D0D), toujours
4. **localStorage keys** préfixées `bisou_` (minuscule) ou `BISOU_` (config)
5. **Lectures localStorage sûres** : toujours `JSON.parse(localStorage.getItem(...) || '[]')` avec fallback

### Patterns JavaScript courants
```javascript
// Lecture safe localStorage
const data = JSON.parse(localStorage.getItem('bisou_orders') || '[]');

// Getter/setter pattern (UGC Studio)
function getVideos() { return JSON.parse(localStorage.getItem('bisou_ugc_videos') || '[]'); }
function saveVideos(v) { localStorage.setItem('bisou_ugc_videos', JSON.stringify(v)); }

// Accès éléments DOM
document.getElementById('id');
document.querySelector('.class');
document.querySelectorAll('.elements').forEach(el => { ... });

// Tabs / accordéons
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('open');
```

### WhatsApp
- Placeholder actuel : `212600000000` (à remplacer par le vrai numéro)
- Format liens : `https://wa.me/212600000000?text=...`
- Fichiers concernés : website-homepage (9), hf-app (13), packs-marketing (3), email-newsletter (2), landing-marrakech (2), checkout-cod (1 dynamique), press-kit (1)
- checkout-cod.html construit l'URL dynamiquement avec `encodeURIComponent()`

### Panneau admin
- Accès via `?admin=1` dans l'URL
- Permet de configurer BISOU_WEBHOOK_URL et BISOU_SHEET_ID

## Git
- **Branch principale** : `master`
- **Remote** : `origin` → `https://github.com/issamafif0505-debug/BISOU.git`
- **GitHub user** : `issamafif0505-debug`

## Workflow de déploiement
1. Modifier les fichiers HTML dans `brand/`
2. Tester localement : `python -m http.server 3000 --directory brand`
3. Commit + push sur GitHub (`master`)
4. Déployer sur HF Space via `huggingface_hub` (HF Token requis)

## TODO restant
- [ ] Remplacer `212600000000` par le vrai numéro WhatsApp dans tous les fichiers (31+ occurrences)
- [ ] Configurer Google Sheets via SETUP-BISOU.md (setup manuel)
- [ ] `brand/writer.js` est un stub (`console.log(42)`) — à implémenter ou supprimer
