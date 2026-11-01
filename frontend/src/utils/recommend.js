import { LANE_SIZE } from "./constants";

const byPopularity = (a, b) => b.popularity - a.popularity || (b.rating ?? 0) - (a.rating ?? 0);
const byRating = (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.popularity - a.popularity;

export const getPopular = (books, n = LANE_SIZE) => [...books].sort(byPopularity).slice(0, n);

/** Same genres (and a bonus for the same author), best match first */
export function getSimilar(book, books, n = 16) {
  const genres = new Set(book.genres);
  return books
    .filter((b) => b.id !== book.id)
    .map((b) => ({
      b,
      score: b.genres.filter((g) => genres.has(g)).length + (b.author === book.author ? 2 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || byPopularity(x.b, y.b))
    .slice(0, n)
    .map((x) => x.b);
}

/** Learns favourite genres from reading / completed / saved books. No history -> top rated. */
export function getRecommended(books, { reading, completed, saved }, n = LANE_SIZE) {
  const touched = new Set([...reading, ...completed, ...saved]);
  const hidden = new Set([...reading, ...completed]);

  const taste = new Map();
  books
    .filter((b) => touched.has(b.id))
    .forEach((b) => b.genres.forEach((g) => taste.set(g, (taste.get(g) ?? 0) + 1)));

  const pool = books.filter((b) => !hidden.has(b.id));
  if (!taste.size) return [...pool].sort(byRating).slice(0, n);

  return pool
    .map((b) => ({ b, score: b.genres.reduce((sum, g) => sum + (taste.get(g) ?? 0), 0) }))
    .sort((x, y) => y.score - x.score || byPopularity(x.b, y.b))
    .slice(0, n)
    .map((x) => x.b);
}
