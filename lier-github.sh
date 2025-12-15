#!/bin/bash

# Script pour lier le projet à GitHub et pousser le code

echo "🔗 Liaison du projet Fayda Digital à GitHub"
echo "============================================"
echo ""

# Vérifier si le remote existe déjà
if git remote | grep -q "^origin$"; then
    echo "✅ Remote 'origin' déjà configuré:"
    git remote -v
    echo ""
    read -p "Voulez-vous le remplacer? (o/n): " REPLACE
    if [ "$REPLACE" = "o" ] || [ "$REPLACE" = "O" ]; then
        git remote remove origin
        echo "✅ Remote supprimé"
    else
        echo "ℹ️  Utilisation du remote existant"
    fi
fi

# Si pas de remote, en créer un
if ! git remote | grep -q "^origin$"; then
    echo ""
    echo "📝 Configuration du remote GitHub"
    echo "─────────────────────────────────"
    read -p "Entrez votre nom d'utilisateur GitHub: " GITHUB_USER
    
    if [ -z "$GITHUB_USER" ]; then
        GITHUB_USER="cheikhnaa"
        echo "Utilisation du nom par défaut: $GITHUB_USER"
    fi
    
    REPO_NAME="fayda-digital"
    GITHUB_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    
    echo ""
    echo "🔗 Ajout du remote: $GITHUB_URL"
    git remote add origin "$GITHUB_URL"
    
    echo "✅ Remote configuré!"
    git remote -v
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 ÉTAPE 1 : Créer le dépôt sur GitHub"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Avant de pousser, vous devez créer le dépôt sur GitHub :"
echo ""
echo "1. Allez sur : https://github.com/new"
echo "2. Repository name : fayda-digital"
echo "3. Description : Application mobile Fayda Digital"
echo "4. Visibilité : Private (recommandé) ou Public"
echo "5. ⚠️  NE COCHEZ PAS 'Initialize with README'"
echo "6. Cliquez sur 'Create repository'"
echo ""

read -p "Avez-vous créé le dépôt sur GitHub? (o/n): " REPO_CREATED

if [ "$REPO_CREATED" != "o" ] && [ "$REPO_CREATED" != "O" ]; then
    echo ""
    echo "⏸️  Créez d'abord le dépôt sur GitHub, puis relancez ce script"
    echo "   Ou ouvrez : https://github.com/new"
    exit 0
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🔑 ÉTAPE 2 : Créer un Personal Access Token"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "GitHub nécessite un token pour l'authentification :"
echo ""
echo "1. Allez sur : https://github.com/settings/tokens"
echo "2. Cliquez sur 'Generate new token' → 'Generate new token (classic)'"
echo "3. Note : fayda-digital-push"
echo "4. Permission : cochez 'repo' ✅"
echo "5. Générez et copiez le token (commence par ghp_)"
echo ""

read -p "Avez-vous créé le token? (o/n): " TOKEN_CREATED

if [ "$TOKEN_CREATED" != "o" ] && [ "$TOKEN_CREATED" != "O" ]; then
    echo ""
    echo "⏸️  Créez d'abord le token, puis relancez ce script"
    echo "   Ou ouvrez : https://github.com/settings/tokens"
    exit 0
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📤 ÉTAPE 3 : Pousser le code vers GitHub"
echo "═══════════════════════════════════════════════════════════════"
echo ""

read -sp "🔑 Collez votre token GitHub ici: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Erreur: Le token ne peut pas être vide"
    exit 1
fi

# Obtenir l'URL du remote
REMOTE_URL=$(git remote get-url origin)

# Extraire le nom d'utilisateur et le repo
if [[ "$REMOTE_URL" =~ github.com[:/]([^/]+)/([^/]+)\.git ]]; then
    GITHUB_USER="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]}"
else
    GITHUB_USER="cheikhnaa"
    REPO_NAME="fayda-digital"
fi

# Construire l'URL avec token
GITHUB_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "📤 Envoi du code vers GitHub..."
echo "───────────────────────────────────────────────────────────────"

# Pousser le code
git push "$GITHUB_URL" main

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "✅ SUCCÈS ! Projet lié et poussé vers GitHub"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "🌐 Votre dépôt est maintenant disponible sur :"
    echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    
    # Configurer le remote pour les prochaines fois (sans token)
    git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    
    # Stocker les credentials
    echo "💾 Configuration des credentials pour les prochaines fois..."
    git credential approve <<EOF
url=https://github.com/${GITHUB_USER}/${REPO_NAME}.git
username=${GITHUB_USER}
password=${GITHUB_TOKEN}
EOF
    
    echo ""
    echo "✅ Configuration terminée !"
    echo ""
    echo "📝 Pour les prochaines fois, vous pouvez simplement faire :"
    echo "   git push"
    echo ""
    echo "   Plus besoin de token, tout est automatique ! 🎉"
    echo ""
    
    # Ouvrir le dépôt dans le navigateur
    read -p "Voulez-vous ouvrir le dépôt dans votre navigateur ? (o/n): " OPEN_BROWSER
    if [ "$OPEN_BROWSER" = "o" ] || [ "$OPEN_BROWSER" = "O" ]; then
        open "https://github.com/${GITHUB_USER}/${REPO_NAME}" 2>/dev/null || echo "Ouvrez manuellement: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    fi
    
else
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "❌ ERREUR lors du push"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "Vérifiez :"
    echo "   ✓ Que le dépôt existe sur GitHub"
    echo "   ✓ Que le token est correct"
    echo "   ✓ Que le token a la permission 'repo'"
    echo "   ✓ Que vous avez les permissions d'écriture"
    echo ""
fi

