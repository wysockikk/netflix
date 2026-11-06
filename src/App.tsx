import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MovieInputSection } from './components/MovieInputSection';
import { LanguageSelectorSection } from './components/LanguageSelectorSection';
import { CinemaPlayer } from './components/CinemaPlayer';
import { SubtitleTimelineEditor } from './components/SubtitleTimelineEditor';
import { ExportModal } from './components/ExportModal';
import { GuideModal } from './components/GuideModal';
import { MovieMetadata, SubtitleCue, LanguageOption, DubbingStyle } from './types';
import { SUPPORTED_LANGUAGES } from './utils/constants';
import { adjustCueTimestamps } from './utils/subtitles';
import { Sparkles, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [movie, setMovie] = useState<MovieMetadata | null>(null);

  // Configuration options
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
    SUPPORTED_LANGUAGES[0] // Default Polski
  );
  const [selectedStyle, setSelectedStyle] = useState<DubbingStyle>('subtitles_literal');
  const [selectedScene, setSelectedScene] = useState<string>('opening');

  // Generated subtitles & live playback
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeCueIndex, setActiveCueIndex] = useState<number>(-1);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Auto-start or test preset if query param present or on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart');
    const movieParam = params.get('movie');

    if (autostart === '1' || movieParam) {
      handleSearchMovie(movieParam || 'https://www.imdb.com/title/tt0816692/');
    }
  }, []);

  // Fetch movie metadata from backend
  const handleSearchMovie = async (input: string) => {
    setIsLoadingMovie(true);
    setCurrentInput(input);
    try {
      const res = await fetch('/api/movie/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (data.success && data.movie) {
        setMovie(data.movie);
        if (data.movie.scenes && data.movie.scenes.length > 0) {
          setSelectedScene(data.movie.scenes[0].id);
        }
      } else {
        alert(data.error || 'Nie znaleziono filmu dla podanego adresu.');
      }
    } catch (err) {
      console.error('Error fetching movie:', err);
      alert('Wystąpił błąd podczas pobierania danych o filmie. Sprawdź połączenie.');
    } finally {
      setIsLoadingMovie(false);
    }
  };

  // Generate time-aligned subtitles and dubbing lines
  const handleGenerateSubtitles = async () => {
    if (!movie) return;
    setIsGeneratingSubtitles(true);
    try {
      const res = await fetch('/api/movie/generate-subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: movie.title,
          year: movie.year,
          director: movie.director,
          targetLanguage: selectedLanguage.code,
          targetLanguageName: selectedLanguage.name,
          style: selectedStyle,
          sceneName:
            movie.scenes?.find((s) => s.id === selectedScene)?.name ||
            'Główna sekwencja filmu',
          startSecondsOffset: 0,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.cues)) {
        setCues(data.cues);
        setCurrentTime(0);
        // Smooth scroll to the player
        setTimeout(() => {
          document.getElementById('player-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        alert(data.error || 'Błąd podczas generowania napisów.');
      }
    } catch (err) {
      console.error('Error generating subtitles:', err);
      alert('Nie udało się wygenerować napisów. Spróbuj ponownie.');
    } finally {
      setIsGeneratingSubtitles(false);
    }
  };

  // Adjust synchronization offset across all cues (+/- ms)
  const handleAdjustOffset = (offsetMs: number) => {
    setCues((prev) => adjustCueTimestamps(prev, offsetMs));
  };

  // Cue editing
  const handleUpdateCue = (updatedCue: SubtitleCue) => {
    setCues((prev) => prev.map((c) => (c.id === updatedCue.id ? updatedCue : c)));
  };

  const handleDeleteCue = (id: number) => {
    setCues((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCue = () => {
    const lastCue = cues[cues.length - 1];
    const newStart = lastCue ? +(lastCue.endSeconds + 1.0).toFixed(2) : +(currentTime + 0.5).toFixed(2);
    const newEnd = +(newStart + 3.0).toFixed(2);
    const newCue: SubtitleCue = {
      id: Date.now(),
      startSeconds: newStart,
      endSeconds: newEnd,
      speaker: 'Narrator',
      originalText: 'Nowa kwestia dialogowa...',
      translatedText: 'Przetłumaczony tekst nowej kwestii...',
    };
    setCues((prev) => [...prev, newCue]);
  };

  const handleJumpToTime = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top App Header */}
      <Header
        onOpenGuide={() => setIsGuideModalOpen(true)}
        hasCues={cues.length > 0}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Step 1: Movie Link Input Section */}
        <MovieInputSection
          onSearch={handleSearchMovie}
          isLoading={isLoadingMovie}
          currentInput={currentInput}
        />

        {/* Step 2: Language & Dubbing Questionnaire (shown once movie is loaded) */}
        {movie && (
          <section id="config-section" className="scroll-mt-20 animate-fadeIn">
            <LanguageSelectorSection
              movie={movie}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
              selectedScene={selectedScene}
              onSelectScene={setSelectedScene}
              onGenerate={handleGenerateSubtitles}
              isGenerating={isGeneratingSubtitles}
            />
          </section>
        )}

        {/* Step 3: Cinema Player & Live Time Dubbing */}
        {cues.length > 0 && movie && (
          <section id="player-section" className="space-y-8 scroll-mt-20 animate-fadeIn">
            {/* Quick success notice */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-800/50 gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">
                    Wygenerowano {cues.length} zsynchronizowanych kwestii dialogowych w języku {selectedLanguage.name}!
                  </div>
                  <div className="text-xs text-zinc-400">
                    Napisy i lektor AI są dopasowane do każdego momentu na osi czasu. Sprawdź podgląd poniżej.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Pobierz plik .SRT / .VTT</span>
              </button>
            </div>

            {/* Cinema Player Viewport */}
            <CinemaPlayer
              movie={movie}
              cues={cues}
              targetLanguage={selectedLanguage}
              activeCueIndex={activeCueIndex}
              onTimeUpdate={setCurrentTime}
              onAdjustOffset={handleAdjustOffset}
            />

            {/* Subtitle Cue List & Timeline Editor */}
            <SubtitleTimelineEditor
              cues={cues}
              currentTime={currentTime}
              targetLanguage={selectedLanguage}
              onUpdateCue={handleUpdateCue}
              onDeleteCue={handleDeleteCue}
              onAddCue={handleAddCue}
              onJumpToTime={handleJumpToTime}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CineSub AI © {new Date().getFullYear()} • Inteligentna synchronizacja napisów i dubbingu live-time.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Instrukcja obsługi
            </button>
            <span>•</span>
            <span className="text-zinc-600">Obsługuje pliki .SRT, .VTT, .JSON</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {movie && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          movie={movie}
          cues={cues}
          targetLanguage={selectedLanguage}
        />
      )}

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
