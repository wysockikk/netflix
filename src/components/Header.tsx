import React from 'react';
import { Film, Sparkles, HelpCircle, Download, Languages } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  hasCues: boolean;
  onOpenExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, hasCues, onOpenExport }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-600 to-red-600 flex items-center justify-center shadow-lg shadow-rose-950/40 border border-amber-400/30">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                CineSub AI
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Live Time Dubbing
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Generator zsynchronizowanych napisów i dubbingu z IMDb & Rotten Tomatoes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/80 transition-all cursor-pointer"
            aria-label="Instrukcja jak dołączyć napisy do filmu"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Jak dodać napisy do filmu?</span>
            <span className="sm:hidden">Poradnik</span>
          </button>

          {hasCues && onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-md shadow-rose-950/30 transition-all cursor-pointer"
              aria-label="Pobierz plik z napisami SRT lub VTT"
            >
              <Download className="w-4 h-4" />
              <span>Pobierz .SRT / .VTT</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
