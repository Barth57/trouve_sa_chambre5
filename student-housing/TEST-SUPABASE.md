# 🧪 Test de l'intégration Supabase

## 📋 Checklist avant test

### 1. Installation des dépendances
```bash
# Installer Supabase (peut échouer sans impact)
bun add @supabase/supabase-js
# ou
npm install @supabase/supabase-js
```

### 2. Vérification des fichiers
- ✅ `src/services/supabaseService.ts` - Service avec fallback
- ✅ `src/hooks/useSupabaseData.ts` - Hooks React adaptés
- ✅ `src/components/ConfigurationSupabase.tsx` - Interface configuration
- ✅ `supabase/schema.sql` - Schéma de base de données
- ✅ `.env.example` - Template variables d'environnement

### 3. Comportement attendu

#### SANS configuration Supabase
- ✅ Application fonctionne normalement avec localStorage
- ✅ Onglet "Supabase" affiche les instructions de configuration
- ✅ Console affiche : "Supabase non configuré, utilisation du localStorage"

#### AVEC configuration Supabase
- ✅ Application utilise Supabase pour nouvelles données
- ✅ Migration possible depuis localStorage
- ✅ Données partagées entre utilisateurs
- ✅ Console affiche : "Supabase initialisé avec succès"

## 🚀 Test local (sans Supabase)

1. **Démarrer l'application**
```bash
bun run dev
```

2. **Vérifier le fonctionnement normal**
- Page d'accueil s'affiche
- Recherche fonctionne
- Admin → Ajouter chambre fonctionne
- Admin → Supabase affiche les instructions

3. **Vérifier les logs**
```
Console → "Supabase non configuré, utilisation du localStorage"
```

## 🗄️ Test avec Supabase

### 1. Créer un projet Supabase
1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Attendre la création (~2 min)

### 2. Configurer la base de données
1. **SQL Editor** → New query
2. Copier le contenu de `supabase/schema.sql`
3. Exécuter le SQL
4. Vérifier dans **Table Editor** que les tables existent

### 3. Récupérer les clés
1. **Settings** → **API**
2. Copier :
   - Project URL
   - anon public key

### 4. Configurer l'application
```bash
# Créer .env à la racine
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

### 5. Redémarrer et tester
```bash
# Redémarrer le serveur
bun run dev
```

Vérifications :
- ✅ Console : "Supabase initialisé avec succès"
- ✅ Admin → Supabase → bandeau vert "Configuré"
- ✅ Bouton "Migrer vers Supabase" disponible
- ✅ Nouvelles chambres sauvées dans Supabase

### 6. Test migration
1. Admin → Ajouter quelques chambres (localStorage)
2. Admin → Supabase → Migrer
3. Vérifier dans Supabase Table Editor
4. Actualiser la page → données persistantes

## 🔍 Dépannage

### "Module @supabase/supabase-js introuvable"
**Normal !** L'application fonctionne en mode localStorage.
```bash
# Installer si vous voulez Supabase
bun add @supabase/supabase-js
```

### "Variables d'environnement manquantes"
```bash
# Vérifier le fichier .env
cat .env

# Redémarrer le serveur
bun run dev
```

### "Erreur de connexion Supabase"
1. Vérifier URL et clé dans .env
2. Tester la connexion dans Supabase Dashboard
3. Vérifier les politiques RLS

### Tables n'existent pas
1. Re-exécuter `supabase/schema.sql`
2. Vérifier dans Table Editor
3. Regarder les erreurs dans SQL Editor

### Migration échoue
- Les données localStorage sont corrompues ?
- Problème de permissions dans Supabase ?
- Vérifier les logs de la console

## 📊 Indicateurs de succès

### Mode localStorage ✅
- Badge jaune "Configuration requise"
- Console : "Supabase non configuré"
- Données privées par utilisateur

### Mode Supabase ✅
- Badge vert "Supabase configuré"
- Console : "Supabase initialisé"
- Données partagées entre utilisateurs

### Migration réussie ✅
- Message vert "Migration réussie"
- Données visibles dans Supabase Table Editor
- Nouvelles données sauvées en ligne

## 🎯 Fonctionnalités à tester

### Basiques
- [ ] Ajout de cité fonctionne
- [ ] Ajout de chambre fonctionne
- [ ] Recherche et filtres fonctionnent
- [ ] Carte interactive s'affiche

### Supabase
- [ ] Configuration détectée automatiquement
- [ ] Migration localStorage → Supabase
- [ ] Nouvelles données dans Supabase
- [ ] Synchronisation entre utilisateurs

### Robustesse
- [ ] Fallback localStorage si Supabase en panne
- [ ] Pas d'erreurs si module non installé
- [ ] Configuration partielle gérée gracieusement

## 🎉 Prochaines étapes

Une fois Supabase fonctionnel :
1. **Authentification** : Connexion utilisateurs
2. **Autorisations** : Qui peut ajouter des chambres
3. **Notifications** : Alertes nouvelles chambres
4. **API** : Accès externe aux données
5. **Analytics** : Suivi utilisation

---

**🎊 Félicitations ! Votre application "Trouvé sa chambre" a maintenant une vraie base de données !**