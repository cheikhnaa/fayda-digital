#!/bin/bash

# Script pour configurer le dépôt GitHub sur un autre compte
# Usage: ./setup-github.sh

echo "🔧 Configuration du dépôt GitHub"
echo "================================"
echo ""

# Demander l'URL du dépôt GitHub
read -p "📝 Entrez l'URL de votre dépôt GitHub (ex: https://github.com/username/repo.git): " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "❌ Erreur: L'URL ne peut pas être vide"
    exit 1
fi

# Vérifier si un remote existe déjà
if git remote | grep -q "^origin$"; then
    echo "⚠️  Un remote 'origin' existe déjà."
    read -p "Voulez-vous le remplacer? (o/n): " REPLACE
    if [ "$REPLACE" = "o" ] || [ "$REPLACE" = "O" ]; then
        git remote remove origin
        echo "✅ Remote 'origin' supprimé"
    else
        echo "❌ Opération annulée"
        exit 1
    fi
fi

# Ajouter le remote
echo ""
echo "📡 Ajout du remote GitHub..."
git remote add origin "$GITHUB_URL"

# Vérifier la configuration
echo ""
echo "✅ Remote configuré:"
git remote -v

# Demander si on veut pousser maintenant
echo ""
read -p "📤 Voulez-vous pousser le code maintenant? (o/n): " PUSH_NOW

if [ "$PUSH_NOW" = "o" ] || [ "$PUSH_NOW" = "O" ]; then
    echo ""
    echo "📤 Envoi du code vers GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Succès! Votre projet est maintenant hébergé sur GitHub"
        echo "🌐 Dépôt: $GITHUB_URL"
    else
        echo ""
        echo "❌ Erreur lors du push. Vérifiez:"
        echo "   - Que le dépôt existe sur GitHub"
        echo "   - Que vous avez les permissions d'écriture"
        echo "   - Que vous êtes authentifié (git config ou token)"
    fi
else
    echo ""
    echo "ℹ️  Pour pousser le code plus tard, exécutez:"
    echo "   git push -u origin main"
fi

