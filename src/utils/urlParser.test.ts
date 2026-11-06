import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMovieInput } from './urlParser';

test('parseMovieInput extracts IMDb id from various url formats', () => {
  const result1 = parseMovieInput('https://www.imdb.com/title/tt0816692/');
  assert.equal(result1.isValid, true);
  assert.equal(result1.source, 'imdb');
  assert.equal(result1.idOrSlug, 'tt0816692');

  const result2 = parseMovieInput('tt15398776');
  assert.equal(result2.isValid, true);
  assert.equal(result2.source, 'imdb');
  assert.equal(result2.idOrSlug, 'tt15398776');
});

test('parseMovieInput extracts Rotten Tomatoes slug and cleans title', () => {
  const result1 = parseMovieInput('https://www.rottentomatoes.com/m/oppenheimer_2023');
  assert.equal(result1.isValid, true);
  assert.equal(result1.source, 'rottentomatoes');
  assert.equal(result1.idOrSlug, 'oppenheimer_2023');
  assert.equal(result1.cleanedTitle, 'Oppenheimer');

  const result2 = parseMovieInput('https://www.rottentomatoes.com/m/dune_part_two');
  assert.equal(result2.isValid, true);
  assert.equal(result2.source, 'rottentomatoes');
  assert.equal(result2.cleanedTitle, 'Dune Part Two');
});

test('parseMovieInput handles plain title inputs', () => {
  const result = parseMovieInput('Pulp Fiction');
  assert.equal(result.isValid, true);
  assert.equal(result.source, 'title');
  assert.equal(result.cleanedTitle, 'Pulp Fiction');
});

test('parseMovieInput rejects empty or unsupported domains', () => {
  const empty = parseMovieInput('   ');
  assert.equal(empty.isValid, false);

  const invalidUrl = parseMovieInput('https://www.randomsite.com/movie/123');
  assert.equal(invalidUrl.isValid, false);
});
