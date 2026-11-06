import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Tv,
  MonitorPlay,
  HardDrive,
  Code,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SubtitleCue, MovieMetadata, LanguageOption } from '../types';
import { generateSrtContent, generateVttContent } from '../utils/subtitles';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieMetadata;
  cues: SubtitleCue[];
  targetLanguage: LanguageOption;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  movie,
  cues,
  targetLanguage,
}) => {
  const [includeSpeaker, setIncludeSpeaker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRawPreview, setShowRawPreview] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'vlc' | 'tv' | 'web'>('vlc');

  if (!isOpen) return null;

  const srtContent = generateSrtContent(cues, { includeSpeaker });
  const vttContent = generateVttContent(cues, { includeSpeaker });

  // Safe filename
  const cleanTitle = movie.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const srtFilename = `${cleanTitle}.${targetLanguage.code}.srt`;
  const vttFilename = `${cleanTitle}.${targetLanguage.code}.vtt`;
  const jsonFilename = `${cleanTitle}.${targetLanguage.code}.json`;

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    // Add UTF-8 BOM so Polish characters (ą, ę, ś, ć, ż, ź, ł, ó, ń) display properly in Windows / VLC
    const blob = new Blob(['\uFEFF' + content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(srtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center shadow-md">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Pobierz Napisy do Filmu
              </h3>
              <p className="text-xs text-zinc-400">
                {movie.title} • Język: <strong className="text-rose-400">{targetLanguage.name}</strong> ({cues.length} kwestii)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Zamknij okno pobierania"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Options */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSpeaker}
                onChange={(e) => setIncludeSpeaker(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-zinc-300 font-medium">
                Dołącz imię postaci w napisach (np. [Cooper]: ...)
              </span>
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">Format kodowania: UTF-8 + BOM</span>
          </div>

          {/* Download Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download SRT */}
            <button
              onClick={() => downloadFile(srtContent, srtFilename, 'text/plain')}
              className="flex items-center gap-3.5 p-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition-all cursor-pointer group text-left"
              aria-label="Pobierz plik napisów SRT"
            >
              <div className="p-2.5 rounded-lg bg-black/20 shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">Pobierz .SRT</span>
                  <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
                    Rekomendowany
                  </span>
                </div>
                <div className="text-xs text-rose-100/80 font-mono truncate mt-0.5">
                  {srtFilename}
                </div>
                <div className="text-[11px] text-rose-200/90 mt-1">
                  Do VLC, TV, MPC-HC, Netflix, AllPlayer
                </div>
              </div>
            </button>

            {/* Download VTT */}
            <button
              onClick={() => downloadFile(vttContent, vttFilename, 'text/vtt')}
              className="flex items-center gap-3.5 p-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-white font-semibold text-sm transition-all cursor-pointer text-left"
              aria-label="Pobierz plik WebVTT"
            >
              <div className="p-2.5 rounded-lg bg-zinc-900 shrink-0">
                <MonitorPlay className="w-6 h-6 text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base">Pobierz .VTT</div>
                <div className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                  {vttFilename}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Format WebVTT do odtwarzaczy HTML5 i przeglądarek
                </div>
              </div>
            </button>
          </div>

          {/* Secondary Actions: Copy & JSON */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Skopiowano SRT do schowka!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopiuj zawartość SRT</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                downloadFile(
                  JSON.stringify(
                    {
                      movie: movie.title,
                      year: movie.year,
                      language: targetLanguage.name,
                      cues,
                    },
                    null,
                    2
                  ),
                  jsonFilename,
                  'application/json'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Eksportuj manifest JSON</span>
            </button>

            <button
              onClick={() => setShowRawPreview(!showRawPreview)}
              className="ml-auto flex items-center gap-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              <span>{showRawPreview ? 'Ukryj podgląd tekstu' : 'Pokaż surowy plik SRT'}</span>
              {showRawPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Raw SRT Preview */}
          {showRawPreview && (
            <div className="rounded-xl bg-black border border-zinc-800 p-3 max-h-48 overflow-y-auto">
              <pre className="text-[11px] font-mono text-zinc-300 whitespace-pre-wrap">
                {srtContent}
              </pre>
            </div>
          )}

          {/* GUIDE: How to attach subtitles to your movie */}
          <div className="pt-4 border-t border-zinc-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Jak dołączyć pobrane napisy do filmu?
            </h4>

            {/* Guide Tabs */}
            <div className="flex gap-2 mb-3 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveGuideTab('vlc')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  activeGuideTab === 'vlc'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>1. VLC Player (Komputer)</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('tv')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  activeGuideTab === 'tv'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>2. Telewizor / Pendrive USB</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('web')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  activeGuideTab === 'web'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>3. Plex / Stremio / TV Box</span>
              </button>
            </div>

            {/* Tab contents */}
            {activeGuideTab === 'vlc' && (
              <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 leading-relaxed">
                <li>Otwórz swój plik z filmem w darmowym programie <strong>VLC Media Player</strong>.</li>
                <li>Pobierz powyższy plik <strong className="text-rose-400">.SRT</strong> i po prostu <strong>przeciągnij go i upuść</strong> bezpośrednio na odtwarzające się wideo.</li>
                <li>Alternatywnie: w górnym menu VLC wybierz <em>Napisy &gt; Dodaj plik z napisami...</em> i wskaż pobrany plik.</li>
                <li>Jeśli napisy spieszą się lub spóźniają w stosunku do wideo, wciskaj klawisze <kbd className="bg-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">G</kbd> lub <kbd className="bg-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">H</kbd> na klawiaturze, by je dopasować co 50ms!</li>
              </ol>
            )}

            {activeGuideTab === 'tv' && (
              <div className="text-xs text-zinc-300 space-y-2 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 leading-relaxed">
                <p>
                  Telewizory Smart TV (Samsung, LG, Sony, Philips) automatycznie wczytują napisy, pod warunkiem że:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>Plik z filmem i plik z napisami znajdują się w <strong>tym samym folderze</strong> na pendrive.</li>
                  <li>Mają <strong>dokładnie tę samą nazwę</strong>, np.:</li>
                </ul>
                <div className="p-2 rounded bg-zinc-900 font-mono text-[11px] text-amber-300">
                  📁 Filmy/<br />
                  &nbsp;&nbsp;🎞️ {cleanTitle}.mp4<br />
                  &nbsp;&nbsp;📄 {cleanTitle}.srt
                </div>
                <p className="text-[11px] text-zinc-500">
                  Telewizor wykryje je automatycznie po naciśnięciu przycisku [SUB] lub w menu Opcje napisów na pilocie.
                </p>
              </div>
            )}

            {activeGuideTab === 'web' && (
              <div className="text-xs text-zinc-300 space-y-2 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 leading-relaxed">
                <p>
                  W programach typu <strong>Plex Media Server</strong> lub <strong>Stremio</strong>:
                </p>
                <p className="text-zinc-400">
                  Zapisz plik jako <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300">{cleanTitle}.pl.srt</code> w katalogu z filmem. Plex automatycznie rozpozna go jako polską ścieżkę dialogową.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
