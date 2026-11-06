import React, { useState } from 'react';
import {
  ListPlus,
  Trash2,
  Play,
  Volume2,
  Clock,
  Sparkles,
  Edit2,
  Check,
  Plus,
  AlertTriangle,
  MoveRight,
  Filter,
} from 'lucide-react';
import { SubtitleCue, LanguageOption } from '../types';
import { formatSrtTime, calculateCPS } from '../utils/subtitles';

interface SubtitleTimelineEditorProps {
  cues: SubtitleCue[];
  currentTime: number;
  targetLanguage: LanguageOption;
  onUpdateCue: (updatedCue: SubtitleCue) => void;
  onDeleteCue: (id: number) => void;
  onAddCue: () => void;
  onJumpToTime: (seconds: number) => void;
}

export const SubtitleTimelineEditor: React.FC<SubtitleTimelineEditorProps> = ({
  cues,
  currentTime,
  targetLanguage,
  onUpdateCue,
  onDeleteCue,
  onAddCue,
  onJumpToTime,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<SubtitleCue | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const handleStartEdit = (cue: SubtitleCue) => {
    setEditingId(cue.id);
    setEditForm({ ...cue });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdateCue(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSpeakLine = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(targetLanguage.code) ||
          v.lang.toLowerCase().includes(targetLanguage.code)
      );
      if (targetVoice) utterance.voice = targetVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredCues = cues.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.speaker.toLowerCase().includes(q) ||
      c.translatedText.toLowerCase().includes(q) ||
      c.originalText.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              Edytor i Lista Kwestii Dialogowych ({cues.length})
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Kliknij na dowolną kwestię, by skoczyć do jej momentu w filmie lub edytuj jej treść i synchronizację.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Szukaj kwestii lub postaci..."
            className="bg-zinc-950 border border-zinc-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
          />

          <button
            onClick={onAddCue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
            aria-label="Dodaj nową kwestię dialogową"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Dodaj kwestię</span>
          </button>
        </div>
      </div>

      {/* Cues List */}
      <div className="mt-4 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredCues.map((cue, index) => {
          const isActive =
            currentTime >= cue.startSeconds && currentTime <= cue.endSeconds;
          const duration = +(cue.endSeconds - cue.startSeconds).toFixed(2);
          const cps = calculateCPS(cue.translatedText, duration);
          const isTooFast = cps > 22;
          const isEditing = editingId === cue.id;

          return (
            <div
              key={cue.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-rose-500/10 border-rose-500 ring-1 ring-rose-500/40 shadow-lg'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              {isEditing && editForm ? (
                /* Editing Mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Postać / Aktor
                      </label>
                      <input
                        type="text"
                        value={editForm.speaker}
                        onChange={(e) =>
                          setEditForm({ ...editForm, speaker: e.target.value })
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Początek (sekundy)
                      </label>
                      <input
                        type="number"
                        step={0.1}
                        value={editForm.startSeconds}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            startSeconds: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Koniec (sekundy)
                      </label>
                      <input
                        type="number"
                        step={0.1}
                        value={editForm.endSeconds}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            endSeconds: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                      Tłumaczenie ({targetLanguage.name})
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.translatedText}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          translatedText: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Zapisz zmiany</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Timing & Speaker Bar */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-rose-400">
                        #{index + 1}
                      </span>

                      <button
                        onClick={() => onJumpToTime(cue.startSeconds)}
                        className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                        title="Kliknij, aby odtworzyć od tego momentu"
                      >
                        <Play className="w-2.5 h-2.5 fill-zinc-300" />
                        <span>{formatSrtTime(cue.startSeconds).slice(3, -1)}</span>
                        <MoveRight className="w-3 h-3 text-zinc-600" />
                        <span>{formatSrtTime(cue.endSeconds).slice(3, -1)}</span>
                      </button>

                      <span className="text-[10px] text-zinc-400 font-mono">
                        ({duration}s)
                      </span>

                      {cue.speaker && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                          {cue.speaker}
                        </span>
                      )}

                      {cue.emotion && (
                        <span className="text-[10px] italic text-zinc-400">
                          {cue.emotion}
                        </span>
                      )}

                      {/* Reading speed warning if too fast for subtitles */}
                      {isTooFast && (
                        <span
                          className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30"
                          title="Tempo czytania powyżej 22 znaków/sek. Może być za szybkie dla widza!"
                        >
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>{cps} zn/s (szybkie)</span>
                        </span>
                      )}
                    </div>

                    {/* Translated Text (Main Subtitle) */}
                    <p className="text-sm font-semibold text-white tracking-wide leading-relaxed">
                      {cue.translatedText}
                    </p>

                    {/* Original Source Text */}
                    {cue.originalText && (
                      <p className="text-xs text-zinc-400 mt-1 italic font-serif">
                        &ldquo;{cue.originalText}&rdquo;
                      </p>
                    )}

                    {cue.notes && (
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        💡 {cue.notes}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleSpeakLine(cue.translatedText)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800 transition-colors cursor-pointer"
                      title="Odsłuchaj kwestię przez lektora"
                      aria-label="Odsłuchaj kwestię lektorem"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleStartEdit(cue)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                      title="Edytuj kwestię"
                      aria-label="Edytuj kwestię"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteCue(cue.id)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/60 text-zinc-500 hover:text-rose-400 border border-zinc-800 transition-colors cursor-pointer"
                      title="Usuń tę kwestię"
                      aria-label="Usuń kwestię"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
