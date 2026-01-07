import * as React from 'react';
import { Language } from '../translations';

// Type du contexte de l'application
export interface AppContextType {
  language: Language | null;
  setLang: (lang: Language | null) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentPlayer: { item: any; type: 'music' | 'podcast' | 'book' | 'zikr' | 'coran' | null } | null;
  setCurrentPlayer: (player: { item: any; type: 'music' | 'podcast' | 'book' | 'zikr' | 'coran' | null } | null) => void;
  audioState: { isPlaying: boolean; position: number; duration: number } | null;
  setAudioState: (state: { isPlaying: boolean; position: number; duration: number } | null) => void;
  currentRoute: string | null;
  setCurrentRoute: (route: string | null) => void;
  recentItems: Array<{id: number, type: 'pdf' | 'audio', title: string, titleAr?: string, timestamp: number, item: any}>;
  addToHistory: (item: any, type: 'pdf' | 'audio') => void;
  showDonationBanner: boolean;
  setShowDonationBanner: (show: boolean) => void;
}

export const AppContext = React.createContext<AppContextType>({ 
  language: null, 
  setLang: () => {},
  darkMode: false,
  setDarkMode: () => {},
  currentPlayer: null,
  setCurrentPlayer: () => {},
  audioState: null,
  setAudioState: () => {},
  currentRoute: null,
  setCurrentRoute: () => {},
  recentItems: [],
  addToHistory: () => {},
  showDonationBanner: true,
  setShowDonationBanner: () => {}
});

