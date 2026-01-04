// services/aiService.ts - Service d'assistant IA avec intégration Groq

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Clé API Groq
// ⚠️ IMPORTANT: Remplacez 'YOUR_GROQ_API_KEY' par votre vraie clé API
// Obtenez votre clé sur https://console.groq.com
// Pour la production, utilisez des variables d'environnement pour sécuriser la clé
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Prompts système pour spécialiser l'IA selon la langue
const getSystemPrompt = (language: 'fr' | 'en' | 'ar'): string => {
  const prompts = {
    fr: `Tu es Fayda IA, un assistant spirituel spécialisé dans l'Islam, la Tariqa Tijaniyya, la Fayda Tidianiyya, et les pratiques spirituelles. Tu aides les utilisateurs à comprendre :
- L'Islam (les cinq piliers, les six piliers de la foi, le Coran, le Prophète Muhammad, le soufisme)
- La Tariqa Tijaniyya (fondements, pratiques comme le Zikr, la Salat al-Fatih, la Wazifa, Cheikh Ahmed Tijani)
- La Fayda Tidianiyya (Baye Niass/Cheikh Ibrahim Niass, Médina Baye, le mouvement de renouveau spirituel)
- Les pratiques spirituelles (comment pratiquer le Zikr, la Wazifa, le Doua de la Wazifa)
- L'application Fayda Digital (comment utiliser les sections Livres, Musique, Podcasts)

Réponds toujours en français de manière détaillée, claire, respectueuse et spirituellement appropriée. Si tu ne connais pas quelque chose, dis-le honnêtement. Utilise un langage accessible et éducatif.`,

    en: `You are Fayda IA, a spiritual assistant specialized in Islam, Tijaniyya Tariqa, Fayda Tidianiyya, and spiritual practices. You help users understand:
- Islam (the five pillars, the six pillars of faith, the Quran, Prophet Muhammad, Sufism)
- Tijaniyya Tariqa (foundations, practices like Zikr, Salat al-Fatih, Wazifa, Sheikh Ahmed Tijani)
- Fayda Tidianiyya (Baye Niass/Sheikh Ibrahim Niass, Medina Baye, the spiritual renewal movement)
- Spiritual practices (how to practice Zikr, Wazifa, Doua of Wazifa)
- Fayda Digital app (how to use Books, Music, Podcasts sections)

Always respond in English in a detailed, clear, respectful and spiritually appropriate manner. If you don't know something, say so honestly. Use accessible and educational language.`,

    ar: `أنت فيدا الذكاء الاصطناعي، مساعد روحي متخصص في الإسلام والطريقة التجانية والفيضة والممارسات الروحية. تساعد المستخدمين على فهم:
- الإسلام (الأركان الخمسة، أركان الإيمان الستة، القرآن، النبي محمد، التصوف)
- الطريقة التجانية (الأسس، الممارسات مثل الذكر، صلاة الفاتح، الوظيفة، الشيخ أحمد التجاني)
- الفيضة التجانية (باي نياس/الشيخ إبراهيم نياس، المدينة باي، حركة التجديد الروحي)
- الممارسات الروحية (كيفية ممارسة الذكر، الوظيفة، دعاء الوظيفة)
- تطبيق فيضة ديجيتال (كيفية استخدام أقسام الكتب والموسيقى والبودكاست)

أجب دائماً بالعربية بطريقة مفصلة وواضحة ومحترمة وروحياً مناسبة. إذا لم تكن تعرف شيئاً، قل ذلك بصراحة. استخدم لغة سهلة ومتعلمة.`
  };
  
  return prompts[language] || prompts.fr;
};

export const sendMessageToAI = async (
  messages: Message[],
  language: 'fr' | 'en' | 'ar' = 'fr'
): Promise<string> => {
  // Vérifier si la clé API est configurée
  if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
    return language === 'fr'
      ? '⚠️ Veuillez configurer votre clé API Groq dans le fichier services/aiService.ts. Obtenez votre clé sur https://console.groq.com'
      : language === 'en'
      ? '⚠️ Please configure your Groq API key in services/aiService.ts file. Get your key at https://console.groq.com'
      : '⚠️ يرجى تكوين مفتاح API الخاص بـ Groq في ملف services/aiService.ts. احصل على مفتاحك على https://console.groq.com';
  }

  try {
    // Préparer les messages pour Groq (format OpenAI)
    const groqMessages = [
      { role: 'system', content: getSystemPrompt(language) },
      ...messages
        .filter(msg => msg.role !== 'system') // Enlever les messages système existants
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))
    ];

    // Limiter l'historique aux 10 derniers messages pour éviter les tokens excessifs
    const limitedMessages = groqMessages.slice(-10);

    // Appeler l'API Groq
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Modèle rapide et performant de Groq
        messages: limitedMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur Groq API:', response.status, errorData);
      
      // Gérer les erreurs spécifiques
      if (response.status === 401) {
        return language === 'fr'
          ? 'Erreur d\'authentification. Vérifiez votre clé API Groq.'
          : language === 'en'
          ? 'Authentication error. Please check your Groq API key.'
          : 'خطأ في المصادقة. يرجى التحقق من مفتاح API الخاص بـ Groq.';
      }
      
      if (response.status === 429) {
        return language === 'fr'
          ? 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.'
          : language === 'en'
          ? 'Rate limit reached. Please try again in a few moments.'
          : 'تم الوصول إلى حد المعدل. يرجى المحاولة مرة أخرى بعد لحظات.';
      }
      
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraire la réponse
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('Réponse invalide de l\'API');
    }

    return aiResponse.trim();
  } catch (error: any) {
    console.error('Erreur lors de l\'appel à Groq:', error);
    
    // Message d'erreur selon la langue
    const errorMessage = language === 'fr'
      ? 'Désolé, une erreur est survenue lors de la communication avec l\'assistant. Veuillez réessayer plus tard.'
      : language === 'en'
      ? 'Sorry, an error occurred while communicating with the assistant. Please try again later.'
      : 'عذراً، حدث خطأ أثناء التواصل مع المساعد. يرجى المحاولة مرة أخرى لاحقاً.';
    
    return errorMessage;
  }
};