import client, { USE_MOCK, delay } from "./client";
import { loadJson, saveJson } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

/* Every call returns the whole library: { reading: [ids], completed: [ids], saved: [ids] } */

/* ---- mock backend (per-user localStorage) ---- */
const key = () => STORAGE_KEYS.library(loadJson(STORAGE_KEYS.user)?.id ?? "guest");
const read = () => ({ reading: [], completed: [], saved: [], ...loadJson(key(), {}) });
const write = (lib) => {
  saveJson(key(), lib);
  return lib;
};
const without = (list, id) => list.filter((x) => x !== id);

/** GET /library */
export async function fetchLibraryRequest() {
  if (!USE_MOCK) return (await client.get("/library")).data;
  await delay(300);
  return read();
}

/** POST /library/:bookId/start - user clicked the reading link -> book is "reading" */
export async function startReadingRequest(bookId) {
  if (!USE_MOCK) return (await client.post(`/library/${bookId}/start`)).data;
  await delay(150);
  const lib = read();
  return write({
    ...lib,
    completed: without(lib.completed, bookId),
    reading: [bookId, ...without(lib.reading, bookId)],
  });
}

/** POST /library/:bookId/complete - only the Completed button moves a book out of "reading" */
export async function completeBookRequest(bookId) {
  if (!USE_MOCK) return (await client.post(`/library/${bookId}/complete`)).data;
  await delay(150);
  const lib = read();
  return write({
    ...lib,
    reading: without(lib.reading, bookId),
    completed: [bookId, ...without(lib.completed, bookId)],
  });
}

/** POST /library/:bookId/save - toggles the heart / bookmark */
export async function toggleSavedRequest(bookId) {
  if (!USE_MOCK) return (await client.post(`/library/${bookId}/save`)).data;
  await delay(150);
  const lib = read();
  const isSaved = lib.saved.includes(bookId);
  return write({ ...lib, saved: isSaved ? without(lib.saved, bookId) : [bookId, ...lib.saved] });
}
