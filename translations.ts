export type Language = 'fr' | 'en' | 'ar' | null;

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.books': 'Livres',
    'nav.music': 'Musique',
    'nav.podcasts': 'Podcasts',
    'nav.library': 'Cours',
    
    // Common
    'common.continue': 'Continuer',
    'common.seeAll': 'Voir tout',
    'common.loading': 'Chargement...',
    'common.close': 'Fermer',
    'common.open': 'Ouvrir',
    'common.read': 'Lire',
    'common.play': 'Lire',
    'common.pause': 'Pause',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    
    // Home
    'home.continue': 'Continuer où vous vous êtes arrêté',
    'home.playlist': 'Playlist Essentielle',
    'home.audiobooks': 'Livres Audio',
    
    // Books
    'books.title': 'Livres',
    'books.readBook': 'Lire le livre',
    'books.download': 'Télécharger',
    
    // Music
    'music.title': 'Musique',
    'music.nowPlaying': 'En cours de lecture',
    
    // Podcasts
    'podcasts.title': 'Podcasts',
    'podcasts.subscribe': "S'abonner",
    'podcasts.subscribed': 'Abonné',
    
    // Library
    'library.title': 'Cours',
    'library.subtitle': 'Cours et formations',
    'library.courses': 'Cours',
    'library.lessons': 'Leçons',
    'library.available': 'cours disponibles',
    'library.lessonCount': 'Leçons',
    'library.video': 'Vidéo',
    
    // Common actions
    'action.subscribe': "S'abonner",
    'action.subscribed': 'Abonné',
    'action.play': 'Lire',
    'action.share': 'Partager',
    'action.info': 'Info',
    'action.menu': 'Menu',
    'action.carMode': 'Mode voiture',
    
    // Stats
    'stats.episodes': 'épisodes',
    'stats.subscribers': 'abonnés',
    'stats.pages': 'pages',
    'stats.downloads': 'téléchargements',
    'stats.rating': 'note',
    
    // Player
    'player.nowPlaying': 'En cours de lecture',
    'player.trackInfo': 'Informations',
    'player.title': 'Titre',
    'player.artist': 'Artiste',
    'player.duration': 'Durée',
    
    // Modal
    'modal.close': 'Fermer',
    'modal.readBook': 'Lire le livre',
    'modal.by': 'Par',
    
    // Assistant
    'assistant.title': 'Assistant IA',
    'assistant.subtitle': 'Posez vos questions',
    'assistant.placeholder': 'Tapez votre question...',
    'assistant.send': 'Envoyer',
    'assistant.thinking': 'Réflexion en cours...',
    'assistant.error': 'Erreur lors de la communication avec l\'assistant',
    'assistant.suggestions': 'Suggestions de questions',
    'assistant.suggestion1': 'Qu\'est-ce que la Tariqa Tijaniyya ?',
    'assistant.suggestion2': 'Expliquez-moi le concept de Zikr',
    'assistant.suggestion3': 'Quels livres recommandez-vous ?',
    'assistant.suggestion4': 'Comment utiliser cette application ?',
    'assistant.clear': 'Effacer',
    'assistant.welcome': 'Bonjour ! Je suis votre assistant spirituel. Comment puis-je vous aider ?',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.books': 'Books',
    'nav.music': 'Music',
    'nav.podcasts': 'Podcasts',
    'nav.library': 'Courses',
    
    // Common
    'common.continue': 'Continue',
    'common.seeAll': 'See All',
    'common.loading': 'Loading...',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.read': 'Read',
    'common.play': 'Play',
    'common.pause': 'Pause',
    'common.next': 'Next',
    'common.previous': 'Previous',
    
    // Home
    'home.continue': 'Continue where you left off',
    'home.playlist': 'Essential Playlist',
    'home.audiobooks': 'Audiobooks',
    
    // Books
    'books.title': 'Books',
    'books.readBook': 'Read book',
    'books.download': 'Download',
    
    // Music
    'music.title': 'Music',
    'music.nowPlaying': 'Now Playing',
    
    // Podcasts
    'podcasts.title': 'Podcasts',
    'podcasts.subscribe': 'Subscribe',
    'podcasts.subscribed': 'Subscribed',
    
    // Library
    'library.title': 'Courses',
    'library.subtitle': 'Courses and training',
    'library.courses': 'Courses',
    'library.lessons': 'Lessons',
    'library.available': 'courses available',
    'library.lessonCount': 'Lessons',
    'library.video': 'Video',
    
    // Common actions
    'action.subscribe': 'Subscribe',
    'action.subscribed': 'Subscribed',
    'action.play': 'Play',
    'action.share': 'Share',
    'action.info': 'Info',
    'action.menu': 'Menu',
    'action.carMode': 'Car mode',
    
    // Stats
    'stats.episodes': 'episodes',
    'stats.subscribers': 'subscribers',
    'stats.pages': 'pages',
    'stats.downloads': 'downloads',
    'stats.rating': 'rating',
    
    // Player
    'player.nowPlaying': 'Now Playing',
    'player.trackInfo': 'Information',
    'player.title': 'Title',
    'player.artist': 'Artist',
    'player.duration': 'Duration',
    
    // Modal
    'modal.close': 'Close',
    'modal.readBook': 'Read book',
    'modal.by': 'By',
    
    // Assistant
    'assistant.title': 'AI Assistant',
    'assistant.subtitle': 'Ask your questions',
    'assistant.placeholder': 'Type your question...',
    'assistant.send': 'Send',
    'assistant.thinking': 'Thinking...',
    'assistant.error': 'Error communicating with assistant',
    'assistant.suggestions': 'Question suggestions',
    'assistant.suggestion1': 'What is the Tijaniyya Tariqa?',
    'assistant.suggestion2': 'Explain the concept of Zikr',
    'assistant.suggestion3': 'What books do you recommend?',
    'assistant.suggestion4': 'How to use this app?',
    'assistant.clear': 'Clear',
    'assistant.welcome': 'Hello! I am your spiritual assistant. How can I help you?',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.books': 'الكتب',
    'nav.music': 'الموسيقى',
    'nav.podcasts': 'البودكاست',
    'nav.library': 'الدورات',
    
    // Common
    'common.continue': 'متابعة',
    'common.seeAll': 'عرض الكل',
    'common.loading': 'جاري التحميل...',
    'common.close': 'إغلاق',
    'common.open': 'فتح',
    'common.read': 'قراءة',
    'common.play': 'تشغيل',
    'common.pause': 'إيقاف',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    
    // Home
    'home.continue': 'تابع من حيث توقفت',
    'home.playlist': 'قائمة أساسية',
    'home.audiobooks': 'كتب صوتية',
    
    // Books
    'books.title': 'الكتب',
    'books.readBook': 'قراءة الكتاب',
    'books.download': 'تحميل',
    
    // Music
    'music.title': 'الموسيقى',
    'music.nowPlaying': 'قيد التشغيل',
    
    // Podcasts
    'podcasts.title': 'البودكاست',
    'podcasts.subscribe': 'اشتراك',
    'podcasts.subscribed': 'مشترك',
    
    // Library
    'library.title': 'الدورات',
    'library.subtitle': 'الدورات والتدريب',
    'library.courses': 'الدورات',
    'library.lessons': 'الدروس',
    'library.available': 'دورة متاحة',
    'library.lessonCount': 'دروس',
    'library.video': 'فيديو',
    
    // Common actions
    'action.subscribe': 'اشتراك',
    'action.subscribed': 'مشترك',
    'action.play': 'تشغيل',
    'action.share': 'مشاركة',
    'action.info': 'معلومات',
    'action.menu': 'القائمة',
    'action.carMode': 'وضع السيارة',
    
    // Stats
    'stats.episodes': 'حلقات',
    'stats.subscribers': 'مشتركين',
    'stats.pages': 'صفحات',
    'stats.downloads': 'تحميلات',
    'stats.rating': 'تقييم',
    
    // Player
    'player.nowPlaying': 'قيد التشغيل',
    'player.trackInfo': 'معلومات',
    'player.title': 'العنوان',
    'player.artist': 'الفنان',
    'player.duration': 'المدة',
    
    // Modal
    'modal.close': 'إغلاق',
    'modal.readBook': 'قراءة الكتاب',
    'modal.by': 'بواسطة',
    
    // Assistant
    'assistant.title': 'المساعد الذكي',
    'assistant.subtitle': 'اطرح أسئلتك',
    'assistant.placeholder': 'اكتب سؤالك...',
    'assistant.send': 'إرسال',
    'assistant.thinking': 'جاري التفكير...',
    'assistant.error': 'خطأ في التواصل مع المساعد',
    'assistant.suggestions': 'اقتراحات الأسئلة',
    'assistant.suggestion1': 'ما هي الطريقة التجانية؟',
    'assistant.suggestion2': 'اشرح لي مفهوم الذكر',
    'assistant.suggestion3': 'ما الكتب التي تنصح بها؟',
    'assistant.suggestion4': 'كيف أستخدم هذا التطبيق؟',
    'assistant.clear': 'مسح',
    'assistant.welcome': 'مرحباً! أنا مساعدك الروحي. كيف يمكنني مساعدتك؟',
  },
};

let currentLanguage: Language = null;

export const setLanguage = (lang: Language) => {
  if (lang) {
    currentLanguage = lang;
  }
};

export const t = (key: string): string => {
  if (!currentLanguage) {
    // Si aucune langue n'est sélectionnée, utiliser le français par défaut pour les traductions
    return translations['fr'][key] || key;
  }
  return translations[currentLanguage][key] || key;
};

