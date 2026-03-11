# BISOU Maroc — Projet E-commerce COD Complet

## Vue d'ensemble
BISOU est une marque de bijoux plaqué or marocaine avec un écosystème e-commerce COD (Cash on Delivery) complet de **14 modules**.

## Déploiement
- **GitHub** : https://github.com/issamafif0505-debug/BISOU
- **HF Space** : https://issam0505-bisou-maroc-dashboard.static.hf.space/index.html
- **HF Token** : stocké dans la mémoire locale Claude (pas dans le repo)
- **HF Space ID** : `issam0505/BISOU-Maroc-Dashboard`

## Architecture
- **Stack** : HTML/CSS/JS vanilla monolithique (aucun framework)
- **Hub** : `brand/index.html` — Page d'accueil avec 14 cartes modules
- **Modules** : Chaque module = 1 fichier HTML autonome dans `brand/`
- **Persistance** : localStorage pour toutes les données utilisateur
- **Serveur local** : `python -m http.server 3000 --directory brand`

## Design System
- **Fonts** : Cormorant Garamond (titres) + Jost (corps)
- **Couleurs** : `--gold: #D4AF37`, `--black: #0D0D0D`, `--card: #1A1A1A`
- **Cards** : fond `#1A1A1A`, border `rgba(212,175,55,0.2)`, hover gold glow
- **Responsive** : `clamp()` + breakpoints 768px / 1024px

## Modules (14)
| # | Module | Fichier |
|---|--------|---------|
| 1 | Brand Guide | `brand-guide.html` |
| 2 | Lookbook | `lookbook.html` |
| 3 | Product Catalog | `product-catalog.html` |
| 4 | Website Homepage | `website-homepage.html` |
| 5 | Landing Marrakech | `landing-marrakech.html` |
| 6 | Checkout COD | `checkout-cod.html` |
| 7 | COD Dashboard | `cod-dashboard.html` |
| 8 | Social Media Kit | `social-media-kit.html` |
| 9 | Email Newsletter | `email-newsletter.html` |
| 10 | Packs Marketing | `packs-marketing.html` |
| 11 | Press Kit | `press-kit.html` |
| 12 | Stratégie Maroc | `strategie-maroc.html` |
| 13 | HF App | `hf-app.html` |
| 14 | UGC Studio Pro | `ugc-studio.html` |

## Produits (22 références)
Bijoux plaqué or — prix 139 à 599 MAD — catégories : Colliers, Bagues, Boucles, Bracelets, Packs, Éditions

## Conventions
- Toujours utiliser le même design system (gold/noir)
- localStorage keys préfixées `bisou_`
- HTML monolithique : tout le CSS dans `<style>`, tout le JS dans `<script>`
- Pas de dépendances externes (sauf Google Fonts CDN)
- Liens WhatsApp : placeholder `212600000000` (à remplacer par le vrai numéro)
- Toujours deployer sur HF Space après modification (via huggingface_hub)
- Toujours push sur GitHub après modification

## Git
- Branch : `master`
- Remote : `origin` → `https://github.com/issamafif0505-debug/BISOU.git`
- GitHub user : `issamafif0505-debug`

## TODO restant
- [ ] Remplacer `212600000000` par le vrai numéro WhatsApp dans tous les fichiers
- [ ] Configurer Google Sheets via SETUP-BISOU.md (setup manuel)
