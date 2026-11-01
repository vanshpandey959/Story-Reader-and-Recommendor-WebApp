export function filterBooks(books, { genre = "All", query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return books.filter((b) => {
    const genreOk = genre === "All" || b.genres.includes(genre);
    const queryOk = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    return genreOk && queryOk;
  });
}
