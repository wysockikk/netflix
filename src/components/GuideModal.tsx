import React from 'react';
import { X, Film, Sparkles, Languages, Download, CheckCircle2, Tv, MonitorPlay } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              Jak działa CineSub AI?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Zamknij instrukcję"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-white block font-semibold mb-0.5">
                  Wklej link z Rotten Tomatoes lub IMDb
                </strong>
                <p className="text-zinc-400 text-xs">
                  Aplikacja odczyta tytuł, reżysera, rok produkcji i strukturę fabularną filmu. Możesz też wpisać po prostu tytuł (np. &quot;Interstellar&quot;) lub kliknąć film z listy gotowych propozycji.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-white block font-semibold mb-0.5">
                  Wybierz język i format dubbingu / lektora
                </strong>
                <p className="text-zinc-400 text-xs">
                  Wybierz język docelowy (np. Polski, Angielski, Hiszpański) oraz styl: tradycyjne napisy kinowe, Polski Lektor telewizyjny, dubbing z dopasowaniem warg (Lip-Sync) lub napisy SDH dla osób niesłyszących.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-white block font-semibold mb-0.5">
                  Podgląd Live-Time z lektorem AI
                </strong>
                <p className="text-zinc-400 text-xs">
                  Odtwarzaj w czasie rzeczywistym! Lektor AI przeczyta kwestie synchronicznie z filmem, a napisy wyświetlą się dokładnie w wyznaczonym momencie. Możesz też załadować swój lokalny plik .mp4.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <strong className="text-white block font-semibold mb-0.5">
                  Pobierz .SRT i dołącz do filmu
                </strong>
                <p className="text-zinc-400 text-xs">
                  Pobierz uniwersalny plik <span className="font-mono text-zinc-200">.SRT</span> w kodowaniu UTF-8 z polskimi znakami. Przeciągnij go do programu VLC Media Player lub umieść na pendrive z filmem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Rozumiem, zaczynajmy!
          </button>
        </div>
      </div>
    </div>
  );
};
