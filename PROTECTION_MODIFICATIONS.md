# 🛡️ Protection des Modifications - Guide Complet

## ⚠️ Pour ne plus perdre vos modifications

### 📋 Méthode 1 : Sauvegarde manuelle rapide (Recommandé)

**À chaque fois que vous faites des modifications importantes :**

```bash
./sauvegarder.sh
```

Ou avec un message personnalisé :
```bash
./sauvegarder.sh "Ajout nouvelle fonctionnalité Zikr"
```

**Ce script va :**
- ✅ Ajouter tous les fichiers modifiés
- ✅ Créer un commit avec horodatage
- ✅ Vous proposer de pousser vers GitHub
- ✅ Sauvegarder localement ET sur GitHub

---

### 🔄 Méthode 2 : Sauvegarde automatique

**Pour sauvegarder automatiquement toutes les 10 minutes :**

```bash
./sauvegarder-auto.sh
```

**Pour un intervalle personnalisé (ex: 5 minutes) :**

```bash
./sauvegarder-auto.sh 5
```

**Le script va :**
- ✅ Vérifier les modifications toutes les X minutes
- ✅ Sauvegarder automatiquement si des changements sont détectés
- ✅ Pousser vers GitHub si possible
- ✅ Continuer en arrière-plan

**Pour arrêter :** Appuyez sur `Ctrl+C`

---

### 📝 Méthode 3 : Commandes Git manuelles

**Sauvegarde rapide :**

```bash
# Ajouter tous les fichiers
git add -A

# Créer un commit
git commit -m "Description de vos modifications"

# Pousser vers GitHub (si configuré)
git push
```

**Vérifier l'état avant de sauvegarder :**

```bash
# Voir les fichiers modifiés
git status

# Voir les différences
git diff
```

---

### 🎯 Bonnes Pratiques

#### ✅ Faites régulièrement :

1. **Sauvegardez après chaque fonctionnalité importante**
   ```bash
   ./sauvegarder.sh "Ajout fonctionnalité X"
   ```

2. **Sauvegardez avant de fermer votre ordinateur**
   ```bash
   ./sauvegarder.sh "Sauvegarde avant fermeture"
   ```

3. **Sauvegardez avant de faire des changements majeurs**
   ```bash
   ./sauvegarder.sh "Point de sauvegarde avant refactoring"
   ```

#### ❌ À éviter :

- ❌ Travailler longtemps sans sauvegarder
- ❌ Oublier de pousser vers GitHub
- ❌ Faire des modifications sans commit

---

### 🔍 Vérifier vos sauvegardes

**Voir l'historique des commits :**

```bash
git log --oneline -10
```

**Voir les modifications non sauvegardées :**

```bash
git status
```

**Voir les différences :**

```bash
git diff
```

---

### 🚨 En cas de problème

#### Si vous avez perdu des modifications :

1. **Vérifier l'historique Git :**
   ```bash
   git log --all --oneline
   ```

2. **Voir les commits récents :**
   ```bash
   git reflog
   ```

3. **Récupérer un commit spécifique :**
   ```bash
   git checkout <hash-du-commit>
   ```

#### Si GitHub n'est pas à jour :

```bash
# Pousser tous les commits locaux
git push origin main

# Ou forcer si nécessaire (attention !)
git push -f origin main
```

---

### 💡 Astuces

1. **Créez un alias pour sauvegarder rapidement :**
   ```bash
   # Ajouter dans ~/.zshrc ou ~/.bashrc
   alias save='cd /Users/clever/thiernohassanedeme/fayda-mobile && ./sauvegarder.sh'
   ```
   Ensuite utilisez simplement : `save`

2. **Configurez un rappel automatique :**
   - Utilisez le script `sauvegarder-auto.sh` en arrière-plan
   - Ou créez un cron job pour sauvegarder régulièrement

3. **Utilisez des messages de commit descriptifs :**
   ```bash
   ./sauvegarder.sh "Correction bug lecteur audio - vitesse de lecture"
   ```

---

### 📊 Statistiques

**Voir combien de commits vous avez :**

```bash
git rev-list --count HEAD
```

**Voir la taille de votre dépôt :**

```bash
du -sh .git
```

---

## ✅ Résumé

**Pour ne plus perdre vos modifications :**

1. ✅ Utilisez `./sauvegarder.sh` régulièrement
2. ✅ Poussez vers GitHub avec `git push`
3. ✅ Activez la sauvegarde automatique si vous travaillez longtemps
4. ✅ Vérifiez `git status` avant de fermer

**Vos modifications seront :**
- 💾 Sauvegardées localement (dans .git)
- ☁️ Sauvegardées sur GitHub (si poussées)
- 🔄 Récupérables à tout moment

