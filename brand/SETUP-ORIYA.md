# ÔRIYA COD — Guide d'installation Google Sheets

**Temps estimé : 10 minutes**

---

## Etape 1 : Creer le Google Sheet

1. Aller sur [sheets.google.com](https://sheets.google.com)
2. Cliquer sur **+ Nouveau** (ou le bouton "+" en bas a gauche)
3. Nommer le fichier : **ÔRIYA Commandes**
4. Copier l'**ID du Sheet** depuis l'URL :

```
https://docs.google.com/spreadsheets/d/  [COPIER-CECI]  /edit
```

Exemple d'ID : `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`

> La feuille "Commandes" avec les en-tetes sera creee automatiquement par le script lors de la premiere commande.

---

## Etape 2 : Creer le Apps Script

1. Aller sur [script.google.com](https://script.google.com)
2. Cliquer sur **Nouveau projet**
3. Supprimer tout le code par defaut dans l'editeur
4. Coller **l'integralite** du contenu du fichier `google-apps-script.js` (dans le dossier `brand/`)
5. Cliquer sur **Enregistrer** (icone disquette ou Ctrl+S)
6. Nommer le projet : **ÔRIYA COD**

### Deployer le script :

7. Cliquer sur **Deployer** (bouton bleu en haut a droite)
8. Choisir **Nouveau deploiement**
9. Cliquer sur l'icone engrenage a cote de "Selectionner le type" → **Application Web**
10. Configurer :
    - Description : `ÔRIYA COD v1`
    - Executer en tant que : **Moi** (votre compte Google)
    - Acces : **Tout le monde** (important pour que HF puisse appeler le script)
11. Cliquer sur **Deployer**
12. Autoriser les permissions quand Google le demande (cliquer sur votre compte, puis "Autoriser")
13. **Copier l'URL de deploiement** (format : `https://script.google.com/macros/s/AKfy.../exec`)

---

## Etape 3 : Configurer ÔRIYA

### Sur la page de commande (checkout-cod.html) :

1. Ouvrir dans le navigateur :
   ```
   https://issam0505-oriya-maroc-dashboard.static.hf.space/checkout-cod.html?admin=1
   ```
2. Un panneau "Configuration Google Sheets" apparait en bas de page
3. Coller l'**URL Apps Script** dans le champ prevu
4. Cliquer sur **Sauvegarder**
5. Optionnel : cliquer sur **Tester la connexion** pour verifier

### Sur le dashboard (cod-dashboard.html) :

6. Ouvrir dans le navigateur :
   ```
   https://issam0505-oriya-maroc-dashboard.static.hf.space/cod-dashboard.html?admin=1
   ```
7. Un panneau "Configuration Google Sheets" apparait en haut de page
8. Coller l'**URL Apps Script** dans le premier champ
9. Coller l'**ID du Sheet** (copie a l'Etape 1) dans le second champ
10. Cliquer sur **Sauvegarder**
11. Cliquer sur **Tester connexion** pour verifier
12. Cliquer sur **Charger depuis Sheets** pour voir les commandes existantes

---

## Comment voir les commandes

### Depuis votre telephone :
- Ouvrir l'app **Google Sheets** → trouver "ÔRIYA Commandes"
- Les colonnes : N° CMD | Date | Prenom | Nom | Telephone | Ville | Adresse | Produit | Prix MAD | Note | Statut | Livreur | Paye

### Depuis le PC :
- Aller sur [sheets.google.com](https://sheets.google.com) → "ÔRIYA Commandes"
- Ou ouvrir `cod-dashboard.html?admin=1` sur HF et cliquer "Charger depuis Sheets"

### Via WhatsApp Business :
- Chaque commande continue d'envoyer un message WhatsApp en parallele
- Le Google Sheet est rempli en arriere-plan sans bloquer le client

---

## Flux d'une commande

```
Client remplit checkout-cod.html
        |
        +--> WhatsApp ouvert immediatement (comportement inchange)
        |
        +--> Fetch silencieux vers Apps Script (si configure)
                  |
                  v
           Google Sheet "Commandes"
           ligne ajoutee : CMD-001, date, prenom, nom, tel, ville...
                  |
                  v
           Disponible sur cod-dashboard.html?admin=1
           (cliquer "Charger depuis Sheets")
```

---

## Problemes courants

| Probleme | Solution |
|---|---|
| "Connexion echouee" | Verifier que le deploiement est en acces "Tout le monde" et non "Utilisateurs connectes" |
| "Autorisation refusee" | Re-deployer le script (Deployer → Gerer les deploiements → Modifier → Deployer) |
| Sheet non trouve | Verifier que le script s'execute sur le bon spreadsheet (ouvrir depuis le Sheet : Extensions → Apps Script) |
| Commandes pas dans le Sheet | Verifier l'URL dans checkout-cod.html?admin=1 avec "Tester la connexion" |
| CORS error dans la console | Normal avec certains reseaux — le sheet est quand meme rempli cote serveur |

---

## Notes de securite

- L'URL Apps Script n'est stockee que dans le `localStorage` du navigateur
- Elle n'est jamais transmise a des tiers
- Le panneau admin n'est visible que via `?admin=1` dans l'URL
- Il est recommande de ne pas partager publiquement l'URL avec `?admin=1`

---

*ÔRIYA — Marrakech, Maroc — 2026*
