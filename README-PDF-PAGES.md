# Obtenir le nombre réel de pages des PDF

## Problème

L'application utilise actuellement des valeurs estimées pour le nombre de pages des PDF. Pour obtenir les nombres réels, `react-native-pdf` a été intégré, mais cette bibliothèque nécessite un **développement build** et ne fonctionne pas avec Expo Go.

## Solutions possibles

### Option 1 : Créer un développement build (Recommandé pour la production)

1. Installer EAS CLI :
```bash
npm install -g eas-cli
```

2. Configurer EAS :
```bash
eas build:configure
```

3. Créer un développement build :
```bash
eas build --profile development --platform ios
# ou
eas build --profile development --platform android
```

4. Une fois le build créé, installer l'application sur votre appareil et utiliser `react-native-pdf` comme prévu.

### Option 2 : Utiliser un script pour précalculer les nombres de pages

Créer un script Node.js qui utilise `pdf-parse` ou `PyPDF2` pour lire tous les PDF et générer un fichier avec les nombres de pages réels, puis mettre à jour `pdfPages.ts`.

### Option 3 : Utiliser les valeurs par défaut (Solution actuelle)

Les valeurs estimées dans `pdfPages.ts` sont utilisées. Ces valeurs peuvent être mises à jour manuellement si vous connaissez les nombres réels de pages.

## Fichiers concernés

- `pdfPages.ts` : Mapping des IDs aux nombres de pages
- `components/PdfPageCounter.tsx` : Composant qui tente de charger les PDF (actuellement désactivé pour Expo Go)
- `App.tsx` : Utilise le mapping pour afficher les nombres de pages

## Note

Le code actuel est préparé pour utiliser `react-native-pdf` une fois qu'un développement build sera créé. Le composant `PdfPageCounter` est actuellement désactivé pour éviter les erreurs dans Expo Go.



