#!/bin/bash

# Script pour pousser vers GitHub avec authentification interactive
# Ce script va demander vos credentials GitHub une fois et les stocker dans le keychain macOS

echo "📤 Configuration et push vers GitHub: fayda-digital"
echo "=================================================="
echo ""

# Vérifier que le remote est configuré
if ! git remote | grep -q "^origin$"; then
    echo "❌ Erreur: Le remote 'origin' n'est pas configuré"
    exit 1
fi

echo "🔗 Remote configuré:"
git remote -v
echo ""

# Instructions pour l'authentification
echo "🔑 AUTHENTIFICATION GITHUB"
echo "=========================="
echo ""
echo "GitHub n'accepte plus les mots de passe. Vous devez utiliser:"
echo "  1. Un Personal Access Token (PAT) - Recommandé"
echo "  2. Ou SSH"
echo ""

echo "📝 Option 1: Personal Access Token (Recommandé)"
echo "   - Allez sur: https://github.com/settings/tokens"
echo "   - Cliquez sur 'Generate new token' → 'Generate new token (classic)'"
echo "   - Nom: fayda-digital-push"
echo "   - Permission: cochez 'repo'"
echo "   - Générez et copiez le token"
echo ""

read -p "Avez-vous créé un token? (o/n): " HAS_TOKEN

if [ "$HAS_TOKEN" = "o" ] || [ "$HAS_TOKEN" = "O" ]; then
    echo ""
    echo "🔑 Lorsque Git vous demandera:"
    echo "   Username: entrez 'cheikhnaa'"
    echo "   Password: collez votre Personal Access Token (pas votre mot de passe)"
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
    echo ""
    echo "📤 Tentative de push..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Succès! Votre projet a été poussé vers GitHub"
        echo "🌐 Dépôt: https://github.com/cheikhnaa/fayda-digital"
        echo ""
        echo "💡 Vos credentials sont maintenant stockés dans le keychain macOS"
        echo "   Vous n'aurez plus besoin de les entrer à chaque fois"
    else
        echo ""
        echo "❌ Erreur lors du push. Vérifiez:"
        echo "   - Que le token est correct"
        echo "   - Que le dépôt existe sur GitHub"
        echo "   - Que vous avez les permissions d'écriture"
    fi
else
    echo ""
    echo "📝 Option 2: Configuration SSH"
    echo "   - Je peux vous aider à configurer SSH si vous préférez"
    echo ""
    read -p "Voulez-vous configurer SSH? (o/n): " SETUP_SSH
    
    if [ "$SETUP_SSH" = "o" ] || [ "$SETUP_SSH" = "O" ]; then
        echo ""
        echo "🔑 Configuration SSH..."
        
        # Vérifier si une clé SSH existe déjà
        if [ -f ~/.ssh/id_ed25519.pub ] || [ -f ~/.ssh/id_rsa.pub ]; then
            echo "✅ Une clé SSH existe déjà"
            if [ -f ~/.ssh/id_ed25519.pub ]; then
                SSH_KEY=$(cat ~/.ssh/id_ed25519.pub)
            else
                SSH_KEY=$(cat ~/.ssh/id_rsa.pub)
            fi
            echo ""
            echo "📋 Votre clé publique SSH:"
            echo "$SSH_KEY"
            echo ""
            echo "📝 Ajoutez cette clé sur GitHub:"
            echo "   1. Allez sur: https://github.com/settings/keys"
            echo "   2. Cliquez sur 'New SSH key'"
            echo "   3. Collez la clé ci-dessus"
            echo "   4. Cliquez sur 'Add SSH key'"
            echo ""
            read -p "Appuyez sur Entrée une fois la clé ajoutée sur GitHub..."
            
            # Configurer le remote en SSH
            git remote set-url origin git@github.com:cheikhnaa/fayda-digital.git
            echo ""
            echo "📤 Tentative de push avec SSH..."
            git push -u origin main
        else
            echo "🔑 Génération d'une nouvelle clé SSH..."
            ssh-keygen -t ed25519 -C "cheikhnaaa4@gmail.com" -f ~/.ssh/id_ed25519 -N ""
            
            SSH_KEY=$(cat ~/.ssh/id_ed25519.pub)
            echo ""
            echo "✅ Clé SSH générée!"
            echo ""
            echo "📋 Votre clé publique SSH:"
            echo "$SSH_KEY"
            echo ""
            echo "📝 Ajoutez cette clé sur GitHub:"
            echo "   1. Allez sur: https://github.com/settings/keys"
            echo "   2. Cliquez sur 'New SSH key'"
            echo "   3. Collez la clé ci-dessus"
            echo "   4. Cliquez sur 'Add SSH key'"
            echo ""
            read -p "Appuyez sur Entrée une fois la clé ajoutée sur GitHub..."
            
            # Ajouter la clé au ssh-agent
            eval "$(ssh-agent -s)"
            ssh-add ~/.ssh/id_ed25519
            
            # Configurer le remote en SSH
            git remote set-url origin git@github.com:cheikhnaa/fayda-digital.git
            echo ""
            echo "📤 Tentative de push avec SSH..."
            git push -u origin main
        fi
    fi
fi

