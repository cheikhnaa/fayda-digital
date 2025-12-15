#!/bin/bash

# Script simple pour pousser vers GitHub avec authentification
# Ce script va vous guider étape par étape

echo "🚀 Push vers GitHub: fayda-digital"
echo "==================================="
echo ""

# Vérifier le remote
echo "🔗 Remote configuré:"
git remote -v
echo ""

echo "📋 Pour pousser vers GitHub, vous avez 2 options:"
echo ""
echo "1️⃣  OPTION 1: Personal Access Token (Plus simple)"
echo "   - Créez un token sur: https://github.com/settings/tokens"
echo "   - Permission: cochez 'repo'"
echo "   - Utilisez le token comme mot de passe"
echo ""
echo "2️⃣  OPTION 2: SSH (Plus sécurisé, une seule fois)"
echo "   - Je peux configurer SSH automatiquement"
echo ""

read -p "Choisissez une option (1 ou 2): " OPTION

if [ "$OPTION" = "1" ]; then
    echo ""
    echo "🔑 Créez votre token maintenant:"
    echo "   https://github.com/settings/tokens"
    echo ""
    read -p "Appuyez sur Entrée une fois le token créé..."
    echo ""
    echo "📤 Lancement du push..."
    echo "   Quand Git vous demandera:"
    echo "   - Username: cheikhnaa"
    echo "   - Password: collez votre token (pas votre mot de passe)"
    echo ""
    git push -u origin main
    
elif [ "$OPTION" = "2" ]; then
    echo ""
    echo "🔑 Configuration SSH..."
    
    # Vérifier si une clé existe
    if [ -f ~/.ssh/id_ed25519 ] || [ -f ~/.ssh/id_rsa ]; then
        echo "✅ Clé SSH trouvée"
        if [ -f ~/.ssh/id_ed25519.pub ]; then
            KEY_FILE=~/.ssh/id_ed25519.pub
        else
            KEY_FILE=~/.ssh/id_rsa.pub
        fi
    else
        echo "🔑 Génération d'une nouvelle clé SSH..."
        ssh-keygen -t ed25519 -C "cheikhnaaa4@gmail.com" -f ~/.ssh/id_ed25519 -N ""
        KEY_FILE=~/.ssh/id_ed25519.pub
    fi
    
    # Afficher la clé publique
    echo ""
    echo "📋 Votre clé publique SSH:"
    echo "=========================="
    cat $KEY_FILE
    echo "=========================="
    echo ""
    echo "📝 Ajoutez cette clé sur GitHub:"
    echo "   1. Allez sur: https://github.com/settings/keys"
    echo "   2. Cliquez sur 'New SSH key'"
    echo "   3. Titre: fayda-digital-mac"
    echo "   4. Collez la clé ci-dessus"
    echo "   5. Cliquez sur 'Add SSH key'"
    echo ""
    read -p "Appuyez sur Entrée une fois la clé ajoutée sur GitHub..."
    
    # Ajouter au ssh-agent
    eval "$(ssh-agent -s)" > /dev/null 2>&1
    if [ -f ~/.ssh/id_ed25519 ]; then
        ssh-add ~/.ssh/id_ed25519 2>/dev/null
    elif [ -f ~/.ssh/id_rsa ]; then
        ssh-add ~/.ssh/id_rsa 2>/dev/null
    fi
    
    # Configurer le remote en SSH
    echo ""
    echo "📡 Configuration du remote en SSH..."
    git remote set-url origin git@github.com:cheikhnaa/fayda-digital.git
    
    echo ""
    echo "📤 Tentative de push avec SSH..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Succès avec SSH!"
    else
        echo ""
        echo "⚠️  Erreur SSH. Vérifiez que la clé est bien ajoutée sur GitHub"
    fi
else
    echo "❌ Option invalide"
    exit 1
fi

