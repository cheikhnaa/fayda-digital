#!/bin/bash

# Script pour compresser toutes les images dans le dossier assets/pdf
# Utilise sips (disponible sur macOS) pour optimiser les images

echo "🖼️  Compression des images dans assets/pdf..."

# Créer un dossier de sauvegarde
BACKUP_DIR="assets/pdf/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Fonction pour compresser une image
compress_image() {
    local file="$1"
    local filename=$(basename "$file")
    
    # Copier l'original dans le backup
    cp "$file" "$BACKUP_DIR/$filename"
    
    # Compresser selon le type
    if [[ "$file" == *.png ]]; then
        # Pour PNG, utiliser une compression optimisée
        sips -s format png -s formatOptions 70 "$file" --out "$file.tmp" > /dev/null 2>&1
        if [ -f "$file.tmp" ]; then
            mv "$file.tmp" "$file"
            echo "✅ Compressé: $filename"
        fi
    elif [[ "$file" == *.jpg ]] || [[ "$file" == *.jpeg ]]; then
        # Pour JPEG, utiliser une qualité de 80%
        sips -s format jpeg -s formatOptions 80 "$file" --out "$file.tmp" > /dev/null 2>&1
        if [ -f "$file.tmp" ]; then
            mv "$file.tmp" "$file"
            echo "✅ Compressé: $filename"
        fi
    fi
}

# Trouver et compresser toutes les images
find assets/pdf -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read -r image; do
    compress_image "$image"
done

echo ""
echo "✨ Compression terminée!"
echo "📦 Les originaux sont sauvegardés dans: $BACKUP_DIR"
echo ""
echo "📊 Statistiques:"
du -sh assets/pdf/*.{png,jpg,jpeg} 2>/dev/null | awk '{print "  " $2 ": " $1}'












