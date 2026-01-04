// Cache global pour les nombres de pages
export const pdfPageCountCache: Record<number, number> = {};

/**
 * Composant PdfPageCounter - Désactivé pour Expo Go
 * 
 * NOTE: Ce composant nécessite react-native-pdf qui n'est pas supporté dans Expo Go.
 * Pour l'utiliser, vous devez créer un développement build.
 * 
 * Voir README-PDF-PAGES.md pour plus d'informations.
 */

// Composant désactivé - retourne null pour éviter les erreurs dans Expo Go
export const PdfPageCounter = () => null;
