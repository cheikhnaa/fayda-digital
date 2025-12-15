#!/bin/bash

# Script interactif pour guider l'utilisateur étape par étape

clear
echo "═══════════════════════════════════════════════════════════════"
echo "🚀 GUIDE INTERACTIF - Pousser Fayda Digital sur GitHub"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "📋 ÉTAPE 1 : Créer votre Personal Access Token"
echo "───────────────────────────────────────────────────────────────"
echo ""
echo "Je vais vous guider pour créer un token GitHub."
echo ""
echo "1️⃣  Ouvrez votre navigateur et allez sur :"
echo "   👉 https://github.com/settings/tokens"
echo ""
read -p "   Appuyez sur Entrée une fois la page ouverte... "
echo ""

echo "2️⃣  Sur la page GitHub :"
echo "   - Cliquez sur le bouton vert 'Generate new token'"
echo "   - Sélectionnez 'Generate new token (classic)'"
echo ""
read -p "   Appuyez sur Entrée une fois fait... "
echo ""

echo "3️⃣  Remplissez le formulaire :"
echo "   ✓ Note : fayda-digital-push"
echo "   ✓ Expiration : Choisissez 90 jours (ou plus)"
echo "   ✓ Permissions : Cochez uniquement 'repo' ✅"
echo ""
read -p "   Appuyez sur Entrée une fois le formulaire rempli... "
echo ""

echo "4️⃣  Cliquez sur 'Generate token' (bouton vert en bas)"
echo ""
read -p "   Appuyez sur Entrée une fois le token généré... "
echo ""

echo "5️⃣  ⚠️  IMPORTANT : Copiez le token maintenant !"
echo "   Il commence par 'ghp_' suivi de caractères"
echo "   Vous ne pourrez plus le voir après !"
echo ""
read -p "   Avez-vous copié le token ? (o/n): " TOKEN_COPIED

if [ "$TOKEN_COPIED" != "o" ] && [ "$TOKEN_COPIED" != "O" ]; then
    echo ""
    echo "⚠️  Veuillez copier le token d'abord, puis relancez ce script"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📤 ÉTAPE 2 : Pousser le code vers GitHub"
echo "═══════════════════════════════════════════════════════════════"
echo ""

read -sp "🔑 Collez votre token ici et appuyez sur Entrée: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Erreur: Le token ne peut pas être vide"
    exit 1
fi

# Vérifier que le token commence par ghp_
if [[ ! "$GITHUB_TOKEN" =~ ^ghp_ ]]; then
    echo "⚠️  Attention: Le token devrait commencer par 'ghp_'"
    read -p "Continuer quand même ? (o/n): " CONTINUE
    if [ "$CONTINUE" != "o" ] && [ "$CONTINUE" != "O" ]; then
        exit 1
    fi
fi

echo ""
echo "📤 Envoi du code vers GitHub..."
echo "───────────────────────────────────────────────────────────────"

# Configurer l'URL avec le token
GITHUB_URL="https://${GITHUB_TOKEN}@github.com/cheikhnaa/fayda-digital.git"

# Pousser le code
git push "$GITHUB_URL" main

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "✅ SUCCÈS ! Votre projet a été poussé vers GitHub"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "🌐 Votre dépôt est maintenant disponible sur :"
    echo "   https://github.com/cheikhnaa/fayda-digital"
    echo ""
    
    # Configurer le remote pour les prochaines fois
    git remote set-url origin https://github.com/cheikhnaa/fayda-digital.git
    
    # Stocker les credentials
    echo "💾 Configuration des credentials pour les prochaines fois..."
    git credential approve <<EOF
url=https://github.com/cheikhnaa/fayda-digital.git
username=cheikhnaa
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
        open "https://github.com/cheikhnaa/fayda-digital" 2>/dev/null || echo "Ouvrez manuellement: https://github.com/cheikhnaa/fayda-digital"
    fi
    
else
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "❌ ERREUR lors du push"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "Vérifiez :"
    echo "   ✓ Que le token est correct"
    echo "   ✓ Que le token a la permission 'repo'"
    echo "   ✓ Que le dépôt existe sur GitHub"
    echo "   ✓ Que vous avez les permissions d'écriture"
    echo ""
    echo "💡 Essayez de créer un nouveau token si le problème persiste"
fi

