#!/bin/bash

# Script pour pousser le projet vers GitHub
# Remplacez YOUR_USERNAME et YOUR_REPO_NAME par vos informations

echo "🚀 Configuration du dépôt GitHub..."

# Remplacez cette URL par l'URL de votre dépôt GitHub
GITHUB_URL="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"

# Ajouter le remote GitHub
git remote add origin $GITHUB_URL

# Vérifier que le remote est bien configuré
echo "📡 Remotes configurés :"
git remote -v

# Pousser le code vers GitHub
echo "📤 Envoi du code vers GitHub..."
git push -u origin main

echo "✅ Projet hébergé sur GitHub avec succès !"
echo "🌐 Votre dépôt : $GITHUB_URL"

