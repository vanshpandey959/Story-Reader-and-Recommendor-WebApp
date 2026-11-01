import client, { USE_MOCK, delay } from "./client";
import rawBooks from "../data/data.json";
import { normalizeBooks } from "../utils/normalizeBook";

/** GET /books  ->  [ book, ... ]  (params ready for server-side paging later) */
export async function fetchBooksRequest(params) {
  if (USE_MOCK) {
    await delay(700);
    return normalizeBooks(rawBooks);
  }
  const { data } = await client.get("/books", { params });
  return normalizeBooks(data);
}
