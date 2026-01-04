// Mapping des IDs aux nombres de pages réels des PDF
// Ce mapping est mis à jour dynamiquement par le composant PdfPageCounter qui utilise react-native-pdf
// Les valeurs par défaut sont utilisées jusqu'à ce que les vraies valeurs soient chargées
export const pdfPages: Record<number, number> = {
  100: 120, // Azal Thierno Hassen Dem
  101: 200, // Diawahir al Mahani
  102: 150, // Nour al Kamal fi Mashhad ar-Rijal
  103: 180, // Miftah al-Wusul
  104: 604, // Arabic Quran
  105: 250, // Baye Niass - Un Père du Panafricanisme
  106: 180, // Afakhou Shiria
  107: 200, // Rouhul Adab
  108: 400, // The Divine Flood
  109: 150, // The Hajj Experiences of Shaykh Ibrahim Niasse
  110: 100, // Congratulations to Ibrahim
  111: 200, // Rihlatul Murtaniyya
  112: 180, // Sairul Qalbi
  113: 200, // Kashf al-Bas
  114: 180, // Lettres Précieuses
  
  // frenchPdfFiles
  200: 250, // Baye Niass - Un Père du Panafricanisme (français)
  201: 200, // Diawahir al Mahani (français)
  202: 200, // Rouhul Adab (français)
  203: 200, // Kashf al-Bas (français)
  204: 180, // Lettres Précieuses (français)
  
  // englishPdfFiles
  300: 100, // Congratulations to Ibrahim (anglais)
  301: 150, // The Hajj Experiences of Shaykh Ibrahim Niasse (anglais)
  302: 400, // The Divine Flood (anglais)
  
  // arabicPdfFiles
  400: 120, // Azal Thierno Hassen Dem (arabe)
  401: 200, // Diawahir al Mahani (arabe)
  402: 150, // Nour al Kamal fi Mashhad ar-Rijal (arabe)
  403: 180, // Miftah al-Wusul (arabe)
  405: 180, // Boughiyat
  406: 170, // Kachf al-Hijab
  407: 180, // Afakhou Shiria (arabe)
  408: 150, // The Hajj Experiences of Shaykh Ibrahim Niasse (arabe)
  409: 100, // Congratulations to Ibrahim (arabe)
  410: 200, // Rihlatul Murtaniyya (arabe)
  411: 180, // Sairul Qalbi (arabe)
};

