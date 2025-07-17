# 🚀 Déploiement Rapide - Trouvé sa chambre

## ⚡ Méthode la Plus Rapide (3 minutes)

### 1. Préparer le projet
```bash
# Tester que tout fonctionne
bun run pre-deploy
```

### 2. Pousser sur GitHub
```bash
git init
git add .
git commit -m "Trouvé sa chambre - Application de logement étudiant"
git remote add origin https://github.com/VOTRE-USERNAME/trouve-sa-chambre.git
git push -u origin main
```

### 3. Déployer sur Vercel (Recommandé)
1. Aller sur [vercel.com](https://vercel.com)
2. "New Project" → Importer depuis GitHub
3. Sélectionner votre repo `trouve-sa-chambre`
4. Cliquer "Deploy" (configuration automatique)
5. **✅ Terminé !** Votre site est en ligne

### 3. Alternative : Déployer sur Netlify
1. Aller sur [netlify.com](https://netlify.com)
2. "New site from Git" → GitHub
3. Sélectionner votre repo `trouve-sa-chambre`
4. Build : `bun run build` | Publish : `dist`
5. **✅ Terminé !** Votre site est en ligne

---

## 🔧 Configuration Automatique

Les fichiers suivants sont déjà configurés :
- ✅ `vercel.json` - Configuration Vercel
- ✅ `netlify.toml` - Configuration Netlify
- ✅ `package.json` - Scripts de build

## 📱 Tester Votre Site

Une fois déployé, testez ces fonctionnalités :
- [ ] Page d'accueil s'affiche correctement
- [ ] Recherche de chambres fonctionne
- [ ] Carte interactive s'affiche
- [ ] Interface admin accessible
- [ ] Ajout de chambres sauvegarde localement

## 🛠️ Dépannage Express

### Build échoue ?
```bash
bun run type-check  # Vérifier les erreurs TypeScript
bun run build      # Tester localement
```

### Site ne s'affiche pas ?
- Vérifier que le build produit un dossier `dist/`
- Vérifier les redirections (SPA routing)

### Données ne se sauvegardent pas ?
- Normal ! Les données sont stockées localement dans le navigateur
- Chaque utilisateur aura ses propres données

## 🎯 Prochaines Étapes

1. **Domaine personnalisé** : Configurer votre-nom.com
2. **Analytics** : Suivre les visiteurs
3. **SEO** : Optimiser pour Google
4. **Base de données** : Remplacer localStorage par une vraie DB

---

**🎉 Félicitations ! Votre application "Trouvé sa chambre" est maintenant en ligne !**