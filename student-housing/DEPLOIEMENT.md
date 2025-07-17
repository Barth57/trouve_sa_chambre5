# 🚀 Guide de Déploiement - Trouvé sa chambre

## Vue d'ensemble
Cette application Trouvé sa chambre est construite avec **Vite + React + TypeScript** et peut être facilement déployée sur plusieurs plateformes. Voici les instructions détaillées pour Vercel et Netlify.

---

## 🔵 Option 1 : Déploiement sur Vercel (Recommandé)

### Pourquoi Vercel ?
- ✅ Optimisé pour React/Next.js/Vite
- ✅ Déploiement automatique via Git
- ✅ CDN global ultra-rapide
- ✅ Certificats SSL automatiques
- ✅ Interface intuitive

### Étapes de déploiement

#### 1. Préparer le projet
```bash
# Vérifier que tout fonctionne localement
bun install
bun run build

# Vérifier que le build se passe bien
ls -la dist/
```

#### 2. Pousser sur GitHub
```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Trouvé sa chambre app"

# Créer un repo sur GitHub et pousser
git remote add origin https://github.com/VOTRE-USERNAME/trouve-sa-chambre.git
git branch -M main
git push -u origin main
```

#### 3. Déployer sur Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec votre compte GitHub
3. Cliquer sur **"New Project"**
4. Importer votre repository `trouve-sa-chambre`
5. Vercel détectera automatiquement Vite
6. Configuration automatique :
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`
   - **Install Command**: `bun install`
7. Cliquer sur **"Deploy"**

#### 4. Configuration personnalisée (optionnel)
Créer un fichier `vercel.json` :
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🟠 Option 2 : Déploiement sur Netlify

### Pourquoi Netlify ?
- ✅ Interface très simple
- ✅ Déploiement drag & drop
- ✅ Formulaires intégrés
- ✅ Fonctions serverless
- ✅ Redirections faciles

### Étapes de déploiement

#### Méthode A : Via Git (Recommandée)
1. Pousser votre code sur GitHub (voir étapes Vercel)
2. Aller sur [netlify.com](https://netlify.com)
3. Cliquer sur **"New site from Git"**
4. Connecter votre repository GitHub
5. Configuration :
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
6. Cliquer sur **"Deploy site"**

#### Méthode B : Drag & Drop
1. Builder localement :
```bash
bun run build
```
2. Aller sur [netlify.com](https://netlify.com)
3. Faire glisser le dossier `dist/` dans la zone de déploiement

#### 3. Configuration Netlify
Créer un fichier `netlify.toml` :
```toml
[build]
  command = "bun run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ⚙️ Configurations Importantes

### 1. Variables d'environnement
Si vous ajoutez des APIs externes plus tard :
```bash
# .env.production
VITE_APP_NAME="Trouvé sa chambre"
VITE_API_URL=https://votre-api.com
```

### 2. Optimisations de build
Dans `package.json`, vérifier :
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 3. Gestion des erreurs 404
Les deux plateformes sont configurées pour rediriger vers `index.html` (SPA routing).

---

## 🎯 Recommandations

### Pour commencer rapidement : **Netlify**
- Plus simple pour les débutants
- Déploiement drag & drop
- Interface très intuitive

### Pour la performance et l'évolutivité : **Vercel**
- CDN plus rapide
- Meilleure intégration avec React
- Outils de développement avancés

---

## 🔧 Après le Déploiement

### 1. Configurer un domaine personnalisé
- **Vercel** : Project Settings > Domains
- **Netlify** : Site Settings > Domain management

### 2. Activer les analytics
- **Vercel** : Onglet Analytics (gratuit)
- **Netlify** : Onglet Analytics (payant)

### 3. Optimiser les performances
- Activer la compression Gzip
- Configurer les headers de cache
- Utiliser les Lighthouse audits

---

## 🆘 Dépannage Courant

### Build qui échoue
```bash
# Vérifier localement
bun run build

# Nettoyer le cache
rm -rf node_modules dist
bun install
bun run build
```

### Problème de routing
Vérifier que les redirections sont configurées dans `vercel.json` ou `netlify.toml`.

### Erreurs TypeScript
```bash
# Vérifier les types
bun run type-check
# ou
bunx tsc --noEmit
```

---

## 📈 Étapes Suivantes

1. **Monitoring** : Configurer des alertes de performances
2. **CI/CD** : Automatiser les tests avant déploiement
3. **SEO** : Ajouter les meta tags appropriées
4. **PWA** : Transformer en Progressive Web App
5. **Backend** : Intégrer une base de données réelle

---

Votre application "Trouvé sa chambre" sera en ligne en quelques minutes ! 🎉