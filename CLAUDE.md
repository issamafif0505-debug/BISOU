# ÔRIYA Maroc — Projet E-commerce COD Complet

## Vue d'ensemble
ÔRIYA est une marque de bijoux plaqué or marocaine avec un écosystème e-commerce COD (contre-remboursement) complet de **14 modules HTML**. Le projet est entièrement construit en HTML/CSS/JS vanilla sans framework.

## Déploiement
- **GitHub** : https://github.com/issamafif0505-debug/BISOU (nom du dépôt inchangé)
- **HF Space** : à redéployer sous le nom ÔRIYA
- **Jeton HF** : stocké dans la mémoire locale Claude (pas dans le dépôt)
- **ID HF Space** : à créer (`issam0505/ORIYA-Maroc-Dashboard`)

## Architecture

### Pile technique
- **Pile** : HTML/CSS/JS vanilla monolithique (aucun framework)
- **Page centrale** : `brand/index.html` — Page d'accueil avec 14 cartes modules en grille 3 colonnes
- **Modules** : Chaque module = 1 fichier HTML autonome dans `brand/`
- **Persistance** : localStorage pour toutes les données utilisateur
- **Backend** : Google Apps Script (`brand/google-apps-script.js`) déployé comme application web
- **Serveur local** : `python -m http.server 3000 --directory brand`

### Arborescence des fichiers
```
BISOU/                                 # Nom du dépôt (marque : ÔRIYA)
├── CLAUDE.md                          # Ce fichier — documentation projet
├── brand/
│   ├── index.html                     # Page centrale (14 cartes modules)
│   ├── assets/
│   │   ├── logo.svg                   # Logo principal
│   │   ├── logo-alternate.svg         # Logo alternatif
│   │   └── logo-monogram.svg          # Monogramme
│   │
│   ├── # ── Modules HTML (14) ────────
│   ├── brand-guide.html               # 1. Guide de marque
│   ├── lookbook.html                  # 2. Lookbook produits
│   ├── product-catalog.html           # 3. Catalogue produits
│   ├── website-homepage.html          # 4. Page d'accueil e-commerce
│   ├── landing-marrakech.html         # 5. Page d'atterrissage Marrakech
│   ├── checkout-cod.html              # 6. Formulaire commande COD
│   ├── cod-dashboard.html             # 7. Tableau de bord commandes COD
│   ├── social-media-kit.html          # 8. Kit réseaux sociaux
│   ├── email-newsletter.html          # 9. Modèles email / infolettre
│   ├── packs-marketing.html           # 10. Packs marketing
│   ├── press-kit.html                 # 11. Kit presse
│   ├── strategie-maroc.html           # 12. Stratégie Maroc
│   ├── hf-app.html                    # 13. Application HF Space
│   ├── ugc-studio.html                # 14. Studio UGC Pro
│   │
│   ├── # ── Backend / Configuration ──
│   ├── google-apps-script.js          # Google Apps Script (doPost/doGet pour Google Sheets)
│   ├── writer.js                      # Fichier stub (console.log(42))
│   ├── SETUP-ÔRIYA.md                 # Guide de configuration Google Sheets en 3 étapes
│   │
│   ├── # ── Documentation Stratégie ──
│   ├── brand-strategy.md              # Stratégie de marque
│   ├── strategie-maroc.md             # Stratégie de lancement Maroc
│   ├── maroc-market-intel.md          # Veille marché Maroc
│   ├── oriya-instagram-strategy.md    # Stratégie Instagram
│   ├── oriya-facebook-strategy.md     # Stratégie Facebook
│   ├── oriya-tiktok-strategy.md       # Stratégie TikTok
│   ├── whatsapp-strategy.md           # Stratégie WhatsApp Business
│   ├── instagram-30days.md            # Plan Instagram 30 jours
│   ├── instagram-content-assets.md    # Ressources contenu Instagram
│   ├── influencers-database.md        # Base de données influenceurs
│   ├── logistics-partners.md          # Partenaires logistiques
│   └── hf-deployment.md              # Documentation déploiement HF
```

## Système de design

### Typographie
- **Titres** : Cormorant Garamond (serif) — graisses 300–700
- **Corps** : Jost (sans-serif) — graisses 200–700
- **Variantes** : Playfair Display (cod-dashboard), Inter (strategie-maroc)
- **CDN** : Google Fonts uniquement (`fonts.googleapis.com`, `display=swap`)

### Couleurs — Variables CSS
```css
/* Principal */
--gold: #D4AF37;          /* Couleur principale de marque */
--black: #0D0D0D;         /* Fond principal */
--card: #1A1A1A;           /* Fond des cartes */
--cream: #FDF6E3;          /* Texte clair / accents */
--white: #FFFFFF;
--rose: #F2D7D5;
--grey: #AAAAAA;

/* Variantes doré (index.html) */
--gold-main, --gold-light, --gold-mid, --gold-dark

/* Statuts (cod-dashboard, strategie-maroc) */
--green: #2ECC71;          /* Livré / succès */
--red: #E74C3C;            /* Refusé / erreur */
--orange: #F39C12;         /* En attente */
--blue: #3498DB;           /* Information */

/* WhatsApp */
--whatsapp: #25D366;       /* Boutons WhatsApp (alias --wa) */

/* Mise en page */
--radius: 12px;
--transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Composants
- **Cartes** : fond `#1A1A1A`, bordure `rgba(212,175,55,0.2)`, lueur dorée au survol
- **Responsive** : `clamp()` + points de rupture 768px / 1024px
- **Grille centrale** : 3 colonnes, espacement 40px, largeur max 1200px

## Modules (14)

| # | Module | Fichier | Description |
|---|--------|---------|-------------|
| 1 | Guide de marque | `brand-guide.html` | Identité visuelle, logos, couleurs |
| 2 | Lookbook | `lookbook.html` | Galerie produits stylisée |
| 3 | Catalogue produits | `product-catalog.html` | Catalogue avec fiches produits |
| 4 | Page d'accueil | `website-homepage.html` | Page d'accueil e-commerce complète |
| 5 | Page Marrakech | `landing-marrakech.html` | Page d'atterrissage ciblée Marrakech |
| 6 | Commande COD | `checkout-cod.html` | Formulaire de commande COD + WhatsApp |
| 7 | Tableau de bord COD | `cod-dashboard.html` | Tableau de bord des commandes |
| 8 | Kit réseaux sociaux | `social-media-kit.html` | Modèles pour réseaux sociaux |
| 9 | Email / Infolettre | `email-newsletter.html` | Modèles email marketing |
| 10 | Packs marketing | `packs-marketing.html` | Packs promotionnels |
| 11 | Kit presse | `press-kit.html` | Kit presse / médias |
| 12 | Stratégie Maroc | `strategie-maroc.html` | Tableau de bord stratégie |
| 13 | Application HF | `hf-app.html` | Interface déployée sur HF Space |
| 14 | Studio UGC Pro | `ugc-studio.html` | Gestion contenu UGC / créateurs |

## Produits (22 références)
Bijoux plaqué or — prix 139 à 599 MAD — catégories : Colliers, Bagues, Boucles, Bracelets, Packs, Éditions

## Flux de données

### Commandes COD
1. Le client remplit `checkout-cod.html` (prénom, nom, téléphone, ville, adresse, produit)
2. WhatsApp s'ouvre immédiatement avec le récapitulatif
3. Un `fetch()` silencieux envoie les données au Google Apps Script
4. Le script écrit une ligne dans la Google Sheet « Commandes »
5. `cod-dashboard.html` lit les commandes via `?action=getOrders`

### Google Apps Script (`google-apps-script.js`)
- `doPost(e)` : reçoit les commandes, génère un identifiant (`CMD-001`, `CMD-002`…)
- `doGet(e)` : retourne toutes les commandes en JSON
- 13 colonnes : N° CMD, Date, Prénom, Nom, Téléphone, Ville, Adresse, Produit, Prix MAD, Note, Statut, Livreur, Payé
- Configuration manuelle via `SETUP-ÔRIYA.md` (3 étapes)

### Clés localStorage
```
oriya_orders          # Commandes COD (tableau JSON)
oriya_ugc_videos      # Vidéos Studio UGC
oriya_ugc_calendar    # Calendrier UGC
oriya_ugc_creators    # Profils créateurs
oriya_ugc_collabs     # Données collaborations
oriya_ugc_budget      # Suivi budget UGC
ORIYA_WEBHOOK_URL     # URL Google Apps Script (configuration admin)
ORIYA_SHEET_ID        # Identifiant Google Sheet (configuration admin)
```

## Conventions de développement

### Règles strictes
1. **HTML monolithique** : tout le CSS dans `<style>`, tout le JS dans `<script>` — un seul fichier par module
2. **Pas de dépendances externes** sauf Google Fonts CDN
3. **Système de design cohérent** : doré (#D4AF37) sur noir (#0D0D0D), toujours
4. **Clés localStorage** préfixées `oriya_` (minuscule) ou `ORIYA_` (configuration)
5. **Lectures localStorage sûres** : toujours `JSON.parse(localStorage.getItem(...) || '[]')` avec valeur par défaut

### Patrons JavaScript courants
```javascript
// Lecture sûre du localStorage
const data = JSON.parse(localStorage.getItem('oriya_orders') || '[]');

// Patron getter/setter (Studio UGC)
function getVideos() { return JSON.parse(localStorage.getItem('oriya_ugc_videos') || '[]'); }
function saveVideos(v) { localStorage.setItem('oriya_ugc_videos', JSON.stringify(v)); }

// Accès aux éléments du DOM
document.getElementById('id');
document.querySelector('.class');
document.querySelectorAll('.elements').forEach(el => { ... });

// Onglets / accordéons
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('open');
```

### WhatsApp
- Numéro provisoire actuel : `212600000000` (à remplacer par le vrai numéro)
- Format des liens : `https://wa.me/212600000000?text=...`
- Fichiers concernés : website-homepage (9), hf-app (13), packs-marketing (3), email-newsletter (2), landing-marrakech (2), checkout-cod (1 dynamique), press-kit (1)
- checkout-cod.html construit l'URL dynamiquement avec `encodeURIComponent()`

### Panneau d'administration
- Accès via `?admin=1` dans l'URL
- Permet de configurer ORIYA_WEBHOOK_URL et ORIYA_SHEET_ID

## Git
- **Branche principale** : `master`
- **Dépôt distant** : `origin` → `https://github.com/issamafif0505-debug/BISOU.git`
- **Utilisateur GitHub** : `issamafif0505-debug`

## Processus de déploiement
1. Modifier les fichiers HTML dans `brand/`
2. Tester localement : `python -m http.server 3000 --directory brand`
3. Commit + push sur GitHub (`master`)
4. Déployer sur HF Space via `huggingface_hub` (jeton HF requis)

## Tâches restantes
- [ ] Remplacer `212600000000` par le vrai numéro WhatsApp dans tous les fichiers (31+ occurrences)
- [ ] Configurer Google Sheets via SETUP-ÔRIYA.md (configuration manuelle)
- [ ] `brand/writer.js` est un fichier stub (`console.log(42)`) — à implémenter ou supprimer
