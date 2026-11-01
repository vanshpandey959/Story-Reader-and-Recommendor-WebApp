import { FALLBACK_COVER } from "./constants";

/**
 * The ONE place that knows what data.json looks like.
 * If your fields are named differently, add the name to the matching list below.
 */
const pick = (obj, keys) =>
  keys.map((k) => obj[k]).find((v) => v !== undefined && v !== null && v !== "");

const titleCase = (s) =>
  s.toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());

const toList = (v) =>
  Array.isArray(v) ? v : typeof v === "string" ? v.split(/[,;/|]/) : [];

export const toBookArray = (raw) =>
  Array.isArray(raw) ? raw : raw?.books ?? raw?.results ?? raw?.data ?? [];

export function normalizeBook(raw, index = 0) {
  const id = String(pick(raw, ["id", "_id", "book_id", "gutenberg_id"]) ?? index);
  const formats = raw.formats ?? {};

  const authorField = pick(raw, ["author", "authors"]);
  const author = Array.isArray(authorField)
    ? authorField.map((a) => a?.name ?? a).join(", ")
    : authorField ?? "Unknown author";

  const genres = toList(
    pick(raw, ["genres", "genre", "category", "categories", "bookshelves", "subjects"])
  )
    .map((g) => titleCase(String(g).split(" -- ")[0].trim()))
    .filter(Boolean)
    .slice(0, 4);

  const isGutenbergId = /^\d+$/.test(id);

  return {
    id,
    title: pick(raw, ["title", "name"]) ?? "Untitled",
    author,
    description: pick(raw, ["description", "summary", "synopsis", "about"]) ?? "No description available yet.",
    cover: pick(raw, ["cover_image_url", "cover_url", "cover", "image_url", "image", "thumbnail"]) ?? formats["image/jpeg"] ?? FALLBACK_COVER,
    genres,
    rating: Number(pick(raw, ["rating", "average_rating"])) || null,
    popularity: Number(pick(raw, ["popularity", "download_count", "downloads", "reads"])) || 0,
    language: String(pick(raw, ["language"]) ?? raw.languages?.[0] ?? "en").toUpperCase(),
    pages: pick(raw, ["pages", "page_count"]) ?? null,
    year: pick(raw, ["year", "published_year"]) ?? null,
    readUrl:
      pick(raw, ["read_url", "read_link", "web_url", "url"]) ??
      formats["text/html"] ??
      (isGutenbergId ? `https://www.gutenberg.org/ebooks/${id}` : null),
    downloadUrl:
      pick(raw, ["download_url", "download_link", "pdf_url", "epub_url"]) ??
      formats["application/epub+zip"] ??
      (isGutenbergId ? `https://www.gutenberg.org/ebooks/${id}.epub3.images` : null),
  };
}

export const normalizeBooks = (raw) => toBookArray(raw).map(normalizeBook);
