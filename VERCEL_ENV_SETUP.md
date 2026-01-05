# Configuration des variables d'environnement sur Vercel

## Variable d'environnement requise

Pour que l'assistant IA fonctionne correctement sur Vercel, vous devez ajouter la variable d'environnement suivante :

### `EXPO_PUBLIC_GROQ_API_KEY`

Cette variable contient votre clé API Groq pour l'assistant IA.

## Comment l'ajouter sur Vercel

### Méthode 1 : Via l'interface web (recommandé)

1. Allez sur https://vercel.com et connectez-vous
2. Sélectionnez votre projet `fayda-digital`
3. Allez dans **Settings** (Paramètres)
4. Cliquez sur **Environment Variables** (Variables d'environnement)
5. Ajoutez une nouvelle variable :
   - **Key** : `EXPO_PUBLIC_GROQ_API_KEY`
   - **Value** : Votre clé API Groq (commence par `gsk_...`)
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
6. Cliquez sur **Save**
7. **Important** : Vous devrez redéployer votre application pour que la variable soit prise en compte

### Méthode 2 : Via la CLI Vercel

```bash
vercel env add EXPO_PUBLIC_GROQ_API_KEY
```

Puis entrez votre clé API lorsque demandé.

## Obtenir votre clé API Groq

1. Allez sur https://console.groq.com
2. Créez un compte ou connectez-vous
3. Allez dans **API Keys**
4. Créez une nouvelle clé API
5. Copiez la clé (elle commence par `gsk_...`)

## Note de sécurité

⚠️ **Important** : Ne commitez jamais votre clé API dans le dépôt Git. 
La variable d'environnement doit être configurée uniquement sur Vercel.



