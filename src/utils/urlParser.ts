export interface ParsedMovieQuery {
  isValid: boolean;
  source: 'imdb' | 'rottentomatoes' | 'title' | 'unknown';
  idOrSlug?: string;
  cleanedTitle?: string;
  originalInput: string;
}

/**
 * Parses user input which can be:
 * - IMDb URL (e.g., https://www.imdb.com/title/tt0816692/ or tt0816692)
 * - Rotten Tomatoes URL (e.g., https://www.rottentomatoes.com/m/oppenheimer_2023 or /m/interstellar)
 * - Plain movie title (e.g., "Interstellar", "Pulp Fiction", "Dune: Part Two")
 */
export function parseMovieInput(input: string): ParsedMovieQuery {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      source: 'unknown',
      originalInput: input,
    };
  }

  // 1. Check IMDb ID or URL
  const imdbMatch = trimmed.match(/(?:imdb\.com\/title\/)?(tt\d{7,10})/i);
  if (imdbMatch) {
    return {
      isValid: true,
      source: 'imdb',
      idOrSlug: imdbMatch[1],
      originalInput: trimmed,
    };
  }

  // 2. Check Rotten Tomatoes URL
  const rtMatch = trimmed.match(/rottentomatoes\.com\/m\/([a-zA-Z0-9_-]+)/i);
  if (rtMatch) {
    const slug = rtMatch[1];
    // Convert slug (e.g. "oppenheimer_2023" or "interstellar") to readable title
    const readable = slug
      .replace(/_\d{4}$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    return {
      isValid: true,
      source: 'rottentomatoes',
      idOrSlug: slug,
      cleanedTitle: readable,
      originalInput: trimmed,
    };
  }

  // 3. Check Rotten Tomatoes short path like "/m/interstellar"
  const rtShortMatch = trimmed.match(/^\/?m\/([a-zA-Z0-9_-]+)/i);
  if (rtShortMatch) {
    const slug = rtShortMatch[1];
    const readable = slug
      .replace(/_\d{4}$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    return {
      isValid: true,
      source: 'rottentomatoes',
      idOrSlug: slug,
      cleanedTitle: readable,
      originalInput: trimmed,
    };
  }

  // 4. Fallback to movie title if at least 2 chars and not random invalid URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Unsupported URL
    return {
      isValid: false,
      source: 'unknown',
      originalInput: trimmed,
    };
  }

  return {
    isValid: true,
    source: 'title',
    cleanedTitle: trimmed,
    originalInput: trimmed,
  };
}

export const PRESET_MOVIES = [
  {
    title: 'Interstellar',
    year: 2014,
    director: 'Christopher Nolan',
    imdbUrl: 'https://www.imdb.com/title/tt0816692/',
    rottenTomatoesUrl: 'https://www.rottentomatoes.com/m/interstellar',
    rating: '8.7/10 ★',
    genres: ['Sci-Fi', 'Dramat', 'Przygoda'],
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'Zespół odkrywców wyrusza w podróż przez nowo odkryty tunel czasoprzestrzenny, by ocalić ludzkość przed zagładą na umierającej Ziemi.',
  },
  {
    title: 'Oppenheimer',
    year: 2023,
    director: 'Christopher Nolan',
    imdbUrl: 'https://www.imdb.com/title/tt15398776/',
    rottenTomatoesUrl: 'https://www.rottentomatoes.com/m/oppenheimer_2023',
    rating: '8.9/10 ★',
    genres: ['Biograficzny', 'Dramat', 'Historia'],
    poster: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'Fascynująca i dramatyczna historia fizyka J. Roberta Oppenheimera oraz ściśle tajnego projektu Manhattan nad bombą atomową.',
  },
  {
    title: 'Pulp Fiction',
    year: 1994,
    director: 'Quentin Tarantino',
    imdbUrl: 'https://www.imdb.com/title/tt0110912/',
    rottenTomatoesUrl: 'https://www.rottentomatoes.com/m/pulp_fiction',
    rating: '8.9/10 ★',
    genres: ['Kryminał', 'Dramat'],
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'Przeplatające się losy dwóch płatnych morderców, boksera i żony gangstera w kultowym arcydziele Quentina Tarantino.',
  },
  {
    title: 'Dune: Part Two',
    year: 2024,
    director: 'Denis Villeneuve',
    imdbUrl: 'https://www.imdb.com/title/tt15239678/',
    rottenTomatoesUrl: 'https://www.rottentomatoes.com/m/dune_part_two',
    rating: '8.6/10 ★',
    genres: ['Sci-Fi', 'Akcja', 'Przygoda'],
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'Paul Atryda jednoczy się z Chani i Fremenami na pustynnej planecie Arrakis, szukając zemsty na spiskowcach, którzy zniszczyli jego ród.',
  },
  {
    title: 'The Matrix',
    year: 1999,
    director: 'Lana & Lilly Wachowski',
    imdbUrl: 'https://www.imdb.com/title/tt0133093/',
    rottenTomatoesUrl: 'https://www.rottentomatoes.com/m/matrix',
    rating: '8.7/10 ★',
    genres: ['Sci-Fi', 'Akcja'],
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'Haker komputerowy Neo dowiaduje się od tajemniczych buntowników o prawdziwej naturze jego rzeczywistości i swojej roli w wojnie z maszynami.',
  },
];
