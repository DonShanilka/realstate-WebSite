import { createSlice } from "@reduxjs/toolkit";

import { tokenStorage, readTokenUser } from "../../utils/storage";

import { googleLogin, login, register } from "./auth.thunks";

import type { User } from "./auth.types";

const token = tokenStorage.get();
const identity = readTokenUser(token);

interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  registrationMessage: string | null;
}

const initialState: AuthState = {
  token,

  user:
    identity.id && identity.role
      ? ({
          id: identity.id,
          role: identity.role,
        } as User)
      : null,

  status: "idle",
  error: null,
  registrationMessage: null,
};

const slice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loggedOut(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.registrationMessage = null;
    },

    clearAuthError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Login failed";
      })

      .addCase(googleLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.error = null;
      })

      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Google sign-in failed";
      })

      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.registrationMessage = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.registrationMessage = action.payload.message;
      })

      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Registration failed";
      });
  },
});

export const { loggedOut, clearAuthError } = slice.actions;

/**
 * Logout the active account in this browser tab.
 *
 * The other role-specific tokens remain stored.
 */
export const logout =
  () => (dispatch: (action: ReturnType<typeof loggedOut>) => void) => {
    tokenStorage.clear();
    dispatch(loggedOut());
  };

export default slice.reducer;
