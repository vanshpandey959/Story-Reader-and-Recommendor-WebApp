import Book, { serializeBook } from "../models/Book.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const SORTS = {
  popular: { downloadCount: -1, bookId: 1 },
  title: { title: 1 },
  author: { author: 1, title: 1 },
};

/**
 * GET /api/books
 *   ?q=austen        title or author contains text (case-insensitive)
 *   ?genre=Horror    exact genre
 *   ?sort=popular|title|author   (default popular)
 *   ?page=1&limit=18             paging (limit max 100)
 * With no page/limit it returns every match, which is what the frontend loads once at start-up.
 * -> { books: [...], total, page, pages, limit }
 */
export const getBooks = asyncHandler(async (req, res) => {
  const { q, genre, sort = "popular" } = req.query;

  const filter = {};
  if (genre && genre !== "All") filter.genre = String(genre);
  if (typeof q === "string" && q.trim()) {
    const rx = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ title: rx }, { author: rx }];
  }

  const paged = req.query.page !== undefined || req.query.limit !== undefined;
  const limit = paged ? Math.min(Math.max(parseInt(req.query.limit, 10) || 18, 1), 100) : 0;
  const page = paged ? Math.max(parseInt(req.query.page, 10) || 1, 1) : 1;

  const query = Book.find(filter).sort(SORTS[sort] ?? SORTS.popular).lean();
  if (paged) query.skip((page - 1) * limit).limit(limit);

  const [docs, total] = await Promise.all([query, Book.countDocuments(filter)]);

  res.json({
    books: docs.map(serializeBook),
    total,
    page,
    pages: paged ? Math.max(Math.ceil(total / limit), 1) : 1,
    limit: paged ? limit : total,
  });
});

/** GET /api/books/popular?limit=32 - most downloaded */
export const getPopularBooks = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 32, 1), 100);
  const docs = await Book.find().sort(SORTS.popular).limit(limit).lean();
  res.json({ books: docs.map(serializeBook) });
});

/** GET /api/books/genres -> [{ name: "History", count: 1627 }, ...] biggest first */
export const getGenres = asyncHandler(async (_req, res) => {
  const rows = await Book.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);
  res.json(rows.map((r) => ({ name: r._id, count: r.count })));
});

/** GET /api/books/:id  (Gutenberg id) */
export const getBook = asyncHandler(async (req, res) => {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId)) throw new ApiError(400, "Invalid book id");

  const book = await Book.findOne({ bookId }).lean();
  if (!book) throw new ApiError(404, "Book not found");
  res.json(serializeBook(book));
});

/** GET /api/books/:id/similar - same genre first, same author boosted */
export const getSimilarBooks = asyncHandler(async (req, res) => {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId)) throw new ApiError(400, "Invalid book id");

  const book = await Book.findOne({ bookId }).lean();
  if (!book) throw new ApiError(404, "Book not found");

  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 16, 1), 50);
  const docs = await Book.find({ bookId: { $ne: bookId }, $or: [{ genre: book.genre }, { author: book.author }] })
    .sort({ downloadCount: -1 })
    .limit(limit * 3)
    .lean();

  const books = docs
    .map((b) => ({ b, score: (b.genre === book.genre ? 1 : 0) + (b.author === book.author ? 2 : 0) }))
    .sort((x, y) => y.score - x.score || y.b.downloadCount - x.b.downloadCount)
    .slice(0, limit)
    .map((x) => serializeBook(x.b));

  res.json({ books });
});
