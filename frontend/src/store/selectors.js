import { createSelector } from "@reduxjs/toolkit";
import { buildGenreList } from "../utils/genres";
import { getPopular, getRecommended } from "../utils/recommend";
import { LANE_SIZE } from "../utils/constants";

export const selectUser = (s) => s.auth.user;
export const selectBooks = (s) => s.books.items;
export const selectBooksStatus = (s) => s.books.status;
export const selectLibrary = (s) => s.library;

export const selectBookById = (id) => (s) => s.books.items.find((b) => b.id === id);

export const selectGenres = createSelector(selectBooks, buildGenreList);

const pickByIds = (books, ids) => {
  const map = new Map(books.map((b) => [b.id, b]));
  return ids.map((id) => map.get(id)).filter(Boolean);
};

export const selectReadingBooks = createSelector([selectBooks, (s) => s.library.reading], pickByIds);
export const selectCompletedBooks = createSelector([selectBooks, (s) => s.library.completed], pickByIds);
export const selectSavedBooks = createSelector([selectBooks, (s) => s.library.saved], pickByIds);

export const selectPopular = createSelector(selectBooks, (books) => getPopular(books));

export const selectRecommended = createSelector(
  [selectBooks, (s) => s.library.reading, (s) => s.library.completed, (s) => s.library.saved],
  (books, reading, completed, saved) => getRecommended(books, { reading, completed, saved })
);

/** everything that isn't already shown in the Popular / Recommended lanes */
export const selectMoreStories = createSelector(
  [selectBooks, selectPopular, selectRecommended],
  (books, popular, recommended) => {
    const used = new Set([...popular, ...recommended].map((b) => b.id));
    return books.filter((b) => !used.has(b.id)).slice(0, LANE_SIZE);
  }
);
