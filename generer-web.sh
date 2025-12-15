#!/bin/bash

# Script pour générer la version web de production

echo "🌐 Génération de la version web de Fayda Digital"
echo "================================================"
echo ""

# Vérifier que les dépendances sont installées
if ! npm list react-native-web > /dev/null 2>&1; then
    echo "📦 Installation des dépendances web..."
    npm install react-native-web react-dom@19.1.0 @expo/metro-runtime --legacy-peer-deps --save
fi

echo "🔨 Construction de la version web..."
echo ""

# Nettoyer l'ancien build si il existe
if [ -d "web-build" ]; then
    echo "🧹 Nettoyage de l'ancien build..."
    rm -rf web-build
fi

# Générer le build web
echo "📦 Génération des fichiers statiques..."
npx expo export:web

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Version web générée avec succès !"
    echo ""
    echo "📁 Fichiers générés dans : web-build/"
    echo ""
    echo "🚀 Pour tester localement :"
    echo "   npm run web:serve"
    echo ""
    echo "🌐 Pour déployer :"
    echo "   - Vercel : vercel deploy web-build"
    echo "   - Netlify : Glissez-déposez web-build/"
    echo "   - GitHub Pages : Committez web-build/"
    echo ""
    
    # Afficher la taille du build
    if [ -d "web-build" ]; then
        SIZE=$(du -sh web-build | cut -f1)
        echo "📊 Taille du build : $SIZE"
    fi
else
    echo ""
    echo "❌ Erreur lors de la génération"
    echo "   Vérifiez les erreurs ci-dessus"
    exit 1
fi

