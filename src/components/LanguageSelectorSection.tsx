import React, { useState } from 'react';
import { Languages, Mic, Sparkles, Sliders, Check, Clock, Star, Film, Radio, Subtitles, Volume2 } from 'lucide-react';
import { MovieMetadata, LanguageOption, DubbingStyle } from '../types';
import { SUPPORTED_LANGUAGES, DUBBING_STYLES } from '../utils/constants';

interface LanguageSelectorSectionProps {
  movie: MovieMetadata;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
  selectedStyle: DubbingStyle;
  onSelectStyle: (style: DubbingStyle) => void;
  selectedScene: string;
  onSelectScene: (sceneId: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const LanguageSelectorSection: React.FC<LanguageSelectorSectionProps> = ({
  movie,
  selectedLanguage,
  onSelectLanguage,
  selectedStyle,
  onSelectStyle,
  selectedScene,
  onSelectScene,
  onGenerate,
  isGenerating,
}) => {
  const [customLanguage, setCustomLanguage] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLanguage.trim()) {
      onSelectLanguage({
        code: 'custom',
        name: customLanguage.trim(),
        nativeName: customLanguage.trim(),
        flag: '🌐',
        voiceLangCode: 'en-US',
      });
      setIsCustomMode(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-7 shadow-xl">
      {/* Movie brief card */}
      <div className="flex flex-col md:flex-row items-start gap-5 pb-6 border-b border-zinc-800">
        <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl overflow-hidden shadow-md shrink-0 border border-zinc-700/80 bg-zinc-950">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {movie.rating}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {movie.year}
            </span>
            <span className="text-xs text-zinc-400">
              • reż. <strong className="text-zinc-200">{movie.director}</strong>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
            {movie.title}
          </h2>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>
      </div>

      {/* Question 1: Language selection */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              1. W jakim języku chcesz wygenerować napisy i dubbing?
            </h3>
          </div>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Wybrano: <strong className="text-rose-400">{selectedLanguage.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 text-white ring-1 ring-rose-500 shadow-md shadow-rose-950/30'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40'
                }`}
                aria-label={`Wybierz język ${lang.name}`}
              >
                <span className="text-xl shrink-0">{lang.flag}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-xs sm:text-sm truncate">
                    {lang.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {lang.nativeName}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-rose-400 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom language option toggle */}
        <div className="mt-2.5 flex items-center justify-end">
          {!isCustomMode ? (
            <button
              onClick={() => setIsCustomMode(true)}
              className="text-xs text-zinc-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Inny język? Wpisz ręcznie
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                placeholder="Wpisz język (np. Norweski, Chiński...)"
                className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-medium cursor-pointer"
              >
                Ustaw
              </button>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                Anuluj
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Question 2: Translation & Dubbing style */}
      <div className="mt-6 pt-5 border-t border-zinc-800/80">
        <div className="flex items-center gap-2 mb-3">
          <Mic className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-white text-base sm:text-lg">
            2. Wybierz format tłumaczenia i styl lektorski / dubbingu:
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DUBBING_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onSelectStyle(style.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/80 text-white ring-1 ring-amber-500/80 shadow-md shadow-amber-950/30'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40'
                }`}
                aria-label={`Wybierz styl ${style.name}`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {style.id === 'subtitles_literal' && <Subtitles className="w-5 h-5" />}
                  {style.id === 'polish_lektor' && <Mic className="w-5 h-5" />}
                  {style.id === 'dubbing_lip_sync' && <Radio className="w-5 h-5" />}
                  {style.id === 'sdh' && <Volume2 className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-white">
                      {style.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {style.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 3: Scene selection */}
      {movie.scenes && movie.scenes.length > 0 && (
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              3. Wybierz sekwencję filmu do zsynchronizowania:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {movie.scenes.map((scene) => {
              const isSelected = selectedScene === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(scene.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/15 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{scene.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    Start: {scene.start} (~{scene.duration}s)
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action CTA Button */}
      <div className="mt-8 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-400">
          <span>Wybrane parametry: </span>
          <strong className="text-white">{selectedLanguage.name}</strong> •{' '}
          <span className="text-amber-400">
            {DUBBING_STYLES.find((s) => s.id === selectedStyle)?.name}
          </span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-rose-950/50 transition-all cursor-pointer"
          aria-label="Generuj zsynchronizowane napisy i dubbing AI"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generowanie napisów z Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Generuj Napisy i Dubbing Live-Time</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
