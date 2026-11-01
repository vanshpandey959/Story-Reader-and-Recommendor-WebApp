import mongoose from "mongoose";

/** One document per record in data.json. */
const bookSchema = new mongoose.Schema(
  {
    bookId: { type: Number, required: true, unique: true }, // Project Gutenberg id ("book_id")
    title: { type: String, required: true, trim: true },
    author: { type: String, default: "Unknown author", trim: true },
    summary: { type: String, default: "" },
    subjects: { type: String, default: "" },
    bookshelves: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    downloadCount: { type: Number, default: 0 },
    genre: { type: String, default: "General Non-Fiction / Other", trim: true },
  },
  { timestamps: true }
);

bookSchema.index({ genre: 1, downloadCount: -1 });
bookSchema.index({ downloadCount: -1 });
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });

/** data.json record -> document fields */
export const fromRaw = (raw) => ({
  bookId: Number(raw.book_id),
  title: String(raw.title ?? "").trim() || "Untitled",
  author: String(raw.author ?? "").trim() || "Unknown author",
  summary: raw.summary ?? "",
  subjects: raw.subjects ?? "",
  bookshelves: raw.bookshelves ?? "",
  coverImageUrl: raw.cover_image_url ?? "",
  downloadCount: Number(raw.download_count) || 0,
  genre: String(raw.genre ?? "").trim() || "General Non-Fiction / Other",
});

/** document -> JSON for the API. Same field names as data.json, plus `id`, so the frontend's normalizer just works. */
export const serializeBook = (b) => ({
  id: String(b.bookId),
  book_id: b.bookId,
  title: b.title,
  author: b.author,
  summary: b.summary,
  subjects: b.subjects,
  bookshelves: b.bookshelves,
  cover_image_url: b.coverImageUrl,
  download_count: b.downloadCount,
  genre: b.genre,
});

export default mongoose.model("Book", bookSchema);
