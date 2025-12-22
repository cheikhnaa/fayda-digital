// services/aiService.ts - Service d'assistant IA avec réponses prédéfinies (100% gratuit)

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Base de connaissances enrichie sur l'islam, la Tariqa Tijaniyya, la Fayda et l'application
const knowledgeBase: Record<string, string> = {
  // Application
  'application': 'Fayda Digital est une application mobile complète qui vous permet d\'accéder à des livres spirituels, musiques (Zikr), podcasts, cours, et vidéos sur la Tariqa Tijaniyya. Utilisez les onglets en bas pour naviguer : Accueil, Livres, Musique, Podcasts, et Cours.',
  'fayda digital': 'Fayda Digital est une plateforme spirituelle dédiée à la diffusion des enseignements de la Tariqa Tijaniyya et de la Fayda Tidianiyya. L\'application contient des livres, des enregistrements de Zikr, des podcasts, des cours et des vidéos pour votre cheminement spirituel.',
  
  // Tariqa Tijaniyya
  'tariqa': 'La Tariqa Tijaniyya est une voie spirituelle soufie fondée par Cheikh Ahmed Tijani (1737-1815) à Fès, au Maroc. Elle met l\'accent sur le Zikr (répétition des noms d\'Allah), la récitation de la Salat al-Fatih, et la recherche de la proximité avec le Prophète Muhammad (paix et bénédictions sur lui). Cette voie spirituelle est largement pratiquée en Afrique de l\'Ouest et dans le monde entier.',
  'tariqa tidianiyya': 'La Tariqa Tijaniyya est une voie spirituelle soufie fondée par Cheikh Ahmed Tijani. Elle met l\'accent sur le Zikr, la Salat al-Fatih, et l\'amour du Prophète. Le Cheikh reçut ses enseignements directement du Prophète Muhammad (paix et bénédictions sur lui) dans un état d\'éveil.',
  'cheikh ahmed tidiane': 'Cheikh Ahmed Tijani (1737-1815) est le fondateur de la Tariqa Tijaniyya. Né en Algérie, il s\'installa à Fès, au Maroc, où il fonda cette voie spirituelle. Il reçut ses enseignements directement du Prophète Muhammad (paix et bénédictions sur lui) dans un état d\'éveil, ce qui confère à cette voie une particularité unique.',
  'cheikh ahmed tijani': 'Cheikh Ahmed Tijani (1737-1815) est le fondateur de la Tariqa Tijaniyya. Il reçut ses enseignements directement du Prophète Muhammad (paix et bénédictions sur lui) et fonda cette voie spirituelle à Fès, au Maroc.',
  
  // Fayda Tidianiyya
  'fayda': 'La Fayda Tidianiyya (ou Fayda Tijaniyya) est un mouvement de renouveau spirituel initié par Cheikh Ibrahim Niass (Baye Niass) au 20ème siècle. "Fayda" signifie "déluge" ou "inondation spirituelle". Baye Niass a ravivé et répandu la Tariqa Tijaniyya à travers le monde, particulièrement en Afrique de l\'Ouest.',
  'fayda tidianiyya': 'La Fayda Tidianiyya est le mouvement de renouveau de la Tariqa Tijaniyya initié par Cheikh Ibrahim Niass (Baye Niass). Elle représente une expansion massive de la voie spirituelle et a touché des millions de personnes à travers le monde.',
  'baye niass': 'Baye Niass (Cheikh Ibrahim Niass, 1900-1975) était un grand maître spirituel, érudit et réformateur qui a ravivé la Tariqa Tijaniyya au 20ème siècle. Il est considéré comme le "Baye" (Père) de la Fayda Tidianiyya. Son centre spirituel se trouvait à Kaolack, au Sénégal (Médina Baye).',
  'ibrahim niass': 'Cheikh Ibrahim Niass (1900-1975), également connu sous le nom de "Baye Niass", était un grand maître spirituel de la Tariqa Tijaniyya. Il a initié la Fayda Tidianiyya, un mouvement de renouveau qui a répandu la voie dans le monde entier. Médina Baye à Kaolack était son centre spirituel.',
  'cheikh ibrahim niass': 'Cheikh Ibrahim Niass (1900-1975), connu comme "Baye Niass", était un maître spirituel, érudit et réformateur de la Tariqa Tijaniyya. Il a initié la Fayda et a été l\'un des plus grands propagateurs de la voie au 20ème siècle.',
  'médina baye': 'Médina Baye est le centre spirituel fondé par Cheikh Ibrahim Niass (Baye Niass) à Kaolack, au Sénégal. C\'est un lieu de pèlerinage et d\'enseignement spirituel important pour les disciples de la Tariqa Tijaniyya et de la Fayda.',
  
  // Zikr et pratiques spirituelles
  'zikr': 'Le Zikr (ذکر) est la récitation des noms d\'Allah et des invocations. Dans la Tariqa Tijaniyya, le Zikr occupe une place centrale pour purifier le cœur et se rapprocher d\'Allah. Vous pouvez trouver de nombreux enregistrements de Zikr dans la section "Musique" de l\'application.',
  'salat al-fatih': 'La Salat al-Fatih est une prière spéciale récitée dans la Tariqa Tijaniyya. Elle est considérée comme ayant une grande valeur spirituelle, équivalente à des milliers de récitations du Coran selon les enseignements du Cheikh Ahmed Tijani. Elle est souvent récitée lors des séances de Zikr.',
  'wazifa': 'La Wazifa est une pratique spirituelle de la Tariqa Tijaniyya qui consiste en la récitation quotidienne de prières et d\'invocations spécifiques, incluant la Salat al-Fatih et le Doua de la Wazifa. C\'est une pratique régulière et disciplinée pour maintenir la connexion spirituelle.',
  'doua wazifa': 'Le Doua de la Wazifa est une série d\'invocations récitées dans le cadre de la pratique de la Wazifa dans la Tariqa Tijaniyya. Il contient des prières pour demander la protection, le pardon, la guidance et les bienfaits d\'Allah. Vous pouvez trouver ce contenu dans la section Tariqa des livres de l\'application.',
  
  // Personnalités spirituelles
  'thierno hassane deme': 'Thierno Hassane Dème (1920-2008) était un grand érudit et compagnon proche de Baye Niass. Il resta avec Cheikh Ibrahim Niass pendant vingt-huit ans, recevant de lui connaissances, secrets et lumières spirituelles. Le livre "Laylatou Katmiya" raconte sa biographie et son parcours spirituel exceptionnel.',
  'thierno hassane dème': 'Thierno Hassane Dème était un érudit distingué et compagnon de Baye Niass pendant 28 ans. Il était spécialisé dans l\'éducation islamique et le service spirituel. Son histoire est racontée dans le livre "Laylatou Katmiya" disponible dans l\'application.',
  
  // Livres et ouvrages
  'livres': 'L\'application contient de nombreux livres spirituels précieux : "Laylatou Katmiya" (biographie de Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), "Afakhou Shiria" (Cheikh Ibrahim Niass), et bien d\'autres ouvrages sur le soufisme et la spiritualité islamique. Accédez-y via l\'onglet "Livres".',
  'diawahir al maani': 'Diawahir al Ma\'ani (جواهر المعاني - Les Perles des Significations) est un ouvrage fondamental de la Tariqa Tijaniyya écrit par Cheikh Ahmed Tijani. Il contient les enseignements spirituels, les secrets de la voie, et les principes de la tariqa. C\'est un texte de référence pour tous les disciples.',
  'laylatou katmiya': 'Laylatou Katmiya (ليلة الكتمية) est une biographie de Thierno Hassane Dème, grand compagnon de Baye Niass. Ce livre raconte sa vie, son éducation spirituelle, et son parcours aux côtés de Cheikh Ibrahim Niass pendant 28 ans.',
  'afakhou shiria': 'Afakhou Shiria est un ouvrage important écrit par Cheikh Ibrahim Niass (Baye Niass). Il traite des aspects de la voie spirituelle et des enseignements de la Tariqa Tijaniyya.',
  
  // Islam général
  'islam': 'L\'Islam est la religion révélée par Allah au Prophète Muhammad (paix et bénédictions sur lui). Elle repose sur cinq piliers : la Shahada (attestation de foi), la Salat (prière), la Zakat (aumône), le Sawm (jeûne du Ramadan), et le Hajj (pèlerinage à La Mecque). L\'Islam comporte aussi six piliers de la foi.',
  'piliers islam': 'L\'Islam repose sur cinq piliers : 1) La Shahada (attestation qu\'il n\'y a de dieu qu\'Allah et que Muhammad est Son messager), 2) La Salat (prière cinq fois par jour), 3) La Zakat (aumône obligatoire), 4) Le Sawm (jeûne du Ramadan), 5) Le Hajj (pèlerinage à La Mecque pour ceux qui en ont les moyens).',
  'piliers foi': 'Les six piliers de la foi (Iman) sont : 1) Croyance en Allah (Unicité divine), 2) Croyance en Ses anges, 3) Croyance en Ses livres révélés (Coran, Torah, Evangile, Psaumes), 4) Croyance en Ses messagers, 5) Croyance au Jour du Jugement, 6) Croyance au destin (qadar).',
  'coran': 'Le Coran est la parole révélée d\'Allah au Prophète Muhammad (paix et bénédictions sur lui) à travers l\'ange Jibril. C\'est le livre sacré de l\'Islam, contenant 114 sourates. Dans l\'application, vous pouvez écouter des récitations du Coran par Abu Bakr Al-Shatri dans la section "Musique" puis "Coran".',
  'prophète': 'Le Prophète Muhammad (paix et bénédictions sur lui) est le dernier messager d\'Allah, envoyé à toute l\'humanité. Il est né à La Mecque en 570 et reçut la révélation à l\'âge de 40 ans. Il est le modèle parfait pour tous les musulmans et l\'objet d\'un amour profond dans la Tariqa Tijaniyya.',
  'soufisme': 'Le soufisme (التصوف) est la dimension mystique et spirituelle de l\'islam. Il cherche à purifier le cœur et à atteindre une proximité avec Allah à travers la pratique spirituelle, le Zikr, l\'éducation du caractère, et l\'amour du Prophète. La Tariqa Tijaniyya est l\'une des principales voies soufies.',
  'maarifa': 'La Ma\'arifa (المعرفة) désigne la connaissance spirituelle directe, la gnose divine qui transcende la simple compréhension intellectuelle. C\'est une connaissance du cœur, une illumination qui vient d\'Allah. Dans la Tariqa Tijaniyya, la Ma\'arifa est particulièrement valorisée.',
};

export const sendMessageToAI = async (
  messages: Message[],
  language: 'fr' | 'en' | 'ar' = 'fr'
): Promise<string> => {
  // Simuler un délai de réponse réaliste
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  // Rechercher dans la base de connaissances (recherche améliorée)
  for (const [key, value] of Object.entries(knowledgeBase)) {
    // Recherche par mots-clés multiples
    const keywords = key.split(' ');
    const found = keywords.some(kw => lastMessage.includes(kw)) || lastMessage.includes(key);
    if (found) {
      return value;
    }
  }

  // Réponses contextuelles selon le contenu du message
  
  // Salutations
  if (lastMessage.includes('bonjour') || lastMessage.includes('salut') || lastMessage.includes('hello') || lastMessage.includes('السلام') || lastMessage.includes('assalam')) {
    return language === 'fr' 
      ? 'Bonjour ! Je suis votre assistant spirituel de Fayda Digital. Je peux vous aider à comprendre l\'Islam, la Tariqa Tijaniyya, la Fayda Tidianiyya, le Zikr, les livres disponibles, et vous guider dans l\'utilisation de l\'application. Comment puis-je vous aider aujourd\'hui ?'
      : language === 'en'
      ? 'Hello! I am your spiritual assistant from Fayda Digital. I can help you understand Islam, the Tijaniyya Tariqa, the Fayda, Zikr, available books, and guide you in using the app. How can I help you today?'
      : 'السلام عليكم! أنا مساعدك الروحي من فيضة ديجيتال. يمكنني مساعدتك في فهم الإسلام والطريقة التجانية والفيضة والذكر والكتب المتاحة وإرشادك في استخدام التطبيق. كيف يمكنني مساعدتك اليوم؟';
  }

  // Questions sur les livres
  if (lastMessage.includes('livre') || lastMessage.includes('book') || lastMessage.includes('كتاب')) {
    return language === 'fr'
      ? 'L\'application contient de nombreux livres spirituels précieux. Dans l\'onglet "Livres", vous trouverez : "Laylatou Katmiya" (biographie de Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), "Afakhou Shiria" (Cheikh Ibrahim Niass), et bien d\'autres ouvrages sur le soufisme et la spiritualité islamique. Les livres sont organisés par catégories : PDF, Tariqa, Ma\'arifa, etc.'
      : language === 'en'
      ? 'The app contains many precious spiritual books. In the "Books" tab, you will find: "Laylatou Katmiya" (biography of Thierno Hassane Dème), "Diawahir al Ma\'ani" (Cheikh Ahmed Tijani), "Afakhou Shiria" (Cheikh Ibrahim Niass), and other works on Sufism and Islamic spirituality. Books are organized by categories: PDF, Tariqa, Ma\'arifa, etc.'
      : 'يحتوي التطبيق على العديد من الكتب الروحية الثمينة. في علامة التبويب "الكتب"، ستجد: "ليلة الكتمية" (سيرة ثيرنو حسن ديم) و"جواهر المعاني" (الشيخ أحمد التجاني) و"أفاخو شريعة" (الشيخ إبراهيم نياس) وأعمال أخرى عن التصوف والروحانية الإسلامية.';
  }

  // Questions sur la musique et le Zikr
  if (lastMessage.includes('musique') || lastMessage.includes('zikr') || lastMessage.includes('music') || lastMessage.includes('ذكر') || lastMessage.includes('invocation')) {
    return language === 'fr'
      ? 'Dans l\'onglet "Musique", vous trouverez des Zikr (invocations), des récitations du Coran, et des chants spirituels. La section "Zikr" contient une collection complète d\'invocations spirituelles de la Tariqa Tijaniyya. Vous pouvez également écouter des récitations coraniques dans la section "Coran" par Abu Bakr Al-Shatri. Utilisez le lecteur audio en bas de l\'écran pour contrôler la lecture.'
      : language === 'en'
      ? 'In the "Music" tab, you will find Zikr (invocations), Quran recitations, and spiritual chants. The "Zikr" section contains a complete collection of spiritual invocations from the Tijaniyya Tariqa. You can also listen to Quran recitations in the "Quran" section by Abu Bakr Al-Shatri. Use the audio player at the bottom to control playback.'
      : 'في علامة التبويب "الموسيقى"، ستجد الذكر (الدعوات) وتلاوات القرآن والأغاني الروحية. يحتوي قسم "الذكر" على مجموعة كاملة من الدعوات الروحية من الطريقة التجانية. يمكنك أيضاً الاستماع إلى تلاوات القرآن في قسم "القرآن" لأبو بكر الشاطري.';
  }

  // Questions sur les cours
  if (lastMessage.includes('cours') || lastMessage.includes('course') || lastMessage.includes('دورة') || lastMessage.includes('formation')) {
    return language === 'fr'
      ? 'Les cours sont disponibles dans l\'onglet "Cours". Vous y trouverez des formations sur le soufisme, l\'étude du Coran, les 99 Noms d\'Allah, la jurisprudence islamique, l\'histoire des compagnons, et bien d\'autres sujets spirituels. Chaque cours contient plusieurs leçons pour approfondir vos connaissances.'
      : language === 'en'
      ? 'Courses are available in the "Courses" tab. You will find training on Sufism, Quran study, the 99 Names of Allah, Islamic jurisprudence, history of the companions, and many other spiritual topics. Each course contains several lessons to deepen your knowledge.'
      : 'الدورات متاحة في علامة التبويب "الدورات". ستجد تدريبات حول التصوف ودراسة القرآن والأسماء الحسنى والفقه الإسلامي وتاريخ الصحابة ومواضيع روحية أخرى كثيرة. كل دورة تحتوي على عدة دروس.';
  }

  // Questions sur l'utilisation de l'application
  if (lastMessage.includes('comment') || lastMessage.includes('how') || lastMessage.includes('كيف') || lastMessage.includes('utiliser') || lastMessage.includes('use')) {
    return language === 'fr'
      ? 'Pour utiliser l\'application Fayda Digital : 1) Utilisez les onglets en bas pour naviguer (Accueil, Livres, Musique, Podcasts, Cours), 2) Cliquez sur un contenu pour le lire ou l\'écouter, 3) Utilisez le lecteur audio en bas pour contrôler la lecture de la musique ou des podcasts, 4) Explorez les différentes sections pour découvrir tout le contenu disponible. N\'hésitez pas à me poser des questions spécifiques sur n\'importe quel aspect de l\'application ou de la spiritualité !'
      : language === 'en'
      ? 'To use the Fayda Digital app: 1) Use the bottom tabs to navigate (Home, Books, Music, Podcasts, Courses), 2) Click on content to read or listen, 3) Use the audio player at the bottom to control playback of music or podcasts, 4) Explore different sections to discover all available content. Feel free to ask me specific questions about any aspect of the app or spirituality!'
      : 'لاستخدام تطبيق فيضة ديجيتال: 1) استخدم علامات التبويب السفلية للتنقل (الرئيسية، الكتب، الموسيقى، البودكاست، الدورات)، 2) انقر على المحتوى للقراءة أو الاستماع، 3) استخدم مشغل الصوت في الأسفل للتحكم في تشغيل الموسيقى أو البودكاست، 4) استكشف الأقسام المختلفة لاكتشاف كل المحتوى المتاح.';
  }

  // Questions sur l'Islam
  if (lastMessage.includes('islam') || lastMessage.includes('musulman') || lastMessage.includes('إسلام')) {
    return language === 'fr'
      ? 'L\'Islam est la religion révélée par Allah au Prophète Muhammad (paix et bénédictions sur lui). Elle repose sur cinq piliers : Shahada (foi), Salat (prière), Zakat (aumône), Sawm (jeûne), Hajj (pèlerinage). L\'Islam comprend aussi six piliers de la foi. Le Coran est la parole d\'Allah et le Prophète Muhammad est le modèle parfait pour tous les musulmans. Dans la Tariqa Tijaniyya, l\'amour et l\'attachement au Prophète occupent une place centrale.'
      : language === 'en'
      ? 'Islam is the religion revealed by Allah to Prophet Muhammad (peace and blessings upon him). It is based on five pillars: Shahada (faith), Salat (prayer), Zakat (charity), Sawm (fasting), Hajj (pilgrimage). Islam also includes six pillars of faith. The Quran is the word of Allah and Prophet Muhammad is the perfect model for all Muslims. In the Tijaniyya Tariqa, love and attachment to the Prophet hold a central place.'
      : 'الإسلام هو الدين الذي أنزله الله على النبي محمد (صلى الله عليه وسلم). يقوم على خمسة أركان: الشهادة والصلاة والزكاة والصوم والحج. يشمل الإسلام أيضاً ستة أركان للإيمان. القرآن هو كلام الله والنبي محمد هو القدوة المثالية لجميع المسلمين.';
  }

  // Questions sur Baye Niass et la Fayda
  if (lastMessage.includes('baye') || lastMessage.includes('fayda') || lastMessage.includes('فيضة')) {
    return language === 'fr'
      ? 'Baye Niass (Cheikh Ibrahim Niass, 1900-1975) était un grand maître spirituel qui a ravivé la Tariqa Tijaniyya au 20ème siècle. Il a initié la Fayda Tidianiyya (le déluge spirituel), un mouvement de renouveau qui a répandu la voie dans le monde entier. Médina Baye à Kaolack, Sénégal, était son centre spirituel. Il était un érudit, un réformateur et un guide spirituel exceptionnel.'
      : language === 'en'
      ? 'Baye Niass (Sheikh Ibrahim Niass, 1900-1975) was a great spiritual master who revived the Tijaniyya Tariqa in the 20th century. He initiated the Fayda Tidianiyya (the spiritual flood), a renewal movement that spread the path throughout the world. Medina Baye in Kaolack, Senegal, was his spiritual center. He was a scholar, reformer, and exceptional spiritual guide.'
      : 'باي نياس (الشيخ إبراهيم نياس، 1900-1975) كان معلماً روحياً عظيماً أعاد إحياء الطريقة التجانية في القرن العشرين. بدأ الفيضة التجانية (الطوفان الروحي)، وهي حركة تجديد نشرت الطريقة في جميع أنحاء العالم.';
  }

  // Réponse générique intelligente et contextualisée
  return language === 'fr'
    ? 'Je comprends votre question. Je peux vous aider sur plusieurs sujets : l\'Islam (piliers, foi, Coran), la Tariqa Tijaniyya (fondements, pratiques, Zikr, Salat al-Fatih), la Fayda Tidianiyya (Baye Niass, Médina Baye), et l\'utilisation de l\'application Fayda Digital (livres, musique, podcasts, cours). N\'hésitez pas à me poser des questions plus spécifiques, par exemple : "Qu\'est-ce que la Fayda ?", "Comment pratiquer le Zikr ?", "Quels livres sont disponibles ?", etc.'
    : language === 'en'
    ? 'I understand your question. I can help you on various topics: Islam (pillars, faith, Quran), the Tijaniyya Tariqa (foundations, practices, Zikr, Salat al-Fatih), the Fayda Tidianiyya (Baye Niass, Medina Baye), and using the Fayda Digital app (books, music, podcasts, courses). Feel free to ask me more specific questions, for example: "What is the Fayda?", "How to practice Zikr?", "What books are available?", etc.'
    : 'أفهم سؤالك. يمكنني مساعدتك في مواضيع مختلفة: الإسلام (الأركان، الإيمان، القرآن)، الطريقة التجانية (الأساسيات، الممارسات، الذكر، صلاة الفاتح)، الفيضة التجانية (باي نياس، المدينة باي)، واستخدام تطبيق فيضة ديجيتال (الكتب، الموسيقى، البودكاست، الدورات). لا تتردد في طرح أسئلة أكثر تحديداً.';
};
