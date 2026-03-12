# DEPLOYMENT GUIDE — Hugging Face Spaces

Guide complet pour déployer le dashboard ÔRIYA Maroc sur Hugging Face Spaces en 10 étapes simples.

---

## ✅ ÉTAPE 1 : Créer compte Hugging Face

1. Aller sur https://huggingface.co/join
2. S'enregistrer avec :
   - Email valide
   - Mot de passe sécurisé
   - Confirmer email
3. Compléter profil (optionnel mais recommandé)

---

## ✅ ÉTAPE 2 : Accéder à la section Spaces

1. Une fois connecté, aller sur : https://huggingface.co/spaces
2. Cliquer sur le bouton bleu "Create New Space" (coin haut droit)

---

## ✅ ÉTAPE 3 : Créer un nouveau Space

Remplir les informations suivantes :

| Champ | Valeur |
|-------|--------|
| **Space name** | `oriya-maroc-launch` |
| **License** | Open Licence |
| **Select Space SDK** | **Static HTML** (IMPORTANT) |
| **Private/Public** | Public |

Exemple :
```
Space name: oriya-maroc-launch
License: openrail
Space SDK: Static HTML [TRÈS IMPORTANT]
Visibility: Public
```

---

## ✅ ÉTAPE 4 : Uploader le fichier HTML

### Méthode 1 : Via interface web
1. Cliquer sur l'onglet **"Files"** (en haut du Space)
2. Cliquer sur **"Add file"** → **"Upload files"**
3. Sélectionner le fichier `hf-app.html`
4. Le renommer en `index.html` (IMPORTANT)
5. Cliquer "Upload"

### Méthode 2 : Via Git (avancé)
```bash
git clone https://huggingface.co/spaces/YourUsername/oriya-maroc-launch
cd oriya-maroc-launch
cp /chemin/vers/hf-app.html index.html
git add index.html
git commit -m "Initial dashboard upload"
git push
```

---

## ✅ ÉTAPE 5 : Vérifier le déploiement

1. Attendre 30-60 secondes
2. Le Space se publie automatiquement
3. Une fois publié, tu veras un message vert "Space is ready"
4. Cliquer sur le lien public généré

### Ton URL sera :
```
https://huggingface.co/spaces/YourUsername/oriya-maroc-launch
```

Remplace `YourUsername` par ton vrai username Hugging Face.

---

## ✅ ÉTAPE 6 : Personnaliser le numéro WhatsApp

Dans le fichier HTML, chercher et remplacer **TOUS LES OCCURRENCES** de :
```
+212600000000
```

Par ton vrai numéro WhatsApp Maroc (format international) :
```
+212XXXXXXXXX
```

### Exemple :
- Avant : `https://wa.me/212600000000`
- Après : `https://wa.me/212612345678`

### Où remplacer ?
- Nav WhatsApp button (section hero)
- Tous les liens "Commander" (packs)
- Tous les liens "Demander" (downloads)
- Footer contact WhatsApp

---

## ✅ ÉTAPE 7 : Personnaliser email & contact

Remplacer également :
- `contact@oriya.ma` → Ton email réel
- Tous les textes `+212 6XX XXX XXX` → Ton vrai numéro

### Localiser dans le HTML :
```html
<!-- FOOTER -->
<p>📱 <a href="https://wa.me/212600000000">WhatsApp : +212 6XX XXX XXX</a></p>
<p>📧 <a href="mailto:contact@oriya.ma">Email : contact@oriya.ma</a></p>
```

---

## ✅ ÉTAPE 8 : Tester le Space

Une fois publié :

1. **Tester responsive** : Ouvrir DevTools (F12) → toggle device toolbar
2. **Tester les boutons WhatsApp** : Cliquer sur les liens (doivent ouvrir WhatsApp)
3. **Vérifier l'affichage** : Desktop + Tablet + Mobile
4. **Vérifier les couleurs** : Gold doit être visible, dark background

### Navigation test :
- [ ] Navbar logo "ÔRIYA" visible
- [ ] Liens nav cliquables
- [ ] Section Packs s'affiche bien
- [ ] Section KPIs colorée (gold background)
- [ ] Tableau de revenue lisible
- [ ] Section Downloads visible
- [ ] Footer contact valide

---

## ✅ ÉTAPE 9 : Partager le Space

Une fois validé, ton URL publique est :

```
https://huggingface.co/spaces/YourUsername/oriya-maroc-launch
```

Partager sur :
- **Instagram bio** : Mettre ce lien
- **Instagram stories** : Mentionner "lien en bio"
- **WhatsApp status** : "Découvrez notre stratégie Maroc"
- **Email signature** : "Notre dashboard"
- **LinkedIn** : Post de lancement

---

## ✅ ÉTAPE 10 : Maintenance & Mises à jour

### Si tu dois modifier le contenu :

1. Aller dans ton Space
2. Cliquer sur **"Files"** tab
3. Ouvrir `index.html` (cliquer dessus)
4. Cliquer le crayon 📝 (Edit button)
5. Modifier le contenu
6. **Commit changes** (bouton vert)
7. Changes appliquées instantanément (pas de redéploiement)

### Backups :
- Garder une copie locale du fichier
- Versionner sur Git/GitHub (optionnel mais recommandé)

---

## 📋 CHECKLIST PRÉ-LANCEMENT

Avant de partager largement :

- [ ] Compte HF créé et actif
- [ ] Space créé avec nom `oriya-maroc-launch`
- [ ] SDK : **Static HTML** (pas Streamlit/Gradio)
- [ ] Fichier `index.html` uploadé et visible
- [ ] Lien public généré
- [ ] Numéro WhatsApp actualisé (+212XXXXXXXXX)
- [ ] Email actualisé (contact@oriya.ma)
- [ ] Tested sur desktop/tablet/mobile
- [ ] Tous les boutons cliquables
- [ ] Affichage correct (pas de déformation)
- [ ] Couleurs gold/dark visibles
- [ ] KPI section colorée
- [ ] Download links fonctionnels (WhatsApp)

---

## 🔧 TROUBLESHOOTING

### Le Space ne s'affiche pas
- Vérifier que le fichier est nommé `index.html` (pas `hf-app.html`)
- Vérifier que le SDK est "Static HTML" (pas autre)
- Attendre 2-3 minutes, puis refresh

### Les styles ne s'appliquent pas
- Le CSS est intégré dans le HTML (pas de fichiers externes)
- Vider le cache du navigateur (Ctrl+Shift+Del)
- Essayer en mode incognito

### Les boutons WhatsApp ne fonctionnent pas
- Vérifier l'URL format : `https://wa.me/212XXXXXXXXX`
- Tester le lien dans un nouvel onglet
- S'assurer que WhatsApp Web est accessible

### Le rendu est mauvais sur mobile
- Ouvrir DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Vérifier les media queries (@media 768px)

---

## 💡 TIPS & BEST PRACTICES

1. **URL courte** : Utiliser un shortener (bit.ly, short.link) pour les partages
2. **Backup** : Garder une copie locale du fichier
3. **Version control** : Versionner sur GitHub (optionnel)
4. **Analytics** : Ajouter Google Analytics (optionnel)
5. **Updates** : Publier une nouvelle version chaque mois

---

## 📊 RÉSULTATS ATTENDUS

Une fois déployé, tu auras :

✅ Dashboard public accessible 24/7
✅ Pas de coût d'hébergement (Hugging Face gratuit)
✅ Domaine personnel avec ton username
✅ HTTPS activé automatiquement
✅ Mobile responsive
✅ Shareable sur réseaux sociaux

---

## 📞 SUPPORT

**Documentation Hugging Face Spaces** :
https://huggingface.co/docs/hub/spaces

**Discord Hugging Face** (communauté) :
https://discord.gg/JfAtqEZZVE

**Aide sur Static HTML** :
https://huggingface.co/docs/hub/spaces-config-reference

---

## ✨ PROCHAINES ÉTAPES

Une fois le Space en ligne :

1. Partager sur tous les réseaux
2. Ajouter le lien en bio Instagram
3. Envoyer aux influencers (+ PDF strategy)
4. Inclure dans emails/WhatsApp
5. Tracker les clics (optionnel : Google Analytics)

---

**Dashboard créé le** : 2024-2025
**Framework** : HTML/CSS statique
**Hébergement** : Hugging Face Spaces (Gratuit)
**Propriétaire** : ÔRIYA — L'or qui t'embrasse

🎉 **Bon lancement au Maroc !**
