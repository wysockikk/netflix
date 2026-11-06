import React, { useState } from 'react';
import { Search, Link as LinkIcon, Film, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { PRESET_MOVIES, parseMovieInput } from '../utils/urlParser';

interface MovieInputSectionProps {
  onSearch: (urlOrTitle: string) => void;
  isLoading: boolean;
  currentInput: string;
}

export const MovieInputSection: React.FC<MovieInputSectionProps> = ({
  onSearch,
  isLoading,
  currentInput,
}) => {
  const [inputValue, setInputValue] = useState(currentInput || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parsed = parseMovieInput(inputValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMsg('Wklej link do Rotten Tomatoes, IMDb lub wpisz tytuł filmu.');
      return;
    }

    const check = parseMovieInput(trimmed);
    if (!check.isValid) {
      setErrorMsg('Nieobsługiwany format. Wklej poprawny adres IMDb (np. imdb.com/title/tt0816692/) lub Rotten Tomatoes (np. rottentomatoes.com/m/interstellar) albo wpisz tytuł.');
      return;
    }

    onSearch(trimmed);
  };

  const handleSelectPreset = (url: string) => {
    setInputValue(url);
    setErrorMsg(null);
    onSearch(url);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950/80 p-5 sm:p-8 shadow-2xl">
      {/* Decorative ambient background */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300 mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Generowanie napisów & tłumaczeń dubbingu w czasie rzeczywistym</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Napisy i Dubbing Live-Time do Twojego Filmu
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Wklej link do filmu z <strong className="text-rose-400 font-semibold">Rotten Tomatoes</strong> lub{' '}
          <strong className="text-amber-400 font-semibold">IMDb</strong>, wybierz język oraz styl, a model AI wygeneruje dopasowane czasowo kwestie i plik <span className="font-mono text-zinc-200">.SRT</span>.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative z-10 max-w-3xl mx-auto">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-xl bg-zinc-900/90 border border-zinc-700/80 focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 shadow-xl transition-all">
          <div className="flex items-center flex-1 px-3 gap-3">
            <LinkIcon className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Wklej link: https://www.rottentomatoes.com/m/... lub imdb.com/title/tt..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none py-1.5"
              aria-label="Link do filmu na IMDb lub Rotten Tomatoes"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-950/40 transition-all shrink-0 cursor-pointer"
            aria-label="Wczytaj film i przejdź do wyboru języka"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analizowanie...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Załaduj film</span>
              </>
            )}
          </button>
        </div>

        {/* Source badge / indicator */}
        {inputValue && (
          <div className="flex items-center justify-between text-xs px-2 pt-2">
            <div className="flex items-center gap-2 text-zinc-400">
              {parsed.source === 'imdb' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  IMDb Link ({parsed.idOrSlug})
                </span>
              )}
              {parsed.source === 'rottentomatoes' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30">
                  🍅 Rotten Tomatoes ({parsed.cleanedTitle})
                </span>
              )}
              {parsed.source === 'title' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                  Tytuł filmu ({parsed.cleanedTitle})
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Wyczyść
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 text-rose-400 text-xs sm:text-sm bg-rose-950/40 border border-rose-800/60 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Preset 1-Click Films */}
      <div className="relative z-10 max-w-3xl mx-auto mt-6 pt-5 border-t border-zinc-800/80">
        <div className="flex items-center justify-between mb-3 text-xs text-zinc-400">
          <span className="font-medium flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-zinc-500" />
            Szybki test z popularnymi filmami:
          </span>
          <span className="text-[11px] text-zinc-500">Kliknij aby wypróbować natychmiast</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_MOVIES.map((movie) => (
            <button
              key={movie.title}
              onClick={() => handleSelectPreset(movie.imdbUrl)}
              disabled={isLoading}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title={`${movie.title} (${movie.year}) - reż. ${movie.director}`}
            >
              <span>{movie.title}</span>
              <span className="text-[10px] text-amber-400/90 font-mono bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
                {movie.year}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
