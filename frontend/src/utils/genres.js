/** [{ name: "Horror", count: 12 }, ...] sorted by size - built from whatever genres exist in the data */
export function buildGenreList(books) {
  const counts = new Map();
  books.forEach((b) => b.genres.forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1)));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
}
