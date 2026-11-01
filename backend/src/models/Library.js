import mongoose from "mongoose";

/**
 * One document per user. Each list holds Gutenberg book ids, newest first:
 *   reading   - pressed "Start reading", not marked completed yet
 *   completed - pressed "Mark as completed"
 *   saved     - bookmarked
 */
const librarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    reading: { type: [Number], default: [] },
    completed: { type: [Number], default: [] },
    saved: { type: [Number], default: [] },
  },
  { timestamps: true }
);

/** What the frontend expects: ids as strings */
export const serializeLibrary = (lib) => ({
  reading: (lib?.reading ?? []).map(String),
  completed: (lib?.completed ?? []).map(String),
  saved: (lib?.saved ?? []).map(String),
});

export default mongoose.model("Library", librarySchema);
