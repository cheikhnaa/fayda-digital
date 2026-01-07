// services/audioService.ts - Service audio avec Groq API
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || 'YOUR_GROQ_API_KEY';
const GROQ_STT_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_TTS_URL = 'https://api.groq.com/openai/v1/audio/speech';

/**
 * Transcrit un fichier audio en texte (Speech-to-Text)
 * @param audioUri URI du fichier audio
 * @param language Langue de l'audio (optionnel, auto-détection si non spécifié)
 * @returns Texte transcrit
 */
export const transcribeAudio = async (
  audioUri: string,
  language?: 'fr' | 'en' | 'ar'
): Promise<string> => {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
    throw new Error('Clé API Groq non configurée');
  }

  try {
    // Créer FormData pour l'envoi du fichier
    const formData = new FormData();
    
    // Extraire le nom du fichier et le type depuis l'URI
    const filename = audioUri.split('/').pop() || 'recording.m4a';
    const fileType = filename.endsWith('.m4a') ? 'audio/m4a' :
                     filename.endsWith('.mp3') ? 'audio/mpeg' :
                     filename.endsWith('.wav') ? 'audio/wav' :
                     'audio/m4a';

    formData.append('file', {
      uri: audioUri,
      type: fileType,
      name: filename,
    } as any);
    
    formData.append('model', 'whisper-large-v3-turbo');
    
    if (language) {
      // Mapper les langues
      const langCode = language === 'fr' ? 'fr' : language === 'ar' ? 'ar' : 'en';
      formData.append('language', langCode);
    }

    const response = await fetch(GROQ_STT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        // Ne pas mettre Content-Type, FormData le définit automatiquement avec boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur transcription:', response.status, errorData);
      
      if (response.status === 401) {
        throw new Error('Erreur d\'authentification. Vérifiez votre clé API Groq.');
      }
      
      throw new Error(`Erreur transcription: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error: any) {
    console.error('Erreur transcription audio:', error);
    throw error;
  }
};

/**
 * Convertit du texte en audio (Text-to-Speech)
 * @param text Texte à convertir en audio
 * @param language Langue du texte
 * @returns URI du fichier audio généré (pour web) ou base64 (pour mobile)
 */
export const synthesizeSpeech = async (
  text: string,
  language: 'fr' | 'en' | 'ar' = 'fr'
): Promise<string> => {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
    throw new Error('Clé API Groq non configurée');
  }

  try {
    // Sélectionner la voix selon la langue
    // Groq TTS supporte: alloy, echo, fable, onyx, nova, shimmer
    // Pour l'arabe, on peut utiliser 'alloy' ou 'nova'
    const voice = language === 'ar' ? 'alloy' : 'alloy';
    
    // Code de langue pour TTS
    const langCode = language === 'fr' ? 'fr' : language === 'ar' ? 'ar' : 'en';

    const response = await fetch(GROQ_TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1', // ou 'tts-1-hd' pour meilleure qualité (plus lent)
        input: text,
        voice: voice,
        response_format: 'mp3', // ou 'opus', 'aac', 'flac', 'pcm', 'wav'
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur synthèse vocale:', response.status, errorData);
      
      if (response.status === 401) {
        throw new Error('Erreur d\'authentification. Vérifiez votre clé API Groq.');
      }
      
      throw new Error(`Erreur synthèse vocale: ${response.status}`);
    }

    // Pour React Native, convertir en base64 ou sauvegarder le fichier
    const blob = await response.blob();
    
    // Convertir blob en base64 pour React Native
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error('Erreur synthèse vocale:', error);
    throw error;
  }
};


