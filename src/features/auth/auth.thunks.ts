import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import type {
  AuthToken,
  LoginCredentials,
  RegisterPayload,
} from "./auth.types";
import { tokenStorage, readTokenUser } from "../../utils/storage";

export const login = createAsyncThunk<
  AuthToken & { user: import("./auth.types").User | null },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  try {
    const token = await authApi.login(body);
    tokenStorage.set(token.access_token);
    const identity = readTokenUser(token.access_token);
    let user: import("./auth.types").User | null = null;
    if (identity.id) {
      try { user = await authApi.me(identity.id); } catch { /* login still succeeds if the profile endpoint is unavailable */ }
    }
    return { ...token, user };
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});
export const register = createAsyncThunk<
  { message: string },
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    return await authApi.register(body);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});
