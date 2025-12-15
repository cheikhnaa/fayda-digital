# 🌐 Guide - Version Web de Fayda Digital

## 📋 Vue d'ensemble

Ce projet est maintenant configuré pour fonctionner sur le web en plus des plateformes mobiles (iOS et Android).

## 🚀 Lancer la version web

### Mode développement

```bash
npm run web
```

Ou directement :
```bash
expo start --web
```

Cela va :
- Démarrer le serveur de développement
- Ouvrir automatiquement votre navigateur
- Activer le hot-reload (rechargement automatique)

### Mode production

**1. Générer les fichiers statiques :**

```bash
npm run web:build
```

Cela va créer un dossier `web-build/` avec tous les fichiers optimisés pour la production.

**2. Servir les fichiers (test local) :**

```bash
npm run web:serve
```

Cela va démarrer un serveur local pour tester la version de production.

**3. Déployer sur un hébergeur :**

Vous pouvez déployer le contenu du dossier `web-build/` sur :
- **Vercel** : `vercel deploy web-build`
- **Netlify** : Glissez-déposez le dossier `web-build/`
- **GitHub Pages** : Committez `web-build/` et activez GitHub Pages
- **Votre propre serveur** : Copiez `web-build/` sur votre serveur web

## 🔧 Configuration

### Fichiers de configuration

- **`app.json`** : Configuration Expo (inclut la config web)
- **`webpack.config.js`** : Configuration Webpack pour le web
- **`metro.config.js`** : Configuration Metro bundler

### Personnalisation

Pour modifier la configuration web, éditez la section `web` dans `app.json` :

```json
{
  "expo": {
    "web": {
      "name": "Fayda Digital",
      "themeColor": "#0F5132",
      "backgroundColor": "#ffffff"
    }
  }
}
```

## ⚠️ Limitations et adaptations

### Fonctionnalités qui nécessitent des adaptations

1. **Audio/Video** : Utilise `expo-av` qui fonctionne sur web
2. **PDF** : Utilise `react-native-webview` qui fonctionne sur web
3. **Navigation** : `@react-navigation` fonctionne sur web
4. **Fichiers locaux** : Certains chemins peuvent nécessiter des ajustements

### Compatibilité

- ✅ Navigation
- ✅ Audio/Video
- ✅ PDF (via WebView)
- ✅ Images et assets
- ✅ Thèmes (clair/sombre)
- ✅ Multilingue
- ⚠️ Certaines fonctionnalités natives peuvent nécessiter des polyfills

## 📦 Dépendances web

Les dépendances suivantes ont été ajoutées pour le web :

- `react-native-web` : Portage de React Native pour le web
- `react-dom` : Rendu React pour le DOM
- `@expo/metro-runtime` : Runtime Expo pour Metro

## 🐛 Dépannage

### Erreur : "Module not found"

```bash
npm install
```

### Erreur : "Cannot find module 'react-native-web'"

```bash
npm install react-native-web react-dom
```

### Le web ne se charge pas

1. Vérifiez que le port 19006 n'est pas utilisé
2. Essayez : `expo start --web --clear`
3. Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`

### Les assets ne se chargent pas

Vérifiez que les fichiers sont dans le dossier `assets/` et que les chemins sont corrects.

## 📱 Responsive Design

L'application est conçue pour être responsive et s'adapter à :
- 📱 Mobile (320px - 768px)
- 💻 Tablette (768px - 1024px)
- 🖥️ Desktop (1024px+)

## 🚀 Déploiement rapide

### Vercel (Recommandé)

```bash
npm install -g vercel
npm run web:build
vercel deploy web-build
```

### Netlify

1. Allez sur https://app.netlify.com
2. Glissez-déposez le dossier `web-build/`
3. Votre site est en ligne !

### GitHub Pages

```bash
npm run web:build
cd web-build
git init
git add .
git commit -m "Deploy web version"
git branch -M gh-pages
git remote add origin https://github.com/VOTRE_USERNAME/fayda-digital.git
git push -u origin gh-pages
```

Puis activez GitHub Pages dans les paramètres du dépôt.

## 📝 Notes

- La version web utilise les mêmes composants que la version mobile
- Certaines fonctionnalités peuvent être adaptées pour une meilleure expérience web
- Les performances peuvent varier selon le navigateur

