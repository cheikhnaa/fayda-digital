# Instructions pour pousser vers GitHub

## Méthode 1 : Utiliser un Personal Access Token (Recommandé)

### Étape 1 : Créer un token GitHub

1. Allez sur https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom : `fayda-digital-push`
4. Cochez la permission **`repo`** (accès complet aux dépôts)
5. Cliquez sur **"Generate token"**
6. **Copiez le token immédiatement** (vous ne pourrez plus le voir après)

### Étape 2 : Pousser avec le script

```bash
cd /Users/clever/thiernohassanedeme/fayda-mobile
./push-to-github-token.sh
```

Le script vous demandera le token et poussera le code.

### Étape 3 : Ou pousser manuellement avec le token

```bash
cd /Users/clever/thiernohassanedeme/fayda-mobile

# Remplacez YOUR_TOKEN par votre token
git push https://YOUR_TOKEN@github.com/cheikhnaa/fayda-digital.git main
```

## Méthode 2 : Configurer SSH (Alternative)

### Étape 1 : Générer une clé SSH (si vous n'en avez pas)

```bash
ssh-keygen -t ed25519 -C "votre_email@example.com"
```

### Étape 2 : Ajouter la clé à GitHub

1. Copiez votre clé publique :
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Allez sur https://github.com/settings/keys
3. Cliquez sur **"New SSH key"**
4. Collez votre clé publique
5. Cliquez sur **"Add SSH key"**

### Étape 3 : Configurer le remote en SSH

```bash
cd /Users/clever/thiernohassanedeme/fayda-mobile
git remote set-url origin git@github.com:cheikhnaa/fayda-digital.git
git push -u origin main
```

## Méthode 3 : Utiliser GitHub CLI

```bash
# Installer GitHub CLI (si pas déjà installé)
brew install gh

# S'authentifier
gh auth login

# Pousser
git push -u origin main
```

## Vérification

Après le push, visitez votre dépôt :
https://github.com/cheikhnaa/fayda-digital

