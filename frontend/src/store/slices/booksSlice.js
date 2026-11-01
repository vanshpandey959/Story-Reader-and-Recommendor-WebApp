import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiError } from "../../api/client";
import { fetchBooksRequest } from "../../api/booksApi";

export const loadBooks = createAsyncThunk(
  "books/load",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBooksRequest();
    } catch (err) {
      return rejectWithValue(apiError(err));
    }
  },
  {
    // never refetch while loading or once loaded; allow retry after a failure
    condition: (_, { getState }) => ["idle", "failed"].includes(getState().books.status),
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: { items: [], status: "idle", error: null }, // idle | loading | succeeded | failed
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadBooks.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(loadBooks.rejected, (state, { payload, error }) => {
        state.status = "failed";
        state.error = payload ?? error.message;
      });
  },
});

export default booksSlice.reducer;
