# Configuration de l'API Groq

## Variables d'environnement

L'application utilise l'API Groq pour l'assistant IA. Pour que cela fonctionne, vous devez configurer la variable d'environnement suivante :

### `EXPO_PUBLIC_GROQ_API_KEY`

Cette variable contient votre clé API Groq.

## Configuration locale (développement)

### Méthode 1 : Fichier .env.local (recommandé)

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```
EXPO_PUBLIC_GROQ_API_KEY=votre_cle_api_groq_ici
```

⚠️ **Important** : Le fichier `.env.local` est déjà ignoré par Git (voir `.gitignore`), donc votre clé ne sera pas commitée.

### Méthode 2 : Ligne de commande

Vous pouvez également définir la variable directement dans votre terminal avant de lancer l'app :

```bash
export EXPO_PUBLIC_GROQ_API_KEY=votre_cle_api_groq_ici
npm start
```

## Configuration sur Vercel (production)

Pour la production sur Vercel, ajoutez la variable d'environnement via :

1. **Interface Web** :
   - Allez sur https://vercel.com
   - Sélectionnez votre projet
   - Settings → Environment Variables
   - Ajoutez `EXPO_PUBLIC_GROQ_API_KEY` avec votre clé
   - Cochez Production, Preview et Development
   - Redéployez l'application

2. **CLI Vercel** :
   ```bash
   vercel env add EXPO_PUBLIC_GROQ_API_KEY
   ```

## Obtenir votre clé API Groq

1. Allez sur https://console.groq.com
2. Créez un compte ou connectez-vous
3. Allez dans **API Keys**
4. Créez une nouvelle clé API
5. Copiez la clé (elle commence par `gsk_...`)

## Vérification

Après avoir configuré la clé, redémarrez votre serveur Expo :

```bash
# Arrêtez le serveur actuel (Ctrl+C)
# Puis redémarrez
npm start
```

L'assistant IA devrait maintenant fonctionner correctement !

## Note de sécurité

⚠️ **Ne commitez jamais votre clé API dans le dépôt Git**. 
- Le fichier `.env.local` est déjà dans `.gitignore`
- Utilisez uniquement des variables d'environnement pour stocker les clés sensibles


