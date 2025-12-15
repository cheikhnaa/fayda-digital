#!/bin/bash

# Script de sauvegarde automatique toutes les X minutes
# Usage: ./sauvegarder-auto.sh [intervalle en minutes]

INTERVAL=${1:-10}  # Par défaut toutes les 10 minutes
INTERVAL_SECONDS=$((INTERVAL * 60))

echo "🔄 Sauvegarde automatique activée"
echo "=================================="
echo ""
echo "⏱️  Intervalle : $INTERVAL minutes"
echo "📝 Les modifications seront sauvegardées automatiquement"
echo ""
echo "Pour arrêter : Appuyez sur Ctrl+C"
echo ""

while true; do
    # Vérifier s'il y a des modifications
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo ""
        echo "[$(date '+%H:%M:%S')] 💾 Sauvegarde automatique..."
        
        git add -A
        git commit -m "Sauvegarde automatique - $(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "   ✅ Sauvegardé localement"
            
            # Essayer de pousser vers GitHub (silencieux)
            git push origin main > /dev/null 2>&1
            if [ $? -eq 0 ]; then
                echo "   ✅ Poussé vers GitHub"
            fi
        fi
    else
        echo "[$(date '+%H:%M:%S')] ✓ Aucune modification"
    fi
    
    # Attendre l'intervalle
    sleep $INTERVAL_SECONDS
done

