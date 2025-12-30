// services/aiService.ts - Service d'assistant IA avec réponses prédéfinies (100% gratuit)

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Base de connaissances enrichie et détaillée
const knowledgeBase: Record<string, string> = {
  // Application
  'application': 'Fayda Digital est une application mobile complète qui vous permet d\'accéder à des livres spirituels, musiques (Zikr), podcasts, cours, et vidéos sur la Tariqa Tijaniyya. Utilisez les onglets en bas pour naviguer : Accueil, Livres, Musique, Podcasts, et Cours. L\'application est conçue pour faciliter votre cheminement spirituel en mettant à votre disposition une vaste collection de ressources sur l\'Islam, le soufisme, et la voie tidiane.',
  'fayda digital': 'Fayda Digital est une plateforme spirituelle dédiée à la diffusion des enseignements de la Tariqa Tijaniyya et de la Fayda Tidianiyya. L\'application contient des livres, des enregistrements de Zikr, des podcasts, des cours et des vidéos pour votre cheminement spirituel. Elle a été créée pour rendre accessible la connaissance spirituelle à tous, partout dans le monde.',
  
  // Tariqa Tijaniyya - Réponses détaillées
  'tariqa': 'La Tariqa Tijaniyya est une voie spirituelle soufie fondée par Cheikh Ahmed Tijani (1737-1815) à Fès, au Maroc. Cette voie se distingue par plusieurs caractéristiques essentielles : 1) Le Zikr (répétition des noms d\'Allah) occupe une place centrale pour purifier le cœur, 2) La récitation quotidienne de la Salat al-Fatih, une prière d\'une valeur spirituelle immense, 3) La pratique de la Wazifa, un ensemble d\'invocations quotidiennes, 4) L\'amour et l\'attachement profond au Prophète Muhammad (paix et bénédictions sur lui), 5) La recherche constante de la proximité avec Allah. Le Cheikh Ahmed Tijani reçut ses enseignements directement du Prophète dans un état d\'éveil, ce qui confère à cette voie une particularité unique. Cette voie spirituelle est largement pratiquée en Afrique de l\'Ouest et dans le monde entier.',
  'tariqa tidianiyya': 'La Tariqa Tijaniyya est une voie spirituelle soufie fondée par Cheikh Ahmed Tijani (1737-1815). Elle met l\'accent sur le Zikr (répétition des noms d\'Allah), la Salat al-Fatih, et l\'amour du Prophète. Le Cheikh reçut ses enseignements directement du Prophète Muhammad (paix et bénédictions sur lui) dans un état d\'éveil, ce qui est unique parmi les confréries soufies. Les pratiques principales incluent : la Wazifa (pratique quotidienne), le Zikr régulier, et l\'attachement au Prophète. Cette voie cherche à purifier le cœur et à atteindre la proximité avec Allah.',
  'cheikh ahmed tidiane': 'Cheikh Ahmed Tijani (1737-1815) est le fondateur de la Tariqa Tijaniyya. Né en Algérie dans la région d\'Aïn Madhi, il s\'installa à Fès, au Maroc, où il fonda cette voie spirituelle. Il reçut ses enseignements directement du Prophète Muhammad (paix et bénédictions sur lui) dans un état d\'éveil, ce qui confère à cette voie une particularité unique. Le Cheikh était un maître spirituel exceptionnel qui a établi les fondements de la tariqa, incluant la pratique du Zikr, de la Salat al-Fatih, et de la Wazifa. Son tombeau se trouve à Fès et est un lieu de pèlerinage important.',
  'cheikh ahmed tijani': 'Cheikh Ahmed Tijani (1737-1815) est le fondateur de la Tariqa Tijaniyya. Il reçut ses enseignements directement du Prophète Muhammad (paix et bénédictions sur lui) et fonda cette voie spirituelle à Fès, au Maroc. Il était un maître spirituel de grande envergure qui a établi les pratiques et les principes de la tariqa. Son enseignement met l\'accent sur le Zikr, la Salat al-Fatih, et l\'amour du Prophète.',
  
  // Fayda Tidianiyya - Réponses détaillées
  'fayda': 'La Fayda Tidianiyya (ou Fayda Tijaniyya) est un mouvement de renouveau spirituel initié par Cheikh Ibrahim Niass (Baye Niass) au 20ème siècle. "Fayda" signifie littéralement "déluge" ou "inondation spirituelle", symbolisant une expansion massive de la grâce divine et de la connaissance spirituelle. Baye Niass a ravivé et répandu la Tariqa Tijaniyya à travers le monde, particulièrement en Afrique de l\'Ouest, touchant des millions de personnes. La Fayda représente une période de renouveau où la voie spirituelle s\'est répandue de manière extraordinaire, apportant la lumière spirituelle à de nombreuses personnes qui cherchaient la proximité avec Allah.',
  'fayda tidianiyya': 'La Fayda Tidianiyya est le mouvement de renouveau de la Tariqa Tijaniyya initié par Cheikh Ibrahim Niass (Baye Niass, 1900-1975). Elle représente une expansion massive de la voie spirituelle et a touché des millions de personnes à travers le monde. Le terme "Fayda" signifie "déluge spirituel" et symbolise cette expansion extraordinaire de la grâce divine. Baye Niass a été l\'instrument de cette renaissance spirituelle, répandant les enseignements de la Tariqa Tijaniyya dans de nombreux pays, notamment en Afrique de l\'Ouest, en Afrique du Nord, et au-delà.',
  'baye niass': 'Baye Niass (Cheikh Ibrahim Niass, 1900-1975) était un grand maître spirituel, érudit et réformateur qui a ravivé la Tariqa Tijaniyya au 20ème siècle. Il est considéré comme le "Baye" (Père) de la Fayda Tidianiyya. Son centre spirituel se trouvait à Kaolack, au Sénégal (Médina Baye). Baye Niass était un érudit exceptionnel, maîtrisant de nombreuses sciences islamiques, et un guide spirituel qui a initié des millions de personnes à la voie. Il a écrit de nombreux ouvrages importants et a formé de nombreux disciples qui ont continué à propager la voie après lui.',
  'ibrahim niass': 'Cheikh Ibrahim Niass (1900-1975), également connu sous le nom de "Baye Niass", était un grand maître spirituel de la Tariqa Tijaniyya. Il a initié la Fayda Tidianiyya, un mouvement de renouveau qui a répandu la voie dans le monde entier. Médina Baye à Kaolack était son centre spirituel. Il était un érudit remarquable, auteur de nombreux ouvrages, et un guide spirituel qui a touché la vie de millions de personnes. Son enseignement mettait l\'accent sur l\'amour du Prophète, la pratique du Zikr, et la recherche de la proximité avec Allah.',
  'cheikh ibrahim niass': 'Cheikh Ibrahim Niass (1900-1975), connu comme "Baye Niass", était un maître spirituel, érudit et réformateur de la Tariqa Tijaniyya. Il a initié la Fayda et a été l\'un des plus grands propagateurs de la voie au 20ème siècle. Il était un érudit exceptionnel en sciences islamiques, un auteur prolifique, et un guide spirituel qui a formé de nombreux disciples. Son centre à Médina Baye (Kaolack, Sénégal) est devenu un lieu de pèlerinage et d\'enseignement spirituel majeur.',
  'médina baye': 'Médina Baye est le centre spirituel fondé par Cheikh Ibrahim Niass (Baye Niass) à Kaolack, au Sénégal. C\'est un lieu de pèlerinage et d\'enseignement spirituel important pour les disciples de la Tariqa Tijaniyya et de la Fayda. Médina Baye est devenu un centre majeur de la spiritualité islamique en Afrique de l\'Ouest, attirant des visiteurs du monde entier. Le lieu abrite la mosquée principale, des écoles coraniques, et des espaces d\'enseignement spirituel. C\'est là que Baye Niass a enseigné et guidé ses disciples pendant de nombreuses années.',
  
  // Zikr et pratiques spirituelles - Réponses détaillées
  'zikr': 'Le Zikr (ذکر) est la récitation des noms d\'Allah et des invocations. Dans la Tariqa Tijaniyya, le Zikr occupe une place centrale pour purifier le cœur et se rapprocher d\'Allah. Le Zikr consiste à répéter les noms d\'Allah, notamment "La ilaha illa Allah" (Il n\'y a de dieu qu\'Allah) et "Allah" (Allah). Cette pratique spirituelle permet de purifier le cœur des souillures, d\'élever l\'âme, et de créer une connexion profonde avec le Divin. Le Zikr peut être pratiqué individuellement ou en groupe, et il est recommandé de le faire régulièrement. Vous pouvez trouver de nombreux enregistrements de Zikr dans la section "Musique" de l\'application pour vous guider dans cette pratique.',
  'pratiquer zikr': 'Pour pratiquer le Zikr dans la Tariqa Tijaniyya : 1) Purifiez-vous (ablutions), 2) Asseyez-vous dans un endroit calme et propre, 3) Récitez "La ilaha illa Allah" (Il n\'y a de dieu qu\'Allah) ou "Allah" de manière répétée, 4) Concentrez votre cœur sur la signification des mots, 5) Faites-le avec humilité et présence d\'esprit. Le Zikr peut être fait individuellement ou en groupe. Il est recommandé de le pratiquer régulièrement, de préférence après les prières obligatoires. Dans l\'application, vous trouverez des enregistrements de Zikr dans la section "Musique" pour vous accompagner.',
  'comment zikr': 'Pour pratiquer le Zikr : 1) Faites vos ablutions, 2) Trouvez un endroit calme, 3) Asseyez-vous confortablement, 4) Récitez "La ilaha illa Allah" ou "Allah" de manière répétée, 5) Concentrez-vous sur le sens et la présence d\'Allah. Le Zikr purifie le cœur et rapproche de Dieu. Vous pouvez utiliser les enregistrements de Zikr dans l\'application pour vous guider.',
  'salat al-fatih': 'La Salat al-Fatih est une prière spéciale récitée dans la Tariqa Tijaniyya. Elle est considérée comme ayant une grande valeur spirituelle, équivalente à des milliers de récitations du Coran selon les enseignements du Cheikh Ahmed Tijani. Cette prière commence par "Allahoumma salli ala sayyidina Muhammad..." et est souvent récitée lors des séances de Zikr et dans le cadre de la Wazifa. La Salat al-Fatih est une expression d\'amour et de bénédictions pour le Prophète Muhammad (paix et bénédictions sur lui) et constitue une pratique essentielle de la voie tidiane.',
  'wazifa': 'La Wazifa est une pratique spirituelle quotidienne de la Tariqa Tijaniyya qui consiste en la récitation de prières et d\'invocations spécifiques. Elle inclut généralement : 1) La récitation de la Salat al-Fatih (100 fois ou selon les instructions du maître), 2) Le Doua de la Wazifa (une série d\'invocations pour demander protection, pardon, guidance et bienfaits), 3) D\'autres invocations selon les instructions reçues. La Wazifa est une pratique régulière et disciplinée pour maintenir la connexion spirituelle, purifier le cœur, et rechercher la proximité avec Allah. C\'est une pratique essentielle pour les disciples de la voie.',
  'doua wazifa': 'Le Doua de la Wazifa est une série d\'invocations récitées dans le cadre de la pratique quotidienne de la Wazifa dans la Tariqa Tijaniyya. Il contient des prières pour demander : la protection d\'Allah, le pardon des péchés, la guidance spirituelle, les bienfaits dans ce monde et dans l\'au-delà, la santé, et la satisfaction d\'Allah. Ce doua inclut des invocations en arabe avec leurs traductions, et il est récité avec dévotion et concentration. Vous pouvez trouver le texte complet du Doua de la Wazifa dans la section Tariqa des livres de l\'application.',
  
  // Personnalités spirituelles
  'thierno hassane deme': 'Thierno Hassane Dème (1920-2008) était un grand érudit et compagnon proche de Baye Niass. Il resta avec Cheikh Ibrahim Niass pendant vingt-huit ans, recevant de lui connaissances, secrets et lumières spirituelles. Pendant ces années, il a été un étudiant dévoué et un serviteur fidèle, absorbant les enseignements spirituels et les sciences islamiques. Le livre "Laylatou Katmiya" raconte sa biographie et son parcours spirituel exceptionnel, détaillant sa relation avec Baye Niass et son développement spirituel.',
  'thierno hassane dème': 'Thierno Hassane Dème était un érudit distingué et compagnon de Baye Niass pendant 28 ans. Il était spécialisé dans l\'éducation islamique et le service spirituel. Pendant son séjour avec Baye Niass, il a reçu une formation spirituelle approfondie et a contribué à l\'enseignement et à la propagation de la voie. Son histoire est racontée dans le livre "Laylatou Katmiya" disponible dans l\'application, qui détaille sa vie, son éducation, et son parcours spirituel remarquable.',
  
  // Livres et ouvrages - Réponses détaillées
  'livres': 'L\'application contient de nombreux livres spirituels précieux organisés en plusieurs catégories : 1) **PDF** : Livres au format PDF comme "Azal Thierno Hassen Dem", "Diawahir al Ma\'ani", "Nour al Kamal", etc. 2) **Tariqa** : Articles et enseignements sur la voie tidiane, incluant "Introduction à la Tariqa Tijaniyya", "Le Zikr dans la Voie", "La Salat al-Fatih", "L\'Attachement au Prophète", et "Doua Wazifa". 3) **Ma\'arifa** : Connaissances spirituelles profondes. Parmi les livres disponibles : "Laylatou Katmiya" (biographie de Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), "Afakhou Shiria" (Cheikh Ibrahim Niass). Accédez-y via l\'onglet "Livres".',
  'diawahir al maani': 'Diawahir al Ma\'ani (جواهر المعاني - Les Perles des Significations) est un ouvrage fondamental de la Tariqa Tijaniyya écrit par Cheikh Ahmed Tijani. Ce livre contient les enseignements spirituels, les secrets de la voie, et les principes de la tariqa. Il explique les pratiques spirituelles, les invocations, les règles de la voie, et les enseignements reçus du Prophète. C\'est un texte de référence essentiel pour tous les disciples de la Tariqa Tijaniyya, offrant une compréhension approfondie des fondements et des pratiques de la voie spirituelle.',
  'laylatou katmiya': 'Laylatou Katmiya (ليلة الكتمية) est une biographie de Thierno Hassane Dème, grand compagnon de Baye Niass. Ce livre raconte en détail sa vie, son éducation spirituelle, et son parcours aux côtés de Cheikh Ibrahim Niass pendant 28 ans. Il détaille la relation maître-disciple, les enseignements reçus, et le développement spirituel de Thierno Hassane Dème. C\'est un ouvrage précieux pour comprendre la formation spirituelle dans la voie et la relation avec un maître spirituel authentique.',
  'afakhou shiria': 'Afakhou Shiria est un ouvrage important écrit par Cheikh Ibrahim Niass (Baye Niass). Il traite des aspects de la voie spirituelle et des enseignements de la Tariqa Tijaniyya. Ce livre contient des explications sur les pratiques spirituelles, les principes de la voie, et les enseignements de Baye Niass sur la Fayda et le renouveau spirituel. C\'est une ressource précieuse pour comprendre les enseignements de ce grand maître spirituel.',
  
  // Islam général - Réponses détaillées
  'islam': 'L\'Islam est la religion révélée par Allah au Prophète Muhammad (paix et bénédictions sur lui). Elle repose sur cinq piliers fondamentaux : 1) La Shahada (attestation de foi : "Il n\'y a de dieu qu\'Allah et Muhammad est Son messager"), 2) La Salat (prière cinq fois par jour), 3) La Zakat (aumône obligatoire pour les nécessiteux), 4) Le Sawm (jeûne du mois de Ramadan), 5) Le Hajj (pèlerinage à La Mecque pour ceux qui en ont les moyens). L\'Islam comporte aussi six piliers de la foi (Iman) : croyance en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour du Jugement, et au destin. Le Coran est la parole d\'Allah et le Prophète Muhammad est le modèle parfait pour tous les musulmans.',
  'piliers islam': 'L\'Islam repose sur cinq piliers essentiels : 1) **La Shahada** : L\'attestation qu\'il n\'y a de dieu qu\'Allah et que Muhammad est Son messager. C\'est la base de la foi musulmane. 2) **La Salat** : La prière rituelle cinq fois par jour (Fajr, Dhuhr, Asr, Maghrib, Isha), orientée vers La Mecque. 3) **La Zakat** : L\'aumône obligatoire (2,5% des biens excédentaires) pour aider les nécessiteux. 4) **Le Sawm** : Le jeûne du mois de Ramadan, de l\'aube au coucher du soleil. 5) **Le Hajj** : Le pèlerinage à La Mecque au moins une fois dans la vie pour ceux qui en ont les moyens physiques et financiers. Ces piliers structurent la vie du musulman.',
  'piliers foi': 'Les six piliers de la foi (Iman) sont les croyances fondamentales de l\'Islam : 1) **Croyance en Allah** : L\'unicité divine (Tawhid), Allah est Un, Unique, sans associé. 2) **Croyance en Ses anges** : Les créatures d\'Allah créées de lumière qui exécutent Ses ordres. 3) **Croyance en Ses livres révélés** : Le Coran, la Torah, l\'Evangile, les Psaumes, et autres révélations. 4) **Croyance en Ses messagers** : Tous les prophètes depuis Adam jusqu\'à Muhammad (paix sur eux tous). 5) **Croyance au Jour du Jugement** : La résurrection et la rétribution des actes. 6) **Croyance au destin (qadar)** : Que tout ce qui arrive est selon la volonté et la connaissance d\'Allah.',
  'coran': 'Le Coran est la parole révélée d\'Allah au Prophète Muhammad (paix et bénédictions sur lui) à travers l\'ange Jibril (Gabriel) sur une période de 23 ans. C\'est le livre sacré de l\'Islam, contenant 114 sourates (chapitres) révélées à La Mecque et à Médine. Le Coran est la source principale de la législation islamique, de la guidance spirituelle, et de la sagesse. Il contient des récits des prophètes, des enseignements moraux, des lois, et des rappels. Dans l\'application, vous pouvez écouter des récitations du Coran par Abu Bakr Al-Shatri dans la section "Musique" puis "Coran". La récitation du Coran est une pratique spirituelle importante et récompensée.',
  'prophète': 'Le Prophète Muhammad (paix et bénédictions sur lui) est le dernier messager d\'Allah, envoyé à toute l\'humanité. Il est né à La Mecque en 570 de l\'ère chrétienne et reçut la révélation à l\'âge de 40 ans. Il a prêché l\'Islam pendant 23 ans, d\'abord à La Mecque puis à Médine. Il est le modèle parfait pour tous les musulmans (Oussouwa Hassana) dans tous les aspects de la vie : foi, adoration, comportement, relations sociales. Dans la Tariqa Tijaniyya, l\'amour et l\'attachement au Prophète occupent une place centrale, car il est la voie vers Allah. Les musulmans envoient des bénédictions sur lui (Salat) à chaque mention de son nom.',
  'soufisme': 'Le soufisme (التصوف) est la dimension mystique et spirituelle de l\'islam. Il cherche à purifier le cœur et à atteindre une proximité avec Allah à travers : 1) La pratique spirituelle (Zikr, méditation), 2) L\'éducation du caractère et des vertus, 3) L\'amour du Prophète Muhammad, 4) La recherche de la connaissance spirituelle (Ma\'arifa), 5) Le suivi d\'un maître spirituel (Cheikh) dans une voie (Tariqa). Le soufisme n\'est pas séparé de l\'Islam mais en est la dimension intérieure. La Tariqa Tijaniyya est l\'une des principales voies soufies, fondée par Cheikh Ahmed Tijani.',
  'maarifa': 'La Ma\'arifa (المعرفة) désigne la connaissance spirituelle directe, la gnose divine qui transcende la simple compréhension intellectuelle. C\'est une connaissance du cœur, une illumination qui vient d\'Allah, permettant de connaître Allah non pas par l\'étude mais par l\'expérience directe. Dans la Tariqa Tijaniyya, la Ma\'arifa est particulièrement valorisée car elle représente le but ultime de la voie spirituelle : connaître Allah de manière directe et intime. Cette connaissance s\'acquiert par la purification du cœur, le Zikr, l\'amour du Prophète, et la guidance d\'un maître spirituel authentique.',
};

// Fonction pour analyser l'intention de la question
function analyzeQuestion(message: string, messageHistory: Message[]): {
  keywords: string[];
  intent: string;
  context: string;
} {
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage.split(/\s+/).filter(w => w.length > 2);
  
  // Extraire les mots-clés importants
  const keywords: string[] = [];
  const importantWords = ['tariqa', 'fayda', 'zikr', 'wazifa', 'islam', 'coran', 'prophète', 'baye', 'niass', 'livre', 'musique', 'cours', 'maarifa', 'soufisme', 'salat', 'fatih', 'doua', 'thierno', 'hassane', 'deme', 'ahmed', 'tijani', 'ibrahim', 'médina', 'baye'];
  
  for (const word of words) {
    if (importantWords.some(iw => word.includes(iw) || iw.includes(word))) {
      keywords.push(word);
    }
  }
  
  // Déterminer l'intention
  let intent = 'general';
  if (lowerMessage.includes('quoi') || lowerMessage.includes('qu\'est') || lowerMessage.includes('what') || lowerMessage.includes('ما')) {
    intent = 'definition';
  } else if (lowerMessage.includes('comment') || lowerMessage.includes('how') || lowerMessage.includes('كيف')) {
    intent = 'howto';
  } else if (lowerMessage.includes('pourquoi') || lowerMessage.includes('why') || lowerMessage.includes('لماذا')) {
    intent = 'why';
  } else if (lowerMessage.includes('qui') || lowerMessage.includes('who') || lowerMessage.includes('من')) {
    intent = 'who';
  } else if (lowerMessage.includes('où') || lowerMessage.includes('where') || lowerMessage.includes('أين')) {
    intent = 'where';
  }
  
  // Analyser le contexte de l'historique
  const context = messageHistory.slice(-3).map(m => m.content).join(' ').toLowerCase();
  
  return { keywords, intent, context };
}

// Fonction pour trouver la meilleure correspondance dans la base de connaissances
function findBestMatch(message: string, context: string): string | null {
  const lowerMessage = message.toLowerCase();
  const lowerContext = context.toLowerCase();
  const combined = (lowerMessage + ' ' + lowerContext).toLowerCase();
  
  // Score de correspondance pour chaque entrée
  const scores: Array<{ key: string; score: number; value: string }> = [];
  
  for (const [key, value] of Object.entries(knowledgeBase)) {
    let score = 0;
    const keyWords = key.split(' ');
    
    // Calculer le score de correspondance
    for (const keyWord of keyWords) {
      if (combined.includes(keyWord)) {
        score += keyWord.length; // Plus le mot est long, plus il est important
      }
    }
    
    // Bonus si la clé complète est trouvée
    if (combined.includes(key)) {
      score += 50;
    }
    
    // Bonus si plusieurs mots-clés correspondent
    const matchingWords = keyWords.filter(kw => combined.includes(kw));
    if (matchingWords.length === keyWords.length) {
      score += 30;
    }
    
    if (score > 0) {
      scores.push({ key, score, value });
    }
  }
  
  // Trier par score décroissant
  scores.sort((a, b) => b.score - a.score);
  
  // Retourner la meilleure correspondance si le score est suffisant
  if (scores.length > 0 && scores[0].score >= 5) {
    return scores[0].value;
  }
  
  return null;
}

export const sendMessageToAI = async (
  messages: Message[],
  language: 'fr' | 'en' | 'ar' = 'fr'
): Promise<string> => {
  // Simuler un délai de réponse réaliste
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  const lastMessage = messages[messages.length - 1]?.content || '';
  const messageHistory = messages.slice(-5); // Utiliser les 5 derniers messages pour le contexte
  
  // Analyser la question
  const analysis = analyzeQuestion(lastMessage, messageHistory);
  const context = messageHistory.map(m => m.content).join(' ').toLowerCase();
  
  // Chercher dans la base de connaissances avec analyse améliorée
  const bestMatch = findBestMatch(lastMessage, context);
  if (bestMatch) {
    return bestMatch;
  }
  
  // Recherche simple par mots-clés (fallback)
  const lowerMessage = lastMessage.toLowerCase();
  for (const [key, value] of Object.entries(knowledgeBase)) {
    const keywords = key.split(' ');
    const found = keywords.some(kw => lowerMessage.includes(kw)) || lowerMessage.includes(key);
    if (found) {
      return value;
    }
  }

  // Réponses contextuelles selon le contenu du message et l'intention
  
  // Salutations
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('السلام') || lowerMessage.includes('assalam') || lowerMessage.includes('salam')) {
    return language === 'fr' 
      ? 'Bonjour ! Je suis Fayda IA, votre assistant spirituel de Fayda Digital. Je peux vous aider à comprendre l\'Islam, la Tariqa Tijaniyya, la Fayda Tidianiyya, le Zikr, les pratiques spirituelles, les livres disponibles, et vous guider dans l\'utilisation de l\'application. Posez-moi vos questions et je vous fournirai des réponses détaillées et explicites. Comment puis-je vous aider aujourd\'hui ?'
      : language === 'en'
      ? 'Hello! I am Fayda IA, your spiritual assistant from Fayda Digital. I can help you understand Islam, the Tijaniyya Tariqa, the Fayda, Zikr, spiritual practices, available books, and guide you in using the app. Ask me your questions and I will provide detailed and explicit answers. How can I help you today?'
      : 'السلام عليكم! أنا فيدا الذكاء الاصطناعي، مساعدك الروحي من فيضة ديجيتال. يمكنني مساعدتك في فهم الإسلام والطريقة التجانية والفيضة والذكر والممارسات الروحية والكتب المتاحة وإرشادك في استخدام التطبيق. اطرح علي أسئلتك وسأقدم لك إجابات مفصلة وواضحة. كيف يمكنني مساعدتك اليوم؟';
  }

  // Questions sur les livres
  if (lowerMessage.includes('livre') || lowerMessage.includes('book') || lowerMessage.includes('كتاب') || analysis.keywords.includes('livre')) {
    return language === 'fr'
      ? 'L\'application contient de nombreux livres spirituels précieux organisés en catégories : **PDF** (livres complets au format PDF), **Tariqa** (articles sur la voie tidiane), et **Ma\'arifa** (connaissances spirituelles). Parmi les livres disponibles : "Laylatou Katmiya" (biographie de Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), "Afakhou Shiria" (Cheikh Ibrahim Niass), "Azal Thierno Hassen Dem", "Nour al Kamal", et bien d\'autres. Dans la section Tariqa, vous trouverez des articles sur l\'introduction à la Tariqa, le Zikr, la Salat al-Fatih, l\'attachement au Prophète, et le Doua Wazifa. Accédez à tous ces contenus via l\'onglet "Livres" en bas de l\'écran.'
      : language === 'en'
      ? 'The app contains many precious spiritual books organized by categories: **PDF** (complete books in PDF format), **Tariqa** (articles on the Tijani path), and **Ma\'arifa** (spiritual knowledge). Among available books: "Laylatou Katmiya" (biography of Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), "Afakhou Shiria" (Cheikh Ibrahim Niass), and others. In the Tariqa section, you will find articles on introduction to Tariqa, Zikr, Salat al-Fatih, attachment to the Prophet, and Doua Wazifa. Access all this content via the "Books" tab at the bottom of the screen.'
      : 'يحتوي التطبيق على العديد من الكتب الروحية الثمينة المنظمة حسب الفئات: **PDF** (كتب كاملة بصيغة PDF)، **الطريقة** (مقالات عن الطريقة التجانية)، و**المعرفة** (المعرفة الروحية). من بين الكتب المتاحة: "ليلة الكتمية" و"جواهر المعاني" و"أفاخو شريعة" وغيرها.';
  }

  // Questions sur la musique et le Zikr
  if (lowerMessage.includes('musique') || lowerMessage.includes('zikr') || lowerMessage.includes('music') || lowerMessage.includes('ذكر') || lowerMessage.includes('invocation') || analysis.keywords.includes('zikr')) {
    return language === 'fr'
      ? 'Dans l\'onglet "Musique", vous trouverez plusieurs sections : 1) **Zikr** : Une collection complète d\'invocations spirituelles de la Tariqa Tijaniyya, incluant des enregistrements de Zikr pour vous guider dans cette pratique. 2) **Coran** : Des récitations coraniques par Abu Bakr Al-Shatri, permettant d\'écouter le Coran de manière récitative. 3) **Zikr & Music Snippets** : Des extraits musicaux spirituels. Utilisez le lecteur audio en bas de l\'écran pour contrôler la lecture : play/pause, avancer/reculer, et voir la progression. Vous pouvez également accéder à un lecteur plein écran pour une meilleure expérience d\'écoute.'
      : language === 'en'
      ? 'In the "Music" tab, you will find several sections: 1) **Zikr**: A complete collection of spiritual invocations from the Tijaniyya Tariqa, including Zikr recordings to guide you in this practice. 2) **Quran**: Quran recitations by Abu Bakr Al-Shatri, allowing you to listen to the Quran in a recitative manner. 3) **Zikr & Music Snippets**: Spiritual music excerpts. Use the audio player at the bottom to control playback: play/pause, forward/backward, and see progress. You can also access a full-screen player for a better listening experience.'
      : 'في علامة التبويب "الموسيقى"، ستجد عدة أقسام: 1) **الذكر**: مجموعة كاملة من الدعوات الروحية من الطريقة التجانية. 2) **القرآن**: تلاوات القرآن لأبو بكر الشاطري. 3) **مقتطفات الذكر والموسيقى**: مقتطفات موسيقية روحية.';
  }

  // Questions sur les cours
  if (lowerMessage.includes('cours') || lowerMessage.includes('course') || lowerMessage.includes('دورة') || lowerMessage.includes('formation')) {
    return language === 'fr'
      ? 'Les cours sont disponibles dans l\'onglet "Cours" (Library). Vous y trouverez des formations structurées sur : le soufisme et la spiritualité islamique, l\'étude approfondie du Coran, les 99 Noms d\'Allah (Asma al-Husna), la jurisprudence islamique (Fiqh), l\'histoire des compagnons du Prophète, et bien d\'autres sujets spirituels. Chaque cours contient plusieurs leçons progressives pour approfondir vos connaissances. Les cours sont organisés par thèmes et vous pouvez suivre votre progression. C\'est une excellente ressource pour développer votre compréhension de l\'Islam et de la spiritualité.'
      : language === 'en'
      ? 'Courses are available in the "Courses" (Library) tab. You will find structured training on: Sufism and Islamic spirituality, in-depth Quran study, the 99 Names of Allah (Asma al-Husna), Islamic jurisprudence (Fiqh), history of the Prophet\'s companions, and many other spiritual topics. Each course contains several progressive lessons to deepen your knowledge. Courses are organized by themes and you can track your progress. This is an excellent resource for developing your understanding of Islam and spirituality.'
      : 'الدورات متاحة في علامة التبويب "الدورات". ستجد تدريبات منظمة حول: التصوف والروحانية الإسلامية، دراسة متعمقة للقرآن، الأسماء الحسنى، الفقه الإسلامي، تاريخ الصحابة، ومواضيع روحية أخرى. كل دورة تحتوي على عدة دروس تقدمية.';
  }

  // Questions sur l'utilisation de l'application
  if (lowerMessage.includes('comment') || lowerMessage.includes('how') || lowerMessage.includes('كيف') || lowerMessage.includes('utiliser') || lowerMessage.includes('use') || analysis.intent === 'howto') {
    return language === 'fr'
      ? 'Pour utiliser l\'application Fayda Digital efficacement : 1) **Navigation** : Utilisez les 5 onglets en bas (Accueil, Livres, Musique, Podcasts, Fayda IA) pour naviguer entre les sections. 2) **Livres** : Cliquez sur un livre pour le lire. Les PDF s\'ouvrent dans un lecteur PDF, les articles HTML s\'affichent dans une vue web. 3) **Musique** : Sélectionnez un Zikr ou une récitation pour l\'écouter. Le lecteur audio apparaît en bas. 4) **Podcasts** : Explorez les podcasts disponibles et écoutez-les via le lecteur. 5) **Fayda IA** : Posez vos questions spirituelles ici. 6) **Langue** : Changez la langue via le sélecteur dans les en-têtes. Explorez toutes les sections pour découvrir le contenu riche disponible !'
      : language === 'en'
      ? 'To use the Fayda Digital app effectively: 1) **Navigation**: Use the 5 bottom tabs (Home, Books, Music, Podcasts, Fayda IA) to navigate between sections. 2) **Books**: Click on a book to read it. PDFs open in a PDF reader, HTML articles display in a web view. 3) **Music**: Select a Zikr or recitation to listen. The audio player appears at the bottom. 4) **Podcasts**: Explore available podcasts and listen via the player. 5) **Fayda IA**: Ask your spiritual questions here. 6) **Language**: Change language via the selector in headers. Explore all sections to discover the rich content available!'
      : 'لاستخدام تطبيق فيضة ديجيتال بفعالية: 1) **التنقل**: استخدم علامات التبويب الخمسة السفلية للتنقل. 2) **الكتب**: انقر على كتاب لقراءته. 3) **الموسيقى**: اختر ذكراً أو تلاوة للاستماع. 4) **البودكاست**: استكشف البودكاست المتاحة. 5) **فيدا الذكاء الاصطناعي**: اطرح أسئلتك الروحية هنا.';
  }

  // Questions sur l'Islam
  if (lowerMessage.includes('islam') || lowerMessage.includes('musulman') || lowerMessage.includes('إسلام') || analysis.keywords.includes('islam')) {
    return language === 'fr'
      ? 'L\'Islam est la religion révélée par Allah au Prophète Muhammad (paix et bénédictions sur lui). **Les cinq piliers de l\'Islam** sont : 1) La Shahada (attestation de foi), 2) La Salat (prière cinq fois par jour), 3) La Zakat (aumône), 4) Le Sawm (jeûne du Ramadan), 5) Le Hajj (pèlerinage). **Les six piliers de la foi** sont : croyance en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour du Jugement, et au destin. Le Coran est la parole d\'Allah révélée au Prophète. Le Prophète Muhammad est le modèle parfait (Oussouwa Hassana) pour tous les musulmans. Dans la Tariqa Tijaniyya, l\'amour et l\'attachement au Prophète occupent une place centrale dans la pratique spirituelle.'
      : language === 'en'
      ? 'Islam is the religion revealed by Allah to Prophet Muhammad (peace and blessings upon him). **The five pillars of Islam** are: 1) Shahada (testimony of faith), 2) Salat (prayer five times a day), 3) Zakat (charity), 4) Sawm (fasting in Ramadan), 5) Hajj (pilgrimage). **The six pillars of faith** are: belief in Allah, in His angels, in His books, in His messengers, in the Day of Judgment, and in destiny. The Quran is the word of Allah revealed to the Prophet. Prophet Muhammad is the perfect model (Uswa Hasana) for all Muslims. In the Tijaniyya Tariqa, love and attachment to the Prophet hold a central place in spiritual practice.'
      : 'الإسلام هو الدين الذي أنزله الله على النبي محمد (صلى الله عليه وسلم). **الأركان الخمسة للإسلام** هي: الشهادة والصلاة والزكاة والصوم والحج. **أركان الإيمان الستة** هي: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر. القرآن هو كلام الله المنزل على النبي. النبي محمد هو القدوة المثالية لجميع المسلمين.';
  }

  // Questions sur Baye Niass et la Fayda
  if (lowerMessage.includes('baye') || lowerMessage.includes('fayda') || lowerMessage.includes('فيضة') || analysis.keywords.some(k => k.includes('baye') || k.includes('fayda') || k.includes('niass'))) {
    return language === 'fr'
      ? 'Baye Niass (Cheikh Ibrahim Niass, 1900-1975) était un grand maître spirituel qui a ravivé la Tariqa Tijaniyya au 20ème siècle. Il a initié la **Fayda Tidianiyya** (le déluge spirituel), un mouvement de renouveau qui a répandu la voie dans le monde entier, touchant des millions de personnes. **Médina Baye** à Kaolack, Sénégal, était son centre spirituel et est devenu un lieu de pèlerinage majeur. Baye Niass était : 1) Un érudit exceptionnel maîtrisant de nombreuses sciences islamiques, 2) Un auteur prolifique de nombreux ouvrages importants, 3) Un réformateur qui a modernisé l\'enseignement de la voie, 4) Un guide spirituel qui a formé des milliers de disciples. Il est considéré comme le "Baye" (Père) de la Fayda et a été l\'un des plus grands propagateurs de la Tariqa Tijaniyya au 20ème siècle.'
      : language === 'en'
      ? 'Baye Niass (Sheikh Ibrahim Niass, 1900-1975) was a great spiritual master who revived the Tijaniyya Tariqa in the 20th century. He initiated the **Fayda Tidianiyya** (the spiritual flood), a renewal movement that spread the path throughout the world, touching millions of people. **Medina Baye** in Kaolack, Senegal, was his spiritual center and became a major pilgrimage site. Baye Niass was: 1) An exceptional scholar mastering many Islamic sciences, 2) A prolific author of many important works, 3) A reformer who modernized the teaching of the path, 4) A spiritual guide who trained thousands of disciples. He is considered the "Baye" (Father) of the Fayda and was one of the greatest propagators of the Tijaniyya Tariqa in the 20th century.'
      : 'باي نياس (الشيخ إبراهيم نياس، 1900-1975) كان معلماً روحياً عظيماً أعاد إحياء الطريقة التجانية في القرن العشرين. بدأ **الفيضة التجانية** (الطوفان الروحي)، وهي حركة تجديد نشرت الطريقة في جميع أنحاء العالم، مؤثرة على ملايين الأشخاص. **المدينة باي** في كولاك، السنغال، كان مركزه الروحي وأصبح مكان حج رئيسي.';
  }

  // Questions sur le Zikr et comment le pratiquer
  if (analysis.keywords.includes('zikr') && (analysis.intent === 'howto' || lowerMessage.includes('comment') || lowerMessage.includes('pratiquer'))) {
    return language === 'fr'
      ? 'Pour pratiquer le Zikr dans la Tariqa Tijaniyya, voici les étapes détaillées : 1) **Préparation** : Faites vos ablutions (wudu) pour être en état de pureté. 2) **Lieu** : Choisissez un endroit calme et propre, de préférence après une prière. 3) **Position** : Asseyez-vous confortablement, de préférence en tailleur, le dos droit. 4) **Récitation** : Récitez "La ilaha illa Allah" (Il n\'y a de dieu qu\'Allah) ou "Allah" de manière répétée, soit silencieusement dans le cœur, soit à voix basse. 5) **Concentration** : Concentrez votre cœur sur la signification des mots et la présence d\'Allah. 6) **Durée** : Pratiquez régulièrement, de préférence après les prières obligatoires. Le Zikr purifie le cœur, élève l\'âme, et crée une connexion profonde avec Allah. Dans l\'application, vous trouverez des enregistrements de Zikr dans la section "Musique" pour vous guider.'
      : language === 'en'
      ? 'To practice Zikr in the Tijaniyya Tariqa, here are the detailed steps: 1) **Preparation**: Perform ablutions (wudu) to be in a state of purity. 2) **Place**: Choose a quiet and clean place, preferably after a prayer. 3) **Position**: Sit comfortably, preferably cross-legged, with your back straight. 4) **Recitation**: Recite "La ilaha illa Allah" (There is no god but Allah) or "Allah" repeatedly, either silently in the heart or in a low voice. 5) **Concentration**: Focus your heart on the meaning of the words and the presence of Allah. 6) **Duration**: Practice regularly, preferably after obligatory prayers. Zikr purifies the heart, elevates the soul, and creates a deep connection with Allah. In the app, you will find Zikr recordings in the "Music" section to guide you.'
      : 'لممارسة الذكر في الطريقة التجانية: 1) **التحضير**: قم بالوضوء. 2) **المكان**: اختر مكاناً هادئاً ونظيفاً. 3) **الوضعية**: اجلس بشكل مريح. 4) **التلاوة**: اذكر "لا إله إلا الله" أو "الله" بشكل متكرر. 5) **التركيز**: ركز قلبك على معنى الكلمات وحضور الله. 6) **المدة**: مارس بانتظام بعد الصلوات.';
  }

  // Réponse générique intelligente et contextualisée avec suggestions
  return language === 'fr'
    ? `Je comprends votre question. Je peux vous fournir des réponses détaillées et explicites sur plusieurs sujets :

**Islam** : Les cinq piliers, les six piliers de la foi, le Coran, le Prophète Muhammad, le soufisme.

**Tariqa Tijaniyya** : Les fondements de la voie, les pratiques (Zikr, Salat al-Fatih, Wazifa), Cheikh Ahmed Tijani, l'amour du Prophète.

**Fayda Tidianiyya** : Baye Niass (Cheikh Ibrahim Niass), Médina Baye, le mouvement de renouveau spirituel.

**Pratiques spirituelles** : Comment pratiquer le Zikr, la Wazifa, le Doua de la Wazifa.

**Application Fayda Digital** : Comment utiliser les différentes sections (Livres, Musique, Podcasts, Cours).

Pour obtenir une réponse plus précise, posez-moi une question spécifique, par exemple :
- "Qu'est-ce que la Fayda Tidianiyya ?"
- "Comment pratiquer le Zikr ?"
- "Quels livres sont disponibles dans l'application ?"
- "Qui est Baye Niass ?"
- "Expliquez-moi la Wazifa"`

    : language === 'en'
    ? `I understand your question. I can provide detailed and explicit answers on various topics:

**Islam**: The five pillars, the six pillars of faith, the Quran, Prophet Muhammad, Sufism.

**Tijaniyya Tariqa**: The foundations of the path, practices (Zikr, Salat al-Fatih, Wazifa), Sheikh Ahmed Tijani, love of the Prophet.

**Fayda Tidianiyya**: Baye Niass (Sheikh Ibrahim Niass), Medina Baye, the spiritual renewal movement.

**Spiritual practices**: How to practice Zikr, Wazifa, Doua of Wazifa.

**Fayda Digital app**: How to use different sections (Books, Music, Podcasts, Courses).

To get a more precise answer, ask me a specific question, for example:
- "What is the Fayda Tidianiyya?"
- "How to practice Zikr?"
- "What books are available in the app?"
- "Who is Baye Niass?"
- "Explain the Wazifa to me"`

    : `أفهم سؤالك. يمكنني تقديم إجابات مفصلة وواضحة حول مواضيع مختلفة:

**الإسلام**: الأركان الخمسة، أركان الإيمان الستة، القرآن، النبي محمد، التصوف.

**الطريقة التجانية**: أسس الطريقة، الممارسات (الذكر، صلاة الفاتح، الوظيفة)، الشيخ أحمد التجاني، حب النبي.

**الفيضة التجانية**: باي نياس، المدينة باي، حركة التجديد الروحي.

**الممارسات الروحية**: كيفية ممارسة الذكر، الوظيفة، دعاء الوظيفة.

**تطبيق فيضة ديجيتال**: كيفية استخدام الأقسام المختلفة.

للحصول على إجابة أكثر دقة، اطرح علي سؤالاً محدداً.`;
};
