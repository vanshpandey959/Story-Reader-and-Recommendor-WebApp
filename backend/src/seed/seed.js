/**
 * Loads data.json into MongoDB.
 *
 *   npm run seed           upsert every book (safe to run again) + create the demo user
 *   npm run seed:fresh     delete all books first, then load
 *   npm run seed:destroy   delete all books and exit
 *
 * Reads SEED_FILE from .env (default ./data/data.json).
 */
import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import Book, { fromRaw } from "../models/Book.js";
import User from "../models/User.js";

const BATCH = 1000;
const DEMO = { name: "Demo Reader", email: "demo@example.com", password: "demo1234" }; // same login the frontend shows

const args = new Set(process.argv.slice(2));

function readBooks() {
  const file = path.resolve(env.seedFile);
  if (!fs.existsSync(file)) throw new Error(`Seed file not found: ${file}`);

  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const list = Array.isArray(raw) ? raw : raw.books ?? raw.results ?? raw.data ?? [];

  // keep the first record for every book_id, skip rows without a usable id
  const byId = new Map();
  let skipped = 0;
  for (const row of list) {
    const id = Number(row?.book_id);
    if (!Number.isFinite(id)) {
      skipped++;
      continue;
    }
    if (byId.has(id)) skipped++;
    else byId.set(id, fromRaw(row));
  }
  return { books: [...byId.values()], total: list.length, skipped };
}

async function importBooks() {
  const { books, total, skipped } = readBooks();
  console.log(`Read ${total} records (${books.length} unique${skipped ? `, ${skipped} skipped` : ""}).`);

  let inserted = 0;
  let updated = 0;
  for (let i = 0; i < books.length; i += BATCH) {
    const chunk = books.slice(i, i + BATCH);
    const result = await Book.bulkWrite(
      chunk.map((doc) => ({
        updateOne: { filter: { bookId: doc.bookId }, update: { $set: doc }, upsert: true },
      })),
      { ordered: false }
    );
    inserted += result.upsertedCount;
    updated += result.modifiedCount;
    process.stdout.write(`\r  ${Math.min(i + BATCH, books.length)} / ${books.length}`);
  }
  console.log(`\nBooks: ${inserted} inserted, ${updated} updated.`);
}

async function createDemoUser() {
  if (await User.exists({ email: DEMO.email })) return console.log(`Demo user already exists (${DEMO.email}).`);
  await User.create(DEMO);
  console.log(`Demo user created: ${DEMO.email} / ${DEMO.password}`);
}

async function main() {
  await connectDB();
  await Book.init(); // make sure indexes exist before loading

  if (args.has("--destroy")) {
    const { deletedCount } = await Book.deleteMany({});
    console.log(`Deleted ${deletedCount} books.`);
  } else {
    if (args.has("--fresh")) {
      const { deletedCount } = await Book.deleteMany({});
      console.log(`Deleted ${deletedCount} existing books.`);
    }
    await importBooks();
    await createDemoUser();
  }
}

main()
  .catch((err) => {
    console.error("\nSeed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(disconnectDB);
