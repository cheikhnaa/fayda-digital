import Slider from '@react-native-community/slider';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as React from 'react';
import { Alert, Dimensions, Image, ImageBackground, Linking, Modal, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Language, setLanguage, t } from './translations';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// DATA - Contenu par défaut
const continueData = [
  { id: 1, title: 'Introduction au Soufisme', speaker: 'Sheikh Hassan Cisse', duration: '01:40:27', type: 'cours' },
  { id: 2, title: 'Les 40 Hadiths An-Nawawi', speaker: 'Cheikh Seydi Ali Cisse', duration: '21:40', type: 'audio' },
  { id: 3, title: 'Conseils du Prophète ﷺ', speaker: 'Sheikh Hassan', duration: '05:52', type: 'lecture' },
];

const audiobooks = [
  { id: 1, title: 'Messager d\'Allah', titleAr: 'رسول الله', color: '#0F5132', locked: false },
  { id: 2, title: 'Tafsir du Coran Vol. 1', titleAr: 'في رياض التفسير', color: '#0B3C5D', locked: false },
  { id: 3, title: 'Histoires des Prophètes', titleAr: 'قصص الأنبياء', color: '#C9A24D', locked: false },
  { id: 4, title: 'Les 99 Noms d\'Allah', titleAr: 'أسماء الله الحسنى', color: '#0F5132', locked: true },
];

// Fichiers Coran depuis le dossier assets/coran
const coranTracks = [
  { id: 1, title: 'Al-Fatiha', titleAr: 'الفاتحة', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-001-al-fatiha-3656-9635.mp3'), duration: '03:05' },
  { id: 2, title: 'Al-Ma\'un', titleAr: 'الماعون', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-107-al-maun-3729-4093.mp3'), duration: '02:15' },
  { id: 3, title: 'Al-Kauther', titleAr: 'الكوثر', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-108-al-kauther-3730-4460.mp3'), duration: '01:15' },
  { id: 4, title: 'Al-Kafiroon', titleAr: 'الكافرون', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-109-al-kafiroon-3731-7397.mp3'), duration: '02:28' },
  { id: 5, title: 'An-Nasr', titleAr: 'النصر', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-110-an-nasr-3732-2998.mp3'), duration: '01:00' },
  { id: 6, title: 'Al-Masadd', titleAr: 'المسد', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-111-al-masadd-3733-4614.mp3'), duration: '01:17' },
  { id: 7, title: 'Al-Ikhlas', titleAr: 'الإخلاص', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-112-al-ikhlas-3734-5801.mp3'), duration: '01:36' },
  { id: 8, title: 'Al-Falaq', titleAr: 'الفلق', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-113-al-falaq-3735-978.mp3'), duration: '00:16' },
  { id: 9, title: 'An-Nas', titleAr: 'الناس', reciter: 'Abu Bakr Al-Shatri', file: require('./assets/coran/abu-bakr-al-shatri-114-an-nas-3736-8725.mp3'), duration: '01:27' },
];

// Zikr & Music Snippets
const zikrTracks = [
  { id: 101, title: 'Dhikr du Matin', titleAr: 'أذكار الصباح', artist: 'Sheikh Hassan Cisse', duration: '15:30', type: 'zikr' },
  { id: 102, title: 'Dhikr du Soir', titleAr: 'أذكار المساء', artist: 'Sheikh Hassan Cisse', duration: '12:45', type: 'zikr' },
  { id: 103, title: 'Salat al-Fatih', titleAr: 'صلاة الفاتح', artist: 'Cheikh Seydi Ali Cisse', duration: '05:20', type: 'zikr' },
  { id: 104, title: 'Jawharat al-Kamal', titleAr: 'جوهرة الكمال', artist: 'Sheikh Hassan', duration: '08:15', type: 'zikr' },
];

const musicTracks = [
  { id: 1, title: 'Salawat al-Fatihi', artist: 'Ensemble Tijani', duration: '45:23' },
  { id: 2, title: 'Qasida Burda', artist: 'Sheikh Mahmoud Al-Tohamy', duration: '28:15' },
  { id: 3, title: 'Mawlaya Salli', artist: 'Maher Zain', duration: '6:42' },
  { id: 4, title: 'Ya Taiba', artist: 'Mesut Kurtis', duration: '5:18' },
  { id: 5, title: 'Tala al Badru Alayna', artist: 'Ensemble Andalous', duration: '7:35' },
  { id: 6, title: 'Dhikr Allah', artist: 'Groupe Soufi', duration: '15:20' },
  { id: 7, title: 'Ya Nabi Salam Alayka', artist: 'Sami Yusuf', duration: '4:55' },
  { id: 8, title: 'Asma Allah Al-Husna', artist: 'Mishary Rashid', duration: '8:30' },
];

const podcasts = [
  { id: 1, title: 'Sagesse Quotidienne', host: 'Sheikh Abdullah', episodes: 156, subscribers: 8500, subscribed: false },
  { id: 2, title: 'Histoire de l\'Islam', host: 'Dr. Hassan Ali', episodes: 48, subscribers: 12300, subscribed: false },
  { id: 3, title: 'Questions de Foi', host: 'Sheikh Youssef', episodes: 89, subscribers: 6700, subscribed: false },
  { id: 4, title: 'Le Coran Expliqué', host: 'Dr. Amina Karim', episodes: 114, subscribers: 15800, subscribed: false },
  { id: 5, title: 'Spiritualité Soufie', host: 'Sheikh Muhammad Tijani', episodes: 62, subscribers: 9200, subscribed: false },
];

const courses = [
  { id: 1, title: 'Introduction au Soufisme', instructor: 'Sheikh Muhammad Al-Tijani', lessons: 12, duration: '6 semaines', level: 'Débutant' },
  { id: 2, title: 'Étude du Coran', instructor: 'Dr. Fatima Zahra', lessons: 48, duration: '12 semaines', level: 'Intermédiaire' },
  { id: 3, title: 'Les 99 Noms d\'Allah', instructor: 'Sheikh Omar Suleiman', lessons: 99, duration: '20 semaines', level: 'Tous niveaux' },
  { id: 4, title: 'Jurisprudence Islamique', instructor: 'Dr. Ahmed Al-Faqih', lessons: 36, duration: '10 semaines', level: 'Avancé' },
  { id: 5, title: 'Histoire des Compagnons', instructor: 'Sheikh Yasir Qadhi', lessons: 24, duration: '8 semaines', level: 'Intermédiaire' },
];

const ebooks = [
  { 
    id: 0, 
    title: 'Laylatou Katmiya', 
    titleAr: 'ليلة الكتمية', 
    author: 'Thierno Hassane Dème', 
    pages: 45, 
    downloads: 25600,
    description: 'La biographie lumineuse de Thierno Hassane Dème, grand érudit et compagnon de Baye Niass. Découvrez l\'histoire de la nuit dédiée à Cheikh Ahmed Tidiane et le parcours spirituel exceptionnel de ce maître soufi.',
    category: 'Biographie',
    rating: 5.0,
    hasPhoto: true,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
    htmlFile: 'generate-pdf.html',
  },
  { 
    id: 13, 
    title: 'Diawahir al Ma\'ani', 
    titleAr: 'جواهر المعاني', 
    author: 'Cheikh Ahmed Tijani', 
    pages: 200, 
    downloads: 15000,
    description: 'Les perles précieuses - Un ouvrage fondamental de la Tariqa Tijaniyya contenant les enseignements spirituels et les secrets de la voie.',
    category: 'Tariqa',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
    htmlFile: 'diawahir-al-maani.html',
  },
  { 
    id: 1, 
    title: 'Les Perles Précieuses', 
    titleAr: 'الجواهر النفيسة', 
    author: 'Cheikh Ahmed Tijani', 
    pages: 250, 
    downloads: 15200,
    description: 'Un recueil essentiel de sagesse soufie et d\'enseignements spirituels. Ce livre contient les paroles lumineuses du Cheikh Ahmed Tijani sur le cheminement spirituel, la purification de l\'âme, et les secrets du dhikr. Une lecture indispensable pour tout chercheur de vérité.',
    category: 'Soufisme',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
  },
  { 
    id: 2, 
    title: 'Le Chemin de la Lumière', 
    titleAr: 'طريق النور', 
    author: 'Sidi Ali Harazim', 
    pages: 180, 
    downloads: 8900,
    description: 'Guide spirituel complet sur le cheminement de l\'âme vers la connaissance divine. L\'auteur explore les différentes stations spirituelles (maqamat) et les états (ahwal) que traverse le disciple sur la voie soufie. Riche en enseignements pratiques et conseils éclairés.',
    category: 'Spiritualité',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
  },
  { 
    id: 3, 
    title: 'Messager d\'Allah', 
    titleAr: 'رسول الله', 
    author: 'Sheikh Hamza Yusuf', 
    pages: 320, 
    downloads: 18900,
    description: 'Ce livre est une exploration approfondie des enseignements et de la vie du Prophète Muhammad (ﷺ), la lumière de l\'humanité. Il couvre les aspects essentiels de sa mission prophétique, sa sagesse, sa miséricorde et son exemple parfait pour toute l\'humanité.',
    category: 'Biographie',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
  },
  { 
    id: 4, 
    title: 'Baye Niass', 
    titleAr: 'باي نياس', 
    author: 'Sheikh Hassan Cisse', 
    pages: 280, 
    downloads: 14200,
    description: 'Plongez dans la vie et les enseignements de Cheikh Ibrahim Niass, le "Baye" (Père) de la Fayda Tijaniyya. Ce livre retrace le parcours exceptionnel de ce grand réformateur, érudit et maître spirituel qui a ravivé la Tariqa Tijaniyya au 20ème siècle.',
    category: 'Biographie',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
  },
  { 
    id: 5, 
    title: 'Les Fondements de l\'Islam', 
    titleAr: 'أصول الإسلام', 
    author: 'Dr. Umar Faruq', 
    pages: 195, 
    downloads: 11200,
    description: 'Ce livre offre une introduction complète aux fondements de l\'Islam, couvrant les cinq piliers de l\'Islam (la Shahada, la Salat, la Zakat, le Sawm, le Hajj) et les six piliers de la foi (croyance en Allah, Ses anges, Ses livres, Ses messagers, le Jour du Jugement, et le destin).',
    category: 'Fiqh',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
  },
  { 
    id: 6, 
    title: 'La Purification de l\'Âme', 
    titleAr: 'تزكية النفس', 
    author: 'Sheikh Hamza Yusuf', 
    pages: 220, 
    downloads: 14800,
    description: 'Guide pratique moderne sur la purification spirituelle (tazkiya). L\'auteur combine sagesse traditionnelle et psychologie contemporaine pour aider le lecteur à combattre l\'égo (nafs), cultiver les vertus, et atteindre l\'excellence morale (ihsan).',
    category: 'Développement Spirituel',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
  },
];

const bookCategories = [
  {
    id: 'fiqh',
    title: 'Fiqh (Français)',
    books: [
      { id: 5, title: 'Les Fondements de l\'Islam', titleAr: 'أصول الإسلام', author: 'Dr. Umar Faruq', pages: 195, cover: '📖' },
      { id: 1, title: 'Les Perles Précieuses', titleAr: 'الجواهر النفيسة', author: 'Cheikh Ahmed Tijani', pages: 250, cover: '📖' },
      { id: 2, title: 'Le Chemin de la Lumière', titleAr: 'طريق النور', author: 'Sidi Ali Harazim', pages: 180, cover: '📖' },
    ]
  },
  {
    id: 'tariqa',
    title: 'Tariqa (Français)',
    books: [
      { id: 14, title: 'Laylatou Katmiya', titleAr: 'ليلة الكتمية', author: 'Thierno Hassane Dème', pages: 45, cover: '📖', htmlFile: 'generate-pdf.html' },
      { id: 13, title: 'Diawahir al Ma\'ani', titleAr: 'جواهر المعاني', author: 'Cheikh Ahmed Tijani', pages: 200, cover: '📖', htmlFile: 'diawahir-al-maani.html' },
      { id: 5, title: 'Sur le Chemin du Prophète', titleAr: 'على طريق النبي', author: 'Professeur Zachary', pages: 260, cover: '🕌' },
      { id: 6, title: 'La Connaissance Vivante dans l\'Islam Ouest-Africain', titleAr: 'المعرفة الحية', author: 'Professeur Zachary', pages: 351, cover: '📚' },
      { id: 7, title: 'La Perle de la Couronne', titleAr: 'درة التاج', author: 'Abdul-Karim', pages: 245, cover: '💎' },
      { id: 8, title: 'L\'Éveil de l\'Humanité', titleAr: 'تبصرة الإنسانية', author: 'Shaykh al-Islam', pages: 83, cover: '✨' },
    ]
  },
  {
    id: 'maarifa',
    title: 'Ma\'arifa (Français)',
    books: [
      { id: 9, title: 'Ce que les Connaissants d\'Allah ont Dit', titleAr: 'ما قاله العارفون', author: 'Shaykh Ahmad', pages: 156, cover: '🌟' },
      { id: 10, title: 'Perles du Déluge', titleAr: 'لآلئ من الفيض', author: 'Shaykh Hassan', pages: 198, cover: '💫' },
      { id: 11, title: 'Le Voyage Nocturne', titleAr: 'الإسراء والمعراج', author: 'Shaykh Muhammad', pages: 127, cover: '🌙' },
      { id: 12, title: 'Les Secrets de la Gnose', titleAr: 'أسرار المعرفة', author: 'Shaykh Ali', pages: 203, cover: '🔮' },
    ]
  },
];

// Context pour la langue et le mode sombre
const AppContext = React.createContext<{
  language: Language;
  setLang: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentPlayer: { item: any; type: 'music' | 'podcast' | 'book' | null } | null;
  setCurrentPlayer: (player: { item: any; type: 'music' | 'podcast' | 'book' | null } | null) => void;
  audioState: { isPlaying: boolean; position: number; duration: number } | null;
  setAudioState: (state: { isPlaying: boolean; position: number; duration: number } | null) => void;
  currentRoute: string | null;
  setCurrentRoute: (route: string | null) => void;
}>({ 
  language: 'fr', 
  setLang: () => {},
  darkMode: false,
  setDarkMode: () => {},
  currentPlayer: null,
  setCurrentPlayer: () => {},
  audioState: null,
  setAudioState: () => {},
  currentRoute: null,
  setCurrentRoute: () => {}
});

// Sélecteur de langue compact
function LanguageSelector() {
  const { language, setLang } = React.useContext(AppContext);

  return (
    <View style={styles.langSelector}>
      {[{ code: 'fr' as Language, flag: '🇫🇷' }, { code: 'en' as Language, flag: '🇬🇧' }, { code: 'ar' as Language, flag: '🇸🇦' }].map(l => (
        <TouchableOpacity key={l.code} style={[styles.langBtn, language === l.code && styles.langBtnActive]} onPress={() => { setLang(l.code); setLanguage(l.code); }}>
          <Text style={styles.langFlag}>{l.flag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Écran d'accueil
function HomeScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header moderne avec gradient */}
      <LinearGradient
        colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerModern}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.appTitleModern, { color: theme.text }]}>Hassaniya Digital</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>Sagesse & Spiritualité</Text>
          </View>
          <LanguageSelector />
        </View>
      </LinearGradient>

      {/* Hero Section moderne */}
      <View style={styles.heroSectionModern}>
        <ImageBackground 
          source={require('./assets/thierno.png')} 
          style={styles.heroImageModern}
          imageStyle={{ opacity: 0.15 }}
        >
          <LinearGradient
            colors={darkMode 
              ? ['rgba(11, 60, 93, 0.92)', 'rgba(15, 81, 50, 0.88)', 'rgba(11, 60, 93, 0.95)']
              : ['rgba(15, 81, 50, 0.90)', 'rgba(11, 60, 93, 0.85)', 'rgba(15, 81, 50, 0.92)']
            }
            style={styles.heroGradientModern}
          >
            <View style={styles.heroContentModern}>
              <View style={styles.heroIconContainer}>
                <Text style={styles.heroIcon}>☪️</Text>
              </View>
              <Text style={styles.heroTitleModern}>Bienvenue</Text>
              <Text style={styles.heroSubtitleModern}>Explorez la sagesse islamique</Text>
              <View style={styles.heroDecorativeLine} />
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Continuer où vous vous êtes arrêté */}
      <View style={styles.sectionModern}>
        <View style={styles.sectionHeaderModern}>
          <View style={styles.sectionTitleContainerModern}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIconModern}>📖</Text>
            </View>
            <View>
            <Text style={[styles.sectionTitleModern, { color: theme.text }]}>{t('home.continue')}</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{t('common.continue')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllModern}>{t('common.seeAll')}</Text>
            <Text style={styles.seeAllArrow}>→</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.horizontalScrollModern} 
          contentContainerStyle={styles.horizontalScrollContentModern}
        >
          {continueData.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.continueCardModern, { backgroundColor: theme.surface }]}
              activeOpacity={0.8}
              onPress={() => {
                if (item.type === 'cours') {
                  navigation.navigate('Library');
                } else {
                  setCurrentPlayer({ item, type: item.type === 'audio' ? 'podcast' : 'book' });
                }
              }}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D', '#0F5132']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueIconGradientModern}
              >
                <Text style={styles.continueIconTextModern}>{item.type === 'cours' ? '📚' : item.type === 'audio' ? '🎧' : '📖'}</Text>
              </LinearGradient>
              <View style={styles.continueCardContent}>
                <Text style={[styles.continueTitleModern, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.continueSpeakerModern, { color: theme.textSecondary }]} numberOfLines={1}>{item.speaker}</Text>
                <View style={styles.continueDurationContainerModern}>
                  <Text style={styles.continueDurationIcon}>⏱️</Text>
                  <Text style={styles.continueDurationModern}>{item.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Playlist Essentielle */}
      <View style={styles.sectionModern}>
        <View style={styles.sectionHeaderModern}>
          <View style={styles.sectionTitleContainerModern}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIconModern}>🎵</Text>
            </View>
            <View>
            <Text style={[styles.sectionTitleModern, { color: theme.text }]}>{t('home.playlist')}</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{t('music.title')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Music')}>
            <Text style={styles.seeAllModern}>Voir tout</Text>
            <Text style={styles.seeAllArrow}>→</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.horizontalScrollModern} 
          contentContainerStyle={styles.horizontalScrollContentModern}
        >
          {musicTracks.slice(0, 5).map(track => (
            <TouchableOpacity 
              key={track.id} 
              style={[styles.musicCardModern, { backgroundColor: theme.surface }]}
              activeOpacity={0.8}
              onPress={() => {
                setCurrentPlayer({ item: track, type: 'music' });
                navigation.navigate('Music');
              }}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D', '#0F5132']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.musicIconGradientModern}
              >
                <Text style={styles.musicIconTextModern}>🎵</Text>
              </LinearGradient>
              <View style={styles.musicCardContent}>
                <Text style={[styles.musicTitleModern, { color: theme.text }]} numberOfLines={1}>{track.title}</Text>
                <Text style={[styles.musicArtistModern, { color: theme.textSecondary }]} numberOfLines={1}>{track.artist}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Livres Audio */}
      <View style={styles.sectionModern}>
        <View style={styles.sectionHeaderModern}>
          <View style={styles.sectionTitleContainerModern}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIconModern}>🎧</Text>
            </View>
            <View>
            <Text style={[styles.sectionTitleModern, { color: theme.text }]}>{t('home.audiobooks')}</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{t('common.play')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Podcasts')}>
            <Text style={styles.seeAllModern}>Voir tout</Text>
            <Text style={styles.seeAllArrow}>→</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.horizontalScrollModern} 
          contentContainerStyle={styles.horizontalScrollContentModern}
        >
          {audiobooks.map(book => (
            <TouchableOpacity 
              key={book.id} 
              style={[styles.audiobookCardModern, { opacity: book.locked ? 0.7 : 1 }]}
              activeOpacity={0.8}
              onPress={() => {
                if (!book.locked) {
                  setCurrentPlayer({ item: book, type: 'book' });
                }
              }}
            >
              <LinearGradient
                colors={[book.color, book.color + 'cc', book.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.audiobookGradientModern}
              >
                <View style={styles.audiobookContent}>
                  <Text style={styles.audiobookTitleModern}>{book.title}</Text>
                  <Text style={styles.audiobookTitleArModern}>{book.titleAr}</Text>
                  {book.locked && (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedIcon}>🔒</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

// Écran des livres
function BooksScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [selectedBook, setSelectedBook] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const handleBookPress = (book: any) => {
    const fullBook = ebooks.find(b => b.id === book.id) || {
      ...book,
      description: 'Livre islamique de grande valeur spirituelle.',
      rating: 4.5,
      downloads: 1000,
      category: 'Islam',
    };
    setSelectedBook(fullBook);
    setModalVisible(true);
  };

  const handleOpenBook = () => {
    if (selectedBook) {
      setCurrentPlayer({ item: selectedBook, type: 'book' });
      navigation.navigate('PDFReader', { book: selectedBook });
      setModalVisible(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header moderne */}
      <LinearGradient
        colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerModern}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitleModern, { color: theme.text }]}>📚 Livres</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>{t('library.subtitle')}</Text>
          </View>
          <LanguageSelector />
        </View>
      </LinearGradient>

      <ScrollView style={styles.booksScrollModern} showsVerticalScrollIndicator={false}>
        {bookCategories.map(category => (
          <View key={category.id} style={styles.categorySectionModern}>
            <View style={styles.categoryHeaderModern}>
              <View style={styles.categoryTitleContainerModern}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIconModern}>📖</Text>
                </View>
                <View>
                  <Text style={[styles.categoryTitleModern, { color: theme.text }]}>{category.title}</Text>
                  <Text style={[styles.categorySubtitle, { color: theme.textSecondary }]}>{category.books.length} livres</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <Text style={styles.seeAllModern}>{t('common.seeAll')}</Text>
                <Text style={styles.seeAllArrow}>→</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.horizontalScrollModern} 
              contentContainerStyle={styles.horizontalScrollContentModern}
            >
              {(expandedCategory === category.id ? category.books : category.books.slice(0, 3)).map(book => (
                <TouchableOpacity
                  key={book.id}
                  style={[styles.bookCardModern, { backgroundColor: theme.surface }]}
                  activeOpacity={0.8}
                  onPress={() => handleBookPress(book)}
                >
                  <LinearGradient
                    colors={['#0F5132', '#0B3C5D', '#0F5132']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.bookCoverModern}
                  >
                    <Text style={styles.bookCoverEmojiModern}>{book.cover || '📖'}</Text>
                  </LinearGradient>
                  <View style={styles.bookCardContentModern}>
                    <Text style={[styles.bookTitleModern, { color: theme.text }]} numberOfLines={2}>{book.title}</Text>
                    <Text style={[styles.bookAuthorModern, { color: theme.textSecondary }]} numberOfLines={1}>{book.author}</Text>
                    <View style={styles.bookPagesContainerModern}>
                      <Text style={styles.bookPagesIcon}>📄</Text>
                      <Text style={styles.bookPagesModern}>{book.pages} pages</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Modal de détail du livre - Moderne */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlayModern}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.bookModalModern, { backgroundColor: theme.surface }]}>
              {selectedBook && (
                <>
                  <LinearGradient
                    colors={['#0F5132', '#0B3C5D']}
                    style={styles.modalHeaderModern}
                  >
                    <View style={styles.modalHeaderContent}>
                      <View style={styles.modalTitleContainer}>
                        <Text style={styles.modalTitleModern} numberOfLines={2}>{selectedBook.title}</Text>
                        <Text style={styles.modalAuthorModern}>{t('modal.by')} {selectedBook.author}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.modalCloseButton}
                        onPress={() => setModalVisible(false)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.modalCloseModern}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                  <ScrollView style={styles.modalContentModern} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.modalDescriptionModern, { color: theme.text }]}>{selectedBook.description}</Text>
                    <View style={styles.modalInfoModern}>
                      <View style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoIcon}>📄</Text>
                        <Text style={[styles.modalInfoTextModern, { color: theme.textSecondary }]}>
                          {selectedBook.pages} {t('stats.pages')}
                        </Text>
                      </View>
                      <View style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoIcon}>⭐</Text>
                        <Text style={[styles.modalInfoTextModern, { color: theme.textSecondary }]}>
                          {selectedBook.rating || 4.5} {t('stats.rating')}
                        </Text>
                      </View>
                      <View style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoIcon}>⬇️</Text>
                        <Text style={[styles.modalInfoTextModern, { color: theme.textSecondary }]}>
                          {selectedBook.downloads || 1000} {t('stats.downloads')}
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                  <TouchableOpacity 
                    style={styles.openButtonModern} 
                    onPress={handleOpenBook}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#0F5132', '#0B3C5D']}
                      style={styles.openButtonGradient}
                    >
                      <Text style={styles.openButtonTextModern}>{t('modal.readBook')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// Écran de musique
function MusicScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer, currentPlayer } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [selectedTrack, setSelectedTrack] = React.useState<any>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showCarMode, setShowCarMode] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  // Utiliser expo-audio pour la lecture
  const player = useAudioPlayer(require('./assets/audio/audio.mp3'));

  React.useEffect(() => {
    if (player && currentPlayer?.type === 'music') {
      // Réinitialiser la position quand on change de piste
      setPosition(0);
      setDuration(0);
      
      const updateStatus = () => {
        try {
          if (player) {
            setIsPlaying(player.playing || false);
            setPosition((player.currentTime || 0) * 1000);
            const dur = (player.duration || 0) * 1000;
            if (dur > 0) {
              setDuration(dur);
            }
          }
        } catch (error) {
          console.log('Erreur mise à jour audio:', error);
        }
      };
      const interval = setInterval(updateStatus, 500);
      return () => clearInterval(interval);
    } else {
      // Réinitialiser quand on n'a plus de lecteur actif
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }
  }, [player, currentPlayer]);

  const togglePlay = async () => {
    try {
      if (player) {
        if (player.playing) {
          await player.pause();
          setIsPlaying(false);
        } else {
          await player.play();
          setIsPlaying(true);
          // Si la durée n'est pas encore chargée, attendre un peu
          if (duration === 0) {
            setTimeout(() => {
              if (player.duration) {
                setDuration(player.duration * 1000);
              }
            }, 500);
          }
        }
      }
    } catch (error) {
      console.log('Erreur toggle play:', error);
      setIsPlaying(!isPlaying);
      if (!isPlaying && duration === 0) {
        setDuration(180000);
      }
    }
  };

  const handleShare = async () => {
    if (currentPlayer?.item) {
      try {
        await Share.share({
          message: `Écoutez "${currentPlayer.item.title}" sur Hassaniya Digital`,
          title: currentPlayer.item.title,
        });
      } catch (error) {
        console.error('Erreur partage:', error);
      }
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMusicColor = (id: number): [string, string] => {
    const colors: [string, string][] = [
      ['#0F5132', '#0B3C5D'],
      ['#0F5132', '#0B3C5D'],
      ['#0B3C5D', '#0F5132'],
      ['#C9A24D', '#0F5132'],
      ['#0F5132', '#0B3C5D'],
      ['#0B3C5D', '#C9A24D'],
      ['#C9A24D', '#0B3C5D'],
      ['#0F5132', '#0B3C5D'],
    ];
    return colors[(id - 1) % colors.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header avec gradient élégant */}
      <LinearGradient
        colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.musicHeaderModern}
      >
        <View style={styles.musicHeaderContent}>
          <View style={styles.musicHeaderLeft}>
            <View style={styles.musicHeaderIconContainer}>
              <Text style={styles.musicHeaderIcon}>🎵</Text>
            </View>
            <View>
              <Text style={[styles.musicHeaderTitle, { color: theme.text }]}>{t('music.title')}</Text>
              <Text style={[styles.musicHeaderSubtitle, { color: theme.textSecondary }]}>
                {zikrTracks.length + coranTracks.length + musicTracks.length} pistes {t('library.available').split(' ')[1]}
              </Text>
            </View>
          </View>
          <LanguageSelector />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.musicScrollNew} 
        contentContainerStyle={[styles.musicScrollContentNew, currentPlayer?.type === 'music' && { paddingBottom: 220 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Zikr & Music Snippets */}
        <View style={styles.musicSection}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>🕌</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Zikr & Music Snippets</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{zikrTracks.length} pistes</Text>
              </View>
            </View>
          </View>
          <View style={styles.musicGridNew}>
            {zikrTracks.map((track) => {
              const musicColors = getMusicColor(track.id);
              const isPlaying = currentPlayer?.type === 'music' && currentPlayer.item?.id === track.id;
              
              return (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.musicCardNew,
                    { 
                      backgroundColor: theme.surface,
                      borderLeftWidth: 4,
                      borderLeftColor: musicColors[0],
                    },
                    isPlaying && styles.musicCardPlaying
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedTrack(track);
                    setCurrentPlayer({ item: track, type: 'music' });
                  }}
                >
                  <LinearGradient
                    colors={musicColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.musicIconNew}
                  >
                    <Text style={styles.musicIconTextNew}>🕌</Text>
                  </LinearGradient>
                  
                  <View style={styles.musicInfoNew}>
                    <View style={styles.musicTitleRow}>
                      <Text style={[styles.musicTitleNew, { color: theme.text }]} numberOfLines={2}>
                        {track.title}
                      </Text>
                      {isPlaying && (
                        <View style={[styles.musicPlayingBadge, { backgroundColor: musicColors[0] }]}>
                          <Text style={styles.musicPlayingIcon}>♪</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.musicArtistNew, { color: theme.textSecondary }]} numberOfLines={1}>
                      👤 {track.artist}
                    </Text>
                    <View style={styles.musicMetaNew}>
                      <View style={[styles.musicDurationBadge, { backgroundColor: musicColors[0] + '15' }]}>
                        <Text style={styles.musicDurationIcon}>⏱️</Text>
                        <Text style={[styles.musicDurationText, { color: musicColors[0] }]}>
                          {track.duration}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.musicPlayButtonNew, { backgroundColor: musicColors[0] }]}
                    activeOpacity={0.9}
                    onPress={() => {
                      setSelectedTrack(track);
                      setCurrentPlayer({ item: track, type: 'music' });
                    }}
                  >
                    <Text style={styles.musicPlayIconNew}>{isPlaying ? '⏸' : '▶'}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Coran */}
        <View style={styles.musicSection}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>📿</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Coran</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{coranTracks.length} sourates</Text>
              </View>
            </View>
          </View>
          <View style={styles.musicGridNew}>
            {coranTracks.map((track) => {
              const musicColors = getMusicColor(track.id);
              const isPlaying = currentPlayer?.type === 'music' && currentPlayer.item?.id === track.id;
              
              return (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.musicCardNew,
                    { 
                      backgroundColor: theme.surface,
                      borderLeftWidth: 4,
                      borderLeftColor: musicColors[0],
                    },
                    isPlaying && styles.musicCardPlaying
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedTrack(track);
                    setCurrentPlayer({ item: track, type: 'music' });
                  }}
                >
                  <LinearGradient
                    colors={musicColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.musicIconNew}
                  >
                    <Text style={styles.musicIconTextNew}>📿</Text>
                  </LinearGradient>
                  
                  <View style={styles.musicInfoNew}>
                    <View style={styles.musicTitleRow}>
                      <Text style={[styles.musicTitleNew, { color: theme.text }]} numberOfLines={2}>
                        {track.title}
                      </Text>
                      {isPlaying && (
                        <View style={[styles.musicPlayingBadge, { backgroundColor: musicColors[0] }]}>
                          <Text style={styles.musicPlayingIcon}>♪</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.musicArtistNew, { color: theme.textSecondary }]} numberOfLines={1}>
                      👤 {track.reciter}
                    </Text>
                    <View style={styles.musicMetaNew}>
                      <View style={[styles.musicDurationBadge, { backgroundColor: musicColors[0] + '15' }]}>
                        <Text style={styles.musicDurationIcon}>⏱️</Text>
                        <Text style={[styles.musicDurationText, { color: musicColors[0] }]}>
                          {track.duration}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.musicPlayButtonNew, { backgroundColor: musicColors[0] }]}
                    activeOpacity={0.9}
                    onPress={() => {
                      setSelectedTrack(track);
                      setCurrentPlayer({ item: track, type: 'music' });
                    }}
                  >
                    <Text style={styles.musicPlayIconNew}>
                      {isPlaying ? '⏸' : '▶'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: Music */}
        <View style={styles.musicSection}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>🎵</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Music</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{musicTracks.length} pistes</Text>
              </View>
            </View>
          </View>
          <View style={styles.musicGridNew}>
            {musicTracks.map((track) => {
              const musicColors = getMusicColor(track.id);
              const isPlaying = currentPlayer?.type === 'music' && currentPlayer.item?.id === track.id;
              
              return (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.musicCardNew,
                    { 
                      backgroundColor: theme.surface,
                      borderLeftWidth: 4,
                      borderLeftColor: musicColors[0],
                    },
                    isPlaying && styles.musicCardPlaying
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedTrack(track);
                    setCurrentPlayer({ item: track, type: 'music' });
                  }}
                >
                  <LinearGradient
                    colors={musicColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.musicIconNew}
                  >
                    <Text style={styles.musicIconTextNew}>🎵</Text>
                  </LinearGradient>
                  
                  <View style={styles.musicInfoNew}>
                    <View style={styles.musicTitleRow}>
                      <Text style={[styles.musicTitleNew, { color: theme.text }]} numberOfLines={2}>
                        {track.title}
                      </Text>
                      {isPlaying && (
                        <View style={[styles.musicPlayingBadge, { backgroundColor: musicColors[0] }]}>
                          <Text style={styles.musicPlayingIcon}>♪</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.musicArtistNew, { color: theme.textSecondary }]} numberOfLines={1}>
                      👤 {t('player.artist')}: {track.artist}
                    </Text>
                    <View style={styles.musicMetaNew}>
                      <View style={[styles.musicDurationBadge, { backgroundColor: musicColors[0] + '15' }]}>
                        <Text style={styles.musicDurationIcon}>⏱️</Text>
                        <Text style={[styles.musicDurationText, { color: musicColors[0] }]}>
                          {track.duration}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.musicPlayButtonNew, { backgroundColor: musicColors[0] }]}
                    activeOpacity={0.9}
                    onPress={() => {
                      setSelectedTrack(track);
                      setCurrentPlayer({ item: track, type: 'music' });
                    }}
                  >
                    <Text style={styles.musicPlayIconNew}>
                      {isPlaying ? '⏸' : '▶'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Lecteur audio intégré en bas - Moderne */}
      {currentPlayer?.type === 'music' && currentPlayer.item && (
        <LinearGradient
          colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#ffffff', '#F8F9F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.musicPlayerContainerModern}
        >
          <View style={styles.musicPlayerHeaderModern}>
            <View style={styles.musicPlayerTrackInfoModern}>
              <Text style={[styles.musicPlayerTrackTitleModern, { color: theme.text }]} numberOfLines={1}>
                {currentPlayer.item.title}
              </Text>
              <Text style={[styles.musicPlayerTrackArtistModern, { color: theme.textSecondary }]} numberOfLines={1}>
                {currentPlayer.item.artist}
              </Text>
            </View>
            <View style={styles.musicPlayerHeaderActionsModern}>
              <TouchableOpacity 
                onPress={() => setShowCarMode(!showCarMode)} 
                style={[styles.musicPlayerHeaderButtonModern, showCarMode && styles.musicPlayerHeaderButtonActive]}
              >
                <Text style={styles.musicPlayerHeaderIconModern}>🚗</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.musicPlayerHeaderButtonModern}>
                <Text style={styles.musicPlayerHeaderIconModern}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.musicPlayerHeaderButtonModern}>
                <Text style={styles.musicPlayerHeaderIconModern}>ℹ️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.musicPlayerHeaderButtonModern}>
                <Text style={styles.musicPlayerHeaderIconModern}>☰</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.musicPlayerControlsModern}>
            <TouchableOpacity style={styles.musicPlayerControlBtnModern} activeOpacity={0.7}>
              <Text style={styles.musicPlayerControlIconModern}>⏮️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.musicPlayerPlayBtnModern}
              onPress={togglePlay}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D']}
                style={styles.musicPlayerPlayBtnGradient}
              >
                <Text style={styles.musicPlayerPlayIconModern}>{isPlaying ? '⏸️' : '▶️'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicPlayerControlBtnModern} activeOpacity={0.7}>
              <Text style={styles.musicPlayerControlIconModern}>⏭️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.musicPlayerProgressContainerModern}>
            <Slider
              style={styles.musicPlayerSliderModern}
              value={position}
              maximumValue={duration || 100}
              minimumValue={0}
              onValueChange={(value) => {
                setPosition(value);
                try {
                  if (player) {
                    player.currentTime = value / 1000;
                  }
                } catch (error) {
                  console.log('Erreur seek:', error);
                }
              }}
              minimumTrackTintColor="#0F5132"
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor="#0F5132"
            />
            <View style={styles.musicPlayerTimeContainerModern}>
              <Text style={[styles.musicPlayerTimeTextModern, { color: theme.textSecondary }]}>
                {formatTime(position)}
              </Text>
              <Text style={[styles.musicPlayerTimeTextModern, { color: theme.textSecondary }]}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

// Écran de podcasts - Design amélioré
function PodcastsScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer, currentPlayer } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [subscribedPodcasts, setSubscribedPodcasts] = React.useState<number[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showCarMode, setShowCarMode] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  // Utiliser expo-audio pour la lecture
  const player = useAudioPlayer(require('./assets/audio/audio.mp3'));

  React.useEffect(() => {
    if (player && currentPlayer?.type === 'podcast') {
      // Réinitialiser la position quand on change de podcast
      setPosition(0);
      setDuration(0);
      
      const updateStatus = () => {
        try {
          if (player) {
            setIsPlaying(player.playing || false);
            setPosition((player.currentTime || 0) * 1000);
            const dur = (player.duration || 0) * 1000;
            if (dur > 0) {
              setDuration(dur);
            }
          }
        } catch (error) {
          console.log('Erreur mise à jour audio:', error);
        }
      };
      const interval = setInterval(updateStatus, 500);
      return () => clearInterval(interval);
    } else {
      // Réinitialiser quand on n'a plus de lecteur actif
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }
  }, [player, currentPlayer]);

  const togglePlay = async () => {
    try {
      if (player) {
        if (player.playing) {
          await player.pause();
          setIsPlaying(false);
        } else {
          await player.play();
          setIsPlaying(true);
          // Si la durée n'est pas encore chargée, attendre un peu
          if (duration === 0) {
            setTimeout(() => {
              if (player.duration) {
                setDuration(player.duration * 1000);
              }
            }, 500);
          }
        }
      }
    } catch (error) {
      console.log('Erreur toggle play:', error);
      setIsPlaying(!isPlaying);
      if (!isPlaying && duration === 0) {
        setDuration(180000);
      }
    }
  };

  const handleShare = async () => {
    if (currentPlayer?.item) {
      try {
        await Share.share({
          message: `Écoutez "${currentPlayer.item.title}" sur Hassaniya Digital`,
          title: currentPlayer.item.title,
        });
      } catch (error) {
        console.error('Erreur partage:', error);
      }
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubscribe = (id: number) => {
    setSubscribedPodcasts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getPodcastColor = (id: number): [string, string] => {
    const colors: [string, string][] = [
      ['#0F5132', '#0B3C5D'],
      ['#0F5132', '#0B3C5D'],
      ['#0B3C5D', '#0F5132'],
      ['#C9A24D', '#0F5132'],
      ['#0F5132', '#0B3C5D'],
    ];
    return colors[(id - 1) % colors.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header avec gradient élégant */}
      <LinearGradient
        colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.podcastsHeaderModern}
      >
        <View style={styles.podcastsHeaderContent}>
          <View style={styles.podcastsHeaderLeft}>
            <View style={styles.podcastsHeaderIconContainer}>
              <Text style={styles.podcastsHeaderIcon}>🎙️</Text>
            </View>
            <View>
              <Text style={[styles.podcastsHeaderTitle, { color: theme.text }]}>{t('podcasts.title')}</Text>
              <Text style={[styles.podcastsHeaderSubtitle, { color: theme.textSecondary }]}>
                {podcasts.length} {t('podcasts.title').toLowerCase()} {t('library.available').split(' ')[1]}
              </Text>
            </View>
          </View>
          <LanguageSelector />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.podcastsScrollNew} 
        contentContainerStyle={[styles.podcastsScrollContentNew, currentPlayer?.type === 'podcast' && { paddingBottom: 220 }]}
        showsVerticalScrollIndicator={false}
      >
        {podcasts.map((podcast, index) => {
          const podcastColors = getPodcastColor(podcast.id);
          const isSubscribed = subscribedPodcasts.includes(podcast.id);
          
          return (
            <View key={podcast.id} style={styles.podcastCardWrapper}>
              <View 
                style={[
                  styles.podcastCardNew,
                  { 
                    backgroundColor: theme.surface,
                    borderLeftWidth: 5,
                    borderLeftColor: podcastColors[0],
                  }
                ]}
              >
                <View style={styles.podcastCardContentNew}>
                  {/* Icône avec gradient coloré */}
                  <LinearGradient
                    colors={podcastColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.podcastIconNew}
                  >
                    <Text style={styles.podcastIconTextNew}>🎙️</Text>
                  </LinearGradient>

                  {/* Informations du podcast */}
                  <View style={styles.podcastInfoNew}>
                    <View style={styles.podcastTitleRow}>
                      <Text style={[styles.podcastTitleNew, { color: theme.text }]} numberOfLines={2}>
                        {podcast.title}
                      </Text>
                      {isSubscribed && (
                        <View style={[styles.podcastSubscribedBadge, { backgroundColor: podcastColors[0] }]}>
                          <Text style={styles.podcastSubscribedIcon}>✓</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={[styles.podcastHostNew, { color: theme.textSecondary }]} numberOfLines={1}>
                      👤 {t('modal.by')} {podcast.host}
                    </Text>

                    {/* Statistiques avec badges */}
                    <View style={styles.podcastStatsNew}>
                      <View style={[styles.podcastStatBadge, { backgroundColor: podcastColors[0] + '15' }]}>
                        <Text style={styles.podcastStatIconNew}>📻</Text>
                        <Text style={[styles.podcastStatTextNew, { color: podcastColors[0] }]}>
                          {podcast.episodes}
                        </Text>
                        <Text style={[styles.podcastStatLabel, { color: theme.textSecondary }]}>{t('stats.episodes')}</Text>
                      </View>
                      <View style={[styles.podcastStatBadge, { backgroundColor: podcastColors[0] + '15' }]}>
                        <Text style={styles.podcastStatIconNew}>👥</Text>
                        <Text style={[styles.podcastStatTextNew, { color: podcastColors[0] }]}>
                          {podcast.subscribers}
                        </Text>
                        <Text style={[styles.podcastStatLabel, { color: theme.textSecondary }]}>{t('stats.subscribers')}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.podcastActionsNew}>
                  <TouchableOpacity
                    style={[
                      styles.podcastSubscribeButton,
                      isSubscribed && { backgroundColor: podcastColors[0] }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleSubscribe(podcast.id)}
                  >
                    <Text style={[
                      styles.podcastSubscribeText,
                      isSubscribed && styles.podcastSubscribeTextActive
                    ]}>
                      {isSubscribed ? `✓ ${t('action.subscribed')}` : t('action.subscribe')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.podcastPlayButtonNew, { backgroundColor: podcastColors[0] }]}
                    activeOpacity={0.9}
                    onPress={() => {
                      setCurrentPlayer({ item: podcast, type: 'podcast' });
                    }}
                  >
                    <Text style={styles.podcastPlayIconNew}>▶</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Lecteur audio intégré en bas - Moderne */}
      {currentPlayer?.type === 'podcast' && currentPlayer.item && (
        <LinearGradient
          colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#ffffff', '#F8F9F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.musicPlayerContainerModern}
        >
          <View style={styles.musicPlayerHeaderModern}>
            <View style={styles.musicPlayerTrackInfoModern}>
              <Text style={[styles.musicPlayerTrackTitleModern, { color: theme.text }]} numberOfLines={1}>
                {currentPlayer.item.title}
              </Text>
              <Text style={[styles.musicPlayerTrackArtistModern, { color: theme.textSecondary }]} numberOfLines={1}>
                {currentPlayer.item.host || currentPlayer.item.artist || t('player.artist')}
              </Text>
            </View>
            <View style={styles.musicPlayerHeaderActionsModern}>
              <TouchableOpacity 
                onPress={() => setShowCarMode(!showCarMode)} 
                style={[styles.musicPlayerHeaderButtonModern, showCarMode && styles.musicPlayerHeaderButtonActive]}
              >
                <Text style={styles.musicPlayerHeaderIconModern}>🚗</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.musicPlayerHeaderButtonModern}>
                <Text style={styles.musicPlayerHeaderIconModern}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.musicPlayerHeaderButtonModern}>
                <Text style={styles.musicPlayerHeaderIconModern}>ℹ️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.musicPlayerHeaderButtonModern}>
                <Text style={styles.musicPlayerHeaderIconModern}>☰</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.musicPlayerControlsModern}>
            <TouchableOpacity style={styles.musicPlayerControlBtnModern} activeOpacity={0.7}>
              <Text style={styles.musicPlayerControlIconModern}>⏮️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.musicPlayerPlayBtnModern}
              onPress={togglePlay}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D']}
                style={styles.musicPlayerPlayBtnGradient}
              >
                <Text style={styles.musicPlayerPlayIconModern}>{isPlaying ? '⏸️' : '▶️'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicPlayerControlBtnModern} activeOpacity={0.7}>
              <Text style={styles.musicPlayerControlIconModern}>⏭️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.musicPlayerProgressContainerModern}>
            <Slider
              style={styles.musicPlayerSliderModern}
              value={position}
              maximumValue={duration || 100}
              minimumValue={0}
              onValueChange={(value) => {
                setPosition(value);
                try {
                  if (player) {
                    player.currentTime = value / 1000;
                  }
                } catch (error) {
                  console.log('Erreur seek:', error);
                }
              }}
              minimumTrackTintColor="#0F5132"
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor="#0F5132"
            />
            <View style={styles.musicPlayerTimeContainerModern}>
              <Text style={[styles.musicPlayerTimeTextModern, { color: theme.textSecondary }]}>
                {formatTime(position)}
              </Text>
              <Text style={[styles.musicPlayerTimeTextModern, { color: theme.textSecondary }]}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

// Écran de cours - Design amélioré
function LibraryScreen({ navigation }: any) {
  const { language, darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);

  const courseLessons: Record<number, any[]> = {
    1: [
      { id: 1, title: 'Introduction au Soufisme', duration: '15:30', video: true },
      { id: 2, title: 'Les Fondements Spirituels', duration: '20:45', video: true },
      { id: 3, title: 'La Purification de l\'Âme', duration: '18:20', video: true },
    ],
    2: [
      { id: 1, title: 'Sourate Al-Fatiha', duration: '25:00', video: true },
      { id: 2, title: 'Sourate Al-Baqarah (Partie 1)', duration: '30:15', video: true },
    ],
  };

  const getCourseColor = (id: number): [string, string] => {
    const colors: [string, string][] = [
      ['#0F5132', '#0B3C5D'],
      ['#0F5132', '#0B3C5D'],
      ['#0B3C5D', '#0F5132'],
      ['#C9A24D', '#0F5132'],
      ['#0F5132', '#0B3C5D'],
    ];
    return colors[(id - 1) % colors.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header avec gradient élégant */}
      <LinearGradient
        colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.libraryHeaderModern}
      >
        <View style={styles.libraryHeaderContent}>
          <View style={styles.libraryHeaderLeft}>
            <View style={styles.libraryHeaderIconContainer}>
              <Text style={styles.libraryHeaderIcon}>📚</Text>
            </View>
            <View>
              <Text style={[styles.libraryHeaderTitle, { color: theme.text }]}>{t('library.title')}</Text>
              <Text style={[styles.libraryHeaderSubtitle, { color: theme.textSecondary }]}>
                {courses.length} {t('library.available')}
              </Text>
            </View>
          </View>
          <LanguageSelector />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.libraryScrollModern} 
        contentContainerStyle={styles.libraryScrollContentModern}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course, index) => {
          const courseColors = getCourseColor(course.id);
          const isExpanded = selectedCourse?.id === course.id;
          
          return (
            <View key={course.id} style={styles.libraryCourseWrapper}>
              <TouchableOpacity
                style={[
                  styles.libraryCourseCard,
                  { 
                    backgroundColor: theme.surface,
                    borderLeftWidth: 5,
                    borderLeftColor: courseColors[0],
                  }
                ]}
                activeOpacity={0.85}
                onPress={() => setSelectedCourse(isExpanded ? null : course)}
              >
                <View style={styles.libraryCourseCardContent}>
                  {/* Icône avec gradient coloré */}
                  <LinearGradient
                    colors={courseColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.libraryCourseIcon}
                  >
                    <Text style={styles.libraryCourseIconText}>📚</Text>
                  </LinearGradient>

                  {/* Informations du cours */}
                  <View style={styles.libraryCourseInfo}>
                    <View style={styles.libraryCourseTitleRow}>
                      <Text style={[styles.libraryCourseTitle, { color: theme.text }]} numberOfLines={2}>
                        {course.title}
                      </Text>
                      <View style={[styles.libraryCourseExpandIcon, isExpanded && styles.libraryCourseExpandIconActive]}>
                        <Text style={styles.libraryCourseExpandIconText}>
                          {isExpanded ? '⌄' : '›'}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.libraryCourseInstructor, { color: theme.textSecondary }]} numberOfLines={1}>
                      👤 {t('modal.by')} {course.instructor}
                    </Text>

                    {/* Métadonnées avec badges */}
                    <View style={styles.libraryCourseBadges}>
                      <View style={[styles.libraryCourseBadge, { backgroundColor: courseColors[0] + '15' }]}>
                        <Text style={styles.libraryCourseBadgeIcon}>📖</Text>
                        <Text style={[styles.libraryCourseBadgeText, { color: courseColors[0] }]}>
                          {course.lessons}
                        </Text>
                      </View>
                      <View style={[styles.libraryCourseBadge, { backgroundColor: courseColors[0] + '15' }]}>
                        <Text style={styles.libraryCourseBadgeIcon}>⏱️</Text>
                        <Text style={[styles.libraryCourseBadgeText, { color: courseColors[0] }]}>
                          {course.duration}
                        </Text>
                      </View>
                      <View style={[styles.libraryCourseBadge, { backgroundColor: courseColors[0] + '15' }]}>
                        <Text style={styles.libraryCourseBadgeIcon}>📊</Text>
                        <Text style={[styles.libraryCourseBadgeText, { color: courseColors[0] }]}>
                          {course.level}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Liste des leçons avec animation */}
              {isExpanded && courseLessons[course.id] && (
                <View style={styles.libraryLessonsContainer}>
                  <View style={styles.libraryLessonsHeader}>
                    <Text style={[styles.libraryLessonsTitle, { color: theme.text }]}>
                      {t('library.lessons')} ({courseLessons[course.id].length})
                    </Text>
                    <View style={styles.libraryLessonsProgressBar}>
                      <LinearGradient
                        colors={courseColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.libraryLessonsProgressFill, { width: '30%' }]}
                      />
                    </View>
                  </View>
                  
                  {courseLessons[course.id].map((lesson, lessonIndex) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.libraryLessonItem,
                        { 
                          backgroundColor: theme.background,
                          borderLeftColor: courseColors[0],
                        }
                      ]}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('VideoPlayer', { lesson })}
                    >
                      <View style={styles.libraryLessonItemContent}>
                        <View style={[styles.libraryLessonNumber, { backgroundColor: courseColors[0] + '20' }]}>
                          <Text style={[styles.libraryLessonNumberText, { color: courseColors[0] }]}>
                            {lessonIndex + 1}
                          </Text>
                        </View>
                        
                        <View style={styles.libraryLessonInfo}>
                          <Text style={[styles.libraryLessonTitle, { color: theme.text }]} numberOfLines={2}>
                            {lesson.title}
                          </Text>
                          <View style={styles.libraryLessonMeta}>
                            <Text style={styles.libraryLessonDurationIcon}>⏱️</Text>
                            <Text style={[styles.libraryLessonDuration, { color: theme.textSecondary }]}>
                              {lesson.duration}
                            </Text>
                            {lesson.video && (
                              <>
                                <Text style={styles.libraryLessonSeparator}>•</Text>
                                <Text style={styles.libraryLessonVideoIcon}>🎥</Text>
                                <Text style={[styles.libraryLessonVideo, { color: theme.textSecondary }]}>
                                  {t('library.video')}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>

                        <View style={[styles.libraryLessonPlayButton, { backgroundColor: courseColors[0] }]}>
                          <Text style={styles.libraryLessonPlayIcon}>▶</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Écran simple pour ouvrir le livre avec le lecteur par défaut
function PDFReaderScreen({ route, navigation }: any) {
  const { book } = route.params;
  const { darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;

  React.useEffect(() => {
    // Retourner automatiquement après un court délai
    // Le fichier sera ouvert par le système par défaut
    const timer = setTimeout(() => {
      navigation.goBack();
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.pdfReaderScreen, { backgroundColor: theme.background }]}>
      <View style={styles.pdfReaderHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.pdfReaderClose}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.pdfReaderTitle} numberOfLines={1}>{book.title || 'Livre'}</Text>
        <View style={{width: 40}} />
      </View>
      <View style={styles.pdfLoading}>
        <Text style={styles.pdfLoadingText}>{t('common.loading')}...</Text>
      </View>
    </View>
  );
}

// Écran de lecteur audio complet - Design comme l'image
function AudioPlayerScreen({ route, navigation }: any) {
  const { track } = route.params || {};
  const { darkMode, setCurrentPlayer } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(1000); // 1 seconde
  const [duration, setDuration] = React.useState(6030000); // 100:30 (1h40:30)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
  const [carMode, setCarMode] = React.useState(false);

  // Utiliser expo-audio pour la lecture
  const player = useAudioPlayer(require('./assets/audio/audio.mp3'));

  React.useEffect(() => {
    if (player) {
      const updateStatus = () => {
        try {
          setIsPlaying(player.playing || false);
          setPosition((player.currentTime || 0) * 1000);
          setDuration((player.duration || 0) * 1000);
        } catch (error) {
          console.log('Erreur mise à jour audio:', error);
        }
      };
      const interval = setInterval(updateStatus, 500);
      return () => clearInterval(interval);
    }
  }, [player]);

  const togglePlay = async () => {
    try {
      if (player) {
        if (player.playing) {
          player.pause();
        } else {
          player.play();
        }
      }
    } catch (error) {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        setDuration(6030000);
      }
    }
  };

  const handleSeek = (seconds: number) => {
    try {
      if (player) {
        player.currentTime = (player.currentTime || 0) + seconds;
      }
    } catch (error) {
      console.log('Erreur seek:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Écoutez "${track?.title || 'cette piste'}" sur Hassaniya Digital`,
        title: track?.title || 'Partage',
      });
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (ms: number) => {
    const remaining = duration - position;
    const totalSeconds = Math.floor(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `-${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `-${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!track) return null;

  return (
    <View style={[styles.audioPlayerScreenNew, { backgroundColor: '#ffffff' }]}>
      <StatusBar style="dark" />
      
      {/* Header avec icônes */}
      <View style={styles.audioPlayerHeaderNew}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.audioPlayerHeaderIconBtn}>
          <Text style={styles.audioPlayerHeaderIconNew}>⌄</Text>
        </TouchableOpacity>
        <View style={styles.audioPlayerHeaderRight}>
          <TouchableOpacity 
            onPress={() => setCarMode(!carMode)} 
            style={[styles.audioPlayerHeaderIconBtn, carMode && styles.audioPlayerHeaderIconBtnActive]}
          >
            <Text style={styles.audioPlayerHeaderIconNew}>🚗</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.audioPlayerHeaderIconBtn}>
            <Text style={styles.audioPlayerHeaderIconNew}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioPlayerHeaderIconBtn}>
            <Text style={styles.audioPlayerHeaderIconNew}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.audioPlayerContentNew} 
        contentContainerStyle={styles.audioPlayerContentContainerNew}
        showsVerticalScrollIndicator={false}
      >
        {/* Grande carte centrale avec motif islamique */}
        <View style={styles.audioPlayerCardNew}>
          <View style={styles.audioPlayerCardInner}>
            {/* Bordure dorée avec motif */}
            <View style={styles.audioPlayerCardBorder}>
              {/* Image portrait */}
              <View style={styles.audioPlayerCardImageContainer}>
                <Image 
                  source={require('./assets/thierno.png')} 
                  style={styles.audioPlayerCardImage}
                  resizeMode="cover"
                />
              </View>
              
              {/* Texte en or */}
              <View style={styles.audioPlayerCardTextContainer}>
                <Text style={styles.audioPlayerCardTitle}>ATLANTA MAWLID</Text>
                <View style={styles.audioPlayerCardTitleRow}>
                  <Text style={styles.audioPlayerCardTitle2}>RASULULLAH 2007</Text>
                  <Text style={styles.audioPlayerCardTitleAr}>رسول الله</Text>
                </View>
                <Text style={styles.audioPlayerCardSubtitle}>KEYNOTE SPEACH:</Text>
                <Text style={styles.audioPlayerCardSpeaker}>SHAYKH HASSAN CISSE</Text>
              </View>
            </View>

            {/* Footer de la carte */}
            <View style={styles.audioPlayerCardFooter}>
              <View style={styles.audioPlayerCardFooterLeft}>
                <Text style={styles.audioPlayerCardFooterLabel}>EXECUTIVE DIRECTOR:</Text>
                <Text style={styles.audioPlayerCardFooterText}>KABA MUHAMMAD ABDUL-FATTAAH</Text>
              </View>
              <View style={styles.audioPlayerCardFooterCenter}>
                <Text style={styles.audioPlayerCardLogo}>FAYDA DIGITAL</Text>
                <Text style={styles.audioPlayerCardLogoAr}>فيضة</Text>
              </View>
              <View style={styles.audioPlayerCardFooterRight}>
                <Text style={styles.audioPlayerCardHeadphone}>🎧</Text>
                <Text style={styles.audioPlayerCardStoreText}>Available on the{'\n'}App Store</Text>
                <Text style={styles.audioPlayerCardStoreText}>GET IT ON{'\n'}Google Play</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Titre de la piste */}
        <View style={styles.audioPlayerTrackInfoNew}>
          <Text style={styles.audioPlayerTrackTitleNew} numberOfLines={1}>
            {track.artist || track.speaker || track.host || 'Shaykh Hassan Cisse'}
          </Text>
          <Text style={styles.audioPlayerTrackSubtitleNew} numberOfLines={1}>
            {track.title || 'd Nabi Shaykh Hassan Cisse Keynot'}
          </Text>
        </View>

        {/* Barre de progression */}
        <View style={styles.audioPlayerProgressNew}>
          <Slider
            style={styles.audioPlayerSliderNew}
            value={position}
            maximumValue={duration || 100}
            minimumValue={0}
            onValueChange={(value) => {
              setPosition(value);
              try {
                if (player) {
                  player.currentTime = value / 1000;
                }
              } catch (error) {
                console.log('Erreur seek:', error);
              }
            }}
            minimumTrackTintColor="#0F5132"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#0F5132"
          />
          <View style={styles.audioPlayerTimeNew}>
            <Text style={styles.audioPlayerTimeTextNew}>{formatTime(position)}</Text>
            <Text style={styles.audioPlayerTimeRemainingNew}>{formatRemainingTime(position)}</Text>
          </View>
        </View>

        {/* Contrôles principaux */}
        <View style={styles.audioPlayerMainControlsNew}>
          <TouchableOpacity style={styles.audioPlayerControlBtnNew} activeOpacity={0.7}>
            <Text style={styles.audioPlayerControlIconNew}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerRewindBtn}
            onPress={() => handleSeek(-30)}
            activeOpacity={0.7}
          >
            <Text style={styles.audioPlayerRewindIcon}>⏪</Text>
            <Text style={styles.audioPlayerRewindText}>30s</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerPlayButtonNew}
            onPress={togglePlay}
            activeOpacity={0.9}
          >
            <Text style={styles.audioPlayerPlayIconNew}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerForwardBtn}
            onPress={() => handleSeek(30)}
            activeOpacity={0.7}
          >
            <Text style={styles.audioPlayerForwardIcon}>⏩</Text>
            <Text style={styles.audioPlayerForwardText}>30s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioPlayerControlBtnNew} activeOpacity={0.7}>
            <Text style={styles.audioPlayerControlIconNew}>⏭</Text>
          </TouchableOpacity>
        </View>

        {/* Contrôles supplémentaires */}
        <View style={styles.audioPlayerExtraControlsNew}>
          <TouchableOpacity style={styles.audioPlayerExtraBtn} activeOpacity={0.7}>
            <Text style={styles.audioPlayerExtraIcon}>🕐</Text>
            <Text style={styles.audioPlayerExtraText}>{playbackSpeed.toFixed(1)}x</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioPlayerExtraBtn} activeOpacity={0.7}>
            <Text style={styles.audioPlayerExtraIcon}>@</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioPlayerExtraBtn} activeOpacity={0.7}>
            <Text style={styles.audioPlayerExtraIcon}>Zz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Mini Player Modal - Désactivé
function MiniPlayerModal({ navigation }: any) {
  // Modal désactivé comme demandé
  return null;
}

// Lecteur vidéo
function VideoPlayerScreen({ route, navigation }: any) {
  const { lesson } = route.params || {};
  const { darkMode, language } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  // Utiliser une vidéo d'exemple depuis une URL
  // Exemple avec une vidéo de démonstration (vous pouvez remplacer par votre propre URL)
  const videoSource = lesson?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  
  const player = useVideoPlayer({ uri: videoSource }, (player) => {
    if (player) {
      player.loop = false;
      player.muted = false;
    }
  });

  React.useEffect(() => {
    if (player) {
      const checkStatus = () => {
        try {
          setIsPlaying(player.playing || false);
        } catch (error) {
          console.log('Erreur statut vidéo:', error);
        }
      };
      const interval = setInterval(checkStatus, 500);
      return () => clearInterval(interval);
    }
  }, [player]);

  const togglePlay = () => {
    if (player) {
      try {
        if (player.playing) {
          player.pause();
        } else {
          player.play();
        }
      } catch (error) {
        console.log('Erreur toggle play vidéo:', error);
      }
    }
  };

  return (
    <View style={[styles.videoPlayerScreenNew, { backgroundColor: '#000' }]}>
      <StatusBar style="light" />
      
      {/* Header moderne */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.videoPlayerHeaderNew}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.videoPlayerBackButton}
          activeOpacity={0.7}
        >
          <Text style={styles.videoPlayerBackIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.videoPlayerTitleContainer}>
          <Text style={styles.videoPlayerTitleNew} numberOfLines={1}>
            {lesson?.title || t('library.lessons')}
          </Text>
          {lesson?.duration && (
            <Text style={styles.videoPlayerDuration}>⏱️ {lesson.duration}</Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={togglePlay}
          style={styles.videoPlayerPlayButtonHeader}
          activeOpacity={0.8}
        >
          <Text style={styles.videoPlayerPlayIconHeader}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Lecteur vidéo */}
      <VideoView
        player={player}
        style={styles.videoViewNew}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
        nativeControls={true}
      />
    </View>
  );
}

// Thèmes
const lightTheme = {
  background: '#F8F9F6',
  surface: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#0F5132',
  secondary: '#0B3C5D',
  accent: '#C9A24D',
};

const darkTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  primary: '#0F5132',
  secondary: '#0B3C5D',
  accent: '#C9A24D',
};

// Écran de Splash/Onboarding
function OnboardingScreen({ navigation }: any) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const { darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;

  const slides = [
    {
      id: 1,
      title: 'Bienvenue sur Hassaniya Digital',
      subtitle: 'Explorez la sagesse islamique',
      description: 'Découvrez une collection riche de livres, musiques, podcasts et cours spirituels',
      icon: '📚',
      color: '#0F5132',
    },
    {
      id: 2,
      title: 'Livres et Enseignements',
      subtitle: t('library.subtitle'),
      description: 'Accédez à des ouvrages spirituels de grande valeur et enrichissez votre connaissance',
      icon: '📖',
      color: '#0B3C5D',
    },
    {
      id: 3,
      title: 'Musique et Podcasts',
      subtitle: 'Contenu audio riche',
      description: 'Écoutez des chants spirituels, des podcasts éducatifs et des livres audio',
      icon: '🎵',
      color: '#0F5132',
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Naviguer vers l'accueil
      navigation.replace('MainTabs');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToHome = () => {
    navigation.replace('MainTabs');
  };

  const slide = slides[currentSlide];

  return (
    <View style={[styles.onboardingContainer, { backgroundColor: slide.color }]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[slide.color, slide.color + 'dd']}
        style={styles.onboardingGradient}
      >
        <View style={styles.onboardingContent}>
          <Text style={styles.onboardingIcon}>{slide.icon}</Text>
          <Text style={styles.onboardingTitle}>{slide.title}</Text>
          <Text style={styles.onboardingSubtitle}>{slide.subtitle}</Text>
          <Text style={styles.onboardingDescription}>{slide.description}</Text>
        </View>

        <View style={styles.onboardingIndicators}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentSlide && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.onboardingControls}>
          {currentSlide > 0 && (
            <TouchableOpacity style={styles.onboardingArrowLeft} onPress={prevSlide}>
              <Text style={styles.onboardingArrowText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {currentSlide < slides.length - 1 ? (
            <TouchableOpacity style={styles.onboardingArrowRight} onPress={nextSlide}>
              <Text style={styles.onboardingArrowText}>→</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.onboardingButton} onPress={goToHome}>
              <Text style={styles.onboardingButtonText}>Continuer</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

// Navigation principale
function MainTabs() {
  const { language, darkMode, currentRoute, setCurrentRoute } = React.useContext(AppContext);
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const state = e.data?.state;
      if (state) {
        const route = state.routes[state.index]?.name;
        setCurrentRoute(route || null);
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0F5132',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: darkMode ? darkTheme.surface : lightTheme.surface,
            borderTopColor: '#e0e0e0',
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: t('nav.home'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
          }}
        />
        <Tab.Screen 
          name="Books" 
          component={BooksScreen}
          options={{
            tabBarLabel: t('nav.books'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>,
          }}
        />
        <Tab.Screen 
          name="Music" 
          component={MusicScreen}
          options={{
            tabBarLabel: t('nav.music'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎵</Text>,
          }}
        />
        <Tab.Screen 
          name="Podcasts" 
          component={PodcastsScreen}
          options={{
            tabBarLabel: t('nav.podcasts'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎙️</Text>,
          }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen}
          options={{
            tabBarLabel: t('nav.library'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📖</Text>,
          }}
        />
      </Tab.Navigator>
      <MiniPlayerModal navigation={navigation} />
    </>
  );
}

// Composant principal
export default function App() {
  const [language, setLang] = React.useState<Language>('fr');
  const [darkMode, setDarkMode] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState<{ item: any; type: 'music' | 'podcast' | 'book' | null } | null>(null);
  const [audioState, setAudioState] = React.useState<{ isPlaying: boolean; position: number; duration: number } | null>(null);
  const [currentRoute, setCurrentRoute] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLanguage(language);
  }, [language]);

  return (
    <AppContext.Provider value={{
      language,
      setLang,
      darkMode,
      setDarkMode,
      currentPlayer,
      setCurrentPlayer,
      audioState,
      setAudioState,
      currentRoute,
      setCurrentRoute,
    }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} />
          <Stack.Screen name="PDFReader" component={PDFReaderScreen} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F5132',
  },
  langSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  langBtn: {
    padding: 5,
    borderRadius: 5,
  },
  langBtnActive: {
    backgroundColor: '#e0e0e0',
  },
  langFlag: {
    fontSize: 20,
  },
  heroSection: {
    height: 250,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#C9A24D',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroPattern: {
    marginTop: 20,
  },
  heroPatternText: {
    fontSize: 40,
    opacity: 0.3,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionEnhanced: {
    marginBottom: 35,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },
  continueCard: {
    width: 160,
    marginRight: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueCardEnhanced: {
    borderRadius: 16,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 18,
  },
  continueIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  continueIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  continueDurationContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  continueIconText: {
    fontSize: 24,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  continueSpeaker: {
    fontSize: 12,
    marginBottom: 5,
  },
  continueDuration: {
    fontSize: 11,
    fontWeight: '600',
  },
  musicCard: {
    width: 140,
    marginRight: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  musicCardEnhanced: {
    borderRadius: 16,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 18,
  },
  musicIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  musicIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  musicIconText: {
    fontSize: 24,
  },
  musicTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  musicArtist: {
    fontSize: 12,
  },
  audiobookCard: {
    width: 150,
    height: 200,
    marginRight: 15,
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audiobookCardEnhanced: {
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  audiobookGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
  },
  audiobookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  audiobookTitleAr: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  lockedText: {
    fontSize: 24,
    marginTop: 10,
  },
  booksScroll: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  categorySectionEnhanced: {
    marginBottom: 35,
    paddingTop: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  bookCard: {
    width: 120,
    marginRight: 15,
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCardEnhanced: {
    borderRadius: 16,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 12,
    width: 130,
  },
  bookCover: {
    width: 100,
    height: 140,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookCoverEnhanced: {
    width: 110,
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  bookCoverEmoji: {
    fontSize: 52,
  },
  bookPagesContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 10,
    marginBottom: 5,
  },
  bookPages: {
    fontSize: 9,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bookModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  modalClose: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContent: {
    marginBottom: 20,
  },
  modalAuthor: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
  },
  modalInfo: {
    flexDirection: 'row',
    gap: 15,
  },
  modalInfoText: {
    fontSize: 12,
  },
  openButton: {
    backgroundColor: '#0F5132',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  musicList: {
    flex: 1,
  },
  musicListContent: {
    padding: 15,
  },
  musicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  musicCardGrid: {
    width: (width - 45) / 2,
    marginBottom: 20,
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  musicCardGridIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  musicCardGridIconText: {
    fontSize: 36,
  },
  musicCardGridTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  musicCardGridArtist: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  musicCardGridDuration: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  musicPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    borderTopWidth: 2,
    borderTopColor: '#0F5132',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  musicPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  musicPlayerTrackInfo: {
    flex: 1,
    marginRight: 15,
  },
  musicPlayerTrackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  musicPlayerTrackArtist: {
    fontSize: 14,
  },
  musicPlayerHeaderActions: {
    flexDirection: 'row',
    gap: 15,
  },
  musicPlayerHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  musicPlayerHeaderIcon: {
    fontSize: 20,
  },
  musicPlayerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginBottom: 15,
  },
  musicPlayerControlBtn: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicPlayerControlIcon: {
    fontSize: 24,
  },
  musicPlayerPlayBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  musicPlayerPlayIcon: {
    fontSize: 32,
    color: '#fff',
  },
  musicPlayerProgressContainer: {
    width: '100%',
  },
  musicPlayerSlider: {
    width: '100%',
    height: 40,
  },
  musicPlayerTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  musicPlayerTimeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  musicItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  musicItemIconText: {
    fontSize: 24,
  },
  musicItemInfo: {
    flex: 1,
  },
  musicItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  musicItemArtist: {
    fontSize: 14,
  },
  musicItemDuration: {
    fontSize: 12,
  },
  podcastsList: {
    flex: 1,
  },
  podcastsListContent: {
    padding: 15,
  },
  podcastCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastCardEnhanced: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  podcastCardHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  podcastIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  podcastIconEnhanced: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  podcastIconText: {
    fontSize: 32,
  },
  podcastInfo: {
    flex: 1,
  },
  podcastInfoEnhanced: {
    flex: 1,
    justifyContent: 'center',
  },
  podcastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  podcastTitleEnhanced: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  podcastHost: {
    fontSize: 14,
    marginBottom: 5,
  },
  podcastHostEnhanced: {
    fontSize: 15,
    marginBottom: 12,
    fontWeight: '500',
  },
  podcastStats: {
    flexDirection: 'row',
    gap: 5,
  },
  podcastStatsEnhanced: {
    flexDirection: 'row',
    gap: 15,
  },
  podcastStat: {
    fontSize: 12,
  },
  podcastStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  podcastStatIcon: {
    fontSize: 14,
  },
  podcastStatText: {
    fontSize: 13,
    fontWeight: '500',
  },
  podcastActions: {
    flexDirection: 'row',
    gap: 10,
  },
  podcastActionsEnhanced: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 5,
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: '#0F5132',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonEnhanced: {
    flex: 1,
    backgroundColor: '#0F5132',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribedButton: {
    backgroundColor: '#ccc',
  },
  subscribedButtonEnhanced: {
    backgroundColor: '#e0e0e0',
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subscribeButtonTextEnhanced: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  subscribedButtonText: {
    color: '#666',
  },
  subscribedButtonTextEnhanced: {
    color: '#666',
    fontSize: 15,
  },
  playButton: {
    width: 50,
    height: 50,
    backgroundColor: '#0F5132',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonEnhanced: {
    width: 56,
    height: 56,
    backgroundColor: '#0F5132',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  playButtonText: {
    fontSize: 20,
  },
  playButtonTextEnhanced: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  coursesList: {
    flex: 1,
  },
  coursesListContent: {
    padding: 15,
  },
  courseCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseCardEnhanced: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  courseHeader: {
    flexDirection: 'row',
  },
  courseHeaderEnhanced: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  courseIconEnhanced: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  courseIconText: {
    fontSize: 32,
  },
  courseInfo: {
    flex: 1,
  },
  courseInfoEnhanced: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseTitleEnhanced: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseInstructor: {
    fontSize: 14,
    marginBottom: 5,
  },
  courseInstructorEnhanced: {
    fontSize: 15,
    marginBottom: 12,
    fontWeight: '500',
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 5,
  },
  courseMetaEnhanced: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  courseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  courseMetaIcon: {
    fontSize: 14,
  },
  courseMetaText: {
    fontSize: 12,
  },
  courseMetaTextEnhanced: {
    fontSize: 13,
    fontWeight: '500',
  },
  lessonsList: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  lessonsListEnhanced: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  lessonItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  lessonItemEnhanced: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lessonItemIcon: {
    fontSize: 20,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  lessonTitleEnhanced: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
  },
  lessonDurationEnhanced: {
    fontSize: 13,
    fontWeight: '500',
  },
  pdfReaderScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfReaderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pdfReaderClose: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  pdfReaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  pdfLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfLoadingText: {
    fontSize: 16,
    color: '#666',
  },
  audioPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  audioPlayerInfo: {
    marginBottom: 10,
  },
  audioPlayerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  audioPlayerArtist: {
    fontSize: 14,
    color: '#666',
  },
  audioPlayerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  audioPlayerButton: {
    fontSize: 32,
  },
  audioSlider: {
    width: '100%',
    height: 40,
  },
  audioPlayerScreen: {
    flex: 1,
  },
  audioPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  audioPlayerHeaderButton: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  audioPlayerHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  audioPlayerContent: {
    flex: 1,
  },
  audioPlayerContentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  audioPlayerArtwork: {
    width: 280,
    height: 280,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  audioPlayerArtworkGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerArtworkIcon: {
    fontSize: 120,
  },
  audioPlayerTrackInfo: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  audioPlayerTrackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  audioPlayerTrackArtist: {
    fontSize: 18,
    textAlign: 'center',
  },
  audioPlayerProgress: {
    width: '100%',
    marginBottom: 30,
  },
  audioPlayerSlider: {
    width: '100%',
    height: 40,
  },
  audioPlayerTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  audioPlayerTimeText: {
    fontSize: 14,
  },
  audioPlayerMainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginBottom: 40,
  },
  audioPlayerControlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerControlIcon: {
    fontSize: 28,
  },
  audioPlayerPlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  audioPlayerPlayIcon: {
    fontSize: 40,
    color: '#fff',
  },
  audioPlayerSecondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  audioPlayerSecondaryButton: {
    alignItems: 'center',
    gap: 8,
  },
  audioPlayerSecondaryButtonActive: {
    opacity: 0.7,
  },
  audioPlayerSecondaryIcon: {
    fontSize: 28,
  },
  audioPlayerSecondaryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  audioPlayerInfoModal: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  audioPlayerInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  audioPlayerInfoText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  miniPlayerOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  miniPlayer: {
    backgroundColor: '#0F5132',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  miniPlayerInfo: {
    flex: 1,
    marginRight: 15,
  },
  miniPlayerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  miniPlayerSubtitle: {
    fontSize: 12,
    color: '#C9A24D',
  },
  miniPlayerClose: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  videoPlayerScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  videoPlayerClose: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  videoPlayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  videoView: {
    flex: 1,
  },
  onboardingContainer: {
    flex: 1,
  },
  onboardingGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 40,
    paddingTop: 80,
    paddingBottom: 60,
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingIcon: {
    fontSize: 100,
    marginBottom: 30,
  },
  onboardingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  onboardingSubtitle: {
    fontSize: 22,
    color: '#C9A24D',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  onboardingDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  onboardingIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#fff',
  },
  onboardingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onboardingArrowLeft: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingArrowRight: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingArrowText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  onboardingButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  onboardingButtonText: {
    color: '#0F5132',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Styles modernes - Header
  headerModern: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitleModern: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
  },
  headerTitleModern: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
  },
  // Styles modernes - Hero
  heroSectionModern: {
    height: 220,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  heroImageModern: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGradientModern: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContentModern: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  heroIcon: {
    fontSize: 45,
    color: '#0F5132',
  },
  heroTitleModern: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitleModern: {
    fontSize: 18,
    color: '#f0f0f0',
    marginBottom: 15,
    fontWeight: '500',
  },
  heroDecorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: '#C9A24D',
    borderRadius: 2,
  },
  // Styles modernes - Sections
  sectionModern: {
    marginBottom: 35,
    paddingHorizontal: 20,
  },
  sectionHeaderModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(15, 81, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIconModern: {
    fontSize: 22,
    color: '#0F5132',
  },
  sectionTitleModern: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#F8F9F6',
  },
  seeAllModern: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F5132',
  },
  seeAllArrow: {
    fontSize: 16,
    color: '#0F5132',
    fontWeight: 'bold',
  },
  horizontalScrollModern: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  horizontalScrollContentModern: {
    paddingRight: 20,
  },
  // Styles modernes - Continue Cards
  continueCardModern: {
    width: 180,
    marginRight: 15,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  continueIconGradientModern: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueIconTextModern: {
    fontSize: 28,
    color: '#0F5132',
  },
  continueCardContent: {
    flex: 1,
  },
  continueTitleModern: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  continueSpeakerModern: {
    fontSize: 12,
    marginBottom: 10,
    opacity: 0.8,
  },
  continueDurationContainerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  continueDurationIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  continueDurationModern: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F5132',
  },
  // Styles modernes - Music Cards
  musicCardModern: {
    width: 160,
    marginRight: 15,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  musicIconGradientModern: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  musicIconTextModern: {
    fontSize: 26,
    color: '#0F5132',
  },
  musicCardContent: {
    flex: 1,
  },
  musicTitleModern: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  musicArtistModern: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Styles modernes - Audiobook Cards
  audiobookCardModern: {
    width: 200,
    height: 140,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  audiobookGradientModern: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  audiobookContent: {
    alignItems: 'center',
    width: '100%',
  },
  audiobookTitleModern: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  audiobookTitleArModern: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 10,
  },
  lockedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 18,
  },
  // Styles modernes - Books
  booksScrollModern: {
    flex: 1,
  },
  categorySectionModern: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  categoryHeaderModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  categoryTitleContainerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F8F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIconModern: {
    fontSize: 22,
  },
  categoryTitleModern: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  categorySubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  bookCardModern: {
    width: 150,
    marginRight: 15,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  bookCoverModern: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverEmojiModern: {
    fontSize: 50,
  },
  bookCardContentModern: {
    padding: 12,
  },
  bookTitleModern: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 18,
  },
  bookAuthorModern: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.7,
  },
  bookPagesContainerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bookPagesIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  bookPagesModern: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F5132',
  },
  // Styles modernes - Music Grid
  musicListModern: {
    flex: 1,
  },
  musicListContentModern: {
    padding: 20,
  },
  musicGridModern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  musicCardGridModern: {
    width: (width - 60) / 2,
    marginBottom: 20,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  musicCardGridIconModern: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  musicCardGridIconTextModern: {
    fontSize: 30,
  },
  musicCardGridContent: {
    flex: 1,
  },
  musicCardGridTitleModern: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  musicCardGridArtistModern: {
    fontSize: 13,
    marginBottom: 8,
    opacity: 0.7,
  },
  musicCardGridDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  musicCardGridDurationIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  musicCardGridDurationModern: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F5132',
  },
  // Styles modernes - Podcasts
  podcastsListModern: {
    flex: 1,
  },
  podcastsListContentModern: {
    padding: 20,
  },
  podcastCardModern: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  podcastCardHeaderModern: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  podcastIconModern: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastIconTextModern: {
    fontSize: 30,
  },
  podcastInfoModern: {
    flex: 1,
  },
  podcastTitleModern: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  podcastHostModern: {
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.7,
  },
  podcastStatsModern: {
    flexDirection: 'row',
    gap: 15,
  },
  podcastStatItemModern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  podcastStatIconModern: {
    fontSize: 14,
  },
  podcastStatTextModern: {
    fontSize: 12,
    fontWeight: '500',
  },
  podcastActionsModern: {
    flexDirection: 'row',
    gap: 12,
  },
  subscribeButtonModern: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#F8F9F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribedButtonModern: {
    backgroundColor: '#0F5132',
  },
  subscribeButtonTextModern: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F5132',
  },
  subscribedButtonTextModern: {
    color: '#fff',
  },
  playButtonModern: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonTextModern: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 2,
  },
  // Styles modernes - Library
  coursesListModern: {
    flex: 1,
  },
  coursesListContentModern: {
    padding: 20,
  },
  courseCardModern: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  courseHeaderModern: {
    flexDirection: 'row',
  },
  courseIconModern: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  courseIconTextModern: {
    fontSize: 30,
  },
  courseInfoModern: {
    flex: 1,
  },
  courseTitleModern: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  courseInstructorModern: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.7,
  },
  courseMetaModern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  courseMetaItemModern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F8F9F6',
  },
  courseMetaIconModern: {
    fontSize: 14,
  },
  courseMetaTextModern: {
    fontSize: 12,
    fontWeight: '600',
  },
  lessonsListModern: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  lessonItemModern: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lessonItemLeftModern: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonItemIconModern: {
    fontSize: 18,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitleModern: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDurationModern: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Styles modernes - Lecteur audio intégré
  musicPlayerContainerModern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    paddingBottom: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  musicPlayerHeaderModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  musicPlayerTrackInfoModern: {
    flex: 1,
    marginRight: 15,
  },
  musicPlayerTrackTitleModern: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  musicPlayerTrackArtistModern: {
    fontSize: 14,
    opacity: 0.8,
  },
  musicPlayerHeaderActionsModern: {
    flexDirection: 'row',
    gap: 12,
  },
  musicPlayerHeaderButtonModern: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 81, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicPlayerHeaderButtonActive: {
    backgroundColor: 'rgba(15, 81, 50, 0.25)',
  },
  musicPlayerHeaderIconModern: {
    fontSize: 20,
  },
  musicPlayerControlsModern: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 35,
    marginBottom: 18,
  },
  musicPlayerControlBtnModern: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicPlayerControlIconModern: {
    fontSize: 26,
  },
  musicPlayerPlayBtnModern: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  musicPlayerPlayBtnGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicPlayerPlayIconModern: {
    fontSize: 36,
    color: '#fff',
  },
  musicPlayerProgressContainerModern: {
    width: '100%',
  },
  musicPlayerSliderModern: {
    width: '100%',
    height: 40,
  },
  musicPlayerTimeContainerModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  musicPlayerTimeTextModern: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Styles modernes - Modal
  modalOverlayModern: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  bookModalModern: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeaderModern: {
    padding: 25,
    paddingTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitleContainer: {
    flex: 1,
    marginRight: 15,
  },
  modalTitleModern: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalAuthorModern: {
    fontSize: 16,
    color: '#f0f0f0',
    opacity: 0.9,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseModern: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContentModern: {
    padding: 25,
    maxHeight: 400,
  },
  modalDescriptionModern: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 25,
    textAlign: 'justify',
  },
  modalInfoModern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalInfoIcon: {
    fontSize: 18,
  },
  modalInfoTextModern: {
    fontSize: 14,
    fontWeight: '600',
  },
  openButtonModern: {
    margin: 25,
    marginTop: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  openButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButtonTextModern: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  // Styles nouveau lecteur audio (comme l'image)
  audioPlayerScreenNew: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  audioPlayerHeaderNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  audioPlayerHeaderIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerHeaderIconBtnActive: {
    backgroundColor: '#F8F9F6',
    borderRadius: 20,
  },
  audioPlayerHeaderIconNew: {
    fontSize: 24,
    color: '#333',
  },
  audioPlayerHeaderRight: {
    flexDirection: 'row',
    gap: 15,
  },
  audioPlayerContentNew: {
    flex: 1,
  },
  audioPlayerContentContainerNew: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  // Grande carte centrale
  audioPlayerCardNew: {
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  audioPlayerCardInner: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  audioPlayerCardBorder: {
    borderWidth: 5,
    borderColor: '#C9A24D',
    borderRadius: 15,
    padding: 25,
    backgroundColor: '#fafafa',
    position: 'relative',
    shadowColor: '#C9A24D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  audioPlayerCardImageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  audioPlayerCardImage: {
    width: '100%',
    height: '100%',
  },
  audioPlayerCardTextContainer: {
    alignItems: 'center',
  },
  audioPlayerCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C9A24D',
    marginBottom: 8,
    letterSpacing: 1,
  },
  audioPlayerCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  audioPlayerCardTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C9A24D',
    letterSpacing: 0.5,
  },
  audioPlayerCardTitleAr: {
    fontSize: 16,
    color: '#C9A24D',
    fontWeight: '600',
  },
  audioPlayerCardSubtitle: {
    fontSize: 14,
    color: '#0F5132',
    marginBottom: 4,
    fontWeight: '600',
  },
  audioPlayerCardSpeaker: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F5132',
    letterSpacing: 0.5,
  },
  audioPlayerCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  audioPlayerCardFooterLeft: {
    flex: 1,
  },
  audioPlayerCardFooterLabel: {
    fontSize: 10,
    color: '#C9A24D',
    fontWeight: '600',
    marginBottom: 4,
  },
  audioPlayerCardFooterText: {
    fontSize: 11,
    color: '#0F5132',
    fontWeight: '600',
  },
  audioPlayerCardFooterCenter: {
    alignItems: 'center',
    flex: 1,
  },
  audioPlayerCardLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: 2,
  },
  audioPlayerCardLogoAr: {
    fontSize: 12,
    color: '#0F5132',
    fontWeight: '600',
  },
  audioPlayerCardFooterRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  audioPlayerCardHeadphone: {
    fontSize: 20,
    marginBottom: 4,
  },
  audioPlayerCardStoreText: {
    fontSize: 8,
    color: '#666',
    textAlign: 'right',
    lineHeight: 10,
  },
  // Info piste
  audioPlayerTrackInfoNew: {
    marginBottom: 20,
  },
  audioPlayerTrackTitleNew: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  audioPlayerTrackSubtitleNew: {
    fontSize: 14,
    color: '#666',
  },
  // Barre de progression
  audioPlayerProgressNew: {
    marginBottom: 25,
  },
  audioPlayerSliderNew: {
    width: '100%',
    height: 40,
  },
  audioPlayerTimeNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  audioPlayerTimeTextNew: {
    fontSize: 13,
    color: '#0F5132',
    fontWeight: '600',
  },
  audioPlayerTimeRemainingNew: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  // Contrôles principaux
  audioPlayerMainControlsNew: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 25,
  },
  audioPlayerControlBtnNew: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerControlIconNew: {
    fontSize: 28,
    color: '#333',
  },
  audioPlayerRewindBtn: {
    alignItems: 'center',
    gap: 4,
  },
  audioPlayerRewindIcon: {
    fontSize: 24,
    color: '#333',
  },
  audioPlayerRewindText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  audioPlayerForwardBtn: {
    alignItems: 'center',
    gap: 4,
  },
  audioPlayerForwardIcon: {
    fontSize: 24,
    color: '#333',
  },
  audioPlayerForwardText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  audioPlayerPlayButtonNew: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  audioPlayerPlayIconNew: {
    fontSize: 36,
    color: '#fff',
    marginLeft: 3,
  },
  // Contrôles supplémentaires
  audioPlayerExtraControlsNew: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  audioPlayerExtraBtn: {
    alignItems: 'center',
    gap: 4,
  },
  audioPlayerExtraIcon: {
    fontSize: 20,
    color: '#666',
  },
  audioPlayerExtraText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  // Styles cours améliorés
  libraryHeaderModern: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  libraryHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  libraryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  libraryHeaderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(15, 81, 50, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  libraryHeaderIcon: {
    fontSize: 26,
  },
  libraryHeaderTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  libraryHeaderSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  libraryScrollModern: {
    flex: 1,
  },
  libraryScrollContentModern: {
    padding: 20,
    paddingBottom: 30,
  },
  libraryCourseWrapper: {
    marginBottom: 20,
  },
  libraryCourseCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  libraryCourseCardContent: {
    flexDirection: 'row',
    padding: 20,
  },
  libraryCourseIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  libraryCourseIconText: {
    fontSize: 32,
  },
  libraryCourseInfo: {
    flex: 1,
  },
  libraryCourseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  libraryCourseTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    lineHeight: 24,
  },
  libraryCourseExpandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryCourseExpandIconActive: {
    backgroundColor: '#0F5132',
    transform: [{ rotate: '180deg' }],
  },
  libraryCourseExpandIconText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  libraryCourseInstructor: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  libraryCourseBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  libraryCourseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  libraryCourseBadgeIcon: {
    fontSize: 14,
  },
  libraryCourseBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  libraryLessonsContainer: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#e8e8e8',
  },
  libraryLessonsHeader: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  libraryLessonsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  libraryLessonsProgressBar: {
    height: 4,
    backgroundColor: '#e8e8e8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  libraryLessonsProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  libraryLessonItem: {
    marginBottom: 12,
    borderRadius: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  libraryLessonItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  libraryLessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  libraryLessonNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  libraryLessonInfo: {
    flex: 1,
    marginRight: 12,
  },
  libraryLessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  libraryLessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  libraryLessonDurationIcon: {
    fontSize: 12,
  },
  libraryLessonDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  libraryLessonSeparator: {
    fontSize: 12,
    color: '#ccc',
    marginHorizontal: 4,
  },
  libraryLessonVideoIcon: {
    fontSize: 12,
  },
  libraryLessonVideo: {
    fontSize: 12,
    fontWeight: '500',
  },
  libraryLessonPlayButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  libraryLessonPlayIcon: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 2,
  },
  // Styles lecteur vidéo amélioré
  videoPlayerScreenNew: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlayerHeaderNew: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  videoPlayerBackButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerBackIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  videoPlayerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  videoPlayerTitleNew: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  videoPlayerDuration: {
    fontSize: 14,
    color: '#f0f0f0',
  },
  videoViewNew: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  videoPlayerPlayButtonHeader: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerPlayIconHeader: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 2,
  },
  // Styles podcasts améliorés
  podcastsHeaderModern: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastsHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  podcastsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  podcastsHeaderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(15, 81, 50, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  podcastsHeaderIcon: {
    fontSize: 26,
  },
  podcastsHeaderTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  podcastsHeaderSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  podcastsScrollNew: {
    flex: 1,
  },
  podcastsScrollContentNew: {
    padding: 20,
    paddingBottom: 30,
  },
  podcastCardWrapper: {
    marginBottom: 20,
  },
  podcastCardNew: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  podcastCardContentNew: {
    flexDirection: 'row',
    padding: 20,
  },
  podcastIconNew: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastIconTextNew: {
    fontSize: 34,
  },
  podcastInfoNew: {
    flex: 1,
  },
  podcastTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  podcastTitleNew: {
    fontSize: 19,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    lineHeight: 24,
  },
  podcastSubscribedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastSubscribedIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  podcastHostNew: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  podcastStatsNew: {
    flexDirection: 'row',
    gap: 10,
  },
  podcastStatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    gap: 6,
  },
  podcastStatIconNew: {
    fontSize: 14,
  },
  podcastStatTextNew: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },
  podcastStatLabel: {
    fontSize: 11,
    opacity: 0.8,
  },
  podcastActionsNew: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  podcastSubscribeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#F8F9F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastSubscribeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F5132',
  },
  podcastSubscribeTextActive: {
    color: '#fff',
  },
  podcastPlayButtonNew: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastPlayIconNew: {
    fontSize: 22,
    color: '#fff',
    marginLeft: 2,
  },
  // Styles musique améliorés
  musicSection: {
    marginBottom: 30,
  },
  musicHeaderModern: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  musicHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  musicHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  musicHeaderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(15, 81, 50, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  musicHeaderIcon: {
    fontSize: 26,
  },
  musicHeaderTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  musicHeaderSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  musicScrollNew: {
    flex: 1,
  },
  musicScrollContentNew: {
    padding: 20,
    paddingBottom: 30,
  },
  musicGridNew: {
    gap: 15,
  },
  musicCardNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  musicCardPlaying: {
    borderWidth: 2,
    borderColor: '#0F5132',
    shadowColor: '#0F5132',
    shadowOpacity: 0.2,
  },
  musicIconNew: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  musicIconTextNew: {
    fontSize: 30,
  },
  musicInfoNew: {
    flex: 1,
    marginRight: 12,
  },
  musicTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  musicTitleNew: {
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
  },
  musicPlayingBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicPlayingIcon: {
    fontSize: 14,
    color: '#fff',
  },
  musicArtistNew: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  musicMetaNew: {
    flexDirection: 'row',
  },
  musicDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  musicDurationIcon: {
    fontSize: 12,
  },
  musicDurationText: {
    fontSize: 12,
    fontWeight: '700',
  },
  musicPlayButtonNew: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  musicPlayIconNew: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 2,
  },
});

