import { LanguageOption, StyleOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pl', name: 'Polski', nativeName: 'Polski', flag: '🇵🇱', voiceLangCode: 'pl-PL' },
  { code: 'en', name: 'Angielski', nativeName: 'English', flag: '🇬🇧', voiceLangCode: 'en-US' },
  { code: 'de', name: 'Niemiecki', nativeName: 'Deutsch', flag: '🇩🇪', voiceLangCode: 'de-DE' },
  { code: 'es', name: 'Hiszpański', nativeName: 'Español', flag: '🇪🇸', voiceLangCode: 'es-ES' },
  { code: 'fr', name: 'Francuski', nativeName: 'Français', flag: '🇫🇷', voiceLangCode: 'fr-FR' },
  { code: 'it', name: 'Włoski', nativeName: 'Italiano', flag: '🇮🇹', voiceLangCode: 'it-IT' },
  { code: 'uk', name: 'Ukraiński', nativeName: 'Українська', flag: '🇺🇦', voiceLangCode: 'uk-UA' },
  { code: 'ja', name: 'Japoński', nativeName: '日本語', flag: '🇯🇵', voiceLangCode: 'ja-JP' },
  { code: 'pt', name: 'Portugalski', nativeName: 'Português', flag: '🇵🇹', voiceLangCode: 'pt-PT' },
  { code: 'cs', name: 'Czeski', nativeName: 'Čeština', flag: '🇨🇿', voiceLangCode: 'cs-CZ' },
];

export const DUBBING_STYLES: StyleOption[] = [
  {
    id: 'subtitles_literal',
    name: 'Napisy filmowe (Klasyczne)',
    description: 'Optymalne tempo czytania (14-17 znaków/sek.), podział na dwuwiersze, wierność dialogom.',
    icon: 'Subtitles',
    badge: 'Popularne do filmów',
  },
  {
    id: 'polish_lektor',
    name: 'Polski Lektor TV (Voiceover)',
    description: 'Klasyczny styl polskiej telewizji: zwięzłość, bez zbędnych wypełniaczy, idealny do czytania na głos.',
    icon: 'Mic',
    badge: 'Tradycja PL',
  },
  {
    id: 'dubbing_lip_sync',
    name: 'Dubbing aktorski (Lip-Sync)',
    description: 'Dopasowanie fonetyczne do ruchów warg, żywa ekspresja aktorska i emocjonalna dynamika.',
    icon: 'Radio',
    badge: 'Kino & Animacja',
  },
  {
    id: 'sdh',
    name: 'Napisy SDH (Dla niesłyszących)',
    description: 'Zawiera opisy dźwięków, tła muzycznego, odgłosów i intonacji postaci w nawiasach [ ].',
    icon: 'Ear',
    badge: 'Dostępność',
  },
];
