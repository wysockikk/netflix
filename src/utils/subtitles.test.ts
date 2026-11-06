import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatSrtTime,
  formatVttTime,
  parseTimestampToSeconds,
  generateSrtContent,
  generateVttContent,
  adjustCueTimestamps,
  calculateCPS,
  SubtitleCue,
} from './subtitles';

test('formatSrtTime formats seconds into 00:00:00,000 accurately', () => {
  assert.equal(formatSrtTime(0), '00:00:00,000');
  assert.equal(formatSrtTime(84.5), '00:01:24,500');
  assert.equal(formatSrtTime(3661.125), '01:01:01,125');
});

test('formatVttTime formats seconds into 00:00:00.000 with period separator', () => {
  assert.equal(formatVttTime(84.5), '00:01:24.500');
});

test('parseTimestampToSeconds handles both SRT and VTT formats correctly', () => {
  assert.equal(parseTimestampToSeconds('00:01:24,500'), 84.5);
  assert.equal(parseTimestampToSeconds('00:01:24.500'), 84.5);
  assert.equal(parseTimestampToSeconds('01:00:00,000'), 3600);
});

test('generateSrtContent creates valid sequential SRT blocks', () => {
  const cues: SubtitleCue[] = [
    {
      id: 1,
      startSeconds: 1.5,
      endSeconds: 4.0,
      speaker: 'Cooper',
      originalText: 'We used to look up at the sky.',
      translatedText: 'Kiedyś patrzyliśmy w niebo.',
    },
    {
      id: 2,
      startSeconds: 4.5,
      endSeconds: 7.2,
      speaker: 'Brand',
      originalText: 'And wonder at our place in the stars.',
      translatedText: 'I zastanawialiśmy się nad naszym miejscem wśród gwiazd.',
    },
  ];

  const srt = generateSrtContent(cues);
  assert.ok(srt.includes('1\n00:00:01,500 --> 00:00:04,000\nKiedyś patrzyliśmy w niebo.'));
  assert.ok(srt.includes('2\n00:00:04,500 --> 00:00:07,200\nI zastanawialiśmy się'));

  const srtWithSpeaker = generateSrtContent(cues, { includeSpeaker: true });
  assert.ok(srtWithSpeaker.includes('[Cooper]: Kiedyś'));
});

test('generateVttContent includes WEBVTT header and formatting', () => {
  const cues: SubtitleCue[] = [
    {
      id: 1,
      startSeconds: 0,
      endSeconds: 2,
      speaker: 'Neo',
      originalText: 'I know kung fu.',
      translatedText: 'Znam kung-fu.',
    },
  ];
  const vtt = generateVttContent(cues);
  assert.ok(vtt.startsWith('WEBVTT\n\n'));
  assert.ok(vtt.includes('00:00:00.000 --> 00:00:02.000'));
});

test('adjustCueTimestamps shifts all timestamps by positive or negative ms', () => {
  const cues: SubtitleCue[] = [
    {
      id: 1,
      startSeconds: 2.0,
      endSeconds: 5.0,
      speaker: 'Tester',
      originalText: 'Hello',
      translatedText: 'Cześć',
    },
  ];
  const shifted = adjustCueTimestamps(cues, 500); // +500ms
  assert.equal(shifted[0].startSeconds, 2.5);
  assert.equal(shifted[0].endSeconds, 5.5);

  const shiftedBack = adjustCueTimestamps(cues, -3000); // clamp at 0
  assert.equal(shiftedBack[0].startSeconds, 0);
});

test('calculateCPS computes correct characters per second', () => {
  assert.equal(calculateCPS('Witaj świecie!', 2), 7);
  assert.equal(calculateCPS('', 2), 0);
});
