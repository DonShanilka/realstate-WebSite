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
    loggedOut(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
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
        s.user = a.payload.user;
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
export const { loggedOut, clearAuthError } = slice.actions;
export const logout = () => (dispatch: (action: ReturnType<typeof loggedOut>) => void) => { tokenStorage.clear(); dispatch(loggedOut()); };
export default slice.reducer;
