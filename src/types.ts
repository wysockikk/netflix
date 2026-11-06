export interface SubtitleCue {
  id: number;
  startSeconds: number;
  endSeconds: number;
  speaker: string;
  originalText: string;
  translatedText: string;
  notes?: string;
  emotion?: string;
}

export interface MovieMetadata {
  title: string;
  originalTitle?: string;
  year: number | string;
  director: string;
  genres: string[];
  rating: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  sourceUrl?: string;
  characters?: string[];
  scenes?: {
    id: string;
    name: string;
    start: string;
    duration: number;
  }[];
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  voiceLangCode: string;
}

export type DubbingStyle = 'subtitles_literal' | 'dubbing_lip_sync' | 'polish_lektor' | 'sdh';

export interface StyleOption {
  id: DubbingStyle;
  name: string;
  description: string;
  icon: string;
  badge: string;
}
