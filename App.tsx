import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import { useAudioPlayer } from 'expo-audio';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Image, ImageBackground, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { pdfPages } from './pdfPages';
import { Message, sendMessageToAI } from './services/aiService';
import { transcribeAudio } from './services/audioService';
import { Language, setLanguage, t } from './translations';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Contenu HTML pour chaque article Tariqa séparément
const getIntroductionTariqaHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Introduction à la Tariqa Tijaniyya</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0F5132; }
        h1 { color: #0F5132; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0F5132; border-radius: 8px; }
        .article h2 { color: #0F5132; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .quote { background: linear-gradient(135deg, #0F5132 0%, #0B3C5D 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; font-size: 1.15em; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .highlight { background: #fff9e6; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0F5132; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Introduction à la Tariqa Tijaniyya</h1>
        </div>
        <div class="article">
            <p>La <span class="highlight">Tariqa Tijaniyya</span> est une voie spirituelle soufie fondée par <span class="highlight">Cheikh Ahmed Tijani</span> (1737-1815) à Fès, au Maroc. Cette voie représente l'une des plus importantes confréries soufies du monde islamique, particulièrement influente en Afrique de l'Ouest.</p>
            <div class="quote">"La Tariqa Tijaniyya est une voie de proximité avec Allah et Son Messager, une voie de purification du cœur et d'élévation de l'âme."</div>
            <p>Le Cheikh Ahmed Tijani reçut ses enseignements directement du Prophète Muhammad (paix et bénédictions sur lui) dans un état d'éveil, ce qui confère à cette voie une particularité unique parmi les confréries soufies.</p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

const getZikrTariqaHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Le Zikr dans la Voie Tijaniyya</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0F5132; }
        h1 { color: #0F5132; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0F5132; border-radius: 8px; }
        .article h2 { color: #0F5132; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .highlight { background: #fff9e6; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0F5132; }
        .arabic { direction: rtl; text-align: right; font-family: 'Arial', sans-serif; font-size: 1.2em; color: #0B3C5D; margin: 10px 0; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Le Zikr dans la Voie Tijaniyya</h1>
        </div>
        <div class="article">
            <p>Le <span class="highlight">Zikr</span> occupe une place centrale dans la pratique de la Tariqa Tijaniyya. Il s'agit de la répétition des noms d'Allah et des invocations spécifiques qui purifient le cœur et rapprochent le disciple de son Seigneur.</p>
            <div class="arabic">"واذكر ربك في نفسك تضرعا وخيفة ودون الجهر من القول"</div>
            <p>"Et invoque ton Seigneur en toi-même, en humilité et crainte, à voix basse, le matin et le soir" (Coran 7:205).</p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

const getSalatFatihHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La Salat al-Fatih</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0F5132; }
        h1 { color: #0F5132; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0F5132; border-radius: 8px; }
        .article h2 { color: #0F5132; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .highlight { background: #fff9e6; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0F5132; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>La Salat al-Fatih</h1>
        </div>
        <div class="article">
            <p>La <span class="highlight">Salat al-Fatih</span> est une prière spéciale récitée dans la Tariqa Tijaniyya. Elle est considérée comme ayant une valeur spirituelle immense, équivalente à des milliers de récitations du Coran selon les enseignements du Cheikh.</p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

const getAttachementPropheteHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>L'Attachement au Prophète</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0F5132; }
        h1 { color: #0F5132; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0F5132; border-radius: 8px; }
        .article h2 { color: #0F5132; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .highlight { background: #fff9e6; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0F5132; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>L'Attachement au Prophète</h1>
        </div>
        <div class="article">
            <p>La Tariqa Tijaniyya met un accent particulier sur l'amour et l'attachement au Prophète Muhammad (paix et bénédictions sur lui). Cette relation spirituelle est considérée comme essentielle pour progresser sur la voie.</p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

const getDouaWazifaHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doua Wazifa</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0F5132; }
        h1 { color: #0F5132; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0F5132; border-radius: 8px; }
        .article h2 { color: #0F5132; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Doua Wazifa</h1>
        </div>
        <div class="article">
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma antal awwalou falaÏssa khablaka chaÏ-oune<br>
                Wa antal aakhirou falaÏssa bahdaka chaÏ-oune<br>
                Wa antaz zaahirou falaïssa fawkhaka chaï-oune<br>
                Wa antal baatinou falaïssa dounaka chaï-oune
            </div>
            <p><strong>Oh Dieu, Tu es le Premier et tu n'y trouvas rien. Tu es le Dernier, et tu n'y laisseras rien. Tu es l'Apparent et rien te voile. Tu es le tout le Caché</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Fakoune lanaa yaa awwalou yaa aakhirou yaa zaahirou yaa<br>
                Baatinou waliyane wanaciirane anta waliyounaa wa mawlaanaa<br>
                Fanihmal mawlaa wa nihman nacirou
            </div>
            <p><strong>Sois pour nous, Oh Toi le Premier, le Dernier, l'Apparent, le Caché, un Ami et un Secours. Tu es notre Seigneur, et quel meilleur Seigneur, quel meilleur Secours!</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma innaa nas-alouka bifaatihiyatil faatihi alfat –ha<br>
                Ataama wabi khaatimiyatil khaatimi housnal khitaam
            </div>
            <p><strong>Oh Dieu, nous te demandons, par la clé de l'Ouverture (Mouhammad, psl), la grande ouverture; et par le caractère fermé de la fermeture (Mouhammad), une beau devenir et une belle fin.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma innaa nas-alouka minal khaïri koullihii handjilihii wa hadjilihii maa<br>
                halimnaa minehou wamaa lame nahlame ;<br>
                Wanahounzou bika mina charri koullihii handjilihii wa hadjilihii maa halimnaa minehou<br>
                wamaa lame nahlame
            </div>
            <p><strong>Oh Dieu, Nous te demandons des tous tes bienfaits, à nous connus ou inconnus. Nous nous protégeons en toi contres tous les maux, à nous connus ou inconnus.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma innaa nas-aloukal diannata wamaa kharraba ilaïhaa mine khawline wa<br>
                hamaline Wanahouzou bika minan naari wamaa kharraba ilaïhaa mine khawline wa<br>
                hamaline
            </div>
            <p><strong>Oh Dieu, nous Te demandons le paradis ainsi que les actes et les paroles qui en rapprochent. Nous nous protégeons en Toi contre l'enfer ainsi que des actes et paroles qui en rapprochent.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma innaa nas-aloukal hafwa wal haafiyata wal mouhaafata<br>
                Addaa-imata fid diini wad dounyaa wal aakhirati
            </div>
            <p><strong>Oh Dieu, nous Te demandons le pardon, la santé et la protection, dans la religion, dans ce bas monde et dans l'au-delà.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma inna nas-alouka ridaaka wa ridaa nabiyyika Seydina Muhammadin çalla<br>
                llahu aleyhi wa sallama wa ridal ach-yaakhi wa ridal waalidaïni
            </div>
            <p><strong>Oh Dieu, nous te demandons Ton agrément, celui des maîtres et des parents.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma idjhal maa nouhibbou fiimaa touhibbou watardaa<br>
                Allahoumma idjhal fikh tiyaarika ikhtiyaaranaa walaa tadjhal illaa ilaîka idtiraaranaa
            </div>
            <p><strong>Oh Dieu, fais que nous aimions ce que Tu aimes. Mets ton choix dans le nôtre. Fais que nous n'ayons besoin que de Toi.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Yaa rabbanaa yaa khaalikhal hawaalimi ; houl baïnanaa wabaïna koulli zaalimi.<br>
                Wadjzi likoulli mane ilaïnaa ahsanaa ; wa diaaziihi hannaal diazaa al ahsanaa
            </div>
            <p><strong>Oh Dieu, Toi qui a crée les mondes, interpose- Toi entre nous et tout Prédicateur. Récompense celui qui nous fait du bien, de la meilleure façon.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma irfah hannal diahda wal diouhan wal hourya wakchif hannaa i minal<br>
                balaa– i maalaa yakchifouhou khaïrouka
            </div>
            <p><strong>Oh Dieu, éloigne nous des dures conditions de vie, de la faim et de la nudité. Eloigne de nous les épreuves, dont Tu es le seul à pouvoir alléger.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma faridje hane oummati sayyidinaa mouhammadine. (s.a.w) 3 fois
            </div>
            <p><strong>Oh Seigneur, répand ta grâce et ta paix sur la communauté de notre Maitre Muhammad. (SAS) 3 fois</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbana atina fid dounya hassanatan wafil aakhirati hassanatane wakhinaa hazaaban<br>
                naari
            </div>
            <p><strong>(C.2.201) Seigneur donne-nous une belle part ici-bas, une belle part aussi dans l'au-delà; et garde nous du châtiment de l'enfer.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbanaa laa tou - aakhiznaa ine naciynaa aw akhtahnaa. Rabbanaa walaa tahmil<br>
                halaïnaa israne kamaa hamaltahou halal laziina mine khablinaa<br>
                Rabbanaa walaa touhammilnaa maa laataakhata lanaa bihii wahfou hannaa wakhfir<br>
                lanaa warham naa anta mawlaanaa fansournaa halal khawmil kaafiriina
            </div>
            <p><strong>(C.2.286) Seigneur, ne T'en prends pas à nous s'il nous arrive d'oublier, ou de commettre l'erreur. Seigneur! Ne nous charge pas d'un fardeau lourd comme Tu as chargé ceux qui furent avant nous. Seigneur! Et ne nous impose pas ce pour quoi nous n'avons point de force. Et donne-nous absolution et donne-nous pardon et aie pour nous miséricorde. Tu es notre patron : donne-nous donc secours contre le peuple mécréant.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbanaa laa touzikh khouloubanaa bahda iz hadaïtanaa wa hab lanaa mine ladounka<br>
                rahmatane innaka antal wah haabou
            </div>
            <p><strong>Seigneur, ne fais pas dévier nos cœurs après que Tu nous as guidés; et donne nous miséricorde de Ta part. Tu es, Toi, le grand donateur.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbanaa innanaa samihnaa mounaadiyane younaadii lil iimaani an aaminou<br>
                birabbikoume fa aamannaa.<br>
                Rabbanaa fakhfir lanaa zounoubanaa wakaffir hannaa seyyi – aatinaa watawaf fanaa<br>
                mahal abraari
            </div>
            <p><strong>(C3.193) Seigneur ! Oui, nous avons entendu un héraut appeler ainsi à la foi : "Croyez en votre Seigneur!" Et nous avons cru. Seigneur pardonne nous donc nos péchés, efface de nous nos méfaits, et fais-nous achever la vie en compagnie de charitables.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbanaa wa aatinaa maa wahattanaa halaa roussoulika walaa toukhziinaa yawmal<br>
                khiyaamati innaka laa toukhlifoul miihaad
            </div>
            <p><strong>(C3.194) Seigneur! Et donne-nous ce que Tu as promis par Tes messagers; et ne nous couvre pas d'ignominie au jour de la Résurrection. En vérité, Tu ne manques pas au rendez-vous.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbanaa zalamnaa anfousanaa wa – ine lame takhfirlanaa watarhamnaa<br>
                lanakounanna minal khaciriina
            </div>
            <p><strong>(C7.23) Ô Seigneur, nous nous sommes manqué à nous mêmes. Et si Tu ne nous pardonne pas et ne nous fais pas miséricorde, alors nous serons très certainement du nombre des perdants.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbanaa aatinaa mine ladounka rahmatane wa hayyih lanaa mine amrinaa rach<br>
                chadane
            </div>
            <p><strong>(C18.10) Seigneur, apporte-nous de Ta part une miséricorde; et arrange-nous une bonne conduite de notre affaire.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Rabbanaa hablanaa mine azwaadjinaa wazouriya tinaa khourrata ah – younine<br>
                wadjhalnaa lilmouttakhiina imaamane
            </div>
            <p><strong>(C25.74) Seigneur, donne-nous, en nos épouses et nos descendants, fraîcheur des yeux, et assigne-nous pour dirigeants aux pieux.</strong></p>
            
            <div style="margin-top: 20px; margin-bottom: 15px; font-style: italic; font-size: 1.1em; color: #0B3C5D;">
                Allahoumma ikhfir lihayyinaa wa mayyitinaa wa kabiirinaa wa sakhiirinaa wa zakarinaa<br>
                wa ounsaanaa wa haadirinaa wa khaa- ibinaa wa hourrinaa wa habdinaa wa taahi-i-naa<br>
                wa hansinaa. (SALATOUL FATIHA)
            </div>
            <p><strong>Oh Dieu, pardonne à nos frères et sœurs, vivants ou nos morts, âgées ou jeunes, hommes ou femmes, présents ou absents, obéissants ou non. (SALATOUL FATIHA)</strong></p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

// Contenu HTML pour chaque article Ma'arifa séparément
const getConnaissanceSpirituelleHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La Connaissance Spirituelle</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0B3C5D; }
        h1 { color: #0B3C5D; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0B3C5D; border-radius: 8px; }
        .article h2 { color: #0B3C5D; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .quote { background: linear-gradient(135deg, #0B3C5D 0%, #0F5132 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; font-size: 1.15em; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .highlight { background: #e6f3ff; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0B3C5D; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>La Connaissance Spirituelle</h1>
        </div>
        <div class="article">
            <h2>Qu'est-ce que la Ma'arifa ?</h2>
            <p>La <span class="highlight">Ma'arifa</span> (المعرفة) désigne la connaissance spirituelle directe, la gnose divine qui transcende la simple compréhension intellectuelle. C'est une connaissance du cœur, une illumination qui vient d'Allah.</p>
            <div class="quote">"La connaissance véritable n'est pas celle que l'on acquiert par l'étude, mais celle qu'Allah dépose dans le cœur de Ses serviteurs."</div>
            <p>Dans la tradition soufie, la Ma'arifa est considérée comme le sommet de la connaissance spirituelle, accessible uniquement à ceux qui ont purifié leur cœur et se sont rapprochés d'Allah.</p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

const getDegresConnaissanceHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Les Degrés de la Connaissance</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0B3C5D; }
        h1 { color: #0B3C5D; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0B3C5D; border-radius: 8px; }
        .article h2 { color: #0B3C5D; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article h3 { color: #0F5132; font-size: 1.3em; margin-top: 20px; margin-bottom: 10px; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .highlight { background: #e6f3ff; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0B3C5D; }
        .arabic { direction: rtl; text-align: right; font-family: 'Arial', sans-serif; font-size: 1.2em; color: #0F5132; margin: 10px 0; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Les Degrés de la Connaissance</h1>
        </div>
        <div class="article">
            <h2>Les Degrés de la Connaissance</h2>
            <h3>1. 'Ilm (La Science)</h3>
            <p>Le premier degré est la <span class="highlight">science</span> ('ilm), qui est la connaissance acquise par l'étude et l'apprentissage. C'est la base nécessaire, mais insuffisante à elle seule.</p>
            <h3>2. Fahm (La Compréhension)</h3>
            <p>Le second degré est la <span class="highlight">compréhension</span> (fahm), qui va au-delà de la simple mémorisation. C'est la capacité à saisir le sens profond des enseignements.</p>
            <h3>3. Ma'arifa (La Gnose)</h3>
            <p>Le troisième degré est la <span class="highlight">Ma'arifa</span> elle-même, la connaissance directe et intuitive qui vient d'Allah. Cette connaissance ne s'acquiert pas par l'effort, mais est un don divin.</p>
            <div class="arabic">"وَعَلَّمَ آدَمَ الأَسْمَاء كُلَّهَا"</div>
            <p>"Et Il apprit à Adam tous les noms" (Coran 2:31). Cette connaissance directe est celle qu'Allah accorde à Ses serviteurs privilégiés.</p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

const getMaarifaTariqaHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La Ma'arifa dans la Tariqa Tijaniyya</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0B3C5D; }
        h1 { color: #0B3C5D; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0B3C5D; border-radius: 8px; }
        .article h2 { color: #0B3C5D; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .highlight { background: #e6f3ff; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0B3C5D; }
        ul { margin-left: 30px; margin-top: 15px; }
        li { margin-bottom: 10px; }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>La Ma'arifa dans la Tariqa Tijaniyya</h1>
        </div>
        <div class="article">
            <h2>La Ma'arifa dans la Tariqa Tijaniyya</h2>
            <p>Dans la <span class="highlight">Tariqa Tijaniyya</span>, la Ma'arifa est particulièrement valorisée. Le Cheikh Ahmed Tijani enseignait que la vraie connaissance spirituelle vient de la proximité avec le Prophète Muhammad (paix et bénédictions sur lui).</p>
            <p>Les disciples de la voie cherchent cette connaissance à travers :</p>
            <ul>
                <li>Le Zikr constant et assidu</li>
                <li>L'amour et l'attachement au Prophète</li>
                <li>La purification du cœur</li>
                <li>L'obéissance au guide spirituel</li>
                <li>La méditation et la contemplation</li>
            </ul>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

const getCheminGnoseHTML = () => `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Le Chemin vers la Gnose</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background: linear-gradient(135deg, #f8f6f0 0%, #e8e5df 100%); padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0B3C5D; }
        h1 { color: #0B3C5D; font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
        .article { margin-bottom: 50px; padding: 30px; background: #fafafa; border-left: 5px solid #0B3C5D; border-radius: 8px; }
        .article h2 { color: #0B3C5D; font-size: 1.8em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #C9A24D; }
        .article h3 { color: #0F5132; font-size: 1.3em; margin-top: 20px; margin-bottom: 10px; }
        .article p { margin-bottom: 15px; text-align: justify; font-size: 1.1em; }
        .highlight { background: #e6f3ff; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0B3C5D; }
        .quote { background: linear-gradient(135deg, #0B3C5D 0%, #0F5132 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; font-size: 1.15em; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Le Chemin vers la Gnose</h1>
        </div>
        <div class="article">
            <p>Le chemin vers la <span class="highlight">Ma'arifa</span> (la gnose) est un voyage spirituel profond qui nécessite persévérance, sincérité et guidance. Ce cheminement vers la connaissance divine requiert plusieurs étapes et qualités essentielles.</p>
            
            <h3>1. La Sincérité (Ikhlas)</h3>
            <p>La première étape est la <span class="highlight">sincérité</span> dans l'intention. Toute recherche spirituelle doit être motivée uniquement par le désir de se rapprocher d'Allah, sans recherche de renommée ou de reconnaissance.</p>
            
            <h3>2. La Purification du Cœur (Tazkiya an-Nafs)</h3>
            <p>Le cœur doit être purifié des mauvaises qualités comme l'orgueil, l'envie, la colère et l'attachement excessif aux biens matériels. Cette purification se fait à travers le Zikr, la repentance et l'obéissance.</p>
            
            <h3>3. L'Attachement au Guide Spirituel</h3>
            <p>Un guide spirituel authentique est essentiel pour progresser sur ce chemin. Il transmet la baraka (bénédiction) et guide le disciple à travers les différentes stations spirituelles.</p>
            
            <h3>4. La Pratique Assidue du Zikr</h3>
            <p>Le Zikr constant purifie le cœur et ouvre les portes de la connaissance spirituelle. C'est par la répétition des noms d'Allah que le cœur s'illumine.</p>
            
            <h3>5. L'Amour du Prophète</h3>
            <p>L'amour et l'attachement au Prophète Muhammad (paix et bénédictions sur lui) sont fondamentaux. C'est par lui que la lumière de la connaissance divine se répand sur les cœurs.</p>
            
            <div class="quote">"Celui qui suit un chemin sans guide, son guide est Satan. Celui qui suit un chemin avec un guide, son guide est le Prophète."</div>
            
            <p>Le chemin vers la gnose est une grâce d'Allah qui se mérite par la sincérité, l'effort spirituel et l'amour du Prophète. C'est un don divin accordé à ceux qui purifient leur cœur et suivent la voie avec persévérance.</p>
        </div>
        <div class="footer">
            <p>Que la paix et les bénédictions d'Allah soient sur notre maître Muhammad, sa famille et ses compagnons.</p>
            <p style="margin-top: 10px;">© Fayda Tidianiya - Sagesse & Spiritualité</p>
        </div>
    </div>
</body>
</html>`;

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

// Fichiers Zikr depuis le dossier assets/zikr
const zikrFiles = [
  { 
    id: 2, 
    title: 'Secrets of Ziyara Rihla (2024)', 
    titleAr: 'أسرار الزيارة',
    subtitle: 'Secrets of Ziyara Soundtrack',
    description: 'This Rihla drew us into an unending journey of divine presence, where we felt the closeness of the beloved Prophet and the saints.',
    duration: null,
    tracks: '4 tracks',
    file: require('./assets/zikr/babacar-thiam-zikr-4.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 3, 
    title: 'Shaykh Muhammad Sha\'ban', 
    titleAr: 'الشيخ محمد شعبان',
    subtitle: 'Qasidat al-Burdah (Poem - قصيدة البردة of the Mantle)',
    description: 'The Burdah Qasida, formally known as Qasidat al-Burdah, is one of the most celebrated poems in praise of the Prophet Muhammad.',
    duration: '58:14',
    tracks: null,
    file: require('./assets/zikr/gamou-babacar-thiam-1.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 4, 
    title: 'Gamou Babacar Thiam 1', 
    titleAr: 'جامع بابكر تيام 1',
    subtitle: 'Zikr Collection',
    description: 'A collection of beautiful Zikr recitations from Gamou celebrations.',
    duration: '12:30',
    tracks: null,
    file: require('./assets/zikr/gamou-babacar-thiam-1.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 5, 
    title: 'Gamou Babacar Thiam 3', 
    titleAr: 'جامع بابكر تيام 3',
    subtitle: 'Zikr Collection',
    description: 'A collection of beautiful Zikr recitations from Gamou celebrations.',
    duration: '15:20',
    tracks: null,
    file: require('./assets/zikr/gamou-babacar-thiam-3.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 6, 
    title: 'Gamou Babacar Thiam 4', 
    titleAr: 'جامع بابكر تيام 4',
    subtitle: 'Zikr Collection',
    description: 'A collection of beautiful Zikr recitations from Gamou celebrations.',
    duration: '18:45',
    tracks: null,
    file: require('./assets/zikr/gamou-babacar-thiam-4.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 7, 
    title: 'Gamou Babacar Thiam 5', 
    titleAr: 'جامع بابكر تيام 5',
    subtitle: 'Zikr Collection',
    description: 'A collection of beautiful Zikr recitations from Gamou celebrations.',
    duration: '14:10',
    tracks: null,
    file: require('./assets/zikr/gamou-babacar-thiam-5.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 8, 
    title: 'Gamou Babacar Thiam 6', 
    titleAr: 'جامع بابكر تيام 6',
    subtitle: 'Zikr Collection',
    description: 'A collection of beautiful Zikr recitations from Gamou celebrations.',
    duration: '16:25',
    tracks: null,
    file: require('./assets/zikr/gamou-babacar-thiam-6.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 9, 
    title: 'Maouloud 2008 Zikr 1', 
    titleAr: 'مولود 2008 ذكر 1',
    subtitle: 'Maouloud Celebration',
    description: 'Beautiful Zikr from the Maouloud celebration of 2008.',
    duration: '20:00',
    tracks: null,
    file: require('./assets/zikr/maouloud-2008-zikr-1.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 10, 
    title: 'Maouloud 2008 Zikr 2', 
    titleAr: 'مولود 2008 ذكر 2',
    subtitle: 'Maouloud Celebration',
    description: 'Beautiful Zikr from the Maouloud celebration of 2008.',
    duration: '22:15',
    tracks: null,
    file: require('./assets/zikr/maouloud-2008-zikr-2.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 11, 
    title: 'Babacar Thiam Zikr 3', 
    titleAr: 'بابكر تيام ذكر 3',
    subtitle: 'Zikr Collection',
    description: 'A beautiful Zikr recitation by Babacar Thiam.',
    duration: '11:40',
    tracks: null,
    file: require('./assets/zikr/babacar-thiam-zikr-3.mp3'),
    image: require('./assets/thierno.png'),
  },
  { 
    id: 12, 
    title: 'Babacar Thiam Zikr 4', 
    titleAr: 'بابكر تيام ذكر 4',
    subtitle: 'Zikr Collection',
    description: 'A beautiful Zikr recitation by Babacar Thiam.',
    duration: '13:50',
    tracks: null,
    file: require('./assets/zikr/babacar-thiam-zikr-4.mp3'),
    image: require('./assets/thierno.png'),
  },
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

// Podcasts avec design inspiré de l'image - Basé sur les fichiers du dossier podcasts
// Note: Les fichiers audio sont chargés dynamiquement via getPodcastFile() pour éviter les problèmes de bundling avec les gros fichiers
const podcasts = [
  { 
    id: 1, 
    title: 'WAKHTANU THIERNO ASSANE DEME CI TARBIYA ILALAH', 
    titleAr: 'أرشيف صوتي - وختنو ثيرنو آسان ديم في التربية الإلهية',
    subtitle: 'Archive audio - Wakhtanu Thierno Assane Deme',
    host: 'Thierno Assane Deme', 
    episodes: 1, 
    subscribers: 0, 
    subscribed: false,
    duration: '00:00',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    image: require('./assets/pdf/cover/pod1.png'),
    modalImage: require('./assets/pdf/cover/coverpod1.png'),
    description: 'Archive audio de Wakhtanu Thierno Assane Deme sur la Tarbiya Ilalah (Éducation divine).',
    locked: false,
    episodeType: 'Archive',
    fileName: 'wakhtanu_tarbiya.mp3',
  },
  { 
    id: 2, 
    title: 'Qu\'est ce que la wazifa d\'un Arif Bilah par Cheikh Assane Dème', 
    titleAr: 'ما هي وظيفة العارف بالله للشيخ آسان ديم',
    subtitle: 'La wazifa d\'un Arif Bilah',
    host: 'Cheikh Assane Dème', 
    episodes: 1, 
    subscribers: 0, 
    subscribed: false,
    duration: '00:00',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    image: require('./assets/pdf/cover/pod2.png'),
    modalImage: require('./assets/pdf/cover/coverpod2.png'),
    description: 'Explication de la wazifa d\'un Arif Bilah (Celui qui connaît Allah) par Cheikh Assane Dème.',
    locked: false,
    episodeType: 'Enseignement',
    fileName: 'wazifa-arif-bilah-cheikh-assane-deme.mp3',
  },
  { 
    id: 3, 
    title: 'Waxtanou Cheikh Thierno Assane Dème', 
    titleAr: 'وختنو الشيخ ثيرنو آسان ديم',
    subtitle: 'Paroles du Cheikh Thierno Assane Dème',
    host: 'Cheikh Thierno Assane Dème', 
    episodes: 1, 
    subscribers: 0, 
    subscribed: false,
    duration: '00:00',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    image: require('./assets/pdf/cover/pod3.png'),
    modalImage: require('./assets/pdf/cover/coverpod3.png'),
    description: 'Paroles et enseignements du Cheikh Thierno Assane Dème.',
    locked: false,
    episodeType: 'Enseignement',
    fileName: 'waxtanou-cheikh-thierno-assane-deme-ra.mp3',
  },
];

// Fonction helper pour obtenir le fichier audio d'un podcast
const getPodcastFile = (fileName: string) => {
  const podcastFiles: { [key: string]: any } = {
    'wakhtanu-thierno-assane-deme-tarbiya-ilalah.mp3': require('./assets/podcasts/wakhtanu_tarbiya.mp3'),
    'wakhtanu_tarbiya.mp3': require('./assets/podcasts/wakhtanu_tarbiya.mp3'),
    'wazifa-arif-bilah-cheikh-assane-deme.mp3': require('./assets/podcasts/wazifa-arif-bilah-cheikh-assane-deme.mp3'),
    'waxtanou-cheikh-thierno-assane-deme-ra.mp3': require('./assets/podcasts/waxtanou-cheikh-thierno-assane-deme-ra.mp3'),
  };
  return podcastFiles[fileName] || require('./assets/audio/audio.mp3');
};

// Gamou items - Basé uniquement sur les fichiers du dossier assets/gamou
const gamouItems = [
  { 
    id: 1001, 
    title: 'Gamou Cheikh Ibrahima Niass 1966', 
    titleAr: 'المولد الشيخ إبراهيم نياس 1966',
    subtitle: 'Célébration Gamou',
    host: 'Cheikh Ibrahima Niass', 
    episodes: 1, 
    subscribers: 0, 
    subscribed: false,
    duration: '00:00',
    date: '1966',
    image: require('./assets/pdf/cover/g1966.png'),
    modalImage: require('./assets/pdf/cover/covg1.png'),
    description: 'Archive audio historique du Gamou de 1966 avec Cheikh Ibrahima Niass.',
    locked: false,
    episodeType: 'Archive historique',
    fileName: 'Gamou-cheikh-ibrahima-niass-1966.mp3',
  },
  { 
    id: 1002, 
    title: 'Gamou Cheikh Ibrahima Niass 1968', 
    titleAr: 'المولد الشيخ إبراهيم نياس 1968',
    subtitle: 'Célébration Gamou',
    host: 'Cheikh Ibrahima Niass', 
    episodes: 1, 
    subscribers: 0, 
    subscribed: false,
    duration: '00:00',
    date: '1968',
    image: require('./assets/pdf/cover/g1968.png'),
    modalImage: require('./assets/pdf/cover/covg2.png'),
    description: 'Archive audio historique du Gamou de 1968 avec Cheikh Ibrahima Niass.',
    locked: false,
    episodeType: 'Archive historique',
    fileName: 'Gamou-cheikh-ibrahima-niass-1968.mp3',
  },
];

// Fonction helper pour obtenir le fichier audio d'un gamou (uniquement depuis assets/gamou)
const getGamouFile = (fileName: string) => {
  const gamouFiles: { [key: string]: any } = {
    'Gamou-cheikh-ibrahima-niass-1966.mp3': require('./assets/gamou/Gamou-cheikh-ibrahima-niass-1966.mp3'),
    'Gamou-cheikh-ibrahima-niass-1968.mp3': require('./assets/gamou/Gamou-cheikh-ibrahima-niass-1968.mp3'),
  };
  return gamouFiles[fileName] || require('./assets/audio/audio.mp3');
};

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

// Fonction utilitaire pour obtenir le nombre de pages réel depuis le mapping
const getPdfPages = (id: number, defaultPages: number): number => {
  return pdfPages[id] ?? defaultPages;
};

// Fonction pour appliquer les nombres de pages réels à un tableau de livres
const applyPdfPages = <T extends { id: number; pages: number }>(books: T[]): T[] => {
  return books.map(book => ({
    ...book,
    pages: getPdfPages(book.id, book.pages)
  }));
};

// Fichiers PDF depuis le dossier assets/pdf
// Tous les PDFs (racine + tous les sous-dossiers)
const allPdfFiles = [
  {
    id: 100,
    title: 'Azal Thierno Hassen Dem',
    titleAr: 'أزل تيرنو حسن ديم',
    author: 'Thierno Hassane Dème',
    pages: 120,
    cover: '📖',
    pdfFile: require('./assets/pdf/Azal_Thierno_Hassen_Dem.pdf'),
    image: require('./assets/pdf/cover3.png'),
    description: 'Ouvrage spirituel de grande valeur sur la vie et les enseignements de Thierno Hassane Dème.',
    category: 'Biographie',
    rating: 5.0,
    downloads: 5000,
  },
  {
    id: 101,
    title: 'Diawahir al Mahani',
    titleAr: 'جواهر المعاني',
    author: 'Cheikh Ahmed Tijani',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/diawahir_al_mahani.pdf'),
    image: require('./assets/pdf/cover/cheikh.jpeg'),
    description: 'Les perles précieuses - Un ouvrage fondamental de la Tariqa Tijaniyya contenant les enseignements spirituels et les secrets de la voie.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 8000,
  },
  {
    id: 102,
    title: 'Nour al Kamal fi Mashhad ar-Rijal',
    titleAr: 'نور الكمال في مشهد الرجال',
    author: 'Shaykh al-Islam',
    pages: 150,
    cover: '📖',
    pdfFile: require('./assets/pdf/Nour_al_Kamal_fi_Mashhad_ar_Rijal.pdf'),
    image: require('./assets/pdf/cover/cover2.jpeg'),
    description: 'La lumière de la perfection dans la présence des hommes - Ouvrage spirituel de grande importance.',
    category: 'Ma\'arifa',
    rating: 4.9,
    downloads: 6000,
  },
  {
    id: 103,
    title: 'Miftah al-Wusul',
    titleAr: 'مفتاح الوصول',
    author: 'Cheikh Ahmed Tijani',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/miftaakhoul-woussoul.pdf'),
    image: require('./assets/pdf/cover/cover1.png'),
    description: 'La clé de l\'accès - Un ouvrage spirituel fondamental sur les moyens d\'accéder à la proximité divine et aux stations spirituelles élevées.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 7500,
  },
  {
    id: 104,
    title: 'Arabic Quran',
    titleAr: 'القرآن الكريم',
    author: 'Allah',
    pages: 604,
    cover: '📖',
    pdfFile: require('./assets/pdf/Arabic-Quran.pdf'),
    image: require('./assets/pdf/cover/coran.jpg'),
    description: 'Le Saint Coran en arabe - La parole révélée d\'Allah au Prophète Muhammad (paix et bénédictions sur lui).',
    category: 'Coran',
    rating: 5.0,
    downloads: 50000,
  },
  {
    id: 105,
    title: 'Baye Niass - Un Père du Panafricanisme',
    titleAr: 'باي نياس - أب الوحدة الأفريقية',
    author: 'Niane Babacar',
    pages: 250,
    cover: '📖',
    pdfFile: require('./assets/pdf/baye-niasse-un-pere-du-panafricanisme-et-figure-niane-babacar-2020.pdf'),
    image: require('./assets/pdf/cover/afrique.png'),
    description: 'Biographie de Cheikh Ibrahim Niass, figure emblématique du panafricanisme et maître spirituel de la Tariqa Tijaniyya.',
    category: 'Biographie',
    rating: 5.0,
    downloads: 12000,
  },
  {
    id: 106,
    title: 'Afakhou Shiria',
    titleAr: 'أفاخو شريعة',
    author: 'Cheikh Ibrahim Niass',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/Afakhou-Shiria.pdf'),
    image: require('./assets/pdf/cover/afakhou.png'),
    description: 'Ouvrage important de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 7000,
  },
  {
    id: 108,
    title: 'Rouhul Adab',
    titleAr: 'روح الأدب',
    author: 'Cheikh Ahmed Tijani',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/ilide.info-rouhul-adab-pr_952fa5e35b9e6fece2a51010881a7978.pdf'),
    image: require('./assets/pdf/cover/rouhou.png'),
    description: 'L\'esprit de la politesse et des bonnes manières.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 9000,
  },
  {
    id: 109,
    title: 'The Divine Flood',
    titleAr: 'الفيض الإلهي',
    author: 'Rüdiger Seesemann',
    pages: 400,
    cover: '📖',
    pdfFile: require('./assets/pdf/the-divine-flood-ibrahim-niasse-and-the-roots-of-a-rudiger-seesemann.pdf'),
    image: require('./assets/pdf/cover/divineflood.png'),
    description: 'Étude académique sur Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.7,
    downloads: 5500,
  },
  {
    id: 110,
    title: 'The Hajj Experiences of Shaykh Ibrahim Niasse',
    titleAr: 'تجارب الحج للشيخ إبراهيم نياس',
    author: 'Imam Fakhri Owaisi',
    pages: 150,
    cover: '📖',
    pdfFile: require('./assets/pdf/the-hajj-experiences-of-shaykh-ibrahim-niasse-by-imam-fakhri-owaisi.pdf'),
    image: require('./assets/pdf/cover/hajj.png'),
    description: 'Récit des expériences du Hajj de Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.8,
    downloads: 6000,
  },
  {
    id: 111,
    title: 'Congratulations to Ibrahim',
    titleAr: 'تهاني لإبراهيم',
    author: 'Fayda Tidianiya',
    pages: 100,
    cover: '📖',
    pdfFile: require('./assets/pdf/ed-congratulations-to-ibrahim-whenever-his-month-appears.pdf'),
    image: require('./assets/pdf/cover/congr.png'),
    description: 'Ouvrage sur Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.6,
    downloads: 5000,
  },
  // Temporairement commenté - fichier manquant
  // {
  //   id: 112,
  //   title: 'Quelques Lettres de Baye Niass',
  //   titleAr: 'بعض رسائل باي نياس',
  //   author: 'Cheikh Ibrahim Niass',
  //   pages: 150,
  //   cover: '📖',
  //   pdfFile: require('./assets/pdf/quelques-lettres-de-baye-niass.pdf'),
  //   image: require('./assets/pdf/lettre1.jpeg'),
  //   description: 'Collection de lettres de Cheikh Ibrahim Niass.',
  //   category: 'Tariqa',
  //   rating: 4.8,
  //   downloads: 6000,
  // },
  {
    id: 113,
    title: 'Rihlatul Murtaniyya',
    titleAr: 'رحلة المرتانية',
    author: 'Cheikh Ahmed Tijani',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/rihilatul-murtaniyya.pdf'),
    image: require('./assets/pdf/cover/rikhla.png'),
    description: 'Le voyage spirituel - Ouvrage important sur le cheminement spirituel.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 7000,
  },
  {
    id: 114,
    title: 'Sairul Qalbi',
    titleAr: 'سير القلب',
    author: 'Cheikh Ahmed Tijani',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/sairul-qalbi.pdf'),
    image: require('./assets/pdf/cover/sayrou.png'),
    description: 'Le cheminement du cœur - Ouvrage spirituel de grande valeur.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 6500,
  },
  {
    id: 115,
    title: 'Kashf al-Bas',
    titleAr: 'كشف البأس',
    author: 'Cheikh Ibrahim Niass',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/Kashf-al-Bas.pdf'),
    image: require('./assets/pdf/cover/kashif.png'),
    description: 'Ouvrage spirituel important de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 7000,
  },
  {
    id: 116,
    title: 'Lettres Précieuses',
    titleAr: 'رسائل ثمينة',
    author: 'Cheikh Ibrahim Niass',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/lettres-precieuses-definitif.pdf'),
    image: require('./assets/pdf/cover/lettre1.jpeg'),
    description: 'Collection de lettres précieuses de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 6500,
  },
  {
    id: 117,
    title: 'Le Discours de Khartoum',
    titleAr: 'خطاب الخرطوم',
    author: 'Cheikh Ibrahim Niass',
    pages: 50,
    cover: '📖',
    pdfFile: require('./assets/pdf/le-discours-de-khartoum-230608-000728.pdf'),
    image: require('./assets/pdf/cover/congr.png'),
    description: 'Discours historique de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 5000,
  },
  {
    id: 118,
    title: 'Testament Shaykh Ibrahima Niasse',
    titleAr: 'وصية الشيخ إبراهيم نياس',
    author: 'Cheikh Ibrahim Niass',
    pages: 100,
    cover: '📖',
    pdfFile: require('./assets/pdf/testament-shaykh-ibrahim-niasse.pdf'),
    image: require('./assets/pdf/cover/cheikh.jpeg'),
    description: 'Testament spirituel de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 6000,
  },
  {
    id: 119,
    title: 'Al-Tijaniya',
    titleAr: 'التجانية',
    author: 'Cheikh Ahmed Tijani',
    pages: 300,
    cover: '📖',
    pdfFile: require('./assets/pdf/al-tijaniya_imp_elect_v01-1.pdf'),
    image: require('./assets/pdf/cover/cover1.png'),
    description: 'Ouvrage fondamental sur la Tariqa Tijaniyya.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 8000,
  },
  {
    id: 120,
    title: 'Diwan Sayrul Qalb',
    titleAr: 'ديوان سير القلب',
    author: 'Cheikh Ahmed Tijani',
    pages: 250,
    cover: '📖',
    pdfFile: require('./assets/pdf/sayrouqalbi-fr.pdf'),
    image: require('./assets/pdf/cover/sayrouqal.png'),
    description: 'Recueil poétique spirituel.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 7000,
  },
  {
    id: 121,
    title: 'Doua Wazifa',
    titleAr: 'دعاء الوظيفة',
    author: 'Fayda Tidianiya',
    pages: 80,
    cover: '📖',
    pdfFile: require('./assets/pdf/doua-wazifa.pdf'),
    image: require('./assets/pdf/cover/articles/art5.png'),
    description: 'Invocation de la Wazifa.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 5500,
  },
  {
    id: 122,
    title: 'Boughiyat',
    titleAr: 'البغية',
    author: 'Cheikh Ahmed Tijani',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/boughiyat.pdf'),
    image: require('./assets/pdf/cover/boughiyat.png'),
    description: 'Ouvrage spirituel important.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 6000,
  },
  {
    id: 123,
    title: 'Kachf al-Hijab',
    titleAr: 'كشف الحجاب',
    author: 'Cheikh Ahmed Tijani',
    pages: 170,
    cover: '📖',
    pdfFile: require('./assets/pdf/kachf-al-hijab.pdf'),
    image: require('./assets/pdf/cover/khidiab.png'),
    description: 'Ouvrage spirituel de grande valeur.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 6200,
  },
];

// PDFs du dossier français uniquement
const frenchPdfFiles = [
  {
    id: 201,
    title: 'Baye Niass - Un Père du Panafricanisme',
    titleAr: 'باي نياس - أب الوحدة الأفريقية',
    author: 'Niane Babacar',
    pages: 250,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/baye-niasse-un-pere-du-panafricanisme-et-figure-niane-babacar-2020.pdf'),
    image: require('./assets/pdf/cover/afrique.png'),
    description: 'Biographie de Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 5.0,
    downloads: 12000,
  },
  {
    id: 202,
    title: 'Diawahir al Mahani',
    titleAr: 'جواهر المعاني',
    author: 'Cheikh Ahmed Tijani',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/diawahir_al_mahani.pdf'),
    image: require('./assets/pdf/cover/cheikh.jpeg'),
    description: 'Les perles précieuses - Un ouvrage fondamental de la Tariqa Tijaniyya.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 8000,
  },
  {
    id: 203,
    title: 'Rouhul Adab',
    titleAr: 'روح الأدب',
    author: 'Cheikh Ahmed Tijani',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/ilide.info-rouhul-adab-pr_952fa5e35b9e6fece2a51010881a7978.pdf'),
    image: require('./assets/pdf/cover/rouhou.png'),
    description: 'L\'esprit de la politesse et des bonnes manières.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 9000,
  },
  // Temporairement commenté - fichier manquant
  // {
  //   id: 204,
  //   title: 'Quelques Lettres de Baye Niass',
  //   titleAr: 'بعض رسائل باي نياس',
  //   author: 'Cheikh Ibrahim Niass',
  //   pages: 150,
  //   cover: '📖',
  //   pdfFile: require('./assets/pdf/francais/quelques-lettres-de-baye-niass.pdf'),
  //   image: require('./assets/pdf/lettre1.jpeg'),
  //   description: 'Collection de lettres de Cheikh Ibrahim Niass.',
  //   category: 'Tariqa',
  //   rating: 4.8,
  //   downloads: 6000,
  // },
  {
    id: 205,
    title: 'Kashf al-Bas',
    titleAr: 'كشف البأس',
    author: 'Cheikh Ibrahim Niass',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/Kashf-al-Bas.pdf'),
    image: require('./assets/pdf/cover/kashif.png'),
    description: 'Ouvrage spirituel important de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 7000,
  },
  {
    id: 206,
    title: 'Lettres Précieuses',
    titleAr: 'رسائل ثمينة',
    author: 'Cheikh Ibrahim Niass',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/lettres-precieuses-definitif.pdf'),
    image: require('./assets/pdf/cover/lettre1.jpeg'),
    description: 'Collection de lettres précieuses de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 6500,
  },
  {
    id: 207,
    title: 'Le Discours de Khartoum',
    titleAr: 'خطاب الخرطوم',
    author: 'Cheikh Ibrahim Niass',
    pages: 50,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/le-discours-de-khartoum-230608-000728.pdf'),
    image: require('./assets/pdf/cover/congr.png'),
    description: 'Discours historique de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 5000,
  },
  {
    id: 208,
    title: 'Testament Shaykh Ibrahima Niasse',
    titleAr: 'وصية الشيخ إبراهيم نياس',
    author: 'Cheikh Ibrahim Niass',
    pages: 100,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/testament-shaykh-ibrahim-niasse.pdf'),
    image: require('./assets/pdf/cover/cheikh.jpeg'),
    description: 'Testament spirituel de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 6000,
  },
  {
    id: 209,
    title: 'Al-Tijaniya',
    titleAr: 'التجانية',
    author: 'Cheikh Ahmed Tijani',
    pages: 300,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/al-tijaniya_imp_elect_v01-1.pdf'),
    image: require('./assets/pdf/cover/cover1.png'),
    description: 'Ouvrage fondamental sur la Tariqa Tijaniyya.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 8000,
  },
  {
    id: 210,
    title: 'Diwan Sayrul Qalb',
    titleAr: 'ديوان سير القلب',
    author: 'Cheikh Ahmed Tijani',
    pages: 250,
    cover: '📖',
    pdfFile: require('./assets/pdf/francais/sayrouqalbi-fr.pdf'),
    image: require('./assets/pdf/cover/sayrouqal.png'),
    description: 'Recueil poétique spirituel.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 7000,
  },
];

// PDFs du dossier anglais uniquement
const englishPdfFiles = [
  {
    id: 300,
    title: 'Congratulations to Ibrahim',
    titleAr: 'تهاني لإبراهيم',
    author: 'Fayda Tidianiya',
    pages: 100,
    cover: '📖',
    pdfFile: require('./assets/pdf/anglais/ed-congratulations-to-ibrahim-whenever-his-month-appears.pdf'),
    image: require('./assets/pdf/cover/congr.png'),
    description: 'Ouvrage sur Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.6,
    downloads: 5000,
  },
  {
    id: 301,
    title: 'The Hajj Experiences of Shaykh Ibrahim Niasse',
    titleAr: 'تجارب الحج للشيخ إبراهيم نياس',
    author: 'Imam Fakhri Owaisi',
    pages: 150,
    cover: '📖',
    pdfFile: require('./assets/pdf/anglais/the-hajj-experiences-of-shaykh-ibrahim-niasse-by-imam-fakhri-owaisi.pdf'),
    image: require('./assets/pdf/cover/hajj.png'),
    description: 'Récit des expériences du Hajj de Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.8,
    downloads: 6000,
  },
  {
    id: 302,
    title: 'The Divine Flood',
    titleAr: 'الفيض الإلهي',
    author: 'Rüdiger Seesemann',
    pages: 400,
    cover: '📖',
    pdfFile: require('./assets/pdf/anglais/the-divine-flood-ibrahim-niasse-and-the-roots-of-a-rudiger-seesemann-welib-org.pdf'),
    image: require('./assets/pdf/cover/divineflood.png'),
    description: 'Étude académique sur Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.7,
    downloads: 5500,
  },
];

// PDFs du dossier arabe uniquement
const arabicPdfFiles = [
  {
    id: 400,
    title: 'Azal Thierno Hassen Dem',
    titleAr: 'أزل تيرنو حسن ديم',
    author: 'Thierno Hassane Dème',
    pages: 120,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/Azal_Thierno_Hassen_Dem.pdf'),
    image: require('./assets/pdf/cover3.png'),
    description: 'Ouvrage spirituel de grande valeur sur la vie et les enseignements de Thierno Hassane Dème.',
    category: 'Biographie',
    rating: 5.0,
    downloads: 5000,
  },
  {
    id: 401,
    title: 'Diawahir al Mahani',
    titleAr: 'جواهر المعاني',
    author: 'Cheikh Ahmed Tijani',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/diawahir_al_mahani.pdf'),
    image: require('./assets/pdf/cover/cheikh.jpeg'),
    description: 'Les perles précieuses - Un ouvrage fondamental de la Tariqa Tijaniyya.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 8000,
  },
  {
    id: 402,
    title: 'Nour al Kamal fi Mashhad ar-Rijal',
    titleAr: 'نور الكمال في مشهد الرجال',
    author: 'Shaykh al-Islam',
    pages: 150,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/Nour_al_Kamal_fi_Mashhad_ar_Rijal.pdf'),
    image: require('./assets/pdf/cover/cover2.jpeg'),
    description: 'La lumière de la perfection dans la présence des hommes.',
    category: 'Ma\'arifa',
    rating: 4.9,
    downloads: 6000,
  },
  {
    id: 403,
    title: 'Miftah al-Wusul',
    titleAr: 'مفتاح الوصول',
    author: 'Cheikh Ahmed Tijani',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/miftaakhoul-woussoul.pdf'),
    image: require('./assets/pdf/cover/cover1.png'),
    description: 'La clé de l\'accès - Un ouvrage spirituel fondamental.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 7500,
  },
  {
    id: 405,
    title: 'Boughiyat',
    titleAr: 'البغية',
    author: 'Cheikh Ahmed Tijani',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/boughiyat.pdf'),
    image: require('./assets/pdf/cover/boughiyat.png'),
    description: 'Ouvrage spirituel important.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 6000,
  },
  {
    id: 406,
    title: 'Kachf al-Hijab',
    titleAr: 'كشف الحجاب',
    author: 'Cheikh Ahmed Tijani',
    pages: 170,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/kachf-al-hijab.pdf'),
    image: require('./assets/pdf/cover/khidiab.png'),
    description: 'Ouvrage spirituel de grande valeur.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 6200,
  },
  {
    id: 407,
    title: 'Afakhou Shiria',
    titleAr: 'أفاخو شريعة',
    author: 'Cheikh Ibrahim Niass',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/Afakhou-Shiria.pdf'),
    image: require('./assets/pdf/cover/afakhou.png'),
    description: 'Ouvrage important de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 7000,
  },
  {
    id: 408,
    title: 'The Hajj Experiences of Shaykh Ibrahim Niasse',
    titleAr: 'تجارب الحج للشيخ إبراهيم نياس',
    author: 'Imam Fakhri Owaisi',
    pages: 150,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/the-hajj-experiences-of-shaykh-ibrahim-niasse-by-imam-fakhri-owaisi.pdf'),
    image: require('./assets/pdf/cover/hajj.png'),
    description: 'Récit des expériences du Hajj de Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.8,
    downloads: 6000,
  },
  {
    id: 409,
    title: 'Congratulations to Ibrahim',
    titleAr: 'تهاني لإبراهيم',
    author: 'Fayda Tidianiya',
    pages: 100,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/ed-congratulations-to-ibrahim-whenever-his-month-appears.pdf'),
    image: require('./assets/pdf/cover/congr.png'),
    description: 'Ouvrage sur Cheikh Ibrahim Niass.',
    category: 'Biographie',
    rating: 4.6,
    downloads: 5000,
  },
  {
    id: 410,
    title: 'Rihlatul Murtaniyya',
    titleAr: 'رحلة المرتانية',
    author: 'Cheikh Ahmed Tijani',
    pages: 200,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/rihilatul-murtaniyya.pdf'),
    image: require('./assets/pdf/cover/rikhla.png'),
    description: 'Le voyage spirituel - Ouvrage important sur le cheminement spirituel.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 7000,
  },
  {
    id: 411,
    title: 'Sairul Qalbi',
    titleAr: 'سير القلب',
    author: 'Cheikh Ahmed Tijani',
    pages: 180,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/sairul-qalbi.pdf'),
    image: require('./assets/pdf/cover/sayrou.png'),
    description: 'Le cheminement du cœur - Ouvrage spirituel de grande valeur.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 6500,
  },
  {
    id: 412,
    title: 'Le Discours de Khartoum',
    titleAr: 'خطاب الخرطوم',
    author: 'Cheikh Ibrahim Niass',
    pages: 50,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/le-discours-de-khartoum-230608-000728.pdf'),
    image: require('./assets/pdf/cover/congr.png'),
    description: 'Discours historique de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 4.8,
    downloads: 5000,
  },
  {
    id: 413,
    title: 'Testament Shaykh Ibrahima Niasse',
    titleAr: 'وصية الشيخ إبراهيم نياس',
    author: 'Cheikh Ibrahim Niass',
    pages: 100,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/testament-shaykh-ibrahim-niasse.pdf'),
    image: require('./assets/pdf/cover/cheikh.jpeg'),
    description: 'Testament spirituel de Cheikh Ibrahim Niass.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 6000,
  },
  {
    id: 414,
    title: 'Al-Tijaniya',
    titleAr: 'التجانية',
    author: 'Cheikh Ahmed Tijani',
    pages: 300,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/al-tijaniya_imp_elect_v01-1.pdf'),
    image: require('./assets/pdf/cover/cover1.png'),
    description: 'Ouvrage fondamental sur la Tariqa Tijaniyya.',
    category: 'Tariqa',
    rating: 5.0,
    downloads: 8000,
  },
  {
    id: 415,
    title: 'Diwan Sayrul Qalb',
    titleAr: 'ديوان سير القلب',
    author: 'Cheikh Ahmed Tijani',
    pages: 250,
    cover: '📖',
    pdfFile: require('./assets/pdf/arabe/sayrouqalbi-fr.pdf'),
    image: require('./assets/pdf/cover/sayrouqal.png'),
    description: 'Recueil poétique spirituel.',
    category: 'Tariqa',
    rating: 4.9,
    downloads: 7000,
  },
];

// Appliquer les nombres de pages réels depuis le mapping
const allPdfFilesWithPages = allPdfFiles.map(book => ({ ...book, pages: getPdfPages(book.id, book.pages) }));
const frenchPdfFilesWithPages = frenchPdfFiles.map(book => ({ ...book, pages: getPdfPages(book.id, book.pages) }));
const englishPdfFilesWithPages = englishPdfFiles.map(book => ({ ...book, pages: getPdfPages(book.id, book.pages) }));
const arabicPdfFilesWithPages = arabicPdfFiles.map(book => ({ ...book, pages: getPdfPages(book.id, book.pages) }));

// Garder pdfFiles pour la compatibilité avec le code existant (page d'accueil)
const pdfFiles = allPdfFilesWithPages;

// Fonction pour obtenir les catégories de livres filtrées selon la langue
// Filtre les PDFs selon leur dossier d'origine :
// - null (Tous) : tous les PDFs du dossier pdf/ (racine)
// - 'fr' (French) : seulement les PDFs du dossier pdf/francais/
// - 'en' (English) : seulement les PDFs du dossier pdf/anglais/
// - 'ar' (Arabe) : seulement les PDFs du dossier pdf/arabe/
const getBookCategories = (language: Language | null) => {
  // Déterminer quels PDFs afficher selon la langue
  let pdfsToShow = allPdfFilesWithPages; // Par défaut (null = "Tous"), tous les PDFs du dossier pdf/ (racine)
  
  if (language === 'fr') {
    pdfsToShow = frenchPdfFilesWithPages; // Seulement les PDFs du dossier pdf/francais/
  } else if (language === 'en') {
    pdfsToShow = englishPdfFilesWithPages; // Seulement les PDFs du dossier pdf/anglais/
  } else if (language === 'ar') {
    pdfsToShow = arabicPdfFilesWithPages; // Seulement les PDFs du dossier pdf/arabe/
  }
  // Si language === null (bouton "Tous"), on garde allPdfFiles (tous les PDFs de la racine)

  return [
    {
      id: 'pdf',
      title: 'Livres PDF',
      books: pdfsToShow,
    },
  {
    id: 'tariqa',
    title: 'Tariqa (Français)',
    books: [
      { id: 20, title: 'Introduction à la Tariqa Tijaniyya', titleAr: 'الطريقة التجانية', author: 'Fayda Tidianiya', pages: 25, cover: '📿', htmlFile: 'tariqa-articles.html', image: require('./assets/pdf/cover/articles/art1.png'), description: 'Découvrez les fondements, les pratiques et les bienfaits de la Tariqa Tijaniyya, voie spirituelle de lumière et de guidance.' },
      { id: 21, title: 'Le Zikr dans la Voie Tijaniyya', titleAr: 'الذكر في الطريقة التجانية', author: 'Fayda Tidianiya', pages: 20, cover: '🕌', htmlFile: 'tariqa-articles.html', image: require('./assets/pdf/cover/articles/art2.png'), description: 'Comprenez l\'importance et la pratique du Zikr (invocation) dans la Tariqa Tijaniyya.' },
      { id: 22, title: 'La Salat al-Fatih', titleAr: 'صلاة الفاتح', author: 'Fayda Tidianiya', pages: 18, cover: '📖', htmlFile: 'tariqa-articles.html', image: require('./assets/pdf/cover/articles/art3.png'), description: 'Apprenez-en plus sur la Salat al-Fatih, cette prière spéciale de la Tariqa Tijaniyya.' },
      { id: 23, title: 'L\'Attachement au Prophète', titleAr: 'التعلق بالنبي', author: 'Fayda Tidianiya', pages: 22, cover: '☪️', htmlFile: 'tariqa-articles.html', image: require('./assets/pdf/cover/articles/art4.png'), description: 'Explorez la relation spirituelle avec le Prophète Muhammad (paix et bénédictions sur lui) dans la voie tidiane.' },
      { id: 24, title: 'Doua Wazifa', titleAr: 'دعاء الوظيفة', author: 'Fayda Tidianiya', pages: 15, cover: '🤲', htmlFile: 'tariqa-articles.html', image: require('./assets/pdf/cover/articles/art5.png'), description: 'Invocation de la Wazifa - Douas et prières de la Tariqa Tijaniyya.' },
    ]
  },
  {
    id: 'maarifa',
    title: 'Ma\'arifa (Français)',
    books: [
      { id: 30, title: 'La Connaissance Spirituelle', titleAr: 'المعرفة الروحية', author: 'Fayda Tidianiya', pages: 28, cover: '🌟', htmlFile: 'maarifa-articles.html', image: require('./assets/pdf/cover/articles/art6.png'), description: 'Découvrez ce qu\'est la Ma\'arifa, la gnose divine dans la tradition soufie.' },
      { id: 31, title: 'Les Degrés de la Connaissance', titleAr: 'درجات المعرفة', author: 'Fayda Tidianiya', pages: 24, cover: '💫', htmlFile: 'maarifa-articles.html', image: require('./assets/pdf/cover/articles/art7.png'), description: 'Comprenez les différents niveaux de connaissance spirituelle : science, compréhension et gnose.' },
      { id: 32, title: 'La Ma\'arifa dans la Tariqa Tijaniyya', titleAr: 'المعرفة في الطريقة التجانية', author: 'Fayda Tidianiya', pages: 26, cover: '🌙', htmlFile: 'maarifa-articles.html', image: require('./assets/pdf/cover/articles/art8.png'), description: 'Explorez comment la Ma\'arifa est cultivée dans la voie tidiane.' },
      { id: 33, title: 'Le Chemin vers la Gnose', titleAr: 'طريق المعرفة', author: 'Fayda Tidianiya', pages: 30, cover: '🔮', htmlFile: 'maarifa-articles.html', image: require('./assets/pdf/cover/articles/art9.png'), description: 'Apprenez les étapes et les qualités nécessaires pour atteindre la connaissance spirituelle.' },
    ]
  },
  ];
};

// Context pour la langue et le mode sombre
const AppContext = React.createContext<{
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
}>({ 
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

// Nouveau sélecteur de langue avec barre horizontale (comme dans l'image)
function LanguageSelectorBar() {
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
                } else {
                  // Pour "Tous", on garde la langue actuelle pour les traductions
                  // mais on réinitialise le filtre des livres à null
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

// Écran d'accueil
function HomeScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer, recentItems, addToHistory, setShowDonationBanner, setLang, setDarkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [selectedBook, setSelectedBook] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'chapters'>('overview');
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const scrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    // Cacher la bande dès qu'on scrolle
    setShowDonationBanner(false);
    
    // Annuler le timer précédent
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    // Créer un nouveau timer pour réafficher la bande après 500ms d'inactivité
    scrollTimer.current = setTimeout(() => {
      setShowDonationBanner(true);
    }, 500);
    
    lastScrollY.current = currentScrollY;
  };

  // Nettoyer le timer au démontage
  React.useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const handleOpenBook = () => {
    if (selectedBook) {
      addToHistory(selectedBook, 'pdf');
      setCurrentPlayer({ item: selectedBook, type: 'book' });
      navigation.navigate('PDFReader', { book: selectedBook });
      setModalVisible(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris',
      isBookmarked ? 'Le livre a été retiré de vos favoris.' : 'Le livre a été ajouté à vos favoris.'
    );
  };

  const handleMenuPress = () => {
    Alert.alert(
      selectedBook?.title || 'Options',
      'Que souhaitez-vous faire ?',
      [
        {
          text: 'Partager',
          onPress: () => {
            Share.share({
              message: `${selectedBook?.title} - ${selectedBook?.author || ''}`,
              title: selectedBook?.title || 'Livre',
            });
          },
        },
        {
          text: 'Ajouter à l\'historique',
          onPress: () => {
            if (selectedBook) {
              addToHistory(selectedBook, 'pdf');
              Alert.alert('Succès', 'Livre ajouté à l\'historique');
            }
          },
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleThemeChange = (newTheme: boolean) => {
    setDarkMode(newTheme);
  };

  const handleLanguageChange = (newLang: Language | null) => {
    setLang(newLang);
    if (newLang) {
      setLanguage(newLang);
    }
  };

  const handleSearchPress = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const performSearchWithQuery = (queryText: string) => {
    const query = queryText.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];

    // Rechercher dans les PDFs
    pdfFiles.forEach(book => {
      const matchTitle = book.title?.toLowerCase().includes(query);
      const matchTitleAr = book.titleAr?.toLowerCase().includes(query);
      const matchAuthor = book.author?.toLowerCase().includes(query);
      const matchDescription = book.description?.toLowerCase().includes(query);
      
      if (matchTitle || matchTitleAr || matchAuthor || matchDescription) {
        results.push({ ...book, searchType: 'pdf' });
      }
    });

    // Rechercher dans les podcasts
    podcasts.forEach(podcast => {
      const matchTitle = podcast.title?.toLowerCase().includes(query);
      const matchTitleAr = podcast.titleAr?.toLowerCase().includes(query);
      const matchSubtitle = podcast.subtitle?.toLowerCase().includes(query);
      
      if (matchTitle || matchTitleAr || matchSubtitle) {
        results.push({ ...podcast, searchType: 'podcast' });
      }
    });

    // Rechercher dans les articles récents
    recentItems.forEach(item => {
      const matchTitle = item.title?.toLowerCase().includes(query);
      const matchTitleAr = item.titleAr?.toLowerCase().includes(query);
      
      if (matchTitle || matchTitleAr) {
        results.push({ ...item, searchType: item.type });
      }
    });

    // Rechercher dans les fichiers Coran
    coranTracks.forEach(track => {
      const matchTitle = track.title?.toLowerCase().includes(query);
      const matchTitleAr = track.titleAr?.toLowerCase().includes(query);
      const matchReciter = track.reciter?.toLowerCase().includes(query);
      
      if (matchTitle || matchTitleAr || matchReciter) {
        results.push({ ...track, searchType: 'coran' });
      }
    });

    // Rechercher dans les fichiers Zikr
    zikrFiles.forEach(zikr => {
      const matchTitle = zikr.title?.toLowerCase().includes(query);
      const matchTitleAr = zikr.titleAr?.toLowerCase().includes(query);
      const matchSubtitle = zikr.subtitle?.toLowerCase().includes(query);
      
      if (matchTitle || matchTitleAr || matchSubtitle) {
        results.push({ ...zikr, searchType: 'zikr' });
      }
    });

    setSearchResults(results);
  };

  const performSearch = () => {
    performSearchWithQuery(searchQuery);
    setShowSuggestions(false);
  };

  const generateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryLower = query.toLowerCase().trim();
    const suggestionsSet = new Set<string>();

    // Générer des suggestions à partir des PDFs
    pdfFiles.forEach(book => {
      if (book.title?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(book.title);
      }
      if (book.titleAr?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(book.titleAr);
      }
      if (book.author?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(book.author);
      }
    });

    // Générer des suggestions à partir des podcasts
    podcasts.forEach(podcast => {
      if (podcast.title?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(podcast.title);
      }
      if (podcast.titleAr?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(podcast.titleAr);
      }
    });

    // Générer des suggestions à partir des articles récents
    recentItems.forEach(item => {
      if (item.title?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(item.title);
      }
      if (item.titleAr?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(item.titleAr);
      }
    });

    // Générer des suggestions à partir des fichiers Coran
    coranTracks.forEach(track => {
      if (track.title?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(track.title);
      }
      if (track.titleAr?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(track.titleAr);
      }
      if (track.reciter?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(track.reciter);
      }
    });

    // Générer des suggestions à partir des fichiers Zikr
    zikrFiles.forEach(zikr => {
      if (zikr.title?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(zikr.title);
      }
      if (zikr.titleAr?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(zikr.titleAr);
      }
      if (zikr.subtitle?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(zikr.subtitle);
      }
    });

    // Limiter à 8 suggestions
    const suggestions = Array.from(suggestionsSet).slice(0, 8);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    generateSuggestions(text);
    // Lancer la recherche automatiquement pendant la saisie
    performSearchWithQuery(text);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    // Utiliser performSearchWithQuery avec la suggestion sélectionnée
    performSearchWithQuery(suggestion);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header moderne avec gradient */}
      <LinearGradient
        colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerModern}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <Image 
            source={require('./assets/pdf/cover/icones/logo.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={handleSearchPress}
          >
            <Ionicons name="search-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Barre de recherche */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.text, borderColor: theme.textSecondary }]}
            placeholder="Rechercher..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            autoFocus={true}
            onSubmitEditing={() => {
              setShowSuggestions(false);
              performSearch();
            }}
            returnKeyType="search"
            onFocus={() => {
              if (searchQuery.trim()) {
                generateSuggestions(searchQuery);
              }
            }}
            onBlur={() => {
              // Délai pour permettre le clic sur une suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                setShowSuggestions(false);
                performSearch();
              }}
            >
              <Ionicons name="search" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.searchCloseButton}
            onPress={() => {
              setShowSearch(false);
              setSearchQuery('');
              setSearchSuggestions([]);
              setShowSuggestions(false);
              setSearchResults([]);
            }}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Suggestions d'autocomplétion */}
      {showSearch && showSuggestions && searchSuggestions.length > 0 && (
        <View style={[styles.searchSuggestionsContainer, { backgroundColor: theme.surface }]}>
          {searchSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.searchSuggestionItem, { borderBottomColor: theme.textSecondary + '20' }]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Ionicons name="search-outline" size={18} color={theme.textSecondary} style={styles.searchSuggestionIcon} />
              <Text style={[styles.searchSuggestionText, { color: theme.text }]} numberOfLines={1}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Résultats de recherche */}
      {showSearch && searchQuery.trim() && searchResults.length > 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>🔍</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>
                  Résultats de recherche ({searchResults.length})
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Pour: "{searchQuery}"
                </Text>
              </View>
            </View>
          </View>
          <ScrollView 
            style={styles.searchResultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {searchResults.map((item, index) => {
              const isViewed = (item.searchType === 'pdf' && recentItems.some(ri => ri.id === item.id && ri.type === 'pdf')) ||
                               ((item.searchType === 'audio' || item.searchType === 'coran' || item.searchType === 'zikr' || item.searchType === 'podcast') && 
                                recentItems.some(ri => ri.id === item.id && ri.type === 'audio'));
              return (
                <TouchableOpacity
                  key={`search-${item.id}-${index}`}
                  style={[styles.searchResultItem, { backgroundColor: theme.surface }]}
                  onPress={() => {
                    if (item.searchType === 'pdf') {
                      const fullBook = allPdfFilesWithPages.find(b => b.id === item.id) ||
                                       frenchPdfFilesWithPages.find(b => b.id === item.id) ||
                                       englishPdfFilesWithPages.find(b => b.id === item.id) ||
                                       arabicPdfFilesWithPages.find(b => b.id === item.id) ||
                                       item;
                      setSelectedBook(fullBook);
                      setActiveTab('overview');
                      setModalVisible(true);
                    } else if (item.searchType === 'podcast') {
                      addToHistory(item, 'audio');
                      navigation.navigate('Podcasts', { selectedPodcast: item });
                    } else if (item.searchType === 'coran') {
                      addToHistory(item, 'audio');
                      setCurrentPlayer({ item: item, type: 'coran' });
                      navigation.navigate('Coran');
                    } else if (item.searchType === 'zikr') {
                      addToHistory(item, 'audio');
                      setCurrentPlayer({ item: item, type: 'zikr' });
                      navigation.navigate('Zikr');
                    } else if (item.searchType === 'audio') {
                      // Pour les articles récents de type audio
                      addToHistory(item, 'audio');
                      // Naviguer vers l'écran approprié selon le type d'audio
                      if (coranTracks.some(t => t.id === item.id)) {
                        setCurrentPlayer({ item: item, type: 'coran' });
                        navigation.navigate('Coran');
                      } else if (zikrFiles.some(z => z.id === item.id)) {
                        setCurrentPlayer({ item: item, type: 'zikr' });
                        navigation.navigate('Zikr');
                      } else {
                        navigation.navigate('Podcasts', { selectedPodcast: item });
                      }
                    }
                  }}
                >
                  {item.image && (
                    <Image
                      source={item.image}
                      style={styles.searchResultImage}
                    />
                  )}
                  <View style={styles.searchResultContent}>
                    <Text style={[styles.searchResultTitle, { color: theme.text }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.titleAr && (
                      <Text style={[styles.searchResultTitleAr, { color: theme.textSecondary }]} numberOfLines={1}>
                        {item.titleAr}
                      </Text>
                    )}
                    {item.author && (
                      <Text style={[styles.searchResultAuthor, { color: theme.textSecondary }]}>
                        {item.author}
                      </Text>
                    )}
                    <Text style={[styles.searchResultType, { color: theme.primary }]}>
                      {item.searchType === 'pdf' ? '📚 Livre PDF' : 
                       item.searchType === 'podcast' ? '🎙️ Podcast' : 
                       item.searchType === 'coran' ? '📖 Coran' :
                       item.searchType === 'zikr' ? '🕌 Zikr' :
                       '📄 Article'}
                    </Text>
            </View>
                  {isViewed && item.searchType === 'pdf' && (
                    <Image source={require('./assets/pdf/cover/icones/lun3.png')} style={styles.searchResultViewedIcon} />
                  )}
                  {isViewed && (item.searchType === 'audio' || item.searchType === 'coran' || item.searchType === 'zikr' || item.searchType === 'podcast') && (
                    <Image source={require('./assets/pdf/cover/icones/pl3.png')} style={styles.searchResultViewedIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
      </View>
      )}

      {/* Message si aucun résultat */}
      {showSearch && searchQuery.trim() && searchResults.length === 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
              Aucun résultat trouvé pour "{searchQuery}"
            </Text>
          </View>
        </View>
      )}

      {/* Modal des paramètres */}
      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.settingsModal, { backgroundColor: theme.surface }]}>
            <View style={styles.settingsModalHeader}>
              <Text style={[styles.settingsModalTitle, { color: theme.text }]}>Paramètres</Text>
              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                style={styles.settingsModalCloseButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Section Thème */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Thème</Text>
              <View style={styles.settingsOptions}>
                <TouchableOpacity
                  style={[
                    styles.settingsOption,
                    { backgroundColor: theme.background },
                    !darkMode && styles.settingsOptionActive
                  ]}
                  onPress={() => handleThemeChange(false)}
                >
                  <Ionicons name="sunny" size={24} color={!darkMode ? '#0F5132' : '#ffffff'} />
                  <Text style={[styles.settingsOptionText, { color: !darkMode ? '#0F5132' : '#ffffff' }]}>
                    Clair
                  </Text>
                  {!darkMode && <Ionicons name="checkmark-circle" size={20} color="#0F5132" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.settingsOption,
                    { backgroundColor: theme.background },
                    darkMode && styles.settingsOptionActive
                  ]}
                  onPress={() => handleThemeChange(true)}
                >
                  <Ionicons name="moon" size={24} color={darkMode ? '#ffffff' : theme.textSecondary} />
                  <Text style={[styles.settingsOptionText, { color: darkMode ? '#ffffff' : theme.textSecondary }]}>
                    Sombre
                  </Text>
                  {darkMode && <Ionicons name="checkmark-circle" size={20} color="#ffffff" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Section Langue */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Langue</Text>
              <View style={styles.settingsOptions}>
                {[
                  { code: null as Language | null, label: 'Tous', flag: '🌍' },
                  { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
                  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
                  { code: 'ar' as Language, label: 'عربي', flag: '🇸🇦' },
                ].map((lang) => (
                  <TouchableOpacity
                    key={lang.code || 'all'}
                    style={[
                      styles.settingsOption,
                      { backgroundColor: theme.background },
                      language === lang.code && styles.settingsOptionActive
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={styles.settingsOptionFlag}>{lang.flag}</Text>
                    <Text style={[styles.settingsOptionText, { color: language === lang.code ? (darkMode ? '#ffffff' : '#0F5132') : theme.textSecondary }]}>
                      {lang.label}
                    </Text>
                    {language === lang.code && <Ionicons name="checkmark-circle" size={20} color={darkMode ? '#ffffff' : '#0F5132'} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rubrique 1 : Derniers articles consultés - Format cartes carrées 1/4 largeur */}
      {!showSearch && recentItems.length > 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>🕐</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Derniers articles consultés</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Articles récents</Text>
              </View>
            </View>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.horizontalScrollModern} 
            contentContainerStyle={styles.horizontalScrollContentModern}
          >
            {recentItems.slice(0, 6).map((item, index) => {
              // Déterminer l'image à afficher selon le type et l'ID
              let cardImage = null;
              if (item.type === 'pdf' && item.item) {
                cardImage = item.item.image || null;
              }
              
              const cardWidth = width * 1.7 / 5; // 1.7/5 de la largeur de l'écran
              
              return (
                <TouchableOpacity 
                  key={`${item.id}-${item.type}-${index}`}
                  style={[styles.recentCardSquare, { width: cardWidth, height: cardWidth }]}
                  activeOpacity={0.9}
                  onPress={() => {
                    if (item.type === 'pdf') {
                      // Utiliser le modal pour les PDFs
                      const fullBook = allPdfFilesWithPages.find(b => b.id === item.item.id) ||
                                       frenchPdfFilesWithPages.find(b => b.id === item.item.id) ||
                                       englishPdfFilesWithPages.find(b => b.id === item.item.id) ||
                                       arabicPdfFilesWithPages.find(b => b.id === item.item.id) ||
                                       item.item;
                      setSelectedBook(fullBook);
                      setActiveTab('overview');
                      setModalVisible(true);
                    } else {
                      // Déterminer le type d'audio et naviguer vers l'écran approprié
                      const isCoran = coranTracks.some(track => track.id === item.item.id);
                      const isZikr = zikrFiles.some(zikr => zikr.id === item.item.id);
                      
                      if (isCoran) {
                        setCurrentPlayer({ item: item.item, type: 'coran' });
                        navigation.navigate('Coran');
                      } else if (isZikr) {
                        setCurrentPlayer({ item: item.item, type: 'zikr' });
                        navigation.navigate('Zikr');
                    } else {
                      setCurrentPlayer({ item: item.item, type: item.item.type || 'music' });
                      }
                    }
                  }}
                >
                  <ImageBackground
                    source={cardImage || require('./assets/thierno.png')}
                    style={styles.recentCardImageSquare}
                    imageStyle={styles.recentCardImageStyleSquare}
                  >
                    {/* Overlay sombre en bas pour la lisibilité du texte */}
                    <View style={styles.recentCardOverlaySquare} />
                    
                    {/* Icône pour les éléments consultés */}
                    <View style={styles.viewedIconContainerRecent}>
                      {item.type === 'pdf' ? (
                        <Image source={require('./assets/pdf/cover/icones/lun3.png')} style={styles.viewedIconImage} />
                      ) : (
                        <Image source={require('./assets/pdf/cover/icones/pl3.png')} style={styles.viewedIconImageAudio} />
                      )}
                    </View>
                    
                    {/* Texte superposé en bas de l'image */}
                    <View style={styles.recentCardTextContainerSquare}>
                      <Text style={styles.recentCardTitleSquare} numberOfLines={2}>
                        {item.title}
                      </Text>
                      {item.titleAr && (
                        <Text style={styles.recentCardTitleArSquare} numberOfLines={2}>
                          {item.titleAr}
                        </Text>
                      )}
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Rubrique 3 : Liste des PDFs */}
      {!showSearch && (
      <View style={styles.sectionModern}>
        <View style={styles.sectionHeaderModern}>
          <View style={styles.sectionTitleContainerModern}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIconModern}>📚</Text>
            </View>
            <View>
              <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Livres PDF</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Ouvrages spirituels</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Books')}>
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
          {pdfFiles.slice(0, 6).map(book => {
            const isViewed = recentItems.some(item => item.id === book.id && item.type === 'pdf');
            return (
            <TouchableOpacity 
              key={book.id} 
              style={[styles.bookCardHome, { backgroundColor: theme.surface, width: width / 5 }]}
              activeOpacity={0.8}
              onPress={() => {
                // Utiliser le modal pour les PDFs
                const fullBook = allPdfFilesWithPages.find(b => b.id === book.id) ||
                                 frenchPdfFilesWithPages.find(b => b.id === book.id) ||
                                 englishPdfFilesWithPages.find(b => b.id === book.id) ||
                                 arabicPdfFilesWithPages.find(b => b.id === book.id) ||
                                 book;
                setSelectedBook(fullBook);
                setActiveTab('overview');
                setModalVisible(true);
              }}
            >
              {book.image ? (
                <ImageBackground
                  source={book.image || require('./assets/pdf/cover3.png')}
                  style={[(book as any).htmlFile ? styles.bookCoverArticle : styles.bookCoverHome, { height: 140 }]}
                  imageStyle={styles.bookCoverImageStyle}
                >
                  <View style={styles.bookCoverOverlay} />
                  {isViewed && (
                    <View style={styles.viewedIconContainer}>
                      <Image source={require('./assets/pdf/cover/icones/lun3.png')} style={styles.viewedIconImage} />
                    </View>
                  )}
                </ImageBackground>
              ) : (
                <LinearGradient
                  colors={['#0F5132', '#0B3C5D', '#0F5132']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[(book as any).htmlFile ? styles.bookCoverArticle : styles.bookCoverHome, { height: 140 }]}
                >
                  <Text style={styles.bookCoverEmojiHome}>{book.cover || '📖'}</Text>
                  {isViewed && (
                    <View style={styles.viewedIconContainer}>
                      <Image source={require('./assets/pdf/cover/icones/lun3.png')} style={styles.viewedIconImage} />
                    </View>
                  )}
                </LinearGradient>
              )}
              <View style={styles.bookCardContentHome}>
                <Text style={[styles.bookTitleHome, { color: theme.text }]} numberOfLines={2}>{book.title}</Text>
                {book.titleAr && (
                  <Text style={[styles.bookAuthorHome, { color: theme.textSecondary }]} numberOfLines={1}>{book.titleAr}</Text>
                )}
              </View>
            </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      )}

      {/* Rubrique Gamou */}
      <View style={styles.sectionModern}>
        <View style={styles.sectionHeaderModern}>
          <View style={styles.sectionTitleContainerModern}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIconModern}>🎉</Text>
            </View>
            <View>
              <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Gamou</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Célébrations spirituelles</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Gamou' })}>
            <Text style={styles.seeAllModern}>Voir tout</Text>
            <Text style={styles.seeAllArrow}>→</Text>
          </TouchableOpacity>
        </View>
            <TouchableOpacity 
          style={[styles.podcastZikrCard, { marginLeft: 0, marginRight: 10, width: '100%', alignSelf: 'stretch' }]}
          activeOpacity={0.9}
              onPress={() => {
            navigation.navigate('MainTabs', { screen: 'Gamou' });
              }}
            >
              <ImageBackground
            source={require('./assets/pdf/cover/gamou.png')}
            style={styles.podcastZikrGradient}
            resizeMode="cover"
            imageStyle={{ 
              width: '100%',
              height: '100%',
            }}
          >
            {/* L'image contient déjà les textes "GAMOU" et les textes arabes */}
              </ImageBackground>
            </TouchableOpacity>
      </View>

      {/* Zikr */}
      <View style={styles.sectionModern}>
        <View style={styles.sectionHeaderModern}>
          <View style={styles.sectionTitleContainerModern}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIconModern}>🕌</Text>
            </View>
            <View>
              <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Zikr</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Invocations spirituelles</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Zikr')}>
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
          {zikrFiles.slice(0, 6).map(zikr => {
            const isViewed = recentItems.some(item => item.id === zikr.id && item.type === 'audio');
            return (
            <TouchableOpacity 
              key={zikr.id} 
              style={[styles.audiobookCardModern, { opacity: 1 }]}
              activeOpacity={0.8}
              onPress={() => {
                addToHistory(zikr, 'audio');
                setCurrentPlayer({ item: zikr, type: 'zikr' });
                navigation.navigate('Zikr'); // Naviguer vers ZikrScreen qui démarre automatiquement
              }}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D', '#0F5132']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.audiobookGradientModern}
              >
                {isViewed && (
                  <View style={styles.viewedIconContainerAudioHome}>
                    <Image source={require('./assets/pdf/cover/icones/pl3.png')} style={styles.viewedIconImageAudio} />
                  </View>
                )}
                <View style={styles.audiobookContent}>
                  <Text style={styles.audiobookTitleModern}>{zikr.title}</Text>
                  <Text style={styles.audiobookTitleArModern}>{zikr.titleAr}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Rubrique Podcasts */}
      <View style={styles.sectionModern}>
        <View style={styles.sectionHeaderModern}>
          <View style={styles.sectionTitleContainerModern}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIconModern}>🎙️</Text>
            </View>
            <View>
              <Text style={[styles.sectionTitleModern, { color: theme.text }]}>Podcasts</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Enseignements audio</Text>
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
          pagingEnabled
          snapToInterval={width * 4 / 5 + 10}
          snapToAlignment="start"
          decelerationRate="fast"
          style={styles.horizontalScrollModernPodcasts} 
          contentContainerStyle={styles.podcastsHorizontalScrollFull}
        >
          {podcasts.slice(0, 5).map((podcast, index) => (
            <TouchableOpacity 
              key={podcast.id} 
              style={[styles.podcastCardHomeFull, index === 0 && styles.podcastCardHomeFullFirst]}
              activeOpacity={0.8}
              onPress={() => {
                addToHistory(podcast, 'audio');
                navigation.navigate('Podcasts', { selectedPodcast: podcast }); // Naviguer vers PodcastsScreen avec le podcast sélectionné
              }}
            >
              <ImageBackground
                source={podcast.image || require('./assets/thierno.png')} 
                style={styles.podcastCardImageHome}
                imageStyle={styles.podcastCardImageStyleHome}
              >
                <View style={styles.podcastCardOverlayHome}>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal de détail du livre - Design comme l'image */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.bookModalContainer, { backgroundColor: theme.surface || '#F5F5F5' }]}>
          {selectedBook && (
            <>
              {/* StatusBar et Header avec X et Bookmark */}
              <StatusBar style={darkMode ? 'light' : 'dark'} />
              <View style={styles.bookModalHeader}>
                <TouchableOpacity 
                  style={styles.bookModalCloseBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.bookModalCloseIcon, { color: theme.text }]}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.bookModalBookmarkBtn}
                  onPress={handleBookmark}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.bookModalBookmarkIcon, 
                    { color: isBookmarked ? '#0F5132' : theme.text }
                  ]}>
                    {isBookmarked ? '🔖' : '🔖'}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.bookModalScroll}
                contentContainerStyle={styles.bookModalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Image de couverture avec texte superposé */}
                <View style={styles.bookModalImageContainer}>
                  <ImageBackground
                    source={selectedBook.image || require('./assets/pdf/cover3.png')}
                    style={styles.bookModalImage}
                    imageStyle={styles.bookModalImageStyle}
                  >
                    <View style={styles.bookModalImageOverlay}>
                      <Text style={[
                        styles.bookModalImageTitle,
                        selectedBook.titleAr && { fontFamily: 'Traditional Arabic' }
                      ]}>
                        {selectedBook.titleAr || selectedBook.title}
                      </Text>
                      {selectedBook.titleAr && (
                        <Text style={styles.bookModalImageSubtitle}>
                          {selectedBook.title}
                        </Text>
                      )}
                      <Text style={styles.bookModalImageFooter}>Fayda Tidianiya</Text>
                    </View>
                  </ImageBackground>
                </View>

                {/* Titre principal */}
                <Text style={[
                  styles.bookModalMainTitle, 
                  { color: theme.text },
                  selectedBook.titleAr && { fontFamily: 'Traditional Arabic' }
                ]}>
                  {selectedBook.titleAr || selectedBook.title}
                </Text>

                {/* Auteur */}
                {selectedBook.author && (
                  <Text style={[styles.bookModalAuthor, { color: theme.textSecondary }]}>
                    {selectedBook.author}
                  </Text>
                )}

                {/* Métadonnées */}
                <View style={styles.bookModalMetadata}>
                  <Text style={[styles.bookModalMetadataText, { color: theme.textSecondary }]}>
                    {selectedBook.pages || 0} {t('stats.pages')} • {selectedBook.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                </View>

                {/* Boutons de contrôle */}
                <View style={styles.bookModalControls}>
                  <TouchableOpacity 
                    style={styles.bookModalReadButton}
                    onPress={handleOpenBook}
                    activeOpacity={0.9}
                  >
                    <View style={styles.bookModalReadButtonGradient}>
                      <Text style={styles.bookModalReadIcon}>▶</Text>
                      <Text style={styles.bookModalReadText}>Ouvrir</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bookModalMenuButton}
                    onPress={handleMenuPress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.bookModalMenuIcon}>⋯</Text>
                  </TouchableOpacity>
                </View>

                {/* Onglets Overview / Chapters */}
                <View style={styles.bookModalTabs}>
                  <TouchableOpacity 
                    style={[
                      styles.bookModalTab, 
                      activeTab === 'overview' && styles.bookModalTabActive
                    ]}
                    onPress={() => setActiveTab('overview')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.bookModalTabText, 
                      activeTab === 'overview' ? styles.bookModalTabTextActive : { color: theme.textSecondary }
                    ]}>
                      {language === 'fr' ? 'Aperçu' : language === 'ar' ? 'نظرة عامة' : 'Overview'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.bookModalTab,
                      activeTab === 'chapters' && styles.bookModalTabActive
                    ]}
                    onPress={() => setActiveTab('chapters')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.bookModalTabText, 
                      activeTab === 'chapters' ? styles.bookModalTabTextActive : { color: theme.textSecondary }
                    ]}>
                      {language === 'fr' ? 'Chapitres' : language === 'ar' ? 'فصول' : 'Chapters'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Contenu selon l'onglet actif */}
                {activeTab === 'overview' ? (
                  <View style={styles.bookModalAboutSection}>
                    <Text style={[styles.bookModalSectionTitle, { color: theme.text }]}>
                      {language === 'fr' ? 'À propos' : language === 'ar' ? 'حول' : 'About'}
                    </Text>
                    <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                      {selectedBook.description || 'Livre islamique de grande valeur spirituelle.'}
                    </Text>
                    
                    {/* Informations supplémentaires */}
                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <Text style={[styles.bookModalSectionTitle, { color: theme.text, fontSize: 16, marginRight: 15 }]}>
                          📄 {t('stats.pages')}:
                        </Text>
                        <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                          {selectedBook.pages || 0}
                        </Text>
                      </View>
                      {selectedBook.rating && (
                        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                          <Text style={[styles.bookModalSectionTitle, { color: theme.text, fontSize: 16, marginRight: 15 }]}>
                            ⭐ {t('stats.rating')}:
                          </Text>
                          <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                            {selectedBook.rating}/5.0
                          </Text>
                        </View>
                      )}
                      {selectedBook.downloads && (
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={[styles.bookModalSectionTitle, { color: theme.text, fontSize: 16, marginRight: 15 }]}>
                            ⬇️ {t('stats.downloads')}:
                          </Text>
                          <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                            {selectedBook.downloads.toLocaleString()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.bookModalAboutSection}>
                    <Text style={[styles.bookModalSectionTitle, { color: theme.text }]}>
                      {language === 'fr' ? 'Chapitres' : language === 'ar' ? 'فصول' : 'Chapters'}
                    </Text>
                    <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                      {language === 'fr' 
                        ? 'Les chapitres de ce livre seront affichés ici.' 
                        : language === 'ar'
                        ? 'سيتم عرض فصول هذا الكتاب هنا.'
                        : 'Book chapters will be displayed here.'}
                    </Text>
                  </View>
                )}

                {/* Espace supplémentaire en bas */}
                <View style={{ height: 30 }} />
              </ScrollView>
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

// Écran des livres
function BooksScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer, addToHistory, setShowDonationBanner, recentItems, setLang, setDarkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [selectedBook, setSelectedBook] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'chapters'>('overview');
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const scrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nettoyer le timer au démontage
  React.useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const handleBookPress = (book: any) => {
    // Toujours afficher le modal pour tous les livres
    const fullBook = ebooks.find(b => b.id === book.id) || 
                     allPdfFilesWithPages.find(b => b.id === book.id) ||
                     frenchPdfFilesWithPages.find(b => b.id === book.id) ||
                     englishPdfFilesWithPages.find(b => b.id === book.id) ||
                     arabicPdfFilesWithPages.find(b => b.id === book.id) || {
      ...book,
      description: 'Livre islamique de grande valeur spirituelle.',
      rating: 4.5,
      downloads: 1000,
      category: 'Islam',
    };
    setSelectedBook(fullBook);
    setActiveTab('overview'); // Réinitialiser l'onglet
    setModalVisible(true);
  };

  const handleOpenBook = () => {
    if (selectedBook) {
      addToHistory(selectedBook, 'pdf');
      setCurrentPlayer({ item: selectedBook, type: 'book' });
      navigation.navigate('PDFReader', { book: selectedBook });
      setModalVisible(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Ici vous pouvez ajouter la logique pour sauvegarder les favoris
    Alert.alert(
      isBookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris',
      isBookmarked ? 'Le livre a été retiré de vos favoris.' : 'Le livre a été ajouté à vos favoris.'
    );
  };

  const handleMenuPress = () => {
    Alert.alert(
      selectedBook?.title || 'Options',
      'Que souhaitez-vous faire ?',
      [
        {
          text: 'Partager',
          onPress: () => {
            Share.share({
              message: `${selectedBook?.title} - ${selectedBook?.author || ''}`,
              title: selectedBook?.title || 'Livre',
            });
          },
        },
        {
          text: 'Ajouter à l\'historique',
          onPress: () => {
            if (selectedBook) {
              addToHistory(selectedBook, 'pdf');
              Alert.alert('Succès', 'Livre ajouté à l\'historique');
            }
          },
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  // Obtenir les catégories filtrées selon la langue
  const bookCategories = getBookCategories(language);

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleThemeChange = (newTheme: boolean) => {
    setDarkMode(newTheme);
  };

  const handleLanguageChange = (newLang: Language | null) => {
    setLang(newLang);
  };

  const handleSearchPress = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const performSearchWithQuery = (queryText: string) => {
    const query = queryText.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];
    const bookCategories = getBookCategories(language);

    // Rechercher dans les livres de la catégorie actuelle
    bookCategories.forEach(category => {
      category.books.forEach((book: any) => {
        const matchTitle = book.title?.toLowerCase().includes(query);
        const matchTitleAr = book.titleAr?.toLowerCase().includes(query);
        const matchAuthor = book.author?.toLowerCase().includes(query);
        const matchDescription = book.description?.toLowerCase().includes(query);
        
        if (matchTitle || matchTitleAr || matchAuthor || matchDescription) {
          results.push({ ...book, searchType: 'pdf' });
        }
      });
    });

    setSearchResults(results);
  };

  const performSearch = () => {
    performSearchWithQuery(searchQuery);
    setShowSuggestions(false);
  };

  const generateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryLower = query.toLowerCase().trim();
    const suggestionsSet = new Set<string>();
    const bookCategories = getBookCategories(language);

    bookCategories.forEach(category => {
      category.books.forEach((book: any) => {
        if (book.title?.toLowerCase().includes(queryLower)) {
          suggestionsSet.add(book.title);
        }
        if (book.titleAr?.toLowerCase().includes(queryLower)) {
          suggestionsSet.add(book.titleAr);
        }
        if (book.author?.toLowerCase().includes(queryLower)) {
          suggestionsSet.add(book.author);
        }
      });
    });

    const suggestions = Array.from(suggestionsSet).slice(0, 8);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    generateSuggestions(text);
    performSearchWithQuery(text);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    performSearchWithQuery(suggestion);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Nouveau header avec barre de langue */}
      <View style={[styles.booksHeaderNew, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={styles.headerIconButton}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <LanguageSelectorBar />
        <TouchableOpacity 
          style={styles.headerIconButton}
          onPress={handleSearchPress}
        >
          <Ionicons name="search-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.text, borderColor: theme.textSecondary }]}
            placeholder="Rechercher un livre..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            autoFocus={true}
            onSubmitEditing={performSearch}
            returnKeyType="search"
            onFocus={() => {
              if (searchQuery.trim()) {
                generateSuggestions(searchQuery);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={performSearch}
            >
              <Ionicons name="search" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.searchCloseButton}
            onPress={handleSearchPress}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Suggestions d'autocomplétion */}
      {showSearch && showSuggestions && searchSuggestions.length > 0 && (
        <View style={[styles.searchSuggestionsContainer, { backgroundColor: theme.surface }]}>
          {searchSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.searchSuggestionItem, { borderBottomColor: theme.textSecondary + '20' }]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Ionicons name="search-outline" size={18} color={theme.textSecondary} style={styles.searchSuggestionIcon} />
              <Text style={[styles.searchSuggestionText, { color: theme.text }]} numberOfLines={1}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Résultats de recherche */}
      {showSearch && searchQuery.trim() && searchResults.length > 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>🔍</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>
                  Résultats de recherche ({searchResults.length})
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Pour: "{searchQuery}"
                </Text>
              </View>
            </View>
          </View>
          <ScrollView 
            style={styles.searchResultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {searchResults.map((item, index) => {
              const isViewed = recentItems.some(ri => ri.id === item.id && ri.type === 'pdf');
              return (
                <TouchableOpacity
                  key={`search-${item.id}-${index}`}
                  style={[styles.searchResultItem, { backgroundColor: theme.surface }]}
                  onPress={() => {
                    const fullBook = allPdfFilesWithPages.find(b => b.id === item.id) ||
                                     frenchPdfFilesWithPages.find(b => b.id === item.id) ||
                                     englishPdfFilesWithPages.find(b => b.id === item.id) ||
                                     arabicPdfFilesWithPages.find(b => b.id === item.id) ||
                                     item;
                    setSelectedBook(fullBook);
                    setActiveTab('overview');
                    setModalVisible(true);
                  }}
                >
                  {item.image && (
                    <Image
                      source={item.image}
                      style={styles.searchResultImage}
                    />
                  )}
                  <View style={styles.searchResultContent}>
                    <Text style={[styles.searchResultTitle, { color: theme.text }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.titleAr && (
                      <Text style={[styles.searchResultTitleAr, { color: theme.textSecondary }]} numberOfLines={1}>
                        {item.titleAr}
                      </Text>
                    )}
                    {item.author && (
                      <Text style={[styles.searchResultAuthor, { color: theme.textSecondary }]}>
                        {item.author}
                      </Text>
                    )}
                    <Text style={[styles.searchResultType, { color: theme.primary }]}>
                      📚 Livre PDF
                    </Text>
                  </View>
                  {isViewed && (
                    <Image source={require('./assets/pdf/cover/icones/lun3.png')} style={styles.searchResultViewedIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Message si aucun résultat */}
      {showSearch && searchQuery.trim() && searchResults.length === 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
              Aucun résultat trouvé pour "{searchQuery}"
            </Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.booksScrollModern} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.booksScrollContentNew}
        onScroll={(event) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          
          // Cacher la bande dès qu'on scrolle
          setShowDonationBanner(false);
          
          // Annuler le timer précédent
          if (scrollTimer.current) {
            clearTimeout(scrollTimer.current);
          }
          
          // Créer un nouveau timer pour réafficher la bande après 500ms d'inactivité
          scrollTimer.current = setTimeout(() => {
            setShowDonationBanner(true);
          }, 500);
          
          lastScrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
      >
        {!showSearch && bookCategories.map(category => (
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
            {category.id === 'pdf' ? (
              <View style={styles.booksGridContainer}>
                {(expandedCategory === category.id ? category.books : category.books.slice(0, 8)).map((book, index) => {
                  const isLastInRow = (index + 1) % 4 === 0;
                  const isViewed = recentItems.some(item => item.id === book.id && item.type === 'pdf');
                  return (
                  <TouchableOpacity
                    key={book.id}
                    style={[
                      styles.bookCardGrid, 
                      { backgroundColor: theme.surface, width: (width - 40) / 4 - 8 },
                      isLastInRow && { marginRight: 0 } // Pas de marginRight sur la 4ème colonne
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleBookPress(book)}
                  >
                    {(book as any).image ? (
                      <ImageBackground
                        source={(book as any).image}
                        style={[(book as any).htmlFile ? styles.bookCoverArticle : styles.bookCoverModern, !(book as any).htmlFile && { height: 140 }]}
                        imageStyle={styles.bookCoverImageStyle}
                      >
                        <View style={styles.bookCoverOverlay} />
                        {isViewed && (
                          <View style={styles.viewedIconContainer}>
                            <Image source={require('./assets/pdf/cover/icones/lun3.png')} style={styles.viewedIconImage} />
                          </View>
                        )}
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={['#0F5132', '#0B3C5D', '#0F5132']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[(book as any).htmlFile ? styles.bookCoverArticle : styles.bookCoverModern, !(book as any).htmlFile && { height: 140 }]}
                      >
                        <Text style={styles.bookCoverEmojiModern}>{book.cover || '📖'}</Text>
                        {isViewed && (
                          <View style={styles.viewedIconContainer}>
                            <Image source={require('./assets/pdf/cover/icones/lun3.png')} style={styles.viewedIconImage} />
                          </View>
                        )}
                      </LinearGradient>
                    )}
                    <View style={styles.bookCardContentModern}>
                      <Text style={[styles.bookTitleModern, { color: theme.text }]} numberOfLines={2}>{book.title}</Text>
                      <Text style={[styles.bookAuthorModern, { color: theme.textSecondary }]} numberOfLines={1}>{book.author}</Text>
                      <View style={styles.bookPagesContainerModern}>
                        <Text style={styles.bookPagesIcon}>📄</Text>
                        <Text style={styles.bookPagesModern}>{book.pages} pages</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  );
                })}
              </View>
            ) : category.id === 'tariqa' || category.id === 'maarifa' ? (
              // Affichage en slide (ScrollView horizontal) pour Tariqa et Ma'rifa avec format carré
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.horizontalScrollModern} 
                contentContainerStyle={styles.horizontalScrollContentModern}
              >
                {(expandedCategory === category.id ? category.books : category.books.slice(0, 3)).map(book => (
                  <TouchableOpacity
                    key={book.id}
                    style={[styles.bookCardArticle, { backgroundColor: theme.surface }]}
                    activeOpacity={0.8}
                    onPress={() => handleBookPress(book)}
                  >
                    {(book as any).image ? (
                      <ImageBackground
                        source={(book as any).image}
                        style={styles.bookCoverArticle}
                        imageStyle={styles.bookCoverImageStyle}
                      >
                        <View style={styles.bookCoverOverlay} />
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={['#0F5132', '#0B3C5D', '#0F5132']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.bookCoverArticle}
                      >
                        <Text style={styles.bookCoverEmojiModern}>{book.cover || '📖'}</Text>
                      </LinearGradient>
                    )}
                    <View style={styles.bookCardContentModern}>
                      <Text style={[styles.bookTitleModern, { color: theme.text }]} numberOfLines={2}>{book.title}</Text>
                      {book.titleAr && (
                        <Text style={[styles.bookTitleArModern, { color: theme.textSecondary }]} numberOfLines={2}>{book.titleAr}</Text>
                      )}
                      <Text style={[styles.bookAuthorModern, { color: theme.textSecondary }]} numberOfLines={1}>{book.author}</Text>
                      <View style={styles.bookPagesContainerModern}>
                        <Text style={styles.bookPagesIcon}>📄</Text>
                        <Text style={styles.bookPagesModern}>{book.pages} pages</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
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
                  {(book as any).image ? (
                    <ImageBackground
                      source={(book as any).image}
                      style={(book as any).htmlFile ? styles.bookCoverArticle : styles.bookCoverModern}
                      imageStyle={styles.bookCoverImageStyle}
                    >
                      <View style={styles.bookCoverOverlay} />
                    </ImageBackground>
                  ) : (
                    <LinearGradient
                      colors={['#0F5132', '#0B3C5D', '#0F5132']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={(book as any).htmlFile ? styles.bookCoverArticle : styles.bookCoverModern}
                    >
                      <Text style={styles.bookCoverEmojiModern}>{book.cover || '📖'}</Text>
                    </LinearGradient>
                  )}
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
            )}
          </View>
        ))}
      </ScrollView>

      {/* Modal de détail du livre - Design comme l'image */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.bookModalContainer, { backgroundColor: theme.surface || '#F5F5F5' }]}>
              {selectedBook && (
                <>
              {/* StatusBar et Header avec X et Bookmark */}
              <StatusBar style={darkMode ? 'light' : 'dark'} />
              <View style={styles.bookModalHeader}>
                      <TouchableOpacity 
                  style={styles.bookModalCloseBtn}
                        onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.bookModalCloseIcon, { color: theme.text }]}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.bookModalBookmarkBtn}
                  onPress={handleBookmark}
                        activeOpacity={0.7}
                      >
                  <Text style={[
                    styles.bookModalBookmarkIcon, 
                    { color: isBookmarked ? '#0F5132' : theme.text }
                  ]}>
                    {isBookmarked ? '🔖' : '🔖'}
                  </Text>
                      </TouchableOpacity>
                    </View>

              <ScrollView
                style={styles.bookModalScroll}
                contentContainerStyle={styles.bookModalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Image de couverture avec texte superposé */}
                <View style={styles.bookModalImageContainer}>
                  <ImageBackground
                    source={selectedBook.image || require('./assets/pdf/cover3.png')}
                    style={styles.bookModalImage}
                    imageStyle={styles.bookModalImageStyle}
                  >
                    <View style={styles.bookModalImageOverlay}>
                      <Text style={styles.bookModalImageTitle}>
                        {selectedBook.titleAr || selectedBook.title}
                        </Text>
                      {selectedBook.titleAr && (
                        <Text style={styles.bookModalImageSubtitle}>
                          {selectedBook.title}
                        </Text>
                      )}
                      <Text style={styles.bookModalImageFooter}>Fayda Tidianiya</Text>
                      </View>
                  </ImageBackground>
                </View>

                {/* Titre principal */}
                <Text style={[styles.bookModalMainTitle, { color: theme.text }]}>
                  {selectedBook.titleAr || selectedBook.title}
                </Text>

                {/* Auteur */}
                {selectedBook.author && (
                  <Text style={[styles.bookModalAuthor, { color: theme.textSecondary }]}>
                    {selectedBook.author}
                  </Text>
                )}

                {/* Métadonnées */}
                <View style={styles.bookModalMetadata}>
                  <Text style={[styles.bookModalMetadataText, { color: theme.textSecondary }]}>
                    {selectedBook.pages || 0} {t('stats.pages')} • {selectedBook.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Text>
                      </View>

                {/* Boutons de contrôle */}
                <View style={styles.bookModalControls}>
                  <TouchableOpacity 
                    style={styles.bookModalReadButton}
                    onPress={handleOpenBook}
                    activeOpacity={0.9}
                  >
                    <View style={styles.bookModalReadButtonGradient}>
                      <Text style={styles.bookModalReadIcon}>▶</Text>
                      <Text style={styles.bookModalReadText}>Ouvrir</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bookModalMenuButton}
                    onPress={handleMenuPress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.bookModalMenuIcon}>⋯</Text>
                  </TouchableOpacity>
            </View>

                {/* Onglets Overview / Chapters */}
                <View style={styles.bookModalTabs}>
                  <TouchableOpacity 
                    style={[
                      styles.bookModalTab, 
                      activeTab === 'overview' && styles.bookModalTabActive
                    ]}
                    onPress={() => setActiveTab('overview')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.bookModalTabText, 
                      activeTab === 'overview' ? styles.bookModalTabTextActive : { color: theme.textSecondary }
                    ]}>
                      {language === 'fr' ? 'Aperçu' : language === 'ar' ? 'نظرة عامة' : 'Overview'}
                    </Text>
          </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.bookModalTab,
                      activeTab === 'chapters' && styles.bookModalTabActive
                    ]}
                    onPress={() => setActiveTab('chapters')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.bookModalTabText, 
                      activeTab === 'chapters' ? styles.bookModalTabTextActive : { color: theme.textSecondary }
                    ]}>
                      {language === 'fr' ? 'Chapitres' : language === 'ar' ? 'فصول' : 'Chapters'}
                    </Text>
        </TouchableOpacity>
                </View>

                {/* Contenu selon l'onglet actif */}
                {activeTab === 'overview' ? (
                  <View style={styles.bookModalAboutSection}>
                    <Text style={[styles.bookModalSectionTitle, { color: theme.text }]}>
                      {language === 'fr' ? 'À propos' : language === 'ar' ? 'حول' : 'About'}
                    </Text>
                    <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                      {selectedBook.description || 'Livre islamique de grande valeur spirituelle.'}
                    </Text>
                    
                    {/* Informations supplémentaires */}
                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <Text style={[styles.bookModalSectionTitle, { color: theme.text, fontSize: 16, marginRight: 15 }]}>
                          📄 {t('stats.pages')}:
                        </Text>
                        <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                          {selectedBook.pages || 0}
                        </Text>
                      </View>
                      {selectedBook.rating && (
                        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                          <Text style={[styles.bookModalSectionTitle, { color: theme.text, fontSize: 16, marginRight: 15 }]}>
                            ⭐ {t('stats.rating')}:
                          </Text>
                          <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                            {selectedBook.rating}/5.0
                          </Text>
                        </View>
                      )}
                      {selectedBook.downloads && (
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={[styles.bookModalSectionTitle, { color: theme.text, fontSize: 16, marginRight: 15 }]}>
                            ⬇️ {t('stats.downloads')}:
                          </Text>
                          <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                            {selectedBook.downloads.toLocaleString()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.bookModalAboutSection}>
                    <Text style={[styles.bookModalSectionTitle, { color: theme.text }]}>
                      {language === 'fr' ? 'Chapitres' : language === 'ar' ? 'فصول' : 'Chapters'}
                    </Text>
                    <Text style={[styles.bookModalAboutText, { color: theme.text }]}>
                      {language === 'fr' 
                        ? 'Les chapitres de ce livre seront affichés ici.' 
                        : language === 'ar'
                        ? 'سيتم عرض فصول هذا الكتاب هنا.'
                        : 'Book chapters will be displayed here.'}
                    </Text>
                  </View>
                )}

                {/* Espace supplémentaire en bas */}
                <View style={{ height: 30 }} />
              </ScrollView>
            </>
          )}
        </View>
      </Modal>

      {/* Modal des paramètres */}
      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.settingsModal, { backgroundColor: theme.surface }]}>
            <View style={styles.settingsModalHeader}>
              <Text style={[styles.settingsModalTitle, { color: theme.text }]}>Paramètres</Text>
              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                style={styles.settingsModalCloseButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Section Thème */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Thème</Text>
              <View style={styles.settingsOptions}>
                <TouchableOpacity
                  style={[styles.settingsOption, !darkMode && styles.settingsOptionActive, { borderColor: !darkMode ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleThemeChange(false)}
                >
                  <Ionicons name="sunny" size={24} color={!darkMode ? '#0F5132' : theme.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Clair</Text>
                  {!darkMode && <Ionicons name="checkmark-circle" size={24} color="#0F5132" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, darkMode && styles.settingsOptionActive, { borderColor: darkMode ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleThemeChange(true)}
                >
                  <Ionicons name="moon" size={24} color={darkMode ? '#ffffff' : theme.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Sombre</Text>
                  {darkMode && <Ionicons name="checkmark-circle" size={24} color="#ffffff" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Section Langue */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Langue</Text>
              <View style={styles.settingsOptions}>
                <TouchableOpacity
                  style={[styles.settingsOption, language === null && styles.settingsOptionActive, { borderColor: language === null ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange(null)}
                >
                  <Text style={styles.settingsOptionFlag}>🌍</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Tous</Text>
                  {language === null && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, language === 'fr' && styles.settingsOptionActive, { borderColor: language === 'fr' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('fr')}
                >
                  <Text style={styles.settingsOptionFlag}>🇫🇷</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Français</Text>
                  {language === 'fr' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, language === 'en' && styles.settingsOptionActive, { borderColor: language === 'en' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('en')}
                >
                  <Text style={styles.settingsOptionFlag}>🇬🇧</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>English</Text>
                  {language === 'en' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, language === 'ar' && styles.settingsOptionActive, { borderColor: language === 'ar' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('ar')}
                >
                  <Text style={styles.settingsOptionFlag}>🇸🇦</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>عربي</Text>
                  {language === 'ar' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Écran de musique
function MusicScreen({ navigation }: any) {
  const { language, darkMode, setShowDonationBanner } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const lastScrollY = React.useRef(0);
  const scrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nettoyer le timer au démontage
  React.useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header simple */}
      <View style={[styles.podcastsHeaderSimple, { backgroundColor: theme.surface }]}>
        <Text style={[styles.podcastsHeaderTitleSimple, { color: darkMode ? '#ffffff' : '#0F5132' }]}>Musique</Text>
        <LanguageSelector />
      </View>

      <ScrollView 
        style={styles.podcastsScrollNew} 
        contentContainerStyle={styles.podcastsScrollContentNew}
        onScroll={(event) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          
          // Cacher la bande dès qu'on scrolle
          setShowDonationBanner(false);
          
          // Annuler le timer précédent
          if (scrollTimer.current) {
            clearTimeout(scrollTimer.current);
          }
          
          // Créer un nouveau timer pour réafficher la bande après 500ms d'inactivité
          scrollTimer.current = setTimeout(() => {
            setShowDonationBanner(true);
          }, 500);
          
          lastScrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Zikr & Music Snippets - Cartes horizontales */}
        <View style={styles.podcastsSection}>
          <View style={styles.podcastsSectionHeader}>
            <Text style={[styles.podcastsSectionTitle, { color: darkMode ? '#ffffff' : '#0F5132' }]}>Zikr & Music Snippets</Text>
            <TouchableOpacity style={styles.podcastsViewAllButton}>
              <Text style={styles.podcastsViewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.podcastsHorizontalScroll}
          >
            {zikrFiles.slice(0, 3).map((track) => (
              <TouchableOpacity
                key={track.id}
                style={styles.podcastCardHorizontal}
                activeOpacity={0.9}
                onPress={() => {
                  navigation.navigate('Zikr');
                }}
              >
                {/* Image d'album avec texte */}
                <View style={styles.podcastAlbumContainer}>
                  <Image 
                    source={track.image || require('./assets/thierno.png')} 
                    style={styles.podcastAlbumImage}
                    resizeMode="cover"
                  />
                  <View style={styles.podcastAlbumOverlay}>
                    <Text style={styles.podcastAlbumTextAr}>{track.titleAr}</Text>
                    <Text style={styles.podcastAlbumTextLatin}>{track.title}</Text>
                    <View style={styles.podcastAlbumLogo}>
                      <Text style={styles.podcastAlbumLogoText}>فيضة FAYDA</Text>
                    </View>
                  </View>
                </View>
                
                {/* Titre et infos */}
                <Text style={[styles.podcastCardTitle, { color: theme.text }]} numberOfLines={1}>
                  {track.title}
                </Text>
                
                {/* Infos avec icônes */}
                <View style={styles.podcastCardInfo}>
                  <View style={styles.podcastCardInfoItem}>
                    <Text style={styles.podcastCardInfoIcon}>🎧</Text>
                    <Text style={[styles.podcastCardInfoText, { color: theme.textSecondary }]}>
                      {track.duration}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Zikr - Grande carte */}
        <View style={styles.podcastsSection}>
          <View style={styles.podcastsSectionHeader}>
            <Text style={[styles.podcastsSectionTitle, { color: darkMode ? '#ffffff' : '#0F5132' }]}>Zikr</Text>
            <TouchableOpacity style={styles.podcastsViewAllButton}>
              <Text style={styles.podcastsViewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.podcastZikrCard}
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate('Zikr');
            }}
          >
            <ImageBackground
              source={require('./assets/pdf/cover/zikr.png')}
              style={styles.podcastZikrGradient}
              resizeMode="cover"
              imageStyle={Platform.OS === 'web' ? { width: '100%', height: '100%', objectFit: 'cover' as any } : {}}
            >
              {/* L'image contient déjà les textes "Zikr" et "ذكر" */}
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Section Coran - Grande carte */}
        <View style={styles.podcastsSection}>
          <View style={styles.podcastsSectionHeader}>
            <Text style={[styles.podcastsSectionTitle, { color: darkMode ? '#ffffff' : '#0F5132' }]}>Coran</Text>
            <TouchableOpacity style={styles.podcastsViewAllButton}>
              <Text style={styles.podcastsViewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.podcastZikrCard}
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate('Coran');
            }}
          >
            <ImageBackground
              source={require('./assets/pdf/cover/coran.png')}
              style={styles.podcastZikrGradient}
              resizeMode="cover"
              imageStyle={Platform.OS === 'web' ? { width: '100%', height: '100%', objectFit: 'cover' as any } : {}}
            >
              {/* L'image contient déjà les textes "AL qur'ane" et "القرآن الكريم" */}
            </ImageBackground>
          </TouchableOpacity>
              </View>

        {/* Section Gamou - Grande carte */}
        <View style={styles.podcastsSection}>
          <View style={styles.podcastsSectionHeader}>
            <Text style={[styles.podcastsSectionTitle, { color: darkMode ? '#ffffff' : '#0F5132' }]}>Gamou</Text>
            <TouchableOpacity style={styles.podcastsViewAllButton}>
              <Text style={styles.podcastsViewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.podcastZikrCard}
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'Gamou' });
            }}
          >
            <ImageBackground
              source={require('./assets/pdf/cover/gamou.png')}
              style={styles.podcastZikrGradient}
              resizeMode="cover"
              imageStyle={Platform.OS === 'web' ? { width: '100%', height: '100%', objectFit: 'cover' as any } : {}}
            >
              {/* L'image contient déjà les textes "GAMOU" et les textes arabes */}
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Écran Zikr - Design selon l'image
function ZikrScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer, currentPlayer, addToHistory, recentItems } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showCarMode, setShowCarMode] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showSleepTimer, setShowSleepTimer] = React.useState(false);

  // Utiliser expo-audio pour la lecture
  const getAudioSource = () => {
    if (currentPlayer?.type === 'zikr' && currentPlayer.item) {
      if (currentPlayer.item.file) {
        return currentPlayer.item.file;
      }
      return require('./assets/audio/audio.mp3');
    }
    return require('./assets/audio/audio.mp3');
  };

  const player = useAudioPlayer(getAudioSource());

  React.useEffect(() => {
    if (player && currentPlayer?.type === 'zikr') {
      setPosition(0);
      setDuration(0);
      
      // Démarrer automatiquement la lecture
      const startPlayback = async () => {
        try {
          if (player && !player.playing) {
            await player.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.log('Erreur démarrage automatique:', error);
        }
      };
      
      startPlayback();
      
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
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }
  }, [player, currentPlayer]);

  // Appliquer la vitesse de lecture quand elle change
  React.useEffect(() => {
    if (player && currentPlayer?.type === 'zikr') {
      try {
        // Essayer d'appliquer la vitesse au player
        if ('rate' in player) {
          (player as any).rate = playbackSpeed;
        }
      } catch (error) {
        console.log('Erreur application vitesse:', error);
      }
    }
  }, [playbackSpeed, player, currentPlayer]);

  const togglePlay = async () => {
    try {
      if (player) {
        if (player.playing) {
          await player.pause();
          setIsPlaying(false);
        } else {
          await player.play();
          setIsPlaying(true);
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

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (current: number, total: number) => {
    const remaining = total - current;
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `-${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRewind = async () => {
    try {
      if (player) {
        const currentTime = player.currentTime || 0;
        const newTime = Math.max(0, currentTime - 30);
        // Utiliser setPosition pour mettre à jour l'état, le player se mettra à jour automatiquement
        setPosition(newTime * 1000);
        // Forcer la mise à jour en relançant la lecture si nécessaire
        if (player.playing) {
          await player.pause();
          await player.play();
        }
      }
    } catch (error) {
      console.log('Erreur rewind:', error);
    }
  };

  const handleForward = async () => {
    try {
      if (player) {
        const currentTime = player.currentTime || 0;
        const maxTime = player.duration || 0;
        const newTime = Math.min(maxTime, currentTime + 30);
        // Utiliser setPosition pour mettre à jour l'état
        setPosition(newTime * 1000);
        // Forcer la mise à jour en relançant la lecture si nécessaire
        if (player.playing) {
          await player.pause();
          await player.play();
        }
      }
    } catch (error) {
      console.log('Erreur forward:', error);
    }
  };

  const handlePrevious = () => {
    const currentIndex = zikrFiles.findIndex(z => z.id === currentPlayer?.item?.id);
    if (currentIndex > 0) {
      setCurrentPlayer({ item: zikrFiles[currentIndex - 1], type: 'zikr' });
    }
  };

  const handleNext = () => {
    const currentIndex = zikrFiles.findIndex(z => z.id === currentPlayer?.item?.id);
    if (currentIndex < zikrFiles.length - 1) {
      setCurrentPlayer({ item: zikrFiles[currentIndex + 1], type: 'zikr' });
    }
  };


  const handleShare = async () => {
    if (currentPlayer?.item) {
      try {
        await Share.share({
          message: `Écoutez "${currentPlayer.item.title}" sur Fayda Tidianiya`,
          title: currentPlayer.item.title,
        });
      } catch (error) {
        console.error('Erreur partage:', error);
      }
    }
  };

  const handleClosePlayer = () => {
    setCurrentPlayer(null);
    if (player) {
      player.pause();
    }
  };

  const handleSpeedChange = async () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    
    // Appliquer la vitesse au player si possible
    try {
      if (player && 'rate' in player) {
        (player as any).rate = newSpeed;
      }
    } catch (error) {
      console.log('Erreur changement vitesse:', error);
    }
  };

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
    Alert.alert(
      'Options',
      'Choisissez une option',
      [
        { text: 'Ajouter à la playlist', onPress: () => {} },
        { text: 'Télécharger', onPress: () => {} },
        { text: 'Supprimer', onPress: () => {}, style: 'destructive' },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleSleepTimer = () => {
    setShowSleepTimer(!showSleepTimer);
    Alert.alert(
      'Minuteur de sommeil',
      'Choisissez la durée',
      [
        { text: '5 minutes', onPress: () => {} },
        { text: '10 minutes', onPress: () => {} },
        { text: '15 minutes', onPress: () => {} },
        { text: '30 minutes', onPress: () => {} },
        { text: 'Désactiver', onPress: () => setShowSleepTimer(false) },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header avec bouton retour */}
      <View style={[styles.zikrHeader, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.zikrBackButton}
        >
          <Text style={[styles.zikrBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.zikrHeaderTitle, { color: darkMode ? '#ffffff' : '#0F5132' }]}>Zikr</Text>
        <View style={styles.zikrHeaderSpacer} />
      </View>

      <ScrollView 
        style={styles.zikrScrollView} 
        contentContainerStyle={[styles.zikrScrollContent, currentPlayer?.type === 'zikr' && { paddingBottom: 220 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Zikr en haut */}
        <View style={styles.zikrBannerContainer}>
          <ImageBackground
            source={require('./assets/pdf/cover/zikr.png')}
            style={styles.zikrBannerGradient}
            resizeMode="cover"
          >
            {/* L'image contient déjà les textes "Zikr" et "ذكر" avec les portraits */}
          </ImageBackground>
        </View>

        {/* Section Header */}
        <View style={styles.zikrSectionHeader}>
          <Text style={[styles.zikrSectionTitle, { color: theme.text }]}>Zikr</Text>
          <Text style={[styles.zikrSectionSubtitle, { color: theme.textSecondary }]}>
            {zikrFiles.length} tracks
          </Text>
        </View>

        {/* Liste des fichiers Zikr */}
        {zikrFiles.map((zikr) => {
          const isPlaying = currentPlayer?.type === 'zikr' && currentPlayer.item?.id === zikr.id;
          const isViewed = recentItems.some(item => item.id === zikr.id && item.type === 'audio');
          
          return (
            <TouchableOpacity
              key={zikr.id}
              style={[styles.zikrCard, { backgroundColor: theme.surface }]}
              activeOpacity={0.9}
              onPress={() => {
                addToHistory(zikr, 'audio');
                setCurrentPlayer({ item: zikr, type: 'zikr' });
              }}
            >
              {/* Thumbnail avec overlay */}
              <View style={styles.zikrThumbnailContainer}>
                <Image 
                  source={zikr.image || require('./assets/thierno.png')} 
                  style={styles.zikrThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.zikrThumbnailOverlay}>
                  <Text style={styles.zikrThumbnailOverlayText}>
                    {zikr.subtitle?.toUpperCase() || zikr.title.toUpperCase()}
                  </Text>
                </View>
                {isViewed && (
                  <View style={styles.viewedIconContainerAudio}>
                    <Image source={require('./assets/pdf/cover/icones/pl3.png')} style={styles.viewedIconImageAudio} />
                  </View>
                )}
              </View>

              {/* Contenu de la carte */}
              <View style={styles.zikrCardContent}>
                <Text style={[styles.zikrCardTitleAr, { color: theme.text }]} numberOfLines={1}>
                  {zikr.titleAr}
                </Text>
                <Text style={[styles.zikrCardTitle, { color: theme.text }]} numberOfLines={2}>
                  {zikr.title}
                </Text>
                {zikr.subtitle && (
                  <Text style={[styles.zikrCardSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                    {zikr.subtitle}
                  </Text>
                )}
                <Text style={[styles.zikrCardDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                  {zikr.description}
                </Text>
                
                {/* Métadonnées */}
                <View style={styles.zikrCardFooter}>
                  <View style={styles.zikrCardFooterLeft}>
                    <Text style={styles.zikrCardFooterIcon}>🎧</Text>
                    <Text style={[styles.zikrCardFooterText, { color: theme.textSecondary }]}>
                      {zikr.duration || zikr.tracks || '--:--'}
                    </Text>
                  </View>
                  <View style={styles.zikrCardFooterRight}>
                    <TouchableOpacity style={styles.zikrCardFooterButton}>
                      <Text style={styles.zikrCardFooterButtonIcon}>🔖</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.zikrCardFooterButton}
                      onPress={() => setShowInfo(!showInfo)}
                    >
                      <Text style={styles.zikrCardFooterButtonIcon}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lecteur audio selon l'image - Design complet */}
      {currentPlayer?.type === 'zikr' && currentPlayer.item && (
        <View style={styles.zikrPlayerContainer}>
          {/* Header avec icônes */}
          <View style={styles.zikrPlayerHeader}>
            <TouchableOpacity 
              onPress={handleClosePlayer}
              style={styles.zikrPlayerHeaderIcon}
            >
              <Text style={styles.zikrPlayerHeaderIconText}>←</Text>
            </TouchableOpacity>
            <View style={styles.zikrPlayerHeaderIcons}>
              <TouchableOpacity 
                style={[styles.zikrPlayerHeaderIcon, showCarMode && { backgroundColor: '#0F5132', borderRadius: 12 }]}
                onPress={() => setShowCarMode(!showCarMode)}
              >
                <Text style={styles.zikrPlayerHeaderIconText}>🚗</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.zikrPlayerHeaderIcon}
                onPress={handleShare}
              >
                <Text style={styles.zikrPlayerHeaderIconText}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.zikrPlayerHeaderIcon}
                onPress={() => {
                  setShowInfo(!showInfo);
                  if (currentPlayer?.item) {
                    Alert.alert(
                      currentPlayer.item.title,
                      currentPlayer.item.description || 'Informations sur cette piste',
                      [{ text: 'OK' }]
                    );
                  }
                }}
              >
                <Text style={styles.zikrPlayerHeaderIconText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Carte principale avec image */}
          <View style={styles.zikrPlayerCard}>
            <ImageBackground
              source={currentPlayer.item.image || require('./assets/thierno.png')}
              style={styles.zikrPlayerImage}
              resizeMode="cover"
              imageStyle={styles.zikrPlayerImageStyle}
            >
              {/* Overlay avec texte doré */}
              <View style={styles.zikrPlayerOverlay}>
                <Text style={styles.zikrPlayerOverlayText}>ZIKR IMAM AL-FAYDA</Text>
                <Text style={styles.zikrPlayerOverlayText}>SHAYKH TIJANI CISSE</Text>
              </View>
            </ImageBackground>
            
            {/* Section turquoise avec motif */}
            <LinearGradient
              colors={['#20B2AA', '#17A2B8', '#20B2AA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.zikrPlayerTealSection}
            >
              <View style={styles.zikrPlayerLogos}>
                <View style={styles.zikrPlayerFaydaLogo}>
                  <Text style={styles.zikrPlayerFaydaLogoAr}>فيضة</Text>
                  <Text style={styles.zikrPlayerFaydaLogoText}>FAYDA TIDIANIYA</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Titre de la piste */}
          <View style={styles.zikrPlayerTrackInfo}>
            <Text style={[styles.zikrPlayerTrackTitle, { color: theme.text }]} numberOfLines={1}>
              {currentPlayer.item.titleAr} {currentPlayer.item.title}
            </Text>
            <TouchableOpacity 
              style={styles.zikrPlayerOptions}
              onPress={handleMenuPress}
            >
              <Text style={styles.zikrPlayerOptionsIcon}>☰</Text>
            </TouchableOpacity>
          </View>

          {/* Barre de progression */}
          <View style={styles.zikrPlayerProgressContainer}>
            <Slider
              style={styles.zikrPlayerSlider}
              value={position}
              maximumValue={duration || 100}
              minimumValue={0}
              onValueChange={(value) => {
                setPosition(value);
                // Note: currentTime est en lecture seule dans expo-audio
                // La position sera mise à jour automatiquement par le player
              }}
              minimumTrackTintColor="#0F5132"
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor="#0F5132"
            />
            <View style={styles.zikrPlayerTimeContainer}>
              <Text style={[styles.zikrPlayerTimeText, { color: theme.text }]}>
                {formatTime(position)}
              </Text>
              <Text style={[styles.zikrPlayerTimeText, { color: theme.text }]}>
                {duration > 0 ? formatRemainingTime(position, duration) : '--:--'}
              </Text>
            </View>
          </View>

          {/* Contrôles de lecture - Design selon l'image */}
          <View style={styles.zikrPlayerControls}>
            {/* 30s Rewind Circle */}
            <TouchableOpacity 
              style={styles.zikrPlayer30sBtn}
              onPress={handleRewind}
              activeOpacity={0.7}
            >
              <View style={styles.zikrPlayer30sCircle}>
                <Text style={styles.zikrPlayer30sText}>30s</Text>
              </View>
            </TouchableOpacity>
            
            {/* Play/Pause Button */}
            <TouchableOpacity 
              style={styles.zikrPlayerPlayBtn}
              onPress={togglePlay}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D']}
                style={styles.zikrPlayerPlayBtnGradient}
              >
                <Text style={styles.zikrPlayerPlayIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* 30s Forward Circle */}
            <TouchableOpacity 
              style={styles.zikrPlayer30sBtn}
              onPress={handleForward}
              activeOpacity={0.7}
            >
              <View style={styles.zikrPlayer30sCircle}>
                <Text style={styles.zikrPlayer30sText}>30s</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contrôles supplémentaires */}
          <View style={styles.zikrPlayerBottomControls}>
            <TouchableOpacity 
              style={styles.zikrPlayerSpeedControl}
              onPress={handleSpeedChange}
            >
              <Text style={styles.zikrPlayerSpeedIcon}>⏱</Text>
              <Text style={[styles.zikrPlayerSpeedText, { color: theme.text }]}>
                {playbackSpeed.toFixed(1)}x
              </Text>
            </TouchableOpacity>
            <View style={styles.zikrPlayerBottomIcons}>
              <TouchableOpacity 
                style={[styles.zikrPlayerBottomIcon, showSleepTimer && { backgroundColor: '#C9A24D' }]}
                onPress={handleSleepTimer}
              >
                <Text style={styles.zikrPlayerBottomIconText}>Z</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// Écran Coran - Design similaire à ZikrScreen
function CoranScreen({ navigation }: any) {
  const { language, darkMode, setCurrentPlayer, currentPlayer, addToHistory, recentItems } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showCarMode, setShowCarMode] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showSleepTimer, setShowSleepTimer] = React.useState(false);

  // Préparer les fichiers Coran avec descriptions
  const coranFiles = coranTracks.map(track => ({
    id: track.id,
    title: track.title,
    titleAr: track.titleAr,
    subtitle: track.reciter,
    description: `Récitation de la sourate ${track.title} (${track.titleAr}) par ${track.reciter}. Une récitation mélodieuse et émouvante du Saint Coran.`,
    duration: track.duration,
    tracks: null,
    file: track.file,
    image: require('./assets/pdf/coran2.jpg'),
  }));

  // Utiliser expo-audio pour la lecture
  const getAudioSource = () => {
    if (currentPlayer?.type === 'coran' && currentPlayer.item) {
      if (currentPlayer.item.file) {
        return currentPlayer.item.file;
      }
      return require('./assets/audio/audio.mp3');
    }
    return require('./assets/audio/audio.mp3');
  };

  const player = useAudioPlayer(getAudioSource());

  React.useEffect(() => {
    if (player && currentPlayer?.type === 'coran') {
      setPosition(0);
      setDuration(0);
      
      // Démarrer automatiquement la lecture
      const startPlayback = async () => {
        try {
          if (player && !player.playing) {
            await player.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.log('Erreur démarrage automatique:', error);
        }
      };
      
      startPlayback();
      
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
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }
  }, [player, currentPlayer]);

  // Appliquer la vitesse de lecture quand elle change
  React.useEffect(() => {
    if (player && currentPlayer?.type === 'coran') {
      try {
        // Essayer d'appliquer la vitesse au player
        if ('rate' in player) {
          (player as any).rate = playbackSpeed;
        }
      } catch (error) {
        console.log('Erreur application vitesse:', error);
      }
    }
  }, [playbackSpeed, player, currentPlayer]);

  const togglePlay = async () => {
    try {
      if (player) {
        if (player.playing) {
          await player.pause();
          setIsPlaying(false);
        } else {
          await player.play();
          setIsPlaying(true);
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

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (current: number, total: number) => {
    const remaining = total - current;
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `-${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRewind = async () => {
    try {
      if (player) {
        const currentTime = player.currentTime || 0;
        const newTime = Math.max(0, currentTime - 30);
        setPosition(newTime * 1000);
        if (player.playing) {
          await player.pause();
          await player.play();
        }
      }
    } catch (error) {
      console.log('Erreur rewind:', error);
    }
  };

  const handleForward = async () => {
    try {
      if (player) {
        const currentTime = player.currentTime || 0;
        const maxTime = player.duration || 0;
        const newTime = Math.min(maxTime, currentTime + 30);
        setPosition(newTime * 1000);
        if (player.playing) {
          await player.pause();
          await player.play();
        }
      }
    } catch (error) {
      console.log('Erreur forward:', error);
    }
  };

  const handlePrevious = () => {
    const currentIndex = coranFiles.findIndex(c => c.id === currentPlayer?.item?.id);
    if (currentIndex > 0) {
      setCurrentPlayer({ item: coranFiles[currentIndex - 1], type: 'coran' });
    }
  };

  const handleNext = () => {
    const currentIndex = coranFiles.findIndex(c => c.id === currentPlayer?.item?.id);
    if (currentIndex < coranFiles.length - 1) {
      setCurrentPlayer({ item: coranFiles[currentIndex + 1], type: 'coran' });
    }
  };

  const handleShare = async () => {
    if (currentPlayer?.item) {
      try {
        await Share.share({
          message: `Écoutez "${currentPlayer.item.title}" - ${currentPlayer.item.titleAr} sur Fayda Tidianiya`,
          title: currentPlayer.item.title,
        });
      } catch (error) {
        console.error('Erreur partage:', error);
      }
    }
  };

  const handleClosePlayer = () => {
    setCurrentPlayer(null);
    if (player) {
      player.pause();
    }
  };

  const handleSpeedChange = async () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    
    try {
      if (player && 'rate' in player) {
        (player as any).rate = newSpeed;
      }
    } catch (error) {
      console.log('Erreur changement vitesse:', error);
    }
  };

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
    Alert.alert(
      'Options',
      'Choisissez une option',
      [
        { text: 'Ajouter à la playlist', onPress: () => {} },
        { text: 'Télécharger', onPress: () => {} },
        { text: 'Supprimer', onPress: () => {}, style: 'destructive' },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleSleepTimer = () => {
    setShowSleepTimer(!showSleepTimer);
    Alert.alert(
      'Minuteur de sommeil',
      'Choisissez la durée',
      [
        { text: '5 minutes', onPress: () => {} },
        { text: '10 minutes', onPress: () => {} },
        { text: '15 minutes', onPress: () => {} },
        { text: '30 minutes', onPress: () => {} },
        { text: 'Désactiver', onPress: () => setShowSleepTimer(false) },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleBookmark = (item: any) => {
    Alert.alert(
      'Favoris',
      `Ajouter "${item.title}" aux favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Ajouter', onPress: () => {
          Alert.alert('Succès', 'Ajouté aux favoris');
        }},
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header avec bouton retour */}
      <View style={[styles.zikrHeader, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.zikrBackButton}
        >
          <Text style={[styles.zikrBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.zikrHeaderTitle, { color: '#0F5132' }]}>Coran</Text>
        <View style={styles.zikrHeaderSpacer} />
      </View>

      <ScrollView 
        style={styles.zikrScrollView} 
        contentContainerStyle={[styles.zikrScrollContent, currentPlayer?.type === 'coran' && { paddingBottom: 220 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Coran en haut */}
        <View style={styles.zikrBannerContainer}>
          <ImageBackground
            source={require('./assets/pdf/cover/coran.png')}
            style={styles.zikrBannerGradient}
            resizeMode="cover"
          >
            {/* L'image contient déjà les textes "AL qur'ane" et "القرآن الكريم" */}
          </ImageBackground>
        </View>

        {/* Section Header */}
        <View style={styles.zikrSectionHeader}>
          <Text style={[styles.zikrSectionTitle, { color: theme.text }]}>Coran</Text>
          <Text style={[styles.zikrSectionSubtitle, { color: theme.textSecondary }]}>
            {coranFiles.length} récitations
          </Text>
        </View>

        {/* Liste des fichiers Coran */}
        {coranFiles.map((coran) => {
          const isPlaying = currentPlayer?.type === 'coran' && currentPlayer.item?.id === coran.id;
          const isViewed = recentItems.some(item => item.id === coran.id && item.type === 'audio');
          
          return (
            <TouchableOpacity
              key={coran.id}
              style={[styles.zikrCard, { backgroundColor: theme.surface }]}
              activeOpacity={0.9}
              onPress={() => {
                addToHistory(coran, 'audio');
                setCurrentPlayer({ item: coran, type: 'coran' });
              }}
            >
              {/* Thumbnail avec overlay */}
              <View style={styles.zikrThumbnailContainer}>
                <Image 
                  source={coran.image || require('./assets/pdf/coran2.jpg')} 
                  style={styles.zikrThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.zikrThumbnailOverlay}>
                  <Text style={styles.zikrThumbnailOverlayText}>
                    {coran.subtitle?.toUpperCase() || coran.title.toUpperCase()}
                  </Text>
                </View>
                {isViewed && (
                  <View style={styles.viewedIconContainerAudio}>
                    <Image source={require('./assets/pdf/cover/icones/pl3.png')} style={styles.viewedIconImageAudio} />
                  </View>
                )}
              </View>

              {/* Contenu de la carte */}
              <View style={styles.zikrCardContent}>
                <Text style={[styles.zikrCardTitleAr, { color: theme.text }]} numberOfLines={1}>
                  {coran.titleAr}
                </Text>
                <Text style={[styles.zikrCardTitle, { color: theme.text }]} numberOfLines={2}>
                  {coran.title}
                </Text>
                {coran.subtitle && (
                  <Text style={[styles.zikrCardSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                    {coran.subtitle}
                  </Text>
                )}
                <Text style={[styles.zikrCardDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                  {coran.description}
                </Text>
                
                {/* Métadonnées */}
                <View style={styles.zikrCardFooter}>
                  <View style={styles.zikrCardFooterLeft}>
                    <Text style={styles.zikrCardFooterIcon}>🎧</Text>
                    <Text style={[styles.zikrCardFooterText, { color: theme.textSecondary }]}>
                      {coran.duration || coran.tracks || '--:--'}
                    </Text>
                  </View>
                  <View style={styles.zikrCardFooterRight}>
                    <TouchableOpacity 
                      style={styles.zikrCardFooterButton}
                      onPress={() => handleBookmark(coran)}
                    >
                      <Text style={styles.zikrCardFooterButtonIcon}>🔖</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.zikrCardFooterButton}
                      onPress={() => {
                        Alert.alert(
                          coran.title,
                          coran.description,
                          [{ text: 'OK' }]
                        );
                      }}
                    >
                      <Text style={styles.zikrCardFooterButtonIcon}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lecteur audio selon l'image - Design complet */}
      {currentPlayer?.type === 'coran' && currentPlayer.item && (
        <View style={styles.zikrPlayerContainer}>
          {/* Header avec icônes */}
          <View style={styles.zikrPlayerHeader}>
            <TouchableOpacity 
              onPress={handleClosePlayer}
              style={styles.zikrPlayerHeaderIcon}
            >
              <Text style={styles.zikrPlayerHeaderIconText}>←</Text>
            </TouchableOpacity>
            <View style={styles.zikrPlayerHeaderIcons}>
              <TouchableOpacity 
                style={[styles.zikrPlayerHeaderIcon, showCarMode && { backgroundColor: '#0F5132', borderRadius: 12 }]}
                onPress={() => setShowCarMode(!showCarMode)}
              >
                <Text style={styles.zikrPlayerHeaderIconText}>🚗</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.zikrPlayerHeaderIcon}
                onPress={handleShare}
              >
                <Text style={styles.zikrPlayerHeaderIconText}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.zikrPlayerHeaderIcon}
                onPress={() => {
                  setShowInfo(!showInfo);
                  if (currentPlayer?.item) {
                    Alert.alert(
                      currentPlayer.item.title,
                      currentPlayer.item.description || 'Informations sur cette récitation',
                      [{ text: 'OK' }]
                    );
                  }
                }}
              >
                <Text style={styles.zikrPlayerHeaderIconText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Carte principale avec image */}
          <View style={styles.zikrPlayerCard}>
            <ImageBackground
              source={currentPlayer.item.image || require('./assets/pdf/coran2.jpg')}
              style={styles.zikrPlayerImage}
              resizeMode="cover"
              imageStyle={styles.zikrPlayerImageStyle}
            >
              {/* Overlay avec texte doré */}
              <View style={styles.zikrPlayerOverlay}>
                <Text style={styles.zikrPlayerOverlayText}>CORAN</Text>
                <Text style={[styles.zikrPlayerOverlayText, { fontFamily: 'Traditional Arabic' }]}>القرآن الكريم</Text>
              </View>
            </ImageBackground>
            
            {/* Section turquoise avec motif */}
            <LinearGradient
              colors={['#20B2AA', '#17A2B8', '#20B2AA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.zikrPlayerTealSection}
            >
              <View style={styles.zikrPlayerLogos}>
                <View style={styles.zikrPlayerFaydaLogo}>
                  <Text style={styles.zikrPlayerFaydaLogoAr}>فيضة</Text>
                  <Text style={styles.zikrPlayerFaydaLogoText}>FAYDA TIDIANIYA</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Titre de la piste */}
          <View style={styles.zikrPlayerTrackInfo}>
            <Text style={[styles.zikrPlayerTrackTitle, { color: theme.text }]} numberOfLines={1}>
              {currentPlayer.item.titleAr} {currentPlayer.item.title}
            </Text>
            <TouchableOpacity 
              style={styles.zikrPlayerOptions}
              onPress={handleMenuPress}
            >
              <Text style={styles.zikrPlayerOptionsIcon}>☰</Text>
            </TouchableOpacity>
          </View>

          {/* Barre de progression */}
          <View style={styles.zikrPlayerProgressContainer}>
            <Slider
              style={styles.zikrPlayerSlider}
              value={position}
              maximumValue={duration || 100}
              minimumValue={0}
              onValueChange={(value) => {
                setPosition(value);
              }}
              minimumTrackTintColor="#0F5132"
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor="#0F5132"
            />
            <View style={styles.zikrPlayerTimeContainer}>
              <Text style={[styles.zikrPlayerTimeText, { color: theme.text }]}>
                {formatTime(position)}
              </Text>
              <Text style={[styles.zikrPlayerTimeText, { color: theme.text }]}>
                {duration > 0 ? formatRemainingTime(position, duration) : '--:--'}
              </Text>
            </View>
          </View>

          {/* Contrôles de lecture - Design selon l'image */}
          <View style={styles.zikrPlayerControls}>
            {/* 30s Rewind Circle */}
            <TouchableOpacity 
              style={styles.zikrPlayer30sBtn}
              onPress={handleRewind}
              activeOpacity={0.7}
            >
              <View style={styles.zikrPlayer30sCircle}>
                <Text style={styles.zikrPlayer30sText}>30s</Text>
              </View>
            </TouchableOpacity>
            
            {/* Play/Pause Button */}
            <TouchableOpacity 
              style={styles.zikrPlayerPlayBtn}
              onPress={togglePlay}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D']}
                style={styles.zikrPlayerPlayBtnGradient}
              >
                <Text style={styles.zikrPlayerPlayIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* 30s Forward Circle */}
            <TouchableOpacity 
              style={styles.zikrPlayer30sBtn}
              onPress={handleForward}
              activeOpacity={0.7}
            >
              <View style={styles.zikrPlayer30sCircle}>
                <Text style={styles.zikrPlayer30sText}>30s</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contrôles supplémentaires */}
          <View style={styles.zikrPlayerBottomControls}>
            <TouchableOpacity 
              style={styles.zikrPlayerSpeedControl}
              onPress={handleSpeedChange}
            >
              <Text style={styles.zikrPlayerSpeedIcon}>⏱</Text>
              <Text style={[styles.zikrPlayerSpeedText, { color: theme.text }]}>
                {playbackSpeed.toFixed(1)}x
              </Text>
            </TouchableOpacity>
            <View style={styles.zikrPlayerBottomIcons}>
              <TouchableOpacity 
                style={[styles.zikrPlayerBottomIcon, showSleepTimer && { backgroundColor: '#C9A24D' }]}
                onPress={handleSleepTimer}
              >
                <Text style={styles.zikrPlayerBottomIconText}>Z</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// Écran Gamou - Design identique à PodcastsScreen
function GamouScreen({ navigation, route }: any) {
  const { language, darkMode, setCurrentPlayer, currentPlayer, addToHistory, setShowDonationBanner, setLang, setDarkMode, recentItems } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [subscribedGamou, setSubscribedGamou] = React.useState<number[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [selectedGamou, setSelectedGamou] = React.useState<any>(route.params?.selectedGamou || null);
  const [modalVisible, setModalVisible] = React.useState(route.params?.selectedGamou ? true : false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [donationModalVisible, setDonationModalVisible] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const scrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // S'assurer que la bande est visible quand on arrive sur la page
  React.useEffect(() => {
    setShowDonationBanner(true);
  }, [setShowDonationBanner]);

  // Nettoyer le timer au démontage
  React.useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  // Ouvrir automatiquement le modal si un gamou est passé en paramètre
  React.useEffect(() => {
    if (route.params?.selectedGamou) {
      setSelectedGamou(route.params.selectedGamou);
      setModalVisible(true);
    }
  }, [route.params?.selectedGamou]);

  const handleGamouPress = (gamou: any) => {
    setSelectedGamou(gamou);
    setModalVisible(true);
  };

  const handlePlayGamou = () => {
    if (selectedGamou) {
      addToHistory(selectedGamou, 'audio');
      // Utiliser getGamouFile pour obtenir le fichier audio
      const audioFile = getGamouFile(selectedGamou.fileName);
      const gamouWithFile = { ...selectedGamou, file: audioFile };
      setCurrentPlayer({ item: gamouWithFile, type: 'podcast' });
      setModalVisible(false);
      // Naviguer vers le lecteur plein écran
      navigation.navigate('PodcastPlayer', { podcast: gamouWithFile });
    }
  };

  const handleSubscribe = (id: number) => {
    setSubscribedGamou(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleThemeChange = (newTheme: boolean) => {
    setDarkMode(newTheme);
  };

  const handleLanguageChange = (newLang: Language | null) => {
    setLang(newLang);
  };

  const handleSearchPress = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const performSearchWithQuery = (queryText: string) => {
    const query = queryText.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];

    // Rechercher dans les gamou
    gamouItems.forEach(gamou => {
      const matchTitle = gamou.title?.toLowerCase().includes(query);
      const matchTitleAr = gamou.titleAr?.toLowerCase().includes(query);
      const matchSubtitle = gamou.subtitle?.toLowerCase().includes(query);
      const matchDescription = gamou.description?.toLowerCase().includes(query);
      
      if (matchTitle || matchTitleAr || matchSubtitle || matchDescription) {
        results.push({ ...gamou, searchType: 'gamou' });
      }
    });

    setSearchResults(results);
  };

  const performSearch = () => {
    performSearchWithQuery(searchQuery);
    setShowSuggestions(false);
  };

  const generateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryLower = query.toLowerCase().trim();
    const suggestionsSet = new Set<string>();

    gamouItems.forEach(gamou => {
      if (gamou.title?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(gamou.title);
      }
      if (gamou.titleAr?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(gamou.titleAr);
      }
      if (gamou.subtitle?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(gamou.subtitle);
      }
    });

    const suggestions = Array.from(suggestionsSet).slice(0, 8);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    generateSuggestions(text);
    performSearchWithQuery(text);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    performSearchWithQuery(suggestion);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header avec pills et icônes */}
      <View style={[styles.podcastsHeaderNew, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          style={styles.podcastsHeaderIconBtn}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.podcastsHeaderPills}>
          <TouchableOpacity
            style={styles.podcastsHeaderPill}
            onPress={() => {
              // Naviguer vers MainTabs et sélectionner l'onglet Podcasts
              navigation.navigate('MainTabs', {
                screen: 'Podcasts',
              });
            }}
          >
            <Text style={styles.podcastsHeaderPillText}>
              Podcast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.podcastsHeaderPill, styles.podcastsHeaderPillActive]}
            disabled={true}
          >
            <Text style={styles.podcastsHeaderPillTextActive}>
              Gamou
            </Text>
          </TouchableOpacity>
      </View>

        <TouchableOpacity 
          style={styles.podcastsHeaderIconBtn}
          onPress={handleSearchPress}
        >
          <Ionicons name="search-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.text, borderColor: theme.textSecondary }]}
            placeholder="Rechercher un gamou..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            autoFocus={true}
            onSubmitEditing={performSearch}
            returnKeyType="search"
            onFocus={() => {
              if (searchQuery.trim()) {
                generateSuggestions(searchQuery);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={performSearch}
            >
              <Ionicons name="search" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.searchCloseButton}
            onPress={handleSearchPress}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Suggestions d'autocomplétion */}
      {showSearch && showSuggestions && searchSuggestions.length > 0 && (
        <View style={[styles.searchSuggestionsContainer, { backgroundColor: theme.surface }]}>
          {searchSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.searchSuggestionItem, { borderBottomColor: theme.textSecondary + '20' }]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Ionicons name="search-outline" size={18} color={theme.textSecondary} style={styles.searchSuggestionIcon} />
              <Text style={[styles.searchSuggestionText, { color: theme.text }]} numberOfLines={1}>
                {suggestion}
          </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Résultats de recherche */}
      {showSearch && searchQuery.trim() && searchResults.length > 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>🔍</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>
                  Résultats de recherche ({searchResults.length})
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Pour: "{searchQuery}"
                </Text>
              </View>
            </View>
          </View>
          <ScrollView 
            style={styles.searchResultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {searchResults.map((item, index) => {
              const isViewed = recentItems.some(ri => ri.id === item.id && ri.type === 'audio');
          return (
            <TouchableOpacity
                  key={`search-${item.id}-${index}`}
                  style={[styles.searchResultItem, { backgroundColor: theme.surface }]}
              onPress={() => {
                    addToHistory(item, 'audio');
                    navigation.navigate('Gamou', { selectedGamou: item });
              }}
            >
                  {item.image && (
                <Image 
                      source={item.image}
                      style={styles.searchResultImage}
                    />
                  )}
                  <View style={styles.searchResultContent}>
                    <Text style={[styles.searchResultTitle, { color: theme.text }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.titleAr && (
                      <Text style={[styles.searchResultTitleAr, { color: theme.textSecondary }]} numberOfLines={1}>
                        {item.titleAr}
                      </Text>
                    )}
                    {item.subtitle && (
                      <Text style={[styles.searchResultAuthor, { color: theme.textSecondary }]}>
                        {item.subtitle}
                      </Text>
                    )}
                    <Text style={[styles.searchResultType, { color: theme.primary }]}>
                      🎉 Gamou
                  </Text>
                </View>
                {isViewed && (
                    <Image source={require('./assets/pdf/cover/icones/pl3.png')} style={styles.searchResultViewedIcon} />
                )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
              </View>
      )}

      {/* Message si aucun résultat */}
      {showSearch && searchQuery.trim() && searchResults.length === 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
              Aucun résultat trouvé pour "{searchQuery}"
                </Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.podcastsScrollNew} 
        contentContainerStyle={[styles.podcastsScrollContentNew, currentPlayer?.type === 'podcast' && { paddingBottom: 220 }]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          
          // Cacher la bande dès qu'on scrolle
          setShowDonationBanner(false);
          
          // Annuler le timer précédent
          if (scrollTimer.current) {
            clearTimeout(scrollTimer.current);
          }
          
          // Créer un nouveau timer pour réafficher la bande après 500ms d'inactivité
          scrollTimer.current = setTimeout(() => {
            setShowDonationBanner(true);
          }, 500);
          
          lastScrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
      >
        {!showSearch && gamouItems.map((gamou) => (
          <View key={gamou.id} style={styles.podcastCardNew}>

            {/* Thumbnail avec overlay */}
            <TouchableOpacity
              style={styles.podcastThumbnailContainer}
              activeOpacity={0.9}
              onPress={() => handleGamouPress(gamou)}
            >
              <Image 
                source={gamou.image || require('./assets/thierno.png')} 
                style={styles.podcastThumbnail}
                resizeMode="cover"
              />
              
              {/* Icône de cadenas si verrouillé */}
              {gamou.locked && (
                <View style={styles.podcastLockIcon}>
                  <Text style={styles.podcastLockIconText}>🔒</Text>
                </View>
              )}
              
              {/* Overlay vide - logo retiré */}
              <View style={styles.podcastThumbnailOverlay}>
              </View>
            </TouchableOpacity>

            {/* Informations en bas de la carte */}
            <View style={styles.podcastCardInfoContainer}>
              {/* Titre */}
            <Text style={[styles.podcastCardTitleNew, { color: theme.text }]} numberOfLines={2}>
                  {gamou.title}
                </Text>
            
              {/* Sous-titre / Hôte */}
                {gamou.subtitle && (
                <Text style={[styles.podcastCardSubtitleNew, { color: theme.textSecondary }]} numberOfLines={1}>
                    {gamou.subtitle}
                  </Text>
                )}
              
              {/* Hôte */}
              {gamou.host && (
                <Text style={[styles.podcastCardHost, { color: theme.textSecondary }]} numberOfLines={1}>
                  Par {gamou.host}
                </Text>
              )}
              
              {/* Description */}
            {gamou.description && (
              <Text style={[styles.podcastCardDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                  {gamou.description}
                </Text>
            )}
              
              {/* Date et type */}
              <View style={styles.podcastCardMetadata}>
                <Text style={[styles.podcastCardDate, { color: theme.textSecondary }]}>
                  {gamou.date}
                    </Text>
                {gamou.episodeType && (
                  <Text style={[styles.podcastCardEpisodeType, { color: theme.textSecondary }]}>
                    • {gamou.episodeType}
                  </Text>
                )}
                  </View>
            </View>

            {/* Infos avec icônes */}
            <View style={styles.podcastCardFooterNew}>
              <View style={styles.podcastCardFooterLeft}>
                <Text style={styles.podcastCardFooterIcon}>🎧</Text>
                <Text style={[styles.podcastCardFooterText, { color: theme.textSecondary }]}>
                  {gamou.duration}
                </Text>
              </View>
              <View style={styles.podcastCardFooterRight}>
                <TouchableOpacity style={styles.podcastCardFooterButton}>
                  <Text style={styles.podcastCardFooterIcon}>🔖</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                  style={styles.podcastCardFooterButton}
                  onPress={() => {
                    Alert.alert(
                      gamou.title,
                      gamou.description || 'Gamou spirituel de grande valeur.',
                      [{ text: 'OK' }]
                    );
                  }}
                >
                  <Text style={styles.podcastCardFooterIcon}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
        ))}
      </ScrollView>

      {/* Modal de détail du gamou */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.podcastModalContainer, { backgroundColor: theme.surface }]}>
              {selectedGamou && (
                <>
                  {/* Header avec X et Bookmark */}
                  <View style={styles.podcastModalHeader}>
              <TouchableOpacity 
                      style={styles.podcastModalCloseBtn}
                      onPress={() => setModalVisible(false)}
              >
                      <Text style={[styles.podcastModalCloseIcon, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
                    <TouchableOpacity style={styles.podcastModalBookmarkBtn}>
                      <Text style={[styles.podcastModalBookmarkIcon, { color: theme.text }]}>🔖</Text>
              </TouchableOpacity>
          </View>

                  <ScrollView
                    style={styles.podcastModalScroll}
                    contentContainerStyle={styles.podcastModalContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Image */}
                    <View style={styles.podcastModalImageContainer}>
            <ImageBackground
                        source={(selectedGamou as any).modalImage || selectedGamou.image || require('./assets/thierno.png')}
                        style={styles.podcastModalImage}
                        imageStyle={styles.podcastModalImageStyle}
                      >
                        <View style={styles.podcastModalImageOverlay}>
              </View>
            </ImageBackground>
                    </View>

                    {/* Informations du son sous l'image */}
                    <View style={styles.podcastModalInfoSection}>
                      <Text style={[styles.podcastModalInfoTitle, { color: theme.text }]} numberOfLines={2}>
                        {selectedGamou.title}
                      </Text>
                      {selectedGamou.description && (
                        <Text style={[styles.podcastModalInfoDescription, { color: theme.textSecondary }]} numberOfLines={3}>
                          {selectedGamou.description}
                        </Text>
                      )}
                      <Text style={[styles.podcastModalInfoDate, { color: theme.textSecondary }]}>
                        {selectedGamou.date} • {selectedGamou.duration || '--:--'}
                      </Text>
                    </View>

                    {/* Boutons de contrôle */}
                    <View style={styles.podcastModalControls}>
                      <TouchableOpacity 
                        style={styles.podcastModalPlayButton}
                        onPress={handlePlayGamou}
                        activeOpacity={0.9}
                      >
            <LinearGradient
                          colors={['#0F5132', '#0B3C5D']}
                          style={styles.podcastModalPlayButtonGradient}
                        >
                          <Text style={styles.podcastModalPlayIcon}>▶</Text>
                          <Text style={styles.podcastModalPlayText}>Play</Text>
            </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.podcastModalMenuButton}>
                        <Text style={styles.podcastModalMenuIcon}>⋯</Text>
                      </TouchableOpacity>
                </View>


                    {/* Section Tags */}
                    <View style={styles.podcastModalTagsSection}>
                      <Text style={[styles.podcastModalSectionTitle, { color: theme.text }]}>Tags</Text>
                      <View style={styles.podcastModalTagsContainer}>
                        <TouchableOpacity style={styles.podcastModalTagButton}>
                          <Text style={styles.podcastModalTagText}>Gamou</Text>
                          <Text style={styles.podcastModalTagIcon}>▶</Text>
            </TouchableOpacity>
              </View>
          </View>
                  </ScrollView>
                </>
              )}
          </View>
      </Modal>

      {/* Modal des paramètres */}
      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.settingsModal, { backgroundColor: theme.surface }]}>
            <View style={styles.settingsModalHeader}>
              <Text style={[styles.settingsModalTitle, { color: theme.text }]}>Paramètres</Text>
            <TouchableOpacity 
                onPress={() => setShowSettingsModal(false)}
                style={styles.settingsModalCloseButton}
            >
                <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

            {/* Section Thème */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Thème</Text>
              <View style={styles.settingsOptions}>
            <TouchableOpacity 
                  style={[styles.settingsOption, !darkMode && styles.settingsOptionActive, { borderColor: !darkMode ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleThemeChange(false)}
                >
                  <Ionicons name="sunny" size={24} color={!darkMode ? '#0F5132' : theme.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Clair</Text>
                  {!darkMode && <Ionicons name="checkmark-circle" size={24} color="#0F5132" />}
            </TouchableOpacity>
            <TouchableOpacity 
                  style={[styles.settingsOption, darkMode && styles.settingsOptionActive, { borderColor: darkMode ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleThemeChange(true)}
                >
                  <Ionicons name="moon" size={24} color={darkMode ? '#ffffff' : theme.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Sombre</Text>
                  {darkMode && <Ionicons name="checkmark-circle" size={24} color="#ffffff" />}
            </TouchableOpacity>
            </View>
          </View>

            {/* Section Langue */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Langue</Text>
              <View style={styles.settingsOptions}>
            <TouchableOpacity 
                  style={[styles.settingsOption, language === null && styles.settingsOptionActive, { borderColor: language === null ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange(null)}
                >
                  <Text style={styles.settingsOptionFlag}>🌍</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Tous</Text>
                  {language === null && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
            </TouchableOpacity>
            <TouchableOpacity 
                  style={[styles.settingsOption, language === 'fr' && styles.settingsOptionActive, { borderColor: language === 'fr' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('fr')}
                >
                  <Text style={styles.settingsOptionFlag}>🇫🇷</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Français</Text>
                  {language === 'fr' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, language === 'en' && styles.settingsOptionActive, { borderColor: language === 'en' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('en')}
                >
                  <Text style={styles.settingsOptionFlag}>🇬🇧</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>English</Text>
                  {language === 'en' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
            </TouchableOpacity>
            <TouchableOpacity 
                  style={[styles.settingsOption, language === 'ar' && styles.settingsOptionActive, { borderColor: language === 'ar' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('ar')}
                >
                  <Text style={styles.settingsOptionFlag}>🇸🇦</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>عربي</Text>
                  {language === 'ar' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
            </TouchableOpacity>
          </View>
          </View>
        </View>
        </View>
      </Modal>

      {/* Menu du bas personnalisé */}
      <View style={[styles.customTabBar, { 
        backgroundColor: darkMode ? darkTheme.surface : lightTheme.surface,
        borderTopColor: '#e0e0e0',
      }]}>
            <TouchableOpacity 
          style={styles.customTabItem}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        >
          <Ionicons name="home-outline" size={24} color="#999" />
          <Text style={[styles.customTabLabel, { color: '#999' }]}>{t('nav.home')}</Text>
            </TouchableOpacity>
              <TouchableOpacity 
          style={styles.customTabItem}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Books' })}
        >
          <Ionicons name="library-outline" size={24} color="#999" />
          <Text style={[styles.customTabLabel, { color: '#999' }]}>{t('nav.books')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.customTabItem}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Music' })}
        >
          <Ionicons name="musical-notes-outline" size={24} color="#999" />
          <Text style={[styles.customTabLabel, { color: '#999' }]}>{t('nav.music')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.customTabItem}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Podcasts' })}
        >
          <Ionicons name="mic-outline" size={24} color="#999" />
          <Text style={[styles.customTabLabel, { color: '#999' }]}>{t('nav.podcasts')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.customTabItem}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Assistant' })}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#999" />
          <Text style={[styles.customTabLabel, { color: '#999' }]}>{t('assistant.title')}</Text>
              </TouchableOpacity>
            </View>

      {/* Bande de don */}
      <DonationBanner onPress={() => setDonationModalVisible(true)} />
      <MiniPlayerModal navigation={navigation} />
      <DonationModal 
        visible={donationModalVisible} 
        onClose={() => setDonationModalVisible(false)} 
      />
    </View>
  );
}

// Écran de podcasts - Design amélioré
function PodcastsScreen({ navigation, route }: any) {
  const { language, darkMode, setCurrentPlayer, currentPlayer, addToHistory, setShowDonationBanner, setLang, setDarkMode, recentItems } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [subscribedPodcasts, setSubscribedPodcasts] = React.useState<number[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [selectedPodcast, setSelectedPodcast] = React.useState<any>(route.params?.selectedPodcast || null);
  const [modalVisible, setModalVisible] = React.useState(route.params?.selectedPodcast ? true : false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const scrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nettoyer le timer au démontage
  React.useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  // Ouvrir automatiquement le modal si un podcast est passé en paramètre
  React.useEffect(() => {
    if (route.params?.selectedPodcast) {
      setSelectedPodcast(route.params.selectedPodcast);
      setModalVisible(true);
    }
  }, [route.params?.selectedPodcast]);

  const handlePodcastPress = (podcast: any) => {
    setSelectedPodcast(podcast);
    setModalVisible(true);
  };

  const handlePlayPodcast = () => {
    if (selectedPodcast) {
      addToHistory(selectedPodcast, 'audio');
      setCurrentPlayer({ item: selectedPodcast, type: 'podcast' });
      setModalVisible(false);
      // Naviguer vers le lecteur plein écran
      navigation.navigate('PodcastPlayer', { podcast: selectedPodcast });
    }
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

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleThemeChange = (newTheme: boolean) => {
    setDarkMode(newTheme);
  };

  const handleLanguageChange = (newLang: Language | null) => {
    setLang(newLang);
  };

  const handleSearchPress = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const performSearchWithQuery = (queryText: string) => {
    const query = queryText.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];

    // Rechercher dans les podcasts
    podcasts.forEach(podcast => {
      const matchTitle = podcast.title?.toLowerCase().includes(query);
      const matchTitleAr = podcast.titleAr?.toLowerCase().includes(query);
      const matchSubtitle = podcast.subtitle?.toLowerCase().includes(query);
      const matchDescription = podcast.description?.toLowerCase().includes(query);
      
      if (matchTitle || matchTitleAr || matchSubtitle || matchDescription) {
        results.push({ ...podcast, searchType: 'podcast' });
      }
    });

    setSearchResults(results);
  };

  const performSearch = () => {
    performSearchWithQuery(searchQuery);
    setShowSuggestions(false);
  };

  const generateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryLower = query.toLowerCase().trim();
    const suggestionsSet = new Set<string>();

    podcasts.forEach(podcast => {
      if (podcast.title?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(podcast.title);
      }
      if (podcast.titleAr?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(podcast.titleAr);
      }
      if (podcast.subtitle?.toLowerCase().includes(queryLower)) {
        suggestionsSet.add(podcast.subtitle);
      }
    });

    const suggestions = Array.from(suggestionsSet).slice(0, 8);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    generateSuggestions(text);
    performSearchWithQuery(text);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    performSearchWithQuery(suggestion);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header avec pills et icônes */}
      <View style={[styles.podcastsHeaderNew, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          style={styles.podcastsHeaderIconBtn}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.podcastsHeaderPills}>
          <TouchableOpacity
            style={[
              styles.podcastsHeaderPill,
              styles.podcastsHeaderPillActive
            ]}
          >
            <Text style={styles.podcastsHeaderPillTextActive}>
              Podcast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.podcastsHeaderPill}
            onPress={() => navigation.navigate('Gamou')}
          >
            <Text style={styles.podcastsHeaderPillText}>
              Gamou
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.podcastsHeaderIconBtn}
          onPress={handleSearchPress}
        >
          <Ionicons name="search-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.text, borderColor: theme.textSecondary }]}
            placeholder="Rechercher un podcast..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            autoFocus={true}
            onSubmitEditing={performSearch}
            returnKeyType="search"
            onFocus={() => {
              if (searchQuery.trim()) {
                generateSuggestions(searchQuery);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={performSearch}
            >
              <Ionicons name="search" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.searchCloseButton}
            onPress={handleSearchPress}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Suggestions d'autocomplétion */}
      {showSearch && showSuggestions && searchSuggestions.length > 0 && (
        <View style={[styles.searchSuggestionsContainer, { backgroundColor: theme.surface }]}>
          {searchSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.searchSuggestionItem, { borderBottomColor: theme.textSecondary + '20' }]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Ionicons name="search-outline" size={18} color={theme.textSecondary} style={styles.searchSuggestionIcon} />
              <Text style={[styles.searchSuggestionText, { color: theme.text }]} numberOfLines={1}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Résultats de recherche */}
      {showSearch && searchQuery.trim() && searchResults.length > 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.sectionHeaderModern}>
            <View style={styles.sectionTitleContainerModern}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIconModern}>🔍</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitleModern, { color: theme.text }]}>
                  Résultats de recherche ({searchResults.length})
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Pour: "{searchQuery}"
                </Text>
              </View>
            </View>
          </View>
          <ScrollView 
            style={styles.searchResultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {searchResults.map((item, index) => {
              const isViewed = recentItems.some(ri => ri.id === item.id && ri.type === 'audio');
              return (
                <TouchableOpacity
                  key={`search-${item.id}-${index}`}
                  style={[styles.searchResultItem, { backgroundColor: theme.surface }]}
                  onPress={() => {
                    addToHistory(item, 'audio');
                    navigation.navigate('Podcasts', { selectedPodcast: item });
                  }}
                >
                  {item.image && (
                    <Image
                      source={item.image}
                      style={styles.searchResultImage}
                    />
                  )}
                  <View style={styles.searchResultContent}>
                    <Text style={[styles.searchResultTitle, { color: theme.text }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.titleAr && (
                      <Text style={[styles.searchResultTitleAr, { color: theme.textSecondary }]} numberOfLines={1}>
                        {item.titleAr}
                      </Text>
                    )}
                    {item.subtitle && (
                      <Text style={[styles.searchResultAuthor, { color: theme.textSecondary }]}>
                        {item.subtitle}
                      </Text>
                    )}
                    <Text style={[styles.searchResultType, { color: theme.primary }]}>
                      🎙️ Podcast
                    </Text>
                  </View>
                  {isViewed && (
                    <Image source={require('./assets/pdf/cover/icones/pl3.png')} style={styles.searchResultViewedIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Message si aucun résultat */}
      {showSearch && searchQuery.trim() && searchResults.length === 0 && (
        <View style={styles.sectionModern}>
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
              Aucun résultat trouvé pour "{searchQuery}"
            </Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.podcastsScrollNew} 
        contentContainerStyle={[styles.podcastsScrollContentNew, currentPlayer?.type === 'podcast' && { paddingBottom: 220 }]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          
          // Cacher la bande dès qu'on scrolle
          setShowDonationBanner(false);
          
          // Annuler le timer précédent
          if (scrollTimer.current) {
            clearTimeout(scrollTimer.current);
          }
          
          // Créer un nouveau timer pour réafficher la bande après 500ms d'inactivité
          scrollTimer.current = setTimeout(() => {
            setShowDonationBanner(true);
          }, 500);
          
          lastScrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
      >
        {!showSearch && podcasts.map((podcast) => (
          <View key={podcast.id} style={styles.podcastCardNew}>

            {/* Thumbnail avec overlay */}
            <TouchableOpacity
              style={styles.podcastThumbnailContainer}
              activeOpacity={0.9}
              onPress={() => handlePodcastPress(podcast)}
            >
              <Image 
                source={podcast.image || require('./assets/thierno.png')} 
                style={styles.podcastThumbnail}
                resizeMode="cover"
              />
              
              {/* Icône de cadenas si verrouillé */}
              {podcast.locked && (
                <View style={styles.podcastLockIcon}>
                  <Text style={styles.podcastLockIconText}>🔒</Text>
                </View>
              )}
              
              {/* Overlay vide - logo retiré */}
              <View style={styles.podcastThumbnailOverlay}>
              </View>
            </TouchableOpacity>

            {/* Informations en bas de la carte */}
            <View style={styles.podcastCardInfoContainer}>
              {/* Titre */}
            <Text style={[styles.podcastCardTitleNew, { color: theme.text }]} numberOfLines={2}>
              {podcast.title}
            </Text>
            
              {/* Sous-titre / Hôte */}
              {podcast.subtitle && (
                <Text style={[styles.podcastCardSubtitleNew, { color: theme.textSecondary }]} numberOfLines={1}>
                  {podcast.subtitle}
                </Text>
              )}
              
              {/* Hôte */}
              {podcast.host && (
                <Text style={[styles.podcastCardHost, { color: theme.textSecondary }]} numberOfLines={1}>
                  Par {podcast.host}
                </Text>
              )}
              
              {/* Description */}
            {podcast.description && (
              <Text style={[styles.podcastCardDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                {podcast.description}
              </Text>
            )}
              
              {/* Date et type */}
              <View style={styles.podcastCardMetadata}>
                <Text style={[styles.podcastCardDate, { color: theme.textSecondary }]}>
                  {podcast.date}
                </Text>
                {podcast.episodeType && (
                  <Text style={[styles.podcastCardEpisodeType, { color: theme.textSecondary }]}>
                    • {podcast.episodeType}
                  </Text>
                )}
              </View>
            </View>

            {/* Infos avec icônes */}
            <View style={styles.podcastCardFooterNew}>
              <View style={styles.podcastCardFooterLeft}>
                <Text style={styles.podcastCardFooterIcon}>🎧</Text>
                <Text style={[styles.podcastCardFooterText, { color: theme.textSecondary }]}>
                  {podcast.duration}
                </Text>
              </View>
              <View style={styles.podcastCardFooterRight}>
                <TouchableOpacity style={styles.podcastCardFooterButton}>
                  <Text style={styles.podcastCardFooterIcon}>🔖</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.podcastCardFooterButton}
                  onPress={() => {
                    Alert.alert(
                      podcast.title,
                      podcast.description || 'Podcast spirituel de grande valeur.',
                      [{ text: 'OK' }]
                    );
                  }}
                >
                  <Text style={styles.podcastCardFooterIcon}>ℹ️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal de détail du podcast */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.podcastModalContainer, { backgroundColor: theme.surface }]}>
              {selectedPodcast && (
                <>
                  {/* Header avec X et Bookmark */}
                  <View style={styles.podcastModalHeader}>
                    <TouchableOpacity 
                      style={styles.podcastModalCloseBtn}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={[styles.podcastModalCloseIcon, { color: theme.text }]}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.podcastModalBookmarkBtn}>
                      <Text style={[styles.podcastModalBookmarkIcon, { color: theme.text }]}>🔖</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    style={styles.podcastModalScroll}
                    contentContainerStyle={styles.podcastModalContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Image */}
                    <View style={styles.podcastModalImageContainer}>
                      <ImageBackground
                        source={(selectedPodcast as any).modalImage || selectedPodcast.image || require('./assets/thierno.png')}
                        style={styles.podcastModalImage}
                        imageStyle={styles.podcastModalImageStyle}
                      >
                        <View style={styles.podcastModalImageOverlay}>
                        </View>
                      </ImageBackground>
                    </View>

                    {/* Informations du son sous l'image */}
                    <View style={styles.podcastModalInfoSection}>
                      <Text style={[styles.podcastModalInfoTitle, { color: theme.text }]} numberOfLines={2}>
                        {selectedPodcast.title}
                      </Text>
                      {selectedPodcast.description && (
                        <Text style={[styles.podcastModalInfoDescription, { color: theme.textSecondary }]} numberOfLines={3}>
                          {selectedPodcast.description}
                        </Text>
                      )}
                      <Text style={[styles.podcastModalInfoDate, { color: theme.textSecondary }]}>
                        {selectedPodcast.date} • {selectedPodcast.duration || '--:--'}
                      </Text>
                    </View>

                    {/* Boutons de contrôle */}
                    <View style={styles.podcastModalControls}>
                      <TouchableOpacity 
                        style={styles.podcastModalPlayButton}
                        onPress={handlePlayPodcast}
                        activeOpacity={0.9}
                      >
                        <LinearGradient
                          colors={['#0F5132', '#0B3C5D']}
                          style={styles.podcastModalPlayButtonGradient}
                        >
                          <Text style={styles.podcastModalPlayIcon}>▶</Text>
                          <Text style={styles.podcastModalPlayText}>Play</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.podcastModalMenuButton}>
                        <Text style={styles.podcastModalMenuIcon}>⋯</Text>
                      </TouchableOpacity>
                    </View>


                    {/* Section Tags */}
                    <View style={styles.podcastModalTagsSection}>
                      <Text style={[styles.podcastModalSectionTitle, { color: theme.text }]}>Tags</Text>
                      <View style={styles.podcastModalTagsContainer}>
                        <TouchableOpacity style={styles.podcastModalTagButton}>
                          <Text style={styles.podcastModalTagText}>Podcasts</Text>
                          <Text style={styles.podcastModalTagIcon}>▶</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </>
              )}
        </View>
      </Modal>

      {/* Modal des paramètres */}
      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.settingsModal, { backgroundColor: theme.surface }]}>
            <View style={styles.settingsModalHeader}>
              <Text style={[styles.settingsModalTitle, { color: theme.text }]}>Paramètres</Text>
              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                style={styles.settingsModalCloseButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Section Thème */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Thème</Text>
              <View style={styles.settingsOptions}>
                <TouchableOpacity
                  style={[styles.settingsOption, !darkMode && styles.settingsOptionActive, { borderColor: !darkMode ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleThemeChange(false)}
                >
                  <Ionicons name="sunny" size={24} color={!darkMode ? '#0F5132' : theme.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Clair</Text>
                  {!darkMode && <Ionicons name="checkmark-circle" size={24} color="#0F5132" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, darkMode && styles.settingsOptionActive, { borderColor: darkMode ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleThemeChange(true)}
                >
                  <Ionicons name="moon" size={24} color={darkMode ? '#ffffff' : theme.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Sombre</Text>
                  {darkMode && <Ionicons name="checkmark-circle" size={24} color="#ffffff" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Section Langue */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>Langue</Text>
              <View style={styles.settingsOptions}>
                <TouchableOpacity
                  style={[styles.settingsOption, language === null && styles.settingsOptionActive, { borderColor: language === null ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange(null)}
                >
                  <Text style={styles.settingsOptionFlag}>🌍</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Tous</Text>
                  {language === null && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, language === 'fr' && styles.settingsOptionActive, { borderColor: language === 'fr' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('fr')}
                >
                  <Text style={styles.settingsOptionFlag}>🇫🇷</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>Français</Text>
                  {language === 'fr' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, language === 'en' && styles.settingsOptionActive, { borderColor: language === 'en' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('en')}
                >
                  <Text style={styles.settingsOptionFlag}>🇬🇧</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>English</Text>
                  {language === 'en' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingsOption, language === 'ar' && styles.settingsOptionActive, { borderColor: language === 'ar' ? (darkMode ? '#ffffff' : '#0F5132') : '#e0e0e0' }]}
                  onPress={() => handleLanguageChange('ar')}
                >
                  <Text style={styles.settingsOptionFlag}>🇸🇦</Text>
                  <Text style={[styles.settingsOptionText, { color: theme.text }]}>عربي</Text>
                  {language === 'ar' && <Ionicons name="checkmark-circle" size={24} color={darkMode ? '#ffffff' : '#0F5132'} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Écran de cours - Design amélioré
function LibraryScreen({ navigation }: any) {
  const { language, darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);
  const [selectedLesson, setSelectedLesson] = React.useState<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  
  // Créer le lecteur vidéo pour la leçon sélectionnée
  const videoUrl = selectedLesson?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const videoPlayer = useVideoPlayer(
    { uri: videoUrl },
    (player) => {
      if (player) {
        player.loop = false;
        player.muted = false;
      }
    }
  );

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
                      onPress={() => {
                        setSelectedLesson(lesson);
                        setIsVideoPlaying(true);
                      }}
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

      {/* Lecteur vidéo intégré - Format MOOC */}
      {selectedLesson && isVideoPlaying && (
        <View style={[styles.libraryVideoPlayer, { backgroundColor: theme.background }]}>
          <View style={[styles.libraryVideoHeader, { backgroundColor: theme.surface }]}>
            <Text style={[styles.libraryVideoTitle, { color: theme.text }]} numberOfLines={1}>
              {selectedLesson.title}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedLesson(null);
                setIsVideoPlaying(false);
              }}
              style={styles.libraryVideoClose}
            >
              <Text style={[styles.libraryVideoCloseText, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.libraryVideoContainer}>
            <VideoView
              player={videoPlayer}
              style={styles.libraryVideoView}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>
        </View>
      )}
    </View>
  );
}

// Écran de lecteur podcast plein écran - Design selon l'image
function PodcastPlayerScreen({ route, navigation }: any) {
  const { podcast } = route.params || {};
  const { darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
  const [showCarMode, setShowCarMode] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showSleepTimer, setShowSleepTimer] = React.useState(false);

  // Utiliser expo-audio pour la lecture
  const getAudioSource = () => {
    if (podcast?.fileName) {
      try {
        return getPodcastFile(podcast.fileName);
      } catch (error) {
        console.log('Erreur chargement fichier podcast:', error);
        return require('./assets/audio/audio.mp3');
      }
    }
    return require('./assets/audio/audio.mp3');
  };

  const player = useAudioPlayer(getAudioSource());

  React.useEffect(() => {
    if (player && podcast) {
      setPosition(0);
      setDuration(0);
      
      // Démarrer automatiquement la lecture
      const startPlayback = async () => {
        try {
          if (player && !player.playing) {
            await player.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.log('Erreur démarrage automatique:', error);
        }
      };
      
      startPlayback();
      
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
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }
  }, [player, podcast]);

  const togglePlay = async () => {
    try {
      if (player) {
        if (player.playing) {
          await player.pause();
          setIsPlaying(false);
        } else {
          await player.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.log('Erreur toggle play:', error);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (current: number, total: number) => {
    const remaining = total - current;
    return formatTime(remaining);
  };

  const handleRewind = async () => {
    try {
      if (player) {
        const newPosition = Math.max(0, (player.currentTime || 0) - 30);
        if ('currentTime' in player && typeof (player as any).currentTime !== 'undefined') {
          (player as any).currentTime = newPosition;
        }
        setPosition(newPosition * 1000);
      }
    } catch (error) {
      console.log('Erreur rewind:', error);
    }
  };

  const handleForward = async () => {
    try {
      if (player && player.duration) {
        const newPosition = Math.min(player.duration, (player.currentTime || 0) + 30);
        if ('currentTime' in player && typeof (player as any).currentTime !== 'undefined') {
          (player as any).currentTime = newPosition;
        }
        setPosition(newPosition * 1000);
      }
    } catch (error) {
      console.log('Erreur forward:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Écoutez "${podcast?.title}" sur Fayda Tidianiya`,
        title: podcast?.title,
      });
    } catch (error) {
      console.log('Erreur partage:', error);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Options',
      'Choisissez une option',
      [
        { text: 'Ajouter aux favoris', onPress: () => {} },
        { text: 'Télécharger', onPress: () => {} },
        { text: 'Partager', onPress: handleShare },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleSleepTimer = () => {
    Alert.alert(
      'Minuteur de sommeil',
      'Choisissez la durée',
      [
        { text: '15 min', onPress: () => setShowSleepTimer(true) },
        { text: '30 min', onPress: () => setShowSleepTimer(true) },
        { text: '60 min', onPress: () => setShowSleepTimer(true) },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  if (!podcast) return null;

  return (
    <View style={[styles.podcastPlayerScreen, { backgroundColor: '#ffffff' }]}>
      <StatusBar style="dark" />
      
      {/* Header avec icônes */}
      <View style={styles.podcastPlayerHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.podcastPlayerHeaderIcon}
        >
          <Text style={styles.podcastPlayerHeaderIconText}>←</Text>
        </TouchableOpacity>
        <View style={styles.podcastPlayerHeaderIcons}>
          <TouchableOpacity 
                style={[styles.podcastPlayerHeaderIcon, showCarMode && { backgroundColor: '#0F5132', borderRadius: 12 }]}
            onPress={() => setShowCarMode(!showCarMode)}
          >
            <Text style={styles.podcastPlayerHeaderIconText}>🚗</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.podcastPlayerHeaderIcon}
            onPress={handleShare}
          >
            <Text style={styles.podcastPlayerHeaderIconText}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.podcastPlayerHeaderIcon}
            onPress={() => {
              setShowInfo(!showInfo);
              Alert.alert(
                podcast.title,
                podcast.description || 'Podcast spirituel de grande valeur.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={styles.podcastPlayerHeaderIconText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.podcastPlayerScroll}
        contentContainerStyle={styles.podcastPlayerContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image principale avec overlay */}
        <View style={styles.podcastPlayerImageContainer}>
          <ImageBackground
            source={podcast.image || require('./assets/thierno.png')}
            style={styles.podcastPlayerImage}
            resizeMode="cover"
            imageStyle={styles.podcastPlayerImageStyle}
          >
            <View style={styles.podcastPlayerImageOverlay}>
            </View>
          </ImageBackground>
        </View>

        {/* Barre de progression */}
        <View style={styles.podcastPlayerProgressContainer}>
          <Slider
            style={styles.podcastPlayerSlider}
            value={position}
            maximumValue={duration || 100}
            minimumValue={0}
            onValueChange={(value) => {
              setPosition(value);
              try {
                if (player && 'currentTime' in player) {
                  (player as any).currentTime = value / 1000;
                }
              } catch (error) {
                console.log('Erreur seek:', error);
              }
            }}
            minimumTrackTintColor="#0F5132"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#0F5132"
          />
          <View style={styles.podcastPlayerTimeContainer}>
            <Text style={[styles.podcastPlayerTimeText, { color: theme.text }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.podcastPlayerTimeText, { color: theme.text }]}>
              {duration > 0 ? formatRemainingTime(position, duration) : '--:--'}
            </Text>
          </View>
        </View>

        {/* Contrôles de lecture */}
        <View style={styles.podcastPlayerControls}>
          {/* 30s Rewind Circle */}
          <TouchableOpacity 
            style={styles.podcastPlayer30sBtn}
            onPress={handleRewind}
            activeOpacity={0.7}
          >
            <View style={styles.podcastPlayer30sCircle}>
              <Text style={styles.podcastPlayer30sText}>30s</Text>
            </View>
          </TouchableOpacity>
          
          {/* Play/Pause Button */}
          <TouchableOpacity 
            style={styles.podcastPlayerPlayBtn}
            onPress={togglePlay}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#0F5132', '#0B3C5D']}
              style={styles.podcastPlayerPlayBtnGradient}
            >
              <Text style={styles.podcastPlayerPlayIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* 30s Forward Circle */}
          <TouchableOpacity 
            style={styles.podcastPlayer30sBtn}
            onPress={handleForward}
            activeOpacity={0.7}
          >
            <View style={styles.podcastPlayer30sCircle}>
              <Text style={styles.podcastPlayer30sText}>30s</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contrôles supplémentaires */}
        <View style={styles.podcastPlayerBottomControls}>
          <TouchableOpacity 
            style={styles.podcastPlayerSpeedControl}
            onPress={handleSpeedChange}
          >
            <Text style={styles.podcastPlayerSpeedIcon}>⏱</Text>
            <Text style={[styles.podcastPlayerSpeedText, { color: theme.text }]}>
              {playbackSpeed.toFixed(1)}x
            </Text>
          </TouchableOpacity>
          <View style={styles.podcastPlayerBottomIcons}>
            <TouchableOpacity 
              style={[styles.podcastPlayerBottomIcon, showSleepTimer && { backgroundColor: '#C9A24D' }]}
              onPress={handleSleepTimer}
            >
              <Text style={styles.podcastPlayerBottomIconText}>Z</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Écran lecteur PDF - Affiche le PDF directement dans l'application
function PDFReaderScreen({ route, navigation }: any) {
  const { book } = route.params;
  const { darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pdfUri, setPdfUri] = React.useState<string | null>(null);
  const [htmlContent, setHtmlContent] = React.useState<string | null>(null);
  const webViewRef = React.useRef<WebView>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1.0);
  const [showControls, setShowControls] = React.useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        if (book?.htmlFile) {
          // Pour les fichiers HTML, utiliser le lecteur par défaut (WebView avec contenu HTML)
          setLoading(true);
          // Déterminer le contenu HTML selon le fichier et l'ID du livre
          let htmlContent = '';
          if (book.htmlFile === 'tariqa-articles.html') {
            // Sélectionner le contenu selon l'ID du livre
            if (book.id === 20) {
              htmlContent = getIntroductionTariqaHTML();
            } else if (book.id === 21) {
              htmlContent = getZikrTariqaHTML();
            } else if (book.id === 22) {
              htmlContent = getSalatFatihHTML();
            } else if (book.id === 23) {
              htmlContent = getAttachementPropheteHTML();
            } else if (book.id === 24) {
              htmlContent = getDouaWazifaHTML();
            }
          } else if (book.htmlFile === 'maarifa-articles.html') {
            // Sélectionner le contenu selon l'ID du livre
            if (book.id === 30) {
              htmlContent = getConnaissanceSpirituelleHTML();
            } else if (book.id === 31) {
              htmlContent = getDegresConnaissanceHTML();
            } else if (book.id === 32) {
              htmlContent = getMaarifaTariqaHTML();
            } else if (book.id === 33) {
              htmlContent = getCheminGnoseHTML();
            }
          }
          setHtmlContent(htmlContent);
          setLoading(false);
        } else if (book?.pdfFile) {
          // Charger le PDF normal
          setLoading(true);
          
          if (Platform.OS === 'web') {
            // Sur le web, les assets sont servis depuis /assets/
            // On doit construire l'URL depuis le require
            try {
              // Pour le web, Asset.fromModule peut ne pas fonctionner correctement
              // Utiliser une approche différente : convertir le module en URI
              const asset = Asset.fromModule(book.pdfFile);
              await asset.downloadAsync();
              
              if (asset.uri) {
                setPdfUri(asset.uri);
                setLoading(false);
              } else if (asset.localUri) {
                setPdfUri(asset.localUri);
                setLoading(false);
              } else {
                setError('Impossible de charger le PDF');
                setLoading(false);
              }
            } catch (err) {
              console.error('Erreur chargement PDF web:', err);
              setError('Impossible de charger le PDF');
              setLoading(false);
            }
          } else {
            // Sur mobile, utiliser Asset.fromModule normalement
          const asset = Asset.fromModule(book.pdfFile);
          await asset.downloadAsync();
          
          if (asset.localUri) {
            setPdfUri(asset.localUri);
            setLoading(false);
          } else {
            setError('Impossible de charger le PDF');
            setLoading(false);
            }
          }
        } else {
          setError('Aucun fichier disponible');
          setLoading(false);
        }
      } catch (err) {
        console.error('Erreur chargement:', err);
        setError('Erreur lors du chargement');
        setLoading(false);
      }
    };

    loadContent();
  }, [book]);

  // Fonction pour zoomer - Version améliorée
  const applyZoom = (zoom: number) => {
    if (!webViewRef.current) return;
    
    const zoomScript = `
      (function() {
        try {
          var zoom = ${zoom};
        var body = document.body;
          var html = document.documentElement;
          
          // Méthode 1: zoom CSS (pour les navigateurs qui le supportent)
        if (body) {
            body.style.zoom = zoom;
          }
          if (html) {
            html.style.zoom = zoom;
          }
          
          // Méthode 2: transform scale (fallback)
          if (body && !body.style.zoom) {
            body.style.transform = 'scale(' + zoom + ')';
          body.style.transformOrigin = 'top left';
            body.style.width = (100 / zoom) + '%';
          }
          
          // Pour les PDFs dans iframes
          var iframes = document.querySelectorAll('iframe, embed, object');
          for (var i = 0; i < iframes.length; i++) {
            try {
              var iframe = iframes[i];
              if (iframe.contentDocument && iframe.contentDocument.body) {
                iframe.contentDocument.body.style.zoom = zoom;
              }
              if (iframe.contentWindow) {
                iframe.style.transform = 'scale(' + zoom + ')';
                iframe.style.transformOrigin = 'top left';
              }
            } catch(e) {
              // Cross-origin, ignorer
            }
          }
          
          // Pour les PDFs embed
          var embeds = document.querySelectorAll('embed');
          for (var j = 0; j < embeds.length; j++) {
            embeds[j].style.width = (100 * zoom) + '%';
            embeds[j].style.height = (100 * zoom) + '%';
          }
          
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'zoom', value: zoom}));
        } catch(e) {
          console.error('Zoom error:', e);
        }
        true;
      })();
    `;
    
    // Utiliser injectJavaScript avec un délai pour s'assurer que le contenu est chargé
    setTimeout(() => {
      webViewRef.current?.injectJavaScript(zoomScript);
    }, 100);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.25, 3.0);
    setZoomLevel(newZoom);
    applyZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.25, 0.5);
    setZoomLevel(newZoom);
    applyZoom(newZoom);
  };

  // Fonction pour partager
  const handleShare = async () => {
    try {
      if (pdfUri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(pdfUri);
        } else {
          await Share.share({
            message: `Partagez "${book?.title || 'ce PDF'}"`,
            url: pdfUri,
          });
        }
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de partager le PDF');
      console.error('Erreur partage:', err);
    }
  };

  // Fonction pour imprimer
  const handlePrint = async () => {
    try {
      if (pdfUri && Platform.OS !== 'web') {
        await Print.printAsync({
          uri: pdfUri,
        });
      } else {
        Alert.alert('Information', 'L\'impression n\'est pas disponible sur cette plateforme');
      }
    } catch (err: any) {
      // Ne pas afficher d'alerte si l'utilisateur a simplement annulé
      const errorMessage = err?.message || err?.toString() || '';
      if (!errorMessage.toLowerCase().includes('cancelled') && 
          !errorMessage.toLowerCase().includes('canceled') &&
          !errorMessage.toLowerCase().includes('did not complete')) {
      console.error('Erreur impression:', err);
        // Ne pas afficher d'alerte pour éviter de gêner l'utilisateur
      }
    }
  };

  const toggleControls = () => {
    Animated.timing(fadeAnim, {
      toValue: showControls ? 0 : 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    setShowControls(!showControls);
  };

  const reloadContent = () => {
    setError(null);
    setLoading(true);
    // Le useEffect se déclenchera automatiquement si on change book
    // Mais pour un vrai rechargement, il faudrait forcer le re-render
    const loadContent = async () => {
      try {
        if (book?.htmlFile) {
          let htmlContent = '';
          if (book.htmlFile === 'tariqa-articles.html') {
            if (book.id === 20) htmlContent = getIntroductionTariqaHTML();
            else if (book.id === 21) htmlContent = getZikrTariqaHTML();
            else if (book.id === 22) htmlContent = getSalatFatihHTML();
            else if (book.id === 23) htmlContent = getAttachementPropheteHTML();
            else if (book.id === 24) htmlContent = getDouaWazifaHTML();
          } else if (book.htmlFile === 'maarifa-articles.html') {
            if (book.id === 30) htmlContent = getConnaissanceSpirituelleHTML();
            else if (book.id === 31) htmlContent = getDegresConnaissanceHTML();
            else if (book.id === 32) htmlContent = getMaarifaTariqaHTML();
            else if (book.id === 33) htmlContent = getCheminGnoseHTML();
          }
          setHtmlContent(htmlContent);
          setLoading(false);
        } else if (book?.pdfFile) {
          const asset = Asset.fromModule(book.pdfFile);
          await asset.downloadAsync();
          if (Platform.OS === 'web') {
            setPdfUri(asset.uri || asset.localUri || null);
          } else {
            setPdfUri(asset.localUri || null);
          }
          setLoading(false);
        }
      } catch (err) {
        setError('Erreur lors du chargement');
        setLoading(false);
      }
    };
    loadContent();
  };

  return (
    <View style={[styles.pdfReaderScreen, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header moderne avec gradient */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient
          colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pdfReaderHeaderModern}
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.pdfReaderBackButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.pdfReaderHeaderContent}
            onPress={showControls ? undefined : toggleControls}
            activeOpacity={showControls ? 1 : 0.7}
          >
            <Text style={[styles.pdfReaderTitleModern, { color: theme.text }]} numberOfLines={1}>
          {book?.title || 'Livre'}
        </Text>
            {book?.author && (
              <Text style={[styles.pdfReaderAuthorModern, { color: theme.textSecondary }]} numberOfLines={1}>
                {book.author}
              </Text>
            )}
          </TouchableOpacity>
          
        <TouchableOpacity 
            onPress={toggleControls}
            style={styles.pdfReaderMenuButton}
          >
            <Ionicons name={showControls ? "eye-off" : "eye"} size={24} color={theme.text} />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
      
      {/* Bouton flottant pour réafficher les contrôles */}
      {!showControls && (
        <TouchableOpacity 
          style={[styles.pdfControlsToggleButton, { backgroundColor: theme.primary }]}
          onPress={toggleControls}
          activeOpacity={0.8}
        >
          <Ionicons name="eye" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Barre de contrôles moderne */}
      {showControls && (
        <Animated.View style={[styles.pdfControlsBarModern, { opacity: fadeAnim, backgroundColor: theme.surface }]}>
          <View style={styles.pdfControlsGroup}>
            <TouchableOpacity 
              style={[styles.pdfControlButtonModern, { backgroundColor: theme.background }]}
          onPress={handleZoomOut}
              activeOpacity={0.7}
        >
              <Ionicons name="remove-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
        
            <View style={[styles.pdfZoomIndicator, { backgroundColor: theme.background }]}>
              <Text style={[styles.pdfZoomTextModern, { color: theme.text }]}>
          {Math.round(zoomLevel * 100)}%
        </Text>
            </View>
        
        <TouchableOpacity 
              style={[styles.pdfControlButtonModern, { backgroundColor: theme.background }]}
          onPress={handleZoomIn}
              activeOpacity={0.7}
        >
              <Ionicons name="add-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
          </View>
        
          <View style={[styles.pdfControlsSeparatorModern, { backgroundColor: theme.textSecondary, opacity: 0.2 }]} />
        
          <View style={styles.pdfControlsGroup}>
        <TouchableOpacity 
              style={[styles.pdfControlButtonModern, { backgroundColor: theme.background }]}
          onPress={handleShare}
              activeOpacity={0.7}
        >
              <Ionicons name="share-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
              style={[styles.pdfControlButtonModern, { backgroundColor: theme.background }]}
          onPress={handlePrint}
              activeOpacity={0.7}
            >
              <Ionicons name="print-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
        </Animated.View>
      )}
      
      {loading ? (
        <View style={styles.pdfContainerModern}>
          <LinearGradient
            colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
            style={styles.pdfLoadingGradient}
          >
            <View style={styles.pdfLoadingContent}>
          <ActivityIndicator size="large" color="#0F5132" />
              <Text style={[styles.pdfLoadingTextModern, { color: theme.text, marginTop: 20 }]}>
            Chargement du PDF...
          </Text>
              <Text style={[styles.pdfLoadingSubtext, { color: theme.textSecondary, marginTop: 8 }]}>
                {book?.title || 'Préparation en cours'}
          </Text>
            </View>
          </LinearGradient>
        </View>
      ) : error ? (
        <View style={styles.pdfContainerModern}>
          <View style={styles.pdfErrorContainer}>
            <Ionicons name="alert-circle-outline" size={80} color={theme.textSecondary} />
            <Text style={[styles.pdfErrorTitle, { color: theme.text }]}>
            {error}
          </Text>
            <TouchableOpacity 
              style={[styles.pdfRetryButton, { backgroundColor: theme.primary }]}
              onPress={reloadContent}
            >
              <Text style={styles.pdfRetryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (pdfUri || htmlContent) ? (
        <View style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            source={htmlContent
              ? { html: htmlContent }
              : { uri: pdfUri! }
            }
            style={{ flex: 1 }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.pdfContainerModern}>
                <ActivityIndicator size="large" color="#0F5132" />
                <Text style={[styles.pdfLoadingTextModern, { color: theme.textSecondary, marginTop: 20 }]}>
                  {book?.htmlFile ? 'Chargement de l\'article...' : 'Chargement du PDF...'}
                </Text>
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView Error:', nativeEvent);
              setError(book?.htmlFile ? 'Impossible d\'afficher l\'article' : 'Impossible d\'afficher le PDF');
            }}
            onLoadEnd={() => {
              setLoading(false);
              if (book?.htmlFile) {
                // Pour les fichiers HTML, pas besoin de zoom initial
                return;
              }
              // Initialiser le zoom pour les PDFs après un court délai
              setTimeout(() => {
                applyZoom(zoomLevel);
              }, 800);
            }}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'zoom') {
                  // Confirmation que le zoom a été appliqué
                  console.log('Zoom applied:', data.value);
                }
              } catch (e) {
                // Ignorer les messages non-JSON
              }
            }}
            javaScriptEnabled={true}
            scalesPageToFit={!book?.htmlFile}
            allowFileAccess={true}
            originWhitelist={['*']}
          />
        </View>
      ) : null}
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
  const [currentPage, setCurrentPage] = React.useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Contenu texte simulé pour la synchronisation (vous pouvez remplacer par le vrai contenu)
  const contentPages = [
    "Première page du contenu. Ce texte sera synchronisé avec la lecture audio. Lorsque l'audio avance, le contenu défile automatiquement.",
    "Deuxième page du contenu. La transition entre les pages est fluide et animée. Le lecteur suit automatiquement le texte affiché.",
    "Troisième page du contenu. Les transitions sont synchronisées avec la position audio pour une expérience de lecture optimale.",
    "Quatrième page du contenu. Le système de synchronisation permet de suivre facilement le texte pendant l'écoute.",
  ];

  // Utiliser expo-audio pour la lecture
  const player = useAudioPlayer(require('./assets/audio/audio.mp3'));

  React.useEffect(() => {
    if (player) {
      const updateStatus = () => {
        try {
          setIsPlaying(player.playing || false);
          const currentPos = (player.currentTime || 0) * 1000;
          setPosition(currentPos);
          setDuration((player.duration || 0) * 1000);
          
          // Synchroniser le scroll avec la position audio
          if (isPlaying && duration > 0) {
            const progress = currentPos / duration;
            const totalHeight = contentPages.length * 500; // Hauteur estimée par page
            const scrollPosition = progress * totalHeight;
            
            // Calculer la page actuelle
            const newPage = Math.floor(progress * contentPages.length);
            if (newPage !== currentPage && newPage < contentPages.length) {
              // Transition vers la nouvelle page
              Animated.sequence([
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: Platform.OS !== 'web',
                }),
                Animated.timing(slideAnim, {
                  toValue: -newPage * 20,
                  duration: 300,
                  useNativeDriver: Platform.OS !== 'web',
                }),
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: Platform.OS !== 'web',
                }),
              ]).start();
              
              setCurrentPage(newPage);
              
              // Faire défiler vers la page correspondante
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                  y: newPage * 500,
                  animated: true,
                });
              }
            }
          }
        } catch (error) {
          console.log('Erreur mise à jour audio:', error);
        }
      };
      const interval = setInterval(updateStatus, 500);
      return () => clearInterval(interval);
    }
  }, [player, isPlaying, duration, currentPage]);

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
        message: `Écoutez "${track?.title || 'cette piste'}" sur Fayda Tidianiya`,
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
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.audioPlayerHeaderIconBtn}
        >
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.audioPlayerHeaderRight}>
          <TouchableOpacity 
            onPress={() => setCarMode(!carMode)} 
            style={styles.audioPlayerHeaderIconBtn}
          >
            <Ionicons name="car" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioPlayerHeaderIconBtn}>
            <Ionicons name="information-circle" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.audioPlayerContentNew} 
        contentContainerStyle={styles.audioPlayerContentContainerNew}
        showsVerticalScrollIndicator={false}
      >
        {/* Carte verte principale avec motif islamique */}
        <View style={styles.audioPlayerCardNew}>
          <ImageBackground
            source={track?.image || require('./assets/thierno.png')}
            style={styles.audioPlayerCardImageBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(15, 81, 50, 0.85)', 'rgba(11, 60, 93, 0.85)']}
              style={styles.audioPlayerCardGradient}
            >
              {/* Titre en blanc (latin) */}
              <Text style={styles.audioPlayerCardTitleWhite} numberOfLines={2}>
                {track?.title || 'Karatuttuka Da Lekcuci Na Shiek Ibrahim Mansur Imam Kaduna'}
              </Text>
              
              {/* Image portrait au centre */}
              <View style={styles.audioPlayerCardPortraitContainer}>
                <Image 
                  source={track?.image || require('./assets/thierno.png')} 
                  style={styles.audioPlayerCardPortrait}
                  resizeMode="cover"
                />
              </View>
              
              {/* Titre en blanc (arabe) */}
              <Text style={styles.audioPlayerCardTitleArabic} numberOfLines={2}>
                {track?.titleAr || 'كراتوتوکا دا لکچوچي نا شيخ إبراهيم منصور إمام كدونا'}
              </Text>
              
              {/* Footer avec logo et casque */}
              <View style={styles.audioPlayerCardFooterNew}>
                <Text style={styles.audioPlayerCardLogoWhite}>FAYDA DIGITAL</Text>
                <Ionicons name="headset" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Info piste avec menu */}
        <View style={styles.audioPlayerTrackInfoNew}>
          <View style={styles.audioPlayerTrackInfoLeft}>
            <Text style={styles.audioPlayerTrackArtistNew} numberOfLines={1}>
              {track?.artist || track?.speaker || track?.host || 'Shaykh al-Islam al-Hajj Ibrahim Niasse'}
            </Text>
          <Text style={styles.audioPlayerTrackTitleNew} numberOfLines={1}>
              {track?.title || 'Risalat al-Muntaqim: Wasika'}
          </Text>
          </View>
          <TouchableOpacity style={styles.audioPlayerTrackMenuBtn}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#8B4513" />
          </TouchableOpacity>
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
          <TouchableOpacity 
            style={styles.audioPlayerControlBtnNew}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-back" size={28} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerRewindBtn}
            onPress={() => handleSeek(-30)}
            activeOpacity={0.7}
          >
            <View style={styles.audioPlayer30sCircle}>
              <Ionicons name="play-back" size={20} color="#333" />
            </View>
            <Text style={styles.audioPlayerRewindText}>30s</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerPlayButtonNew}
            onPress={togglePlay}
            activeOpacity={0.9}
          >
            <View style={styles.audioPlayerPlayCircle}>
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={28} 
                color="#fff" 
                style={{ marginLeft: 3 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerForwardBtn}
            onPress={() => handleSeek(30)}
            activeOpacity={0.7}
          >
            <View style={styles.audioPlayer30sCircle}>
              <Ionicons name="play-forward" size={20} color="#333" />
            </View>
            <Text style={styles.audioPlayerForwardText}>30s</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerControlBtnNew}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-forward" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Contrôles supplémentaires */}
        <View style={styles.audioPlayerExtraControlsNew}>
          <TouchableOpacity 
            style={styles.audioPlayerExtraBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={20} color="#333" />
            <Text style={styles.audioPlayerExtraText}>{playbackSpeed.toFixed(1).replace('.', ',')}x</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerExtraBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="radio" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.audioPlayerExtraBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="moon-outline" size={20} color="#333" />
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

// Bande de don au-dessus du menu
function DonationBanner({ onPress }: { onPress: () => void }) {
  const { darkMode, showDonationBanner, currentRoute } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  // Ne pas afficher la bande sur la page Assistant/Fayda IA
  // Triple vérification pour être absolument sûr
  const isAssistantPage = currentRoute === 'Assistant';
  const shouldShow = showDonationBanner && !isAssistantPage;

  React.useEffect(() => {
    // Si on est sur Assistant, forcer shouldShow à false
    if (isAssistantPage) {
      const targetTranslateY = 100; // Sortir complètement de l'écran
      const targetOpacity = 0; // Rendre invisible
      
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: targetTranslateY,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacity, {
          toValue: targetOpacity,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
      return;
    }

    // Sinon, utiliser shouldShow normalement
    const targetTranslateY = shouldShow ? 0 : 100;
    const targetOpacity = shouldShow ? 1 : 0;
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: targetTranslateY,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(opacity, {
        toValue: targetOpacity,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [shouldShow, isAssistantPage]);

  // Ne pas rendre la bande si on est sur la page Assistant - retourner null immédiatement
  // Vérification prioritaire avant même le rendu
  if (isAssistantPage || !shouldShow) {
    return null;
  }

  return (
    <Animated.View style={{
      position: 'absolute',
      bottom: Platform.OS === 'web' ? 60 : 80, // Position au-dessus du menu (Tab.Navigator)
      left: 0,
      right: 0,
      height: 50, // Hauteur fixe pour garantir la visibilité
      backgroundColor: '#0F5132',
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 10, // Augmenté pour Android
      zIndex: 1001, // Au-dessus de tout
      opacity, // Ajouter opacity à l'animation
      transform: [{ translateY }],
    }}>
      <Text style={{
        color: '#ffffff',
        fontSize: 13,
        flex: 1,
        marginRight: 10,
        fontWeight: '500',
      }}>
        🤲 {t('donation.title')}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: '#ffffff',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
          minHeight: 40,
        }}
        activeOpacity={0.8}
      >
        <Text style={{
          color: '#0F5132',
          fontSize: 13,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          {t('donation.button')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Modal de don avec Wave et Orange Money
function DonationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { darkMode, language } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [selectedPayment, setSelectedPayment] = React.useState<'wave' | 'orange' | null>(null);
  const [selectedAmount, setSelectedAmount] = React.useState<string>('');

  // Montants prédéfinis en FCFA
  const amounts = ['1000', '2000', '5000', '10000', '20000', '50000'];

  // Fonction pour ouvrir l'application avec le montant sélectionné
  const handleOpenPaymentApp = (method: 'wave' | 'orange', amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner un montant');
      return;
    }

    if (method === 'wave') {
      // Pour Wave, utiliser le code USSD : #2171*1*783438249*montant#
      const ussdCode = `#2171*1*783438249*${amount}#`;
      const telUrl = `tel:${ussdCode}`;
      
      Linking.openURL(telUrl)
        .then(() => {
          // Fermer le modal directement sans afficher de popup
          setSelectedPayment(null);
          setSelectedAmount('');
          onClose();
        })
        .catch(err => {
          Alert.alert('Erreur', 'Impossible d\'effectuer l\'appel');
        });
    } else {
      // Pour Orange Money, utiliser le code USSD : #144*21*1*783438249*montant#
      const ussdCode = `#144*21*1*783438249*${amount}#`;
      const telUrl = `tel:${ussdCode}`;
      
      Linking.openURL(telUrl)
        .then(() => {
          // Fermer le modal directement sans afficher de popup
              setSelectedPayment(null);
              setSelectedAmount('');
              onClose();
        })
        .catch(err => {
          Alert.alert('Erreur', 'Impossible d\'effectuer l\'appel');
        });
    }
  };

  React.useEffect(() => {
    if (!visible) {
      setSelectedPayment(null);
      setSelectedAmount('');
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
      }}>
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={{
          backgroundColor: theme.surface,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          paddingTop: 24,
          paddingBottom: 40,
          paddingHorizontal: 24,
          maxHeight: '85%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
        }}>
          {/* Handle bar */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: theme.textSecondary + '40',
            borderRadius: 1,
            alignSelf: 'center',
            marginBottom: 20,
          }} />

          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.text,
                marginBottom: 4,
              }}>
                🤲 {t('donation.title')}
              </Text>
              <Text style={{
                fontSize: 14,
                color: theme.textSecondary,
              }}>
                {t('donation.message')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 1,
                backgroundColor: theme.background,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 20,
                color: theme.text,
                fontWeight: '300',
              }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Séparateur */}
          <View style={{
            height: 1,
            backgroundColor: theme.textSecondary + '20',
            marginVertical: 24,
          }} />

          {!selectedPayment ? (
            <>
              {/* Sous-titre */}
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.text,
                marginBottom: 20,
                textAlign: 'center',
              }}>
                {t('donation.subtitle')}
              </Text>

              {/* Bouton Wave */}
              <TouchableOpacity
                onPress={() => setSelectedPayment('wave')}
                style={{
                  backgroundColor: '#1E88E5',
                  borderRadius: 1,
                  padding: 20,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#1E88E5',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
                activeOpacity={0.9}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                  overflow: 'hidden',
                }}>
                  <Image
                    source={require('./assets/pdf/cover/icones/wave.png')}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: 4,
                  }}>
                    Wave
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: '#ffffff',
                    opacity: 0.9,
                  }}>
                    {t('donation.wave')}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 24,
                  color: '#ffffff',
                  opacity: 0.8,
                }}>›</Text>
              </TouchableOpacity>

              {/* Bouton Orange Money */}
              <TouchableOpacity
                onPress={() => setSelectedPayment('orange')}
                style={{
                  backgroundColor: '#FF6600',
                  borderRadius: 1,
                  padding: 20,
                  marginBottom: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#FF6600',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
                activeOpacity={0.9}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                  overflow: 'hidden',
                }}>
                  <Image
                    source={require('./assets/pdf/cover/icones/om.png')}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: 4,
                  }}>
                    Orange Money
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: '#ffffff',
                    opacity: 0.9,
                  }}>
                    {t('donation.orange')}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 24,
                  color: '#ffffff',
                  opacity: 0.8,
                }}>›</Text>
              </TouchableOpacity>
            </>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header avec logo */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  overflow: 'hidden',
                }}>
                  <Image
                    source={selectedPayment === 'wave' 
                      ? require('./assets/pdf/cover/icones/wave.png')
                      : require('./assets/pdf/cover/icones/om.png')}
                    style={{
                      width: 60,
                      height: 60,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: theme.text,
                  marginBottom: 4,
                }}>
                  {selectedPayment === 'wave' ? 'Wave' : 'Orange Money'}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: theme.textSecondary,
                }}>
                  Sélectionnez un montant
                </Text>
              </View>

              {/* Sélecteur de montant */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: 16,
                  textAlign: 'center',
                }}>
                  {t('donation.amount')} (FCFA)
                </Text>
                
                {/* Grille de montants */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 12,
                }}>
                  {amounts.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      onPress={() => setSelectedAmount(amt)}
                      style={{
                        width: '30%',
                        backgroundColor: selectedAmount === amt 
                          ? (selectedPayment === 'wave' ? '#1E88E5' : '#FF6600')
                          : theme.background,
                        borderRadius: 5,
                        padding: 16,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: selectedAmount === amt 
                          ? (selectedPayment === 'wave' ? '#1E88E5' : '#FF6600')
                          : theme.textSecondary + '20',
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: selectedAmount === amt ? '#ffffff' : theme.text,
                      }}>
                        {parseInt(amt).toLocaleString()} FCFA
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Champ montant personnalisé */}
                <View style={{ marginTop: 16 }}>
                  <TextInput
                    style={{
                      backgroundColor: theme.background,
                      borderRadius: 5,
                      padding: 16,
                      fontSize: 16,
                      color: theme.text,
                      borderWidth: 1,
                      borderColor: theme.textSecondary + '30',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                    placeholder="Montant personnalisé"
                    placeholderTextColor={theme.textSecondary + '70'}
                    value={selectedAmount && !amounts.includes(selectedAmount) ? selectedAmount : ''}
                    onChangeText={(text) => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      setSelectedAmount(numericText);
                    }}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Bouton retour */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedPayment(null);
                  setSelectedAmount('');
                }}
                style={{
                  backgroundColor: theme.background,
                  borderRadius: 5,
                  padding: 16,
                  alignItems: 'center',
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: theme.textSecondary + '20',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 16,
                  color: theme.text,
                  fontWeight: '500',
                }}>
                  ← Retour
                </Text>
              </TouchableOpacity>

              {/* Bouton valider */}
              <TouchableOpacity
                onPress={() => {
                  if (selectedAmount && parseFloat(selectedAmount) > 0) {
                    handleOpenPaymentApp(selectedPayment!, selectedAmount);
                  } else {
                    Alert.alert('Erreur', 'Veuillez sélectionner un montant');
                  }
                }}
                disabled={!selectedAmount || parseFloat(selectedAmount) <= 0}
                style={{
                  backgroundColor: selectedPayment === 'wave' ? '#1E88E5' : '#FF6600',
                  borderRadius: 5,
                  padding: 18,
                  alignItems: 'center',
                  shadowColor: selectedPayment === 'wave' ? '#1E88E5' : '#FF6600',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  opacity: (!selectedAmount || parseFloat(selectedAmount) <= 0) ? 0.5 : 1,
                }}
                activeOpacity={0.9}
              >
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}>
                  Valider et ouvrir {selectedPayment === 'wave' ? 'Wave' : 'Orange Money'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
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

// Écran Assistant IA
function AIScreen({ navigation }: any) {
  const { language, darkMode, setShowDonationBanner } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: t('assistant.welcome') }
  ]);
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recording, setRecording] = React.useState<Audio.Recording | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const lastScrollY = React.useRef(0);
  const scrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Utiliser useFocusEffect pour cacher la bande dès que la page est focalisée
  useFocusEffect(
    React.useCallback(() => {
      // Cacher la bande immédiatement quand on arrive sur cette page
      setShowDonationBanner(false);
      
      // Remettre la bande à true quand on quitte la page
      return () => {
        // Petit délai pour éviter un flash lors de la transition
        setTimeout(() => {
          setShowDonationBanner(true);
        }, 100);
      };
    }, [setShowDonationBanner])
  );

  // Nettoyer le timer au démontage
  React.useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const suggestions = [
    t('assistant.suggestion1'),
    t('assistant.suggestion2'),
    t('assistant.suggestion3'),
    t('assistant.suggestion4'),
  ];

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    // Ajouter le message de l'utilisateur
    const userMessage = { role: 'user' as const, content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Préparer l'historique des messages
      const messageHistory: Message[] = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Appeler l'API
      const response = await sendMessageToAI(messageHistory, language || 'fr');
      
      // Ajouter la réponse de l'assistant
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('assistant.error') 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([{ role: 'assistant', content: t('assistant.welcome') }]);
  };

  // Fonction pour démarrer l'enregistrement vocal
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(
          'Permission microphone',
          'L\'accès au microphone est nécessaire pour l\'enregistrement vocal'
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  };

  // Fonction pour arrêter l'enregistrement et transcrire
  const stopRecording = async () => {
    if (!recording) return;
    
    setIsRecording(false);
    setIsLoading(true);
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      
      const uri = recording.getURI();
      if (uri) {
        try {
          const transcribedText = await transcribeAudio(uri, language || 'fr');
          if (transcribedText.trim()) {
            setInputText(transcribedText);
            // Optionnel : envoyer automatiquement
            // await sendMessage(transcribedText);
          }
        } catch (error: any) {
          console.error('Erreur transcription:', error);
          Alert.alert(
            'Erreur de transcription',
            error.message || 'Impossible de transcrire l\'audio. Veuillez réessayer.'
          );
        }
      }
    } catch (error) {
      console.error('Erreur arrêt enregistrement:', error);
    } finally {
      setRecording(null);
      setIsLoading(false);
    }
  };

  // Fonction pour lire une réponse vocale
  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      // Utiliser expo-speech (plus simple, voix système)
      await Speech.speak(text, {
        language: language === 'ar' ? 'ar' : language === 'fr' ? 'fr-FR' : 'en-US',
        pitch: 1.0,
        rate: 0.9,
      });
      
      // Note: Pour utiliser Groq TTS, décommentez le code ci-dessous
      // et commentez expo-speech ci-dessus
      // const audioBase64 = await synthesizeSpeech(text, language || 'fr');
      // const sound = new Audio.Sound();
      // await sound.loadAsync({ uri: audioBase64 });
      // await sound.playAsync();
      // sound.setOnPlaybackStatusUpdate((status) => {
      //   if (status.isLoaded && status.didJustFinish) {
      //     setIsSpeaking(false);
      //     sound.unloadAsync();
      //   }
      // });
      
    } catch (error) {
      console.error('Erreur lecture vocale:', error);
    } finally {
      // Pour expo-speech, on peut arrêter immédiatement
      // Pour Groq TTS, attendre la fin de la lecture
      setTimeout(() => setIsSpeaking(false), 100);
    }
  };

  // Arrêter la lecture vocale
  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  React.useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <LinearGradient
        colors={darkMode ? ['#0B3C5D', '#0F5132'] : ['#F8F9F6', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerModern}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.appTitleModern, { color: theme.text }]}>
              {t('assistant.title')}
            </Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>
              {t('assistant.subtitle')}
            </Text>
          </View>
          <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
            <Text style={[styles.clearButtonText, { color: theme.primary }]}>
              {t('assistant.clear')}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <LinearGradient
              colors={
                message.role === 'user'
                  ? ['#0F5132', '#0B3C5D']
                  : darkMode
                  ? ['#1e1e1e', '#2a2a2a']
                  : ['#f0f0f0', '#e0e0e0']
              }
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userMessageBubble : styles.assistantMessageBubble,
              ]}
            >
              <View style={styles.messageHeader}>
              <Text
                style={[
                  styles.messageText,
                  {
                    color: message.role === 'user' ? '#ffffff' : theme.text,
                    textAlign: language === 'ar' ? 'right' : 'left',
                  },
                ]}
              >
                {message.content}
              </Text>
                
                {message.role === 'assistant' && (
                  <TouchableOpacity
                    onPress={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                    style={styles.speakButton}
                  >
                    <Ionicons 
                      name={isSpeaking ? "volume-high" : "volume-high-outline"} 
                      size={18} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.thinkingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.thinkingText, { color: theme.textSecondary }]}>
              {t('assistant.thinking')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      {messages.length === 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: theme.textSecondary }]}>
            {t('assistant.suggestions')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionChip, { backgroundColor: theme.surface }]}
                onPress={() => sendMessage(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: theme.text }]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.background }]}>
          {/* Bouton microphone */}
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[
              styles.micButton,
              isRecording && styles.micButtonRecording,
            ]}
            disabled={isLoading}
          >
            <Ionicons 
              name={isRecording ? "mic" : "mic-outline"} 
              size={24} 
              color={isRecording ? "#fff" : theme.textSecondary} 
            />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, { color: theme.text }]}
            placeholder={t('assistant.placeholder')}
            placeholderTextColor={theme.textSecondary}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              // Scroller vers le bas quand on tape
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
            multiline
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: theme.primary },
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
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
  primary: '#ffffff',
  secondary: '#0B3C5D',
  accent: '#C9A24D',
};

// Écran de Splash/Onboarding
function OnboardingScreen({ navigation }: any) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const { darkMode } = React.useContext(AppContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const scrollViewRef = React.useRef<ScrollView>(null);

  const slides = [
    {
      id: 1,
      title: 'Bienvenue sur Fayda Tidianiya',
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

  const handleScroll = (event: any) => {
    const slideWidth = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideWidth);
    setCurrentSlide(index);
  };

  const goToHome = () => {
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.onboardingContainer}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.onboardingScrollView}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.onboardingSlide, { backgroundColor: slide.color }]}>
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
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Indicateurs de pagination - remontés */}
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

      {/* Flèches de navigation - relevées */}
      <View style={styles.onboardingArrowsContainer}>
        {currentSlide > 0 && (
          <TouchableOpacity 
            style={styles.onboardingArrowLeft} 
            onPress={() => {
              scrollViewRef.current?.scrollTo({ x: (currentSlide - 1) * width, animated: true });
            }}
          >
            <Text style={styles.onboardingArrowText}>←</Text>
          </TouchableOpacity>
        )}
        {currentSlide > 0 && currentSlide < slides.length - 1 && (
          <TouchableOpacity 
            style={styles.onboardingArrowRight} 
            onPress={() => {
              scrollViewRef.current?.scrollTo({ x: (currentSlide + 1) * width, animated: true });
            }}
          >
            <Text style={styles.onboardingArrowText}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bouton continuer centré sur toutes les pages */}
      <View style={styles.onboardingButtonContainer}>
        <TouchableOpacity style={styles.onboardingButton} onPress={goToHome}>
          <Text style={styles.onboardingButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Navigation principale
function MainTabs() {
  const { language, darkMode, currentRoute, setCurrentRoute, showDonationBanner } = React.useContext(AppContext);
  const navigation = useNavigation();
  const [donationModalVisible, setDonationModalVisible] = React.useState(false);
  const tabBarTranslateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Quand showDonationBanner est false (on scrolle), le menu descend un peu avec la bande en bas
    // Quand showDonationBanner est true (on ne scrolle pas), le menu est en position normale
    const targetValue = showDonationBanner ? 0 : 10; // Descendre de 10px quand on scrolle (juste un petit peu)
    Animated.timing(tabBarTranslateY, {
      toValue: targetValue, // Descendre légèrement de 10px
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [showDonationBanner]);

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
    <View style={{ flex: 1, position: 'relative' }}>
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: tabBarTranslateY }],
          zIndex: 999,
        }}
      >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0F5132',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: darkMode ? darkTheme.surface : lightTheme.surface,
            borderTopColor: '#e0e0e0',
            ...(Platform.OS === 'web' && {
              height: 60,
            }),
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: t('nav.home'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={24} 
                color={focused ? '#0F5132' : color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Books" 
          component={BooksScreen}
          options={{
            tabBarLabel: t('nav.books'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'library' : 'library-outline'} 
                size={24} 
                color={focused ? '#0F5132' : color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Music" 
          component={MusicScreen}
          options={{
            tabBarLabel: t('nav.music'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'musical-notes' : 'musical-notes-outline'} 
                size={24} 
                color={focused ? '#0F5132' : color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Podcasts" 
          component={PodcastsScreen}
          options={{
            tabBarLabel: t('nav.podcasts'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'mic' : 'mic-outline'} 
                size={24} 
                color={focused ? '#0F5132' : color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Assistant"
          component={AIScreen}
          options={{
            tabBarLabel: t('assistant.title'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
                size={24} 
                color={focused ? '#0F5132' : color} 
              />
            ),
          }}
        />
      </Tab.Navigator>
      </Animated.View>
      <DonationBanner onPress={() => setDonationModalVisible(true)} />
      <MiniPlayerModal navigation={navigation} />
      <DonationModal 
        visible={donationModalVisible} 
        onClose={() => setDonationModalVisible(false)} 
      />
    </View>
  );
}

// Écran de chargement avec "Fayda Tidianiya"
function LoadingScreen() {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.8));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.loadingScreen}>
      <LinearGradient
        colors={['#0F5132', '#0B3C5D', '#0F5132']}
        style={styles.loadingGradient}
      >
        <Animated.View
          style={[
            styles.loadingContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('./assets/pdf/cover/icones/chargement.png')}
            style={styles.loadingImage}
            resizeMode="contain"
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

// Composant principal
export default function App() {
  const [language, setLang] = React.useState<Language | null>(null);
  const [darkMode, setDarkMode] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState<{ item: any; type: 'music' | 'podcast' | 'book' | 'zikr' | 'coran' | null } | null>(null);
  const [audioState, setAudioState] = React.useState<{ isPlaying: boolean; position: number; duration: number } | null>(null);
  const [currentRoute, setCurrentRoute] = React.useState<string | null>(null);
  const [recentItems, setRecentItems] = React.useState<Array<{id: number, type: 'pdf' | 'audio', title: string, titleAr?: string, timestamp: number, item: any}>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDonationBanner, setShowDonationBanner] = React.useState(true);

  const addToHistory = React.useCallback((item: any, type: 'pdf' | 'audio') => {
    setRecentItems(prev => {
      const newItem = {
        id: item.id || Date.now(),
        type,
        title: item.title || item.name || 'Sans titre',
        titleAr: item.titleAr,
        timestamp: Date.now(),
        item: item
      };
      // Retirer les doublons et garder seulement les 6 plus récents
      const filtered = prev.filter(i => !(i.id === newItem.id && i.type === type));
      const updated = [newItem, ...filtered].slice(0, 6);
      return updated.sort((a, b) => b.timestamp - a.timestamp);
    });
  }, []);

  React.useEffect(() => {
    if (language) {
      setLanguage(language);
    }
    // Simuler un chargement de 2 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [language]);

  if (isLoading) {
    return <LoadingScreen />;
  }

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
      recentItems,
      addToHistory,
      showDonationBanner,
      setShowDonationBanner,
    }}>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'fade', // Transition fade pour plus de fluidité
            animationDuration: 150, // Animation plus rapide pour transition fluide
          }} 
          initialRouteName="Onboarding"
        >
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="AudioPlayer" 
            component={AudioPlayerScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="PDFReader" 
            component={PDFReaderScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="VideoPlayer" 
            component={VideoPlayerScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="Zikr" 
            component={ZikrScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="Coran" 
            component={CoranScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="Gamou" 
            component={GamouScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="PodcastPlayer" 
            component={PodcastPlayerScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="Assistant" 
            component={AIScreen}
            options={{ animation: 'fade' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* Note: PdfPageCounter est désactivé car react-native-pdf nécessite un développement build
          Voir README-PDF-PAGES.md pour plus d'informations */}
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
  headerLogo: {
    width: 180,
    height: 50,
    marginTop: 8,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueCardEnhanced: {
    borderRadius: 1,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 18,
  },
  continueIcon: {
    width: 50,
    height: 50,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  continueIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 1,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  musicCardEnhanced: {
    borderRadius: 1,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 18,
  },
  musicIcon: {
    width: 50,
    height: 50,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  musicIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 1,
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
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audiobookCardEnhanced: {
    borderRadius: 1,
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
    borderRadius: 1,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCardEnhanced: {
    borderRadius: 1,
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
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookCoverEnhanced: {
    width: 110,
    height: 150,
    borderRadius: 5,
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
    marginTop: 8,
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
    borderRadius: 1,
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
    borderRadius: 1,
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
    borderRadius: 14,
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
    borderRadius: 5,
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
    borderRadius: 5,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  musicItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 9,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastCardEnhanced: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  podcastIcon: {
    width: 50,
    height: 50,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  podcastIconEnhanced: {
    width: 70,
    height: 70,
    borderRadius: 5,
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
    borderRadius: 5,
    alignItems: 'center',
  },
  subscribeButtonEnhanced: {
    flex: 1,
    backgroundColor: '#0F5132',
    padding: 14,
    borderRadius: 5,
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
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonEnhanced: {
    width: 56,
    height: 56,
    backgroundColor: '#0F5132',
                  borderRadius: 10,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseCardEnhanced: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 5,
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
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  courseIconEnhanced: {
    width: 70,
    height: 70,
    borderRadius: 5,
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
    borderRadius: 5,
    marginBottom: 8,
  },
  lessonItemEnhanced: {
    padding: 15,
    borderRadius: 5,
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
  },
  pdfReaderHeaderModern: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 12 : 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfReaderBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  pdfReaderHeaderContent: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'center',
    paddingVertical: 5,
  },
  pdfReaderTitleModern: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pdfReaderAuthorModern: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  pdfReaderMenuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  pdfContainerModern: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfLoadingGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfLoadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfLoadingTextModern: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  pdfLoadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  pdfErrorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  pdfErrorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  pdfRetryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  pdfRetryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pdfControlsToggleButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 80 : 120,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  pdfControlsBarModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pdfControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pdfControlButtonModern: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pdfZoomIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 60,
    alignItems: 'center',
  },
  pdfZoomTextModern: {
    fontSize: 14,
    fontWeight: '600',
  },
  pdfControlsSeparatorModern: {
    width: 1,
    height: 30,
    marginHorizontal: 10,
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
    borderRadius: 5,
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
    borderRadius: 14,
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
    borderRadius: 5,
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
    borderRadius: 5,
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
  onboardingScrollView: {
    flex: 1,
  },
  onboardingSlide: {
    width: width,
    flex: 1,
  },
  onboardingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#fff',
  },
  onboardingArrowsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  onboardingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  onboardingArrowLeft: {
    width: 50,
    height: 50,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingArrowRight: {
    width: 50,
    height: 50,
    borderRadius: 9,
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
    borderRadius: 9,
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
    paddingTop: Platform.OS === 'web' ? 12 : 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
  headerIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCloseButton: {
    marginLeft: 10,
    padding: 5,
  },
  searchResultsContainer: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultImage: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 12,
    resizeMode: 'cover',
  },
  searchResultContent: {
    flex: 1,
    justifyContent: 'center',
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultTitleAr: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Traditional Arabic',
  },
  searchResultAuthor: {
    fontSize: 13,
    marginBottom: 4,
  },
  searchResultType: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchResultViewedIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  searchSuggestionsContainer: {
    marginHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
    overflow: 'hidden',
  },
  searchSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  searchSuggestionIcon: {
    marginRight: 10,
  },
  searchSuggestionText: {
    flex: 1,
    fontSize: 15,
  },
  settingsModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  settingsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsModalCloseButton: {
    padding: 5,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingsOptions: {
    gap: 12,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  settingsOptionActive: {
    borderColor: '#0F5132',
    borderWidth: 2,
  },
  settingsOptionFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  settingsOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
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
    height: 280,
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 0,
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
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
    borderRadius: 14,
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
    borderRadius: 1,
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
    borderRadius: 13,
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
    borderRadius: 9,
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
  horizontalScrollModernPodcasts: {
    marginHorizontal: -20,
    paddingLeft: 0,
    paddingRight: 20,
  },
  horizontalScrollContentModern: {
    paddingRight: 20,
  },
  // Styles modernes - Continue Cards
  continueCardModern: {
    width: 180,
    marginRight: 15,
    padding: 18,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  continueIconGradientModern: {
    width: 65,
    height: 65,
    borderRadius: 19,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  musicIconGradientModern: {
    width: 60,
    height: 60,
    borderRadius: 1,
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
    borderRadius: 5,
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
    borderRadius: 10,
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
  booksScrollContentNew: {
    paddingHorizontal: 8, // Marges réduites
  },
  booksHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 20, // Faire descendre le menu
    marginTop: 20, // Espacement supplémentaire en haut
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerIcon: {
    fontSize: 20,
  },
  languageBarContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 4,
    minHeight: 36,
  },
  languageBarItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 1,
    marginHorizontal: 2,
  },
  languageBarItemActive: {
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageBarText: {
    fontSize: 13,
    fontWeight: '500',
  },
  languageBarTextActive: {
    fontWeight: '600',
  },
  languageBarSeparator: {
    width: 1,
    height: 20,
    marginHorizontal: 4,
  },
  categorySectionModern: {
    marginBottom: 30,
    paddingHorizontal: 8, // Marges réduites
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
    borderRadius: 13,
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
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  bookCardArticle: {
    width: 150,
    marginRight: 15,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  booksGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 4, // Marges réduites
    paddingVertical: 10,
  },
  bookCardGrid: {
    width: '32%', // 3 colonnes : 32% × 3 = 96%, reste 4% pour les espaces
    marginRight: '1%',
    marginBottom: 15,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  bookCardGridLastInRow: {
    marginRight: 0, // Pas de marge à droite pour la 3ème colonne de chaque ligne
  },
  bookCoverModern: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverArticle: {
    width: '100%',
    aspectRatio: 1, // Format carré pour les articles
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      minHeight: 0,
      position: 'relative' as any,
    }),
  },
  // Styles pour les cartes pleine largeur (Tariqa et Ma'rifa)
  bookCardFullWidth: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  bookCoverFullWidth: {
    width: '100%',
    aspectRatio: 1.3, // Format rectangulaire large
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCardContentFullWidth: {
    padding: 16,
  },
  bookTitleFullWidth: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bookTitleArFullWidth: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'right',
  },
  bookAuthorFullWidth: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  bookPagesContainerFullWidth: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bookCoverImageStyle: {
    resizeMode: 'cover',
    borderRadius: 5,
    ...(Platform.OS === 'web' && {
      objectFit: 'cover' as any,
    }),
  },
  bookCoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
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
  bookTitleArModern: {
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'right',
    opacity: 0.8,
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  musicCardGridIconModern: {
    width: 70,
    height: 70,
    borderRadius: 5,
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
    borderRadius: 13,
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
    borderRadius: 5,
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
    borderRadius: 9,
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
    borderRadius: 9,
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
    borderRadius: 13,
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
    borderRadius: 5,
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
    borderRadius: 5,
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
    borderRadius: 9,
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
    borderRadius: 5,
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
                  borderRadius: 8,
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
    borderRadius: 13,
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  musicPlayerPlayBtnGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
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
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
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
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
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
    borderRadius: 5,
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
    borderRadius: 5,
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
  modalContentScroll: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 20,
  },
  modalPodcastImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalDescriptionSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  // Styles pour le modal podcast (design selon l'image)
  podcastModalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  podcastModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  podcastModalCloseBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastModalCloseIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  podcastModalBookmarkBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastModalBookmarkIcon: {
    fontSize: 24,
  },
  podcastModalScroll: {
    flex: 1,
  },
  podcastModalContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  podcastModalImageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastModalImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  podcastModalImageStyle: {
    borderRadius: 1,
    resizeMode: 'cover',
  },
  podcastModalImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    paddingBottom: 20,
  },
  podcastModalImageTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  podcastModalImageSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  podcastModalImageInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    paddingBottom: 20,
  },
  podcastModalImageDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'left',
    lineHeight: 20,
  },
  podcastModalImageDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'left',
  },
  podcastModalInfoSection: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  podcastModalInfoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 28,
  },
  podcastModalInfoDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  podcastModalInfoDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  podcastModalMainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
  },
  podcastModalMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  podcastModalMetadataText: {
    fontSize: 14,
    marginRight: 8,
  },
  podcastModalLockIcon: {
    fontSize: 16,
  },
  podcastModalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 12,
  },
  podcastModalPlayButton: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastModalPlayButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  podcastModalPlayIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  podcastModalPlayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  podcastModalMenuButton: {
    width: 56,
    height: 56,
    borderRadius: 5,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastModalMenuIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  podcastModalAboutSection: {
    marginBottom: 25,
  },
  podcastModalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  podcastModalAboutText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
  },
  podcastModalTagsSection: {
    marginBottom: 20,
  },
  podcastModalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  podcastModalTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#C9A24D',
    gap: 8,
  },
  podcastModalTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  podcastModalTagIcon: {
    fontSize: 12,
    color: '#000000',
  },
  // Styles pour le modal de livre (design selon l'image)
  bookModalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  bookModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  bookModalCloseBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookModalCloseIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  bookModalBookmarkBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookModalBookmarkIcon: {
    fontSize: 24,
  },
  bookModalScroll: {
    flex: 1,
  },
  bookModalContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bookModalImageContainer: {
    width: '70%',
    alignSelf: 'center',
    aspectRatio: 1, // Format carré
    marginBottom: 20,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bookModalImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web' && {
      minHeight: 200,
    }),
  },
  bookModalImageStyle: {
    borderRadius: 1,
    resizeMode: 'cover',
    ...(Platform.OS === 'web' && {
      objectFit: 'cover' as any,
    }),
  },
  bookModalImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    paddingBottom: 20,
  },
  bookModalImageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  bookModalImageSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
    textAlign: 'center',
  },
  bookModalImageFooter: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.7,
    marginTop: 4,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bookModalMainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 32,
  },
  bookModalAuthor: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  bookModalMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bookModalMetadataText: {
    fontSize: 14,
    marginRight: 8,
    textAlign: 'center',
  },
  bookModalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  bookModalReadButton: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookModalReadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: '#0F5132',
  },
  bookModalReadIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  bookModalReadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  bookModalMenuButton: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookModalMenuIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
  },
  bookModalTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 20,
  },
  bookModalTab: {
    paddingBottom: 12,
    marginBottom: -1,
  },
  bookModalTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0F5132',
  },
  bookModalTabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bookModalTabTextActive: {
    color: '#0F5132',
    fontWeight: '600',
  },
  bookModalAboutSection: {
    marginTop: 10,
  },
  bookModalSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bookModalAboutText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
  },
  // Styles pour le lecteur podcast plein écran
  podcastPlayerScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  podcastPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  podcastPlayerHeaderIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastPlayerHeaderIconText: {
    fontSize: 24,
    color: '#000000',
  },
  podcastPlayerHeaderIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  podcastPlayerScroll: {
    flex: 1,
  },
  podcastPlayerContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  podcastPlayerImageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastPlayerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  podcastPlayerImageStyle: {
    borderRadius: 1,
    resizeMode: 'cover',
  },
  podcastPlayerImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    paddingBottom: 20,
  },
  podcastPlayerImageTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#ffffff',
    marginBottom: 4,
  },
  podcastPlayerImageSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  podcastPlayerTrackInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  podcastPlayerTrackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 15,
  },
  podcastPlayerOptions: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastPlayerOptionsIcon: {
    fontSize: 24,
    color: '#000000',
  },
  podcastPlayerProgressContainer: {
    marginBottom: 30,
  },
  podcastPlayerSlider: {
    width: '100%',
    height: 40,
  },
  podcastPlayerTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  podcastPlayerTimeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  podcastPlayerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 20,
  },
  podcastPlayer30sBtn: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastPlayer30sCircle: {
    width: 60,
    height: 60,
    borderRadius: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F5132',
  },
  podcastPlayer30sText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F5132',
  },
  podcastPlayerPlayBtn: {
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  podcastPlayerPlayBtnGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastPlayerPlayIcon: {
    fontSize: 36,
    color: '#ffffff',
  },
  podcastPlayerBottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  podcastPlayerSpeedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    gap: 8,
  },
  podcastPlayerSpeedIcon: {
    fontSize: 18,
  },
  podcastPlayerSpeedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  podcastPlayerBottomIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  podcastPlayerBottomIcon: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastPlayerBottomIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F5132',
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
    paddingTop: Platform.OS === 'web' ? 12 : 50,
    paddingBottom: 15,
  },
  audioPlayerHeaderIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerHeaderRight: {
    flexDirection: 'row',
    gap: 20,
  },
  audioPlayerContentNew: {
    flex: 1,
  },
  audioPlayerContentContainerNew: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  // Grande carte verte centrale
  audioPlayerCardNew: {
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  audioPlayerCardImageBackground: {
    width: '100%',
    minHeight: 280,
  },
  audioPlayerCardGradient: {
    padding: 24,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  audioPlayerCardTitleWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  audioPlayerCardPortraitContainer: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  audioPlayerCardPortrait: {
    width: '100%',
    height: '100%',
  },
  audioPlayerCardTitleArabic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Al Nile' : 'sans-serif',
  },
  audioPlayerCardFooterNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  audioPlayerCardLogoWhite: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  // Info piste
  audioPlayerTrackInfoNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  audioPlayerTrackInfoLeft: {
    flex: 1,
    marginRight: 12,
  },
  audioPlayerTrackArtistNew: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  audioPlayerTrackTitleNew: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  audioPlayerTrackMenuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#333',
    fontWeight: '500',
  },
  audioPlayerTimeRemainingNew: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  // Contrôles principaux
  audioPlayerMainControlsNew: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 25,
  },
  audioPlayerControlBtnNew: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayer30sCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerRewindBtn: {
    alignItems: 'center',
    gap: 6,
  },
  audioPlayerRewindText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  audioPlayerForwardBtn: {
    alignItems: 'center',
    gap: 6,
  },
  audioPlayerForwardText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  audioPlayerPlayButtonNew: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerPlayCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Contrôles supplémentaires
  audioPlayerExtraControlsNew: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  audioPlayerExtraBtn: {
    alignItems: 'center',
    gap: 4,
  },
  audioPlayerExtraText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
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
    borderRadius: 9,
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
    borderRadius: 5,
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
    borderRadius: 5,
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
    borderRadius: 1,
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
    borderRadius: 9,
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
    borderRadius: 1,
    overflow: 'hidden',
  },
  libraryLessonsProgressFill: {
    height: '100%',
    borderRadius: 1,
  },
  libraryLessonItem: {
    marginBottom: 12,
    borderRadius: 9,
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
    borderRadius: 5,
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
    borderRadius: 13,
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
    borderRadius: 13,
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
    borderRadius: 13,
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
    borderRadius: 9,
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
    borderRadius: 5,
    overflow: 'hidden',
  },
  podcastCardContentNew: {
    flexDirection: 'row',
    padding: 20,
  },
  podcastIconNew: {
    width: 75,
    height: 75,
    borderRadius: 13,
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
    borderRadius: 9,
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
    borderRadius: 9,
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
                  borderRadius: 10,
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
  // Styles nouveaux podcasts
  podcastsSection: {
    marginBottom: 30,
  },
  podcastsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  podcastsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  podcastsViewAllButton: {
    backgroundColor: '#C9A24D',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 9,
  },
  podcastsViewAllText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  podcastsHorizontalScroll: {
    paddingRight: 20,
    gap: 15,
  },
  podcastCardHorizontal: {
    width: 180,
    marginRight: 15,
  },
  podcastAlbumContainer: {
    width: 180,
    height: 180,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0F5132',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastAlbumImage: {
    width: '100%',
    height: '100%',
  },
  podcastAlbumOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    paddingBottom: 8,
  },
  podcastAlbumTextAr: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'right',
  },
  podcastAlbumTextLatin: {
    fontSize: 10,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'right',
  },
  podcastAlbumLogo: {
    alignItems: 'center',
    marginTop: 4,
  },
  podcastAlbumLogoText: {
    fontSize: 8,
    color: '#C9A24D',
    fontWeight: '600',
  },
  podcastCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  podcastCardSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  podcastCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  podcastCardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  podcastCardInfoIcon: {
    fontSize: 14,
  },
  podcastCardInfoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  podcastCardInfoButton: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastZikrCard: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  podcastZikrGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  podcastZikrPattern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastZikrTextAr: {
    fontSize: 80,
    color: '#C9A24D',
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  podcastZikrTextLatin: {
    fontSize: 32,
    color: '#C9A24D',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  podcastMusicCard: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  podcastMusicGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  podcastMusicPattern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastMusicTextAr: {
    fontSize: 80,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  podcastMusicTextLatin: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  // Styles header simple podcasts
  podcastsHeaderSimple: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  podcastsHeaderTitleSimple: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  // Styles header nouveau design podcasts (avec pills)
  podcastsHeaderNew: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  podcastsHeaderIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastsHeaderIconNew: {
    fontSize: 22,
  },
  podcastsHeaderPills: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 9,
    padding: 4,
  },
  podcastsHeaderPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  podcastsHeaderPillActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  podcastsHeaderPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  podcastsHeaderPillTextActive: {
    color: '#0F5132',
    fontWeight: 'bold',
  },
  // Styles cartes podcasts nouveau design
  podcastCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  podcastFaydaIcon: {
    width: 32,
    height: 32,
    borderRadius: 1,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  podcastFaydaIconText: {
    fontSize: 14,
    color: '#C9A24D',
    fontWeight: 'bold',
  },
  podcastDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  podcastThumbnailContainer: {
    width: '100%',
    height: 220,
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  podcastThumbnail: {
    width: '100%',
    height: '100%',
  },
  podcastLockIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastLockIconText: {
    fontSize: 18,
  },
  podcastThumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'space-between',
    padding: 20,
  },
  podcastThumbnailTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  podcastThumbnailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  podcastThumbnailSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  podcastThumbnailEpisodes: {
    fontSize: 13,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  podcastThumbnailLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    gap: 6,
  },
  podcastThumbnailLogoAr: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  podcastThumbnailLogoText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  podcastThumbnailWaveform: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 4,
  },
  podcastCardInfoContainer: {
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 8,
  },
  podcastCardTitleNew: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  podcastCardSubtitleNew: {
    fontSize: 14,
    marginBottom: 4,
  },
  podcastCardHost: {
    fontSize: 13,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  podcastCardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  podcastCardMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  podcastCardDate: {
    fontSize: 12,
  },
  podcastCardEpisodeType: {
    fontSize: 12,
    marginLeft: 4,
  },
  podcastCardFooterNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  podcastCardFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  podcastCardFooterRight: {
    flexDirection: 'row',
    gap: 12,
  },
  podcastCardFooterIcon: {
    fontSize: 18,
  },
  podcastCardFooterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  podcastCardFooterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Styles ZikrScreen
  zikrHeader: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  zikrBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrBackIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  zikrHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  zikrHeaderSpacer: {
    width: 40,
  },
  zikrScrollView: {
    flex: 1,
  },
  zikrScrollContent: {
    paddingBottom: 30,
  },
  zikrBannerContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 0,
    overflow: 'hidden',
  },
  zikrBannerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  zikrBannerPattern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  zikrBannerTextAr: {
    fontSize: 80,
    color: '#C9A24D',
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  zikrBannerTextLatin: {
    fontSize: 32,
    color: '#C9A24D',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  zikrSectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  zikrSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  zikrSectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  zikrCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  zikrThumbnailContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  zikrThumbnail: {
    width: '100%',
    height: '100%',
  },
  zikrThumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 81, 50, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  zikrThumbnailOverlayText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  zikrCardContent: {
    padding: 16,
  },
  zikrCardTitleAr: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: 'Traditional Arabic',
  },
  zikrCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  zikrCardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  zikrCardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  zikrCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zikrCardFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zikrCardFooterRight: {
    flexDirection: 'row',
    gap: 12,
  },
  zikrCardFooterIcon: {
    fontSize: 18,
  },
  zikrCardFooterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  zikrCardFooterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrCardFooterButtonIcon: {
    fontSize: 18,
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
    borderRadius: 9,
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
    borderRadius: 1,
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
    borderRadius: 19,
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
    borderRadius: 5,
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
    borderRadius: 9,
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
  // Styles écran de chargement
  loadingScreen: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingImage: {
    width: 400,
    height: 400,
  },
  loadingLogo: {
    fontSize: 80,
    color: '#C9A24D',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 3,
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingSpinner: {
    marginTop: 20,
  },
  // Styles lecteur vidéo intégré dans LibraryScreen
  libraryVideoPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  libraryVideoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  libraryVideoTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  libraryVideoClose: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryVideoCloseText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  libraryVideoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  libraryVideoView: {
    flex: 1,
    width: '100%',
  },
  // Styles lecteur Zikr selon l'image
  zikrPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    paddingBottom: 20,
  },
  zikrPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  zikrPlayerHeaderIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrPlayerHeaderIconText: {
    fontSize: 22,
    color: '#0F5132',
  },
  zikrPlayerHeaderIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  zikrPlayerCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  zikrPlayerImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  zikrPlayerImageStyle: {
    opacity: 0.9,
  },
  zikrPlayerOverlay: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  zikrPlayerOverlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C9A24D',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 2,
    marginBottom: 4,
  },
  zikrPlayerTealSection: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  zikrPlayerLogos: {
    alignItems: 'center',
  },
  zikrPlayerFaydaLogo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  zikrPlayerFaydaLogoAr: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Traditional Arabic',
  },
  zikrPlayerFaydaLogoText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  zikrPlayerTrackInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  zikrPlayerTrackTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  zikrPlayerOptions: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrPlayerOptionsIcon: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  zikrPlayerProgressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  zikrPlayerSlider: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
  zikrPlayerTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zikrPlayerTimeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  zikrPlayerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  zikrPlayerSquareBtn: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#6B7A8F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  zikrPlayerSquareBtnInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrPlayerSquareIcon: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',
  },
  zikrPlayer30sBtn: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrPlayer30sCircle: {
    width: 60,
    height: 60,
    borderRadius: 1,
    borderWidth: 2,
    borderColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  zikrPlayer30sText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F5132',
  },
  zikrPlayerPlayBtn: {
    width: 80,
    height: 80,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  zikrPlayerPlayBtnGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrPlayerPlayIcon: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  zikrPlayerBottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  zikrPlayerSpeedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zikrPlayerSpeedIcon: {
    fontSize: 18,
    color: '#0F5132',
  },
  zikrPlayerSpeedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  zikrPlayerBottomIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  zikrPlayerBottomIcon: {
    width: 32,
    height: 32,
    borderRadius: 1,
    backgroundColor: '#0F5132',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zikrPlayerBottomIconText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Styles Assistant IA
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 1,
  },
  userMessageBubble: {
    borderTopRightRadius: 2,
  },
  assistantMessageBubble: {
    borderTopLeftRadius: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
  },
  speakButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignSelf: 'flex-start',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  micButtonRecording: {
    backgroundColor: '#ff0000',
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  thinkingText: {
    marginLeft: 8,
    fontSize: 14,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  suggestionsTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionText: {
    fontSize: 13,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Styles banner Essentials Playlist
  essentialsBannerContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 1,
    overflow: 'hidden',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  essentialsBannerBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  essentialsBannerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    backgroundColor: 'transparent',
    // Pattern géométrique simplifié - utiliser des formes répétées
  },
  essentialsBannerContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    position: 'relative',
  },
  essentialsBannerLeft: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  essentialsBannerText1: {
    fontSize: 14,
    fontWeight: '300',
    color: '#F5E6D3',
    letterSpacing: 2,
    marginBottom: 4,
  },
  essentialsBannerText2: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F5E6D3',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  essentialsBannerText3: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#F5E6D3',
    opacity: 0.9,
    marginTop: 10,
  },
  essentialsBannerLogo: {
    marginTop: 'auto',
  },
  essentialsBannerLogoAr: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  essentialsBannerLogoText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 1,
  },
  essentialsBannerRight: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  essentialsCloud1: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 70,
    height: 35,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    opacity: 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  essentialsCloud2: {
    position: 'absolute',
    top: 35,
    left: 5,
    width: 60,
    height: 30,
    backgroundColor: '#ffffff',
    borderRadius: 1,
    opacity: 0.75,
  },
  essentialsMinaret: {
    position: 'absolute',
    left: 25,
    bottom: 35,
    width: 24,
    height: 90,
    backgroundColor: '#D4A574',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#B8956A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  essentialsDome: {
    position: 'absolute',
    right: 35,
    bottom: 25,
    width: 90,
    height: 70,
    backgroundColor: '#0F5132',
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#0B3C5D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  essentialsCalligraphy: {
    position: 'absolute',
    right: 15,
    top: 25,
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ffffff',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Styles cartes PDF pour la page d'accueil
  bookCardHome: {
    width: 140,
    marginRight: 12,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCoverHome: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverEmojiHome: {
    fontSize: 40,
  },
  bookCardContentHome: {
    padding: 12,
  },
  bookTitleHome: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookAuthorHome: {
    fontSize: 12,
  },
  // Styles pour les cartes récentes verticales avec portraits
  recentCardVertical: {
    width: 120,
    marginRight: 12,
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  recentCardImage: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  recentCardImageStyle: {
    borderRadius: 5,
    resizeMode: 'cover',
  },
  recentCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recentCardTextContainer: {
    padding: 8,
    zIndex: 1,
    position: 'relative',
  },
  recentCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 3,
    lineHeight: 16,
  },
  recentCardTitleAr: {
    fontSize: 10,
    color: '#ffffff',
    lineHeight: 14,
    textAlign: 'right',
    opacity: 0.9,
    fontFamily: 'Traditional Arabic',
  },
  // Styles pour les cartes récentes carrées (2/5 largeur)
  recentCardSquare: {
    marginRight: 12,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  recentCardImageSquare: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  recentCardImageStyleSquare: {
    borderRadius: 5,
    resizeMode: 'cover',
  },
  recentCardOverlaySquare: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recentCardTextContainerSquare: {
    padding: 6,
    zIndex: 1,
    position: 'relative',
  },
  recentCardTitleSquare: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
    lineHeight: 12,
  },
  recentCardTitleArSquare: {
    fontSize: 9,
    color: '#ffffff',
    lineHeight: 11,
    textAlign: 'right',
    opacity: 0.9,
    fontFamily: 'Traditional Arabic',
  },
  // Styles pour les cartes Coran avec image
  podcastCardHome: {
    width: 180,
    height: 240,
    marginRight: 12,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  podcastsHorizontalScrollFull: {
    paddingRight: 20,
  },
  podcastCardHomeFull: {
    width: width * 4 / 5,
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
    marginLeft: 10,
  },
  podcastCardHomeFullFirst: {
    marginLeft: 20,
  },
  podcastCardImageHome: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  podcastCardImageStyleHome: {
    borderRadius: 5,
  },
  podcastCardOverlayHome: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'flex-end',
    padding: 12,
    borderRadius: 5,
  },
  podcastCardTitleHome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  podcastCardSubtitleHome: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  coranCardHome: {
    width: 180,
    height: 240,
    marginRight: 12,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  coranCardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  coranCardImageStyle: {
    borderRadius: 5,
    resizeMode: 'cover',
  },
  coranCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  coranCardContent: {
    padding: 16,
    zIndex: 1,
  },
  coranCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  coranCardTitleAr: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: 'Traditional Arabic',
  },
  coranCardReciter: {
    fontSize: 12,
    color: '#F5E6D3',
    opacity: 0.9,
  },
  viewedIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  viewedIconText: {
    fontSize: 14,
  },
  viewedIconImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  viewedIconContainerAudio: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  viewedIconTextAudio: {
    fontSize: 12,
  },
  viewedIconImageAudio: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  viewedIconContainerAudioHome: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  viewedIconContainerRecent: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  customTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'web' ? 8 : 20,
    borderTopWidth: 1,
    ...(Platform.OS === 'web' && {
      height: 60,
    }),
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  customTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  customTabLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});


