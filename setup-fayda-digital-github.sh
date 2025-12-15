#!/bin/bash

# Script pour configurer le dépôt GitHub sous le nom "fayda-digital"
# Usage: ./setup-fayda-digital-github.sh

echo "🚀 Configuration du dépôt GitHub: Fayda Digital"
echo "=============================================="
echo ""

# Demander le nom d'utilisateur GitHub
read -p "📝 Entrez votre nom d'utilisateur GitHub: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Erreur: Le nom d'utilisateur ne peut pas être vide"
    exit 1
fi

# URL du dépôt (sans espace, GitHub utilise des tirets)
GITHUB_URL="https://github.com/${GITHUB_USERNAME}/fayda-digital.git"

echo ""
echo "📦 Nom du dépôt: fayda-digital"
echo "🔗 URL: $GITHUB_URL"
echo ""

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

# Instructions pour créer le dépôt sur GitHub
echo ""
echo "📋 INSTRUCTIONS IMPORTANTES:"
echo "============================"
echo "1. Allez sur rlier clirhttps://github.com/new"
echo "2. Repository name: fayda-digital"
echo "3. Description: Application mobile Fayda Digital - Plateforme de contenu spirituel islamique"
echo "4. Visibilité: Private (recommandé) ou Public"
echo "5. NE COCHEZ PAS 'Initialize this repository with a README'"
echo "6. Cliquez sur 'Create repository'"
echo ""
read -p "✅ Avez-vous créé le dépôt sur GitHub? (o/n): " REPO_CREATED

if [ "$REPO_CREATED" != "o" ] && [ "$REPO_CREATED" != "O" ]; then
    echo ""
    echo "⏸️  Créez d'abord le dépôt sur GitHub, puis relancez ce script"
    exit 0
fi

# Demander si on veut pousser maintenant
echo ""
read -p "📤 Voulez-vous pousser le code maintenant? (o/n): " PUSH_NOW

if [ "$PUSH_NOW" = "o" ] || [ "$PUSH_NOW" = "O" ]; then
    echo ""
    echo "📤 Envoi du code vers GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Succès! Votre projet 'Fayda Digital' est maintenant hébergé sur GitHub"
        echo "🌐 Dépôt: $GITHUB_URL"
        echo ""
        echo "📝 Prochaines étapes:"
        echo "   - Visitez votre dépôt: $GITHUB_URL"
        echo "   - Configurez les paramètres du dépôt si nécessaire"
        echo "   - Ajoutez une description et des topics sur GitHub"
    else
        echo ""
        echo "❌ Erreur lors du push. Vérifiez:"
        echo "   - Que le dépôt 'fayda-digital' existe bien sur GitHub"
        echo "   - Que vous avez les permissions d'écriture"
        echo "   - Que vous êtes authentifié (git config ou token)"
        echo ""
        echo "💡 Pour l'authentification, vous pouvez utiliser:"
        echo "   - Un Personal Access Token (PAT)"
        echo "   - Ou configurer SSH: git remote set-url origin git@github.com:${GITHUB_USERNAME}/fayda-digital.git"
    fi
else
    echo ""
    echo "ℹ️  Pour pousser le code plus tard, exécutez:"
    echo "   git push -u origin main"
fi

