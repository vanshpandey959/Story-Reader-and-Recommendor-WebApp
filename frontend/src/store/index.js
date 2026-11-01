import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import booksReducer from "./slices/booksSlice";
import libraryReducer from "./slices/librarySlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    library: libraryReducer,
    ui: uiReducer,
  },
});
