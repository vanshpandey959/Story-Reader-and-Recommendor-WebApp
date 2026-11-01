import Book from "../models/Book.js";
import Library, { serializeLibrary } from "../models/Library.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const without = (list, id) => list.filter((x) => x !== id);

/** Reads a book id from the URL and makes sure the book exists */
async function requireBookId(req) {
  const bookId = Number(req.params.bookId);
  if (!Number.isInteger(bookId)) throw new ApiError(400, "Invalid book id");
  if (!(await Book.exists({ bookId }))) throw new ApiError(404, "Book not found");
  return bookId;
}

const emptyLists = { reading: [], completed: [], saved: [] };

/** Applies `change(lists) -> lists` to the user's library, saves it, and replies with the whole library */
async function updateLibrary(req, res, change) {
  const current = (await Library.findOne({ user: req.user._id }).lean()) ?? emptyLists;
  const next = change({ reading: current.reading, completed: current.completed, saved: current.saved });

  const lib = await Library.findOneAndUpdate(
    { user: req.user._id },
    { $set: next, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true, lean: true }
  );
  res.json(serializeLibrary(lib));
}

/** GET /api/library -> { reading: [ids], completed: [ids], saved: [ids] } */
export const getLibrary = asyncHandler(async (req, res) => {
  const lib = await Library.findOne({ user: req.user._id }).lean();
  res.json(serializeLibrary(lib));
});

/** POST /api/library/:bookId/start - the reader opened the book: it is now "reading" */
export const startReading = asyncHandler(async (req, res) => {
  const id = await requireBookId(req);
  await updateLibrary(req, res, (l) => ({
    ...l,
    completed: without(l.completed, id),
    reading: [id, ...without(l.reading, id)],
  }));
});

/** POST /api/library/:bookId/complete - only this moves a book out of "reading" */
export const completeBook = asyncHandler(async (req, res) => {
  const id = await requireBookId(req);
  await updateLibrary(req, res, (l) => ({
    ...l,
    reading: without(l.reading, id),
    completed: [id, ...without(l.completed, id)],
  }));
});

/** POST /api/library/:bookId/save - toggles the bookmark */
export const toggleSaved = asyncHandler(async (req, res) => {
  const id = await requireBookId(req);
  await updateLibrary(req, res, (l) => ({
    ...l,
    saved: l.saved.includes(id) ? without(l.saved, id) : [id, ...l.saved],
  }));
});
