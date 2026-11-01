import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import client, { USE_MOCK, apiError } from "../../api/client";
import { loginRequest, signupRequest } from "../../api/authApi";
import { loadJson, removeKey, saveJson } from "../../utils/storage";
import { STORAGE_KEYS } from "../../utils/constants";

const persist = ({ user, token }) => {
  saveJson(STORAGE_KEYS.user, user);
  saveJson(STORAGE_KEYS.token, token);
};

const makeAuthThunk = (type, request) =>
  createAsyncThunk(`auth/${type}`, async (payload, { rejectWithValue }) => {
    try {
      const data = await request(payload);
      persist(data);
      return data;
    } catch (err) {
      return rejectWithValue(apiError(err));
    }
  });

export const login = makeAuthThunk("login", loginRequest);
export const signup = makeAuthThunk("signup", signupRequest);

const initialState = {
  user: loadJson(STORAGE_KEYS.user),
  token: loadJson(STORAGE_KEYS.token),
  status: "idle", // idle | loading | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedOut: () => ({ ...initialState, user: null, token: null }),
    clearAuthError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(login.pending, signup.pending), (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(isAnyOf(login.fulfilled, signup.fulfilled), (state, { payload }) => {
        state.status = "idle";
        state.user = payload.user;
        state.token = payload.token;
      })
      .addMatcher(isAnyOf(login.rejected, signup.rejected), (state, { payload, error }) => {
        state.status = "failed";
        state.error = payload ?? error.message;
      });
  },
});

export const { loggedOut, clearAuthError } = authSlice.actions;

export const logout = () => (dispatch) => {
  // ask the backend to clear its auth cookie (not needed in mock mode; a failure must not block logging out)
  if (!USE_MOCK) client.post("/auth/logout").catch(() => {});
  removeKey(STORAGE_KEYS.token);
  removeKey(STORAGE_KEYS.user);
  dispatch(loggedOut());
};

export default authSlice.reducer;