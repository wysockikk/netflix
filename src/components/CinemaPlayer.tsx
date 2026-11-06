import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Sliders,
  Upload,
  Sparkles,
  Layers,
  Radio,
  Type,
  Maximize2,
  Settings,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { SubtitleCue, MovieMetadata, LanguageOption } from '../types';
import { formatSrtTime } from '../utils/subtitles';

interface CinemaPlayerProps {
  movie: MovieMetadata;
  cues: SubtitleCue[];
  targetLanguage: LanguageOption;
  activeCueIndex: number;
  onTimeUpdate: (time: number) => void;
  onCueChange?: (cueIndex: number) => void;
  onAdjustOffset: (offsetMs: number) => void;
}

export const CinemaPlayer: React.FC<CinemaPlayerProps> = ({
  movie,
  cues,
  targetLanguage,
  activeCueIndex,
  onTimeUpdate,
  onCueChange,
  onAdjustOffset,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isDubbingEnabled, setIsDubbingEnabled] = useState(true);
  const [dubbingVolume, setDubbingVolume] = useState(1);
  const [showOriginalComparison, setShowOriginalComparison] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState({
    color: '#FACC15', // Cinematic Yellow default
    fontSize: 'text-lg sm:text-2xl',
    hasBackground: true,
    showSpeaker: true,
  });

  // Optional custom user video file
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoFileName, setCustomVideoFileName] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastSpokenCueIdRef = useRef<number | null>(null);

  // Maximum duration from cues or 60s
  const maxDuration = Math.max(
    60,
    ...cues.map((c) => c.endSeconds + 2)
  );

  // Current active cue based on currentTime
  const currentCue = cues.find(
    (c) => currentTime >= c.startSeconds && currentTime <= c.endSeconds
  );

  // Play / Pause timer simulation if no video file
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const deltaSec = ((now - lastTimestamp) / 1000) * playbackSpeed;
      lastTimestamp = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= maxDuration) {
          setIsPlaying(false);
          return maxDuration;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, maxDuration]);

  // Sync with onTimeUpdate callback
  useEffect(() => {
    onTimeUpdate(currentTime);
  }, [currentTime, onTimeUpdate]);

  // Real-time AI Dubbing / Voiceover TTS execution
  useEffect(() => {
    if (!isPlaying || !isDubbingEnabled || !currentCue) {
      return;
    }

    if (lastSpokenCueIdRef.current === currentCue.id) {
      return; // Already triggered for this cue instance
    }

    lastSpokenCueIdRef.current = currentCue.id;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop prior sentence

      const utterance = new SpeechSynthesisUtterance(currentCue.translatedText);
      utterance.volume = dubbingVolume;
      utterance.rate = playbackSpeed;

      // Find appropriate voice
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(targetLanguage.code) ||
          v.lang.toLowerCase().includes(targetLanguage.code)
      );

      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [currentCue, isPlaying, isDubbingEnabled, targetLanguage, dubbingVolume, playbackSpeed]);

  const togglePlay = () => {
    if (currentTime >= maxDuration) {
      setCurrentTime(0);
      lastSpokenCueIdRef.current = null;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(newTime, maxDuration));
    setCurrentTime(clamped);
    lastSpokenCueIdRef.current = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoFileName(file.name);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
      {/* Top player bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white tracking-wide">
            Odtwarzacz Podglądu Live-Time
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">
            Język napisów: <strong className="text-rose-400">{targetLanguage.name}</strong>
          </span>
        </div>

        {/* Controls toggles */}
        <div className="flex items-center gap-2">
          {/* Dubbing Voiceover Toggle */}
          <button
            onClick={() => {
              setIsDubbingEnabled(!isDubbingEnabled);
              if (window.speechSynthesis) window.speechSynthesis.cancel();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              isDubbingEnabled
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label="Włącz lub wyłącz lektora AI w czasie rzeczywistym"
          >
            {isDubbingEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Lektor AI: {isDubbingEnabled ? 'WŁĄCZONY' : 'WYŁĄCZONY'}</span>
          </button>

          {/* Compare original button */}
          <button
            onClick={() => setShowOriginalComparison(!showOriginalComparison)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
              showOriginalComparison
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Pokaż oryginalny tekst angielski równolegle z tłumaczeniem"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Porównaj oryginał</span>
          </button>

          {/* Video upload input */}
          <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">
              {customVideoFileName ? 'Zmień wideo' : 'Podepnij własny plik .mp4'}
            </span>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Screen / Cinema Viewport with 16:9 / 2.39:1 letterbox */}
      <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center select-none group">
        {customVideoUrl ? (
          <video
            ref={videoRef}
            src={customVideoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          /* Simulated Cinematic Stage */
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Film backdrop image */}
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className={`w-full h-full object-cover transition-transform duration-700 opacity-60 ${
                isPlaying ? 'scale-105 filter contrast-110' : 'scale-100'
              }`}
            />

            {/* Cinematic grain & vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80 pointer-events-none" />

            {/* Letterbox borders */}
            <div className="absolute top-0 left-0 right-0 h-6 sm:h-10 bg-black/90 border-b border-zinc-900 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-10 bg-black/90 border-t border-zinc-900 pointer-events-none" />

            {/* Watermark / scene indicator */}
            <div className="absolute top-8 sm:top-12 left-5 z-20 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-zinc-800">
                {movie.title} • {movie.year}
              </span>
              {currentCue?.speaker && (
                <span className="px-2 py-0.5 rounded bg-rose-500/30 backdrop-blur-md text-[11px] font-semibold text-rose-300 border border-rose-500/40">
                  Postać: {currentCue.speaker}
                </span>
              )}
            </div>

            {/* Audio wave animation when Dubbing Voice is speaking */}
            {isPlaying && isDubbingEnabled && currentCue && (
              <div className="absolute top-8 sm:top-12 right-5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 backdrop-blur-md">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] text-amber-300 font-medium">Lektor czyta na żywo</span>
                <div className="flex items-end gap-0.5 h-3 ml-1">
                  <div className="w-1 bg-amber-400 rounded animate-bounce [animation-delay:-0.3s] h-3" />
                  <div className="w-1 bg-amber-400 rounded animate-bounce [animation-delay:-0.15s] h-2" />
                  <div className="w-1 bg-amber-400 rounded animate-bounce h-3" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIVE SUBTITLE OVERLAY */}
        <div className="absolute bottom-12 sm:bottom-16 left-4 right-4 z-30 flex flex-col items-center justify-end pointer-events-none">
          {currentCue ? (
            <div className="max-w-3xl text-center transition-all animate-fadeIn">
              {showOriginalComparison && (
                <div className="mb-2 inline-block px-3 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-zinc-700 text-xs sm:text-sm text-zinc-300 italic font-serif">
                  <span className="text-zinc-500 font-sans not-italic mr-1.5 text-[10px] uppercase font-bold">
                    Oryginał:
                  </span>
                  &ldquo;{currentCue.originalText}&rdquo;
                </div>
              )}

              <div
                className={`inline-block px-4 py-1.5 rounded-lg transition-all ${
                  subtitleStyle.hasBackground ? 'bg-black/80 backdrop-blur-sm' : ''
                }`}
                style={{
                  color: subtitleStyle.color,
                  textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
                }}
              >
                {subtitleStyle.showSpeaker && currentCue.speaker && (
                  <span className="text-zinc-400 font-normal mr-2 text-sm sm:text-lg">
                    [{currentCue.speaker}]:
                  </span>
                )}
                <span className={`font-semibold tracking-wide ${subtitleStyle.fontSize}`}>
                  {currentCue.translatedText}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 text-xs sm:text-sm font-mono italic">
              [Brak kwestii dialogowej w tym momencie - tło filmu]
            </div>
          )}
        </div>
      </div>

      {/* SCRUBBER TIMELINE & CUE MARKERS */}
      <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800">
        {/* Progress Bar with Cue Markers */}
        <div className="relative mb-2">
          {/* Cue block markers on the timeline */}
          <div className="absolute inset-x-0 h-2 -top-1 pointer-events-none">
            {cues.map((cue) => {
              const leftPercent = (cue.startSeconds / maxDuration) * 100;
              const widthPercent = Math.max(1, ((cue.endSeconds - cue.startSeconds) / maxDuration) * 100);
              const isActive = currentTime >= cue.startSeconds && currentTime <= cue.endSeconds;
              return (
                <div
                  key={cue.id}
                  className={`absolute h-2.5 rounded-sm transition-colors ${
                    isActive ? 'bg-rose-500 ring-2 ring-rose-300 shadow-md' : 'bg-amber-400/60 hover:bg-amber-400'
                  }`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                  title={`${cue.speaker}: ${cue.translatedText}`}
                />
              );
            })}
          </div>

          {/* Slider input */}
          <input
            type="range"
            min={0}
            max={maxDuration}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            aria-label="Oś czasu filmu"
          />
        </div>

        {/* Transport controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Left: Play/Pause, Skips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSeek(currentTime - 5)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Cofnij 5 sekund"
              aria-label="Cofnij 5 sekund"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40 transition-transform active:scale-95 cursor-pointer"
              aria-label={isPlaying ? 'Wstrzymaj odtwarzanie' : 'Rozpocznij odtwarzanie'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => handleSeek(currentTime + 5)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Do przodu 5 sekund"
              aria-label="Przewiń 5 sekund w przód"
            >
              <FastForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSeek(0)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Zacznij od początku"
              aria-label="Restartuj do początku"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Timecode */}
            <div className="ml-2 font-mono text-xs text-zinc-300">
              <span className="text-white font-bold">{formatSrtTime(currentTime).slice(3)}</span>
              <span className="text-zinc-600 mx-1">/</span>
              <span className="text-zinc-400">{formatSrtTime(maxDuration).slice(3)}</span>
            </div>
          </div>

          {/* Center: Quick Subtitle Sync Calibration Offset (+/- 250ms, +/- 1s) */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 mr-1">Kalibracja synchronizacji:</span>
            <button
              onClick={() => onAdjustOffset(-250)}
              className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono cursor-pointer"
              title="Przyspiesz napisy o 0.25 sekundy"
            >
              -250ms
            </button>
            <button
              onClick={() => onAdjustOffset(250)}
              className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono cursor-pointer"
              title="Opóźnij napisy o 0.25 sekundy"
            >
              +250ms
            </button>
          </div>

          {/* Right: Speed & Subtitle style presets */}
          <div className="flex items-center gap-2">
            {/* Speed select */}
            <div className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700 text-xs">
              <span className="text-zinc-400 text-[10px]">Prędkość:</span>
              {[0.75, 1, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-rose-600 text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Subtitle color toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setSubtitleStyle((prev) => ({
                    ...prev,
                    color: prev.color === '#FACC15' ? '#FFFFFF' : '#FACC15',
                  }))
                }
                className="w-5 h-5 rounded-full border border-zinc-700 cursor-pointer shadow"
                style={{ backgroundColor: subtitleStyle.color }}
                title="Przełącz kolor napisów (żółty kinowy / biały)"
                aria-label="Zmień kolor napisów"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
