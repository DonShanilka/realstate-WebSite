import { createSlice } from "@reduxjs/toolkit";
import { tokenStorage, readTokenUser } from "../../utils/storage";
import { login, register } from "./auth.thunks";
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
  user: identity.id
    ? ({ id: identity.id, role: identity.role ?? "BUYER" } as User)
    : null,
  status: "idle",
  error: null,
  registrationMessage: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      tokenStorage.clear();
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.token = a.payload.access_token;
        tokenStorage.set(a.payload.access_token);
        const who = readTokenUser(a.payload.access_token);
        if (who.id)
          s.user = {
            id: who.id,
            role: (who.role ?? "BUYER") as User["role"],
          } as User;
      })
      .addCase(login.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? a.error.message ?? "Login failed";
      });
    builder
      .addCase(register.pending, (s) => {
        s.status = "loading";
        s.error = null;
        s.registrationMessage = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.registrationMessage = a.payload.message;
      })
      .addCase(register.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? a.error.message ?? "Registration failed";
      });
  },
});
export const { logout, clearAuthError } = slice.actions;
export default slice.reducer;
