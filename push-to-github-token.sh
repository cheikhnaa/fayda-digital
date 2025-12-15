#!/bin/bash

# Script pour pousser vers GitHub avec token d'accès personnel
# Usage: ./push-to-github-token.sh

echo "📤 Push vers GitHub: fayda-digital"
echo "=================================="
echo ""

# Vérifier que le remote est configuré
if ! git remote | grep -q "^origin$"; then
    echo "❌ Erreur: Le remote 'origin' n'est pas configuré"
    exit 1
fi

echo "🔗 Remote configuré:"
git remote -v
echo ""

# Demander le token d'accès personnel
echo "🔑 Pour pousser vers GitHub, vous avez besoin d'un Personal Access Token (PAT)"
echo ""
echo "📝 Pour créer un token:"
echo "   1. Allez sur https://github.com/settings/tokens"
echo "   2. Cliquez sur 'Generate new token' → 'Generate new token (classic)'"
echo "   3. Donnez un nom (ex: fayda-digital-push)"
echo "   4. Cochez 'repo' pour les permissions"
echo "   5. Cliquez sur 'Generate token'"
echo "   6. Copiez le token (vous ne pourrez plus le voir après)"
echo ""

read -sp "🔑 Entrez votre Personal Access Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Erreur: Le token ne peut pas être vide"
    exit 1
fi

# Configurer l'URL avec le token
GITHUB_URL="https://${GITHUB_TOKEN}@github.com/cheikhnaa/fayda-digital.git"

echo ""
echo "📤 Envoi du code vers GitHub..."
git push $GITHUB_URL main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Succès! Votre projet a été poussé vers GitHub"
    echo "🌐 Dépôt: https://github.com/cheikhnaa/fayda-digital"
else
    echo ""
    echo "❌ Erreur lors du push. Vérifiez:"
    echo "   - Que le token est valide"
    echo "   - Que le dépôt existe sur GitHub"
    echo "   - Que vous avez les permissions d'écriture"
fi

