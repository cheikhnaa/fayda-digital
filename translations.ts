export type Language = 'fr' | 'en' | 'ar';

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
    
    // Donation
    'donation.title': 'Soutenir Fayda Digital',
    'donation.message': 'Votre soutien nous aide à continuer à partager la connaissance spirituelle.',
    'donation.button': 'Faire un don',
    'donation.subtitle': 'Choisissez votre moyen de paiement',
    'donation.wave': 'Payer avec Wave',
    'donation.orange': 'Payer avec Orange Money',
    'donation.phoneNumber': 'Numéro de téléphone',
    'donation.amount': 'Montant',
    'donation.close': 'Fermer',
    'donation.thankYou': 'Merci pour votre générosité !',
    'donation.or': 'ou',
    
    // Assistant
    'assistant.title': 'Fayda IA',
    'assistant.subtitle': 'Assistant intelligent',
    'assistant.welcome': 'Bonjour ! Je suis Fayda IA, votre assistant intelligent. Comment puis-je vous aider aujourd\'hui ?',
    'assistant.clear': 'Effacer',
    'assistant.error': 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
    'assistant.thinking': 'Réflexion...',
    'assistant.suggestions': 'Suggestions',
    'assistant.placeholder': 'Tapez votre message...',
    'assistant.suggestion1': 'Qu\'est-ce que la Tariqa Tijaniyya ?',
    'assistant.suggestion2': 'Expliquez-moi la Wazifa',
    'assistant.suggestion3': 'Qu\'est-ce que la Fayda Tidianiyya ?',
    'assistant.suggestion4': 'Comment pratiquer le Zikr ?',
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
    
    // Donation
    'donation.title': 'Support Fayda Digital',
    'donation.message': 'Your support helps us continue sharing spiritual knowledge.',
    'donation.button': 'Make a donation',
    'donation.subtitle': 'Choose your payment method',
    'donation.wave': 'Pay with Wave',
    'donation.orange': 'Pay with Orange Money',
    'donation.phoneNumber': 'Phone number',
    'donation.amount': 'Amount',
    'donation.close': 'Close',
    'donation.thankYou': 'Thank you for your generosity!',
    'donation.or': 'or',
    
    // Assistant
    'assistant.title': 'Fayda IA',
    'assistant.subtitle': 'Intelligent Assistant',
    'assistant.welcome': 'Hello! I am Fayda IA, your intelligent assistant. How can I help you today?',
    'assistant.clear': 'Clear',
    'assistant.error': 'Sorry, an error occurred. Please try again.',
    'assistant.thinking': 'Thinking...',
    'assistant.suggestions': 'Suggestions',
    'assistant.placeholder': 'Type your message...',
    'assistant.suggestion1': 'What is the Tariqa Tijaniyya?',
    'assistant.suggestion2': 'Explain the Wazifa to me',
    'assistant.suggestion3': 'What is the Fayda Tidianiyya?',
    'assistant.suggestion4': 'How to practice Zikr?',
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
    
    // Donation
    'donation.title': 'دعم فيدا الرقمية',
    'donation.message': 'دعمك يساعدنا على مواصلة مشاركة المعرفة الروحية.',
    'donation.button': 'التبرع',
    'donation.subtitle': 'اختر طريقة الدفع',
    'donation.wave': 'الدفع عبر Wave',
    'donation.orange': 'الدفع عبر Orange Money',
    'donation.phoneNumber': 'رقم الهاتف',
    'donation.amount': 'المبلغ',
    'donation.close': 'إغلاق',
    'donation.thankYou': 'شكراً لكرمك!',
    'donation.or': 'أو',
    
    // Assistant
    'assistant.title': 'فيدا الذكاء الاصطناعي',
    'assistant.subtitle': 'مساعد ذكي',
    'assistant.welcome': 'مرحباً! أنا فيدا الذكاء الاصطناعي، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
    'assistant.clear': 'مسح',
    'assistant.error': 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
    'assistant.thinking': 'تفكير...',
    'assistant.suggestions': 'اقتراحات',
    'assistant.placeholder': 'اكتب رسالتك...',
    'assistant.suggestion1': 'ما هي الطريقة التيجانية؟',
    'assistant.suggestion2': 'اشرح لي الوظيفة',
    'assistant.suggestion3': 'ما هي الفيضة التيجانية؟',
    'assistant.suggestion4': 'كيف أمارس الذكر؟',
  },
};

let currentLanguage: Language = 'fr';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const t = (key: string): string => {
  return translations[currentLanguage][key] || key;
};

