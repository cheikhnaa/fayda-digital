import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Language, setLanguage } from '../translations';
import { lightTheme, darkTheme } from '../utils/theme';

// Sélecteur de langue compact
export function LanguageSelector() {
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

// Nouveau sélecteur de langue avec barre horizontale
export function LanguageSelectorBar() {
  const { language, setLang, darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  
  const languages = [
    { code: null as Language | null, label: 'Tous' },
    { code: 'en' as Language, label: 'English' },
    { code: 'ar' as Language, label: 'عربي' },
    { code: 'fr' as Language, label: 'French' },
  ];

  return (
    <View style={styles.languageBarContainer}>
      <View style={[styles.languageBar, { backgroundColor: theme.surface }]}>
        {languages.map((lang, index) => (
          <React.Fragment key={lang.code || 'all'}>
            {index > 0 && <View style={[styles.languageBarSeparator, { backgroundColor: theme.textSecondary + '30' }]} />}
            <TouchableOpacity
              style={[
                styles.languageBarItem,
                language === lang.code && styles.languageBarItemActive
              ]}
              onPress={() => {
                setLang(lang.code);
                if (lang.code) {
                  setLanguage(lang.code);
                }
              }}
            >
              <Text style={[
                styles.languageBarText,
                { color: language === lang.code ? theme.text : theme.textSecondary },
                language === lang.code && styles.languageBarTextActive
              ]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

// Styles - Note: Ces styles devront être déplacés vers styles/ plus tard
const styles = StyleSheet.create({
  langSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  langBtnActive: {
    backgroundColor: '#0F5132',
  },
  langFlag: {
    fontSize: 20,
  },
  languageBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  languageBar: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  languageBarItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  languageBarItemActive: {
    backgroundColor: 'rgba(15, 81, 50, 0.1)',
    borderRadius: 6,
  },
  languageBarSeparator: {
    width: 1,
    marginVertical: 4,
  },
  languageBarText: {
    fontSize: 14,
    fontWeight: '500',
  },
  languageBarTextActive: {
    fontWeight: 'bold',
  },
});

