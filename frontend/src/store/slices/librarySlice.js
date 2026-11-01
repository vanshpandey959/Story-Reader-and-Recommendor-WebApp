import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { apiError } from "../../api/client";
import {
  completeBookRequest,
  fetchLibraryRequest,
  startReadingRequest,
  toggleSavedRequest,
} from "../../api/libraryApi";
import { loggedOut } from "./authSlice";

const makeThunk = (name, request) =>
  createAsyncThunk(`library/${name}`, async (arg, { rejectWithValue }) => {
    try {
      return await request(arg);
    } catch (err) {
      return rejectWithValue(apiError(err));
    }
  });

export const loadLibrary = makeThunk("load", fetchLibraryRequest);
export const startReading = makeThunk("start", startReadingRequest);
export const completeBook = makeThunk("complete", completeBookRequest);
export const toggleSaved = makeThunk("toggleSaved", toggleSavedRequest);

const initialState = { reading: [], completed: [], saved: [], status: "idle", error: null };

const changed = isAnyOf(
  loadLibrary.fulfilled,
  startReading.fulfilled,
  completeBook.fulfilled,
  toggleSaved.fulfilled
);
const failed = isAnyOf(
  loadLibrary.rejected,
  startReading.rejected,
  completeBook.rejected,
  toggleSaved.rejected
);

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, () => initialState)
      .addCase(loadLibrary.pending, (state) => {
        state.status = "loading";
      })
      .addMatcher(changed, (state, { payload }) => {
        state.reading = payload.reading;
        state.completed = payload.completed;
        state.saved = payload.saved;
        state.status = "ready";
        state.error = null;
      })
      .addMatcher(failed, (state, { payload, error }) => {
        state.status = "failed";
        state.error = payload ?? error.message;
      });
  },
});

export default librarySlice.reducer;
