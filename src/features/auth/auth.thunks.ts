import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import type {
  AuthToken,
  LoginCredentials,
  RegisterPayload,
} from "./auth.types";

export const login = createAsyncThunk<
  AuthToken,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  try {
    return await authApi.login(body);
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
