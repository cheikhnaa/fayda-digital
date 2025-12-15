#!/bin/bash

# Script rapide pour pousser avec un token GitHub
# Usage: ./quick-push.sh [VOTRE_TOKEN]

echo "📤 Push rapide vers GitHub: fayda-digital"
echo "========================================="
echo ""

# Vérifier si un token est fourni en argument
if [ -z "$1" ]; then
    echo "🔑 Pour pousser, vous avez besoin d'un Personal Access Token"
    echo ""
    echo "📝 Créez un token maintenant:"
    echo "   1. Allez sur: https://github.com/settings/tokens"
    echo "   2. Cliquez sur 'Generate new token' → 'Generate new token (classic)'"
    echo "   3. Nom: fayda-digital-push"
    echo "   4. Permission: cochez 'repo'"
    echo "   5. Générez et copiez le token"
    echo ""
    read -sp "🔑 Collez votre token ici: " GITHUB_TOKEN
    echo ""
else
    GITHUB_TOKEN="$1"
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Erreur: Le token ne peut pas être vide"
    exit 1
fi

# Configurer l'URL avec le token
GITHUB_URL="https://${GITHUB_TOKEN}@github.com/cheikhnaa/fayda-digital.git"

echo ""
echo "📤 Envoi du code vers GitHub..."
git push "$GITHUB_URL" main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Succès! Votre projet a été poussé vers GitHub"
    echo "🌐 Dépôt: https://github.com/cheikhnaa/fayda-digital"
    
    # Configurer le remote pour les prochaines fois (sans token dans l'URL)
    git remote set-url origin https://github.com/cheikhnaa/fayda-digital.git
    
    # Stocker le token dans le credential helper
    echo "💾 Stockage des credentials pour les prochaines fois..."
    git credential approve <<EOF
url=https://github.com/cheikhnaa/fayda-digital.git
username=cheikhnaa
password=${GITHUB_TOKEN}
EOF
    
    echo "✅ Configuration terminée!"
else
    echo ""
    echo "❌ Erreur lors du push. Vérifiez:"
    echo "   - Que le token est valide"
    echo "   - Que le dépôt existe sur GitHub"
    echo "   - Que vous avez les permissions d'écriture"
fi

