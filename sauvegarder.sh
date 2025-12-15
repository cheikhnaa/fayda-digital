#!/bin/bash

# Script pour sauvegarder rapidement toutes les modifications
# Usage: ./sauvegarder.sh [message de commit]

COMMIT_MESSAGE="${1:-Sauvegarde automatique - $(date '+%Y-%m-%d %H:%M:%S')}"

echo "💾 Sauvegarde des modifications..."
echo "=================================="
echo ""

# Vérifier s'il y a des modifications
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ Aucune modification à sauvegarder"
    exit 0
fi

# Afficher les fichiers modifiés
echo "📝 Fichiers modifiés :"
git status --short
echo ""

# Ajouter tous les fichiers
echo "📦 Ajout des fichiers..."
git add -A

# Créer le commit
echo "💾 Création du commit..."
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Modifications sauvegardées localement !"
    echo "   Commit : $COMMIT_MESSAGE"
    echo ""
    
    # Vérifier si GitHub est configuré
    if git remote | grep -q "^origin$"; then
        echo "📤 Voulez-vous pousser vers GitHub maintenant ?"
        read -p "   (o/n): " PUSH_NOW
        
        if [ "$PUSH_NOW" = "o" ] || [ "$PUSH_NOW" = "O" ]; then
            echo ""
            echo "📤 Envoi vers GitHub..."
            git push origin main
            
            if [ $? -eq 0 ]; then
                echo ""
                echo "✅ Modifications sauvegardées sur GitHub !"
                echo "🌐 Dépôt : $(git remote get-url origin)"
            else
                echo ""
                echo "⚠️  Erreur lors du push vers GitHub"
                echo "   Vos modifications sont sauvegardées localement"
                echo "   Pour pousser plus tard : git push"
            fi
        else
            echo ""
            echo "ℹ️  Pour pousser vers GitHub plus tard :"
            echo "   git push"
        fi
    else
        echo ""
        echo "ℹ️  GitHub n'est pas encore configuré"
        echo "   Pour configurer : ./lier-github.sh"
    fi
else
    echo ""
    echo "❌ Erreur lors de la sauvegarde"
    exit 1
fi

