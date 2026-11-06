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
  imdbId?: string;
  rottenTomatoesSlug?: string;
  durationMinutes?: number;
  sourceUrl?: string;
}

/**
 * Format seconds (e.g. 84.5) to SRT timestamp: "00:01:24,500"
 */
export function formatSrtTime(totalSeconds: number): string {
  if (totalSeconds < 0 || isNaN(totalSeconds)) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const pad = (num: number, size = 2) => String(num).padStart(size, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

/**
 * Format seconds (e.g. 84.5) to WebVTT timestamp: "00:01:24.500"
 */
export function formatVttTime(totalSeconds: number): string {
  return formatSrtTime(totalSeconds).replace(',', '.');
}

/**
 * Parse an SRT timestamp ("00:01:24,500") or VTT ("00:01:24.500") back to seconds.
 */
export function parseTimestampToSeconds(timestamp: string): number {
  const normalized = timestamp.trim().replace(',', '.');
  const parts = normalized.split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  }
  return 0;
}

/**
 * Generate standard .SRT subtitle content from cues
 */
export function generateSrtContent(cues: SubtitleCue[], options?: { includeSpeaker?: boolean }): string {
  const includeSpeaker = options?.includeSpeaker ?? false;
  return cues
    .map((cue, index) => {
      const startTime = formatSrtTime(cue.startSeconds);
      const endTime = formatSrtTime(cue.endSeconds);
      const speakerPrefix = includeSpeaker && cue.speaker ? `[${cue.speaker}]: ` : '';
      const text = `${speakerPrefix}${cue.translatedText}`.trim();
      return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n`;
    })
    .join('\n');
}

/**
 * Generate standard WebVTT .VTT content from cues
 */
export function generateVttContent(cues: SubtitleCue[], options?: { includeSpeaker?: boolean }): string {
  const includeSpeaker = options?.includeSpeaker ?? false;
  const header = 'WEBVTT\n\n';
  const body = cues
    .map((cue, index) => {
      const startTime = formatVttTime(cue.startSeconds);
      const endTime = formatVttTime(cue.endSeconds);
      const speakerVoice = includeSpeaker && cue.speaker ? `<v ${cue.speaker}>` : '';
      const speakerClose = includeSpeaker && cue.speaker ? '</v>' : '';
      const text = `${speakerVoice}${cue.translatedText}${speakerClose}`.trim();
      return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n`;
    })
    .join('\n');
  return header + body;
}

/**
 * Shift all cues by an offset in milliseconds (+/- ms)
 */
export function adjustCueTimestamps(cues: SubtitleCue[], offsetMs: number): SubtitleCue[] {
  const offsetSec = offsetMs / 1000;
  return cues.map(cue => ({
    ...cue,
    startSeconds: Math.max(0, +(cue.startSeconds + offsetSec).toFixed(3)),
    endSeconds: Math.max(0.1, +(cue.endSeconds + offsetSec).toFixed(3)),
  }));
}

/**
 * Calculate reading speed in characters per second (CPS)
 */
export function calculateCPS(text: string, durationSec: number): number {
  if (durationSec <= 0) return 0;
  return +(text.length / durationSec).toFixed(1);
}
