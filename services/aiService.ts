// services/aiService.ts - Service d'assistant IA avec réponses prédéfinies (100% gratuit)

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Base de connaissances sur l'application et la spiritualité
const knowledgeBase: Record<string, string> = {
  'tariqa': 'La Tariqa Tijaniyya est une voie spirituelle soufie fondée par Cheikh Ahmed Tijani au 18ème siècle. Elle met l\'accent sur le Zikr (répétition des noms d\'Allah), la récitation de la Salat al-Fatih, et la recherche de la proximité avec le Prophète Muhammad (paix et bénédictions sur lui). Cette voie spirituelle est largement pratiquée en Afrique de l\'Ouest et dans le monde entier.',
  'zikr': 'Le Zikr (ذکر) est la récitation des noms d\'Allah et des invocations. Dans la Tariqa Tijaniyya, le Zikr occupe une place centrale pour purifier le cœur et se rapprocher d\'Allah. Vous pouvez trouver de nombreux enregistrements de Zikr dans la section "Musique" de l\'application.',
  'livres': 'L\'application contient plusieurs livres spirituels précieux : "Laylatou Katmiya" (biographie de Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), et bien d\'autres ouvrages sur le soufisme et la spiritualité islamique. Accédez-y via l\'onglet "Livres".',
  'application': 'Fayda Digital vous permet d\'accéder à des livres, musiques spirituelles (Zikr), podcasts, cours, et vidéos. Utilisez les onglets en bas pour naviguer entre les sections : Accueil, Livres, Musique, Podcasts, et Cours.',
  'soufisme': 'Le soufisme (التصوف) est la dimension mystique et spirituelle de l\'islam. Il cherche à purifier le cœur et à atteindre une proximité avec Allah à travers la pratique spirituelle, le Zikr, et l\'éducation du caractère. La Tariqa Tijaniyya est l\'une des principales voies soufies.',
  'salat al-fatih': 'La Salat al-Fatih est une prière spéciale récitée dans la Tariqa Tijaniyya. Elle est considérée comme ayant une grande valeur spirituelle et est souvent récitée lors des séances de Zikr.',
  'thierno hassane deme': 'Thierno Hassane Dème était un grand érudit et compagnon de Baye Niass. Le livre "Laylatou Katmiya" raconte sa biographie lumineuse et son parcours spirituel exceptionnel.',
  'diawahir al maani': 'Diawahir al Ma\'ani (جواهر المعاني) est un ouvrage fondamental de la Tariqa Tijaniyya écrit par Cheikh Ahmed Tijani. Il contient les enseignements spirituels et les secrets de la voie.',
  'coran': 'Dans l\'application, vous pouvez écouter des récitations du Coran par Abu Bakr Al-Shatri. Accédez-y via l\'onglet "Musique" puis la section "Coran".',
  'podcasts': 'Les podcasts contiennent des enseignements, des conférences et des discussions sur la spiritualité islamique. Explorez-les dans l\'onglet "Podcasts".',
};

export const sendMessageToAI = async (
  messages: Message[],
  language: 'fr' | 'en' | 'ar' = 'fr'
): Promise<string> => {
  // Simuler un délai de réponse réaliste
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  // Rechercher dans la base de connaissances
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (lastMessage.includes(key)) {
      return value;
    }
  }

  // Réponses contextuelles selon le contenu du message
  if (lastMessage.includes('bonjour') || lastMessage.includes('salut') || lastMessage.includes('hello') || lastMessage.includes('السلام')) {
    return language === 'fr' 
      ? 'Bonjour ! Je suis votre assistant spirituel. Je peux vous aider à comprendre la Tariqa Tijaniyya, le Zikr, les livres disponibles, et vous guider dans l\'utilisation de l\'application. Comment puis-je vous aider aujourd\'hui ?'
      : language === 'en'
      ? 'Hello! I am your spiritual assistant. I can help you understand the Tijaniyya Tariqa, Zikr, available books, and guide you in using the app. How can I help you today?'
      : 'مرحباً! أنا مساعدك الروحي. يمكنني مساعدتك في فهم الطريقة التجانية والذكر والكتب المتاحة وإرشادك في استخدام التطبيق. كيف يمكنني مساعدتك اليوم؟';
  }

  if (lastMessage.includes('livre') || lastMessage.includes('book') || lastMessage.includes('كتاب')) {
    return language === 'fr'
      ? 'L\'application contient de nombreux livres spirituels précieux. Allez dans l\'onglet "Livres" pour découvrir "Laylatou Katmiya" (biographie de Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), et d\'autres ouvrages sur le soufisme et la spiritualité islamique.'
      : language === 'en'
      ? 'The app contains many precious spiritual books. Go to the "Books" tab to discover "Laylatou Katmiya" (biography of Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), and other works on Sufism and Islamic spirituality.'
      : 'يحتوي التطبيق على العديد من الكتب الروحية الثمينة. اذهب إلى علامة التبويب "الكتب" لاكتشاف "ليلة الكتمية" (سيرة ثيرنو حسن ديم) و"جواهر المعاني" (الشيخ أحمد التجاني) وأعمال أخرى عن التصوف والروحانية الإسلامية.';
  }

  if (lastMessage.includes('musique') || lastMessage.includes('zikr') || lastMessage.includes('music') || lastMessage.includes('ذكر')) {
    return language === 'fr'
      ? 'Dans l\'onglet "Musique", vous trouverez des Zikr (invocations), des récitations du Coran, et des chants spirituels. Cliquez sur la section "Zikr" pour accéder à la collection complète d\'invocations spirituelles. Vous pouvez également écouter des récitations coraniques dans la section "Coran".'
      : language === 'en'
      ? 'In the "Music" tab, you will find Zikr (invocations), Quran recitations, and spiritual chants. Click on the "Zikr" section to access the complete collection of spiritual invocations. You can also listen to Quran recitations in the "Quran" section.'
      : 'في علامة التبويب "الموسيقى"، ستجد الذكر (الدعوات) وتلاوات القرآن والأغاني الروحية. انقر على قسم "الذكر" للوصول إلى المجموعة الكاملة من الدعوات الروحية. يمكنك أيضاً الاستماع إلى تلاوات القرآن في قسم "القرآن".';
  }

  if (lastMessage.includes('cours') || lastMessage.includes('course') || lastMessage.includes('دورة')) {
    return language === 'fr'
      ? 'Les cours sont disponibles dans l\'onglet "Cours" (Library). Vous y trouverez des formations sur le soufisme, l\'étude du Coran, les 99 Noms d\'Allah, et bien d\'autres sujets spirituels. Chaque cours contient plusieurs leçons.'
      : language === 'en'
      ? 'Courses are available in the "Courses" (Library) tab. You will find training on Sufism, Quran study, the 99 Names of Allah, and many other spiritual topics. Each course contains several lessons.'
      : 'الدورات متاحة في علامة التبويب "الدورات" (المكتبة). ستجد تدريبات حول التصوف ودراسة القرآن والأسماء الحسنى ومواضيع روحية أخرى كثيرة. كل دورة تحتوي على عدة دروس.';
  }

  if (lastMessage.includes('comment') || lastMessage.includes('how') || lastMessage.includes('كيف')) {
    return language === 'fr'
      ? 'Pour utiliser l\'application : 1) Utilisez les onglets en bas pour naviguer (Accueil, Livres, Musique, Podcasts, Cours), 2) Cliquez sur un contenu pour le lire ou l\'écouter, 3) Utilisez le lecteur audio en bas pour contrôler la lecture. N\'hésitez pas à me poser des questions spécifiques !'
      : language === 'en'
      ? 'To use the app: 1) Use the bottom tabs to navigate (Home, Books, Music, Podcasts, Courses), 2) Click on content to read or listen, 3) Use the audio player at the bottom to control playback. Feel free to ask me specific questions!'
      : 'لاستخدام التطبيق: 1) استخدم علامات التبويب السفلية للتنقل (الرئيسية، الكتب، الموسيقى، البودكاست، الدورات)، 2) انقر على المحتوى للقراءة أو الاستماع، 3) استخدم مشغل الصوت في الأسفل للتحكم في التشغيل. لا تتردد في طرح أسئلة محددة!';
  }

  // Réponse générique intelligente
  return language === 'fr'
    ? 'Je comprends votre question. Pour plus d\'informations, explorez les différentes sections de l\'application : Livres, Musique (Zikr et Coran), Podcasts, et Cours. N\'hésitez pas à me poser des questions spécifiques sur la Tariqa Tijaniyya, le Zikr, le soufisme, ou les contenus disponibles dans l\'application.'
    : language === 'en'
    ? 'I understand your question. For more information, explore the different sections of the app: Books, Music (Zikr and Quran), Podcasts, and Courses. Feel free to ask me specific questions about the Tijaniyya Tariqa, Zikr, Sufism, or available content in the app.'
    : 'أفهم سؤالك. لمزيد من المعلومات، استكشف الأقسام المختلفة للتطبيق: الكتب، الموسيقى (الذكر والقرآن)، البودكاست، والدورات. لا تتردد في طرح أسئلة محددة حول الطريقة التجانية أو الذكر أو التصوف أو المحتوى المتاح في التطبيق.';
};

