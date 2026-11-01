import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    menuOpen: false, // mobile navbar menu
    pendingAction: null, // e.g. { type: "save", bookId } - runs right after the visitor logs in
  },
  reducers: {
    toggleMenu: (state) => {
      state.menuOpen = !state.menuOpen;
    },
    closeMenu: (state) => {
      state.menuOpen = false;
    },
    setPendingAction: (state, { payload }) => {
      state.pendingAction = payload;
    },
    clearPendingAction: (state) => {
      state.pendingAction = null;
    },
  },
});

export const { toggleMenu, closeMenu, setPendingAction, clearPendingAction } = uiSlice.actions;
export default uiSlice.reducer;