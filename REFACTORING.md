# Plan de Refactorisation d'App.tsx

## Problème Identifié
Le fichier `App.tsx` contient **14 440 lignes**, ce qui est excessif et pose plusieurs problèmes :
- Performance (chargement/parsing)
- Maintenabilité difficile
- Conflits Git fréquents
- Tests impossibles
- IDE lent

## Structure Cible

```
fayda-mobile/
├── App.tsx (50-100 lignes - point d'entrée uniquement)
├── context/
│   └── AppContext.tsx ✅ (créé)
├── data/
│   ├── tariqaContent.ts ✅ (créé - fonctions HTML)
│   ├── pdfFiles.ts (à créer)
│   ├── audioData.ts (à créer)
│   └── ...
├── screens/
│   ├── HomeScreen.tsx (à créer)
│   ├── BooksScreen.tsx (à créer)
│   ├── MusicScreen.tsx (à créer)
│   └── ... (30+ écrans)
├── components/
│   ├── LanguageSelector.tsx (à créer)
│   ├── DonationBanner.tsx (à créer)
│   └── ...
├── styles/
│   ├── homeStyles.ts (à créer)
│   ├── booksStyles.ts (à créer)
│   └── ...
└── utils/
    └── theme.ts ✅ (créé)
```

## Progrès Actuel

### ✅ Complété
- [x] Structure de dossiers créée
- [x] Fonctions HTML extraites → `data/tariqaContent.ts`
- [x] Thèmes extraits → `utils/theme.ts`
- [x] Contexte créé → `context/AppContext.tsx`

### ⏳ À Faire

#### 1. Données (lignes ~520-1620)
- [ ] Extraire `continueData`, `audiobooks`, `coranTracks`
- [ ] Extraire `zikrTracks`, `zikrFiles`, `musicTracks`
- [ ] Extraire `podcasts`, `courses`, `ebooks`
- [ ] Extraire `pdfFiles` (toutes les variantes)

#### 2. Composants Réutilisables (lignes ~1705-1767)
- [ ] `LanguageSelector` → `components/LanguageSelector.tsx`
- [ ] `LanguageSelectorBar` → `components/LanguageSelectorBar.tsx`

#### 3. Écrans (lignes ~1769-8596)
- [ ] `HomeScreen` (ligne 1769)
- [ ] `BooksScreen` (ligne 2895)
- [ ] `MusicScreen` (ligne 3731)
- [ ] `ZikrScreen` (ligne 3924)
- [ ] `CoranScreen` (ligne 4461)
- [ ] `GamouScreen` (ligne 5025)
- [ ] `PodcastsScreen` (ligne 5542)
- [ ] `LibraryScreen` (ligne 6186)
- [ ] `PodcastPlayerScreen` (ligne 6437)
- [ ] `PDFReaderScreen` (ligne 6764)
- [ ] `AudioPlayerScreen` (ligne 7066)
- [ ] `VideoPlayerScreen` (ligne 7994)
- [ ] `AIScreen` (ligne 8086)
- [ ] `OnboardingScreen` (ligne 8344)
- [ ] `LoadingScreen` (ligne 8599)
- [ ] `MainTabs` (ligne 8465)
- [ ] Composants modaux (DonationBanner, DonationModal, MiniPlayerModal)

#### 4. Styles (lignes ~8726-14439)
- [ ] Séparer les styles par écran/composant
- [ ] Créer fichiers de styles individuels

#### 5. App.tsx Final
- [ ] Réduire à ~50-100 lignes (imports + navigation principale)

## Notes

- Chaque écran fait entre 100-1000+ lignes
- Les styles font ~5700 lignes
- Les données font ~1100 lignes
- **Estimation totale : ~40-50 fichiers à créer**

## Recommandations

1. **Approche progressive** : Extraire un écran/composant à la fois
2. **Tests** : Tester après chaque extraction
3. **Git** : Commiter après chaque section extraite
4. **Priorité** : Commencer par les sections les plus volumineuses


