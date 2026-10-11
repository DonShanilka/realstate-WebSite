import { createAsyncThunk } from "@reduxjs/toolkit";

import { authApi } from "./auth.api";

import type {
  AuthToken,
  LoginCredentials,
  RegisterPayload,
  User,
} from "./auth.types";

import {
  tokenStorage,
  readTokenUser,
  type UserRole,
} from "../../utils/storage";

type AuthResult = AuthToken & {
  user: User | null;
};

function getFallbackUser(token: string): User | null {
  const identity = readTokenUser(token);

  if (!identity.id || !identity.role) {
    return null;
  }

  const validRoles: UserRole[] = ["ADMIN", "AGENT", "OWNER", "BUYER"];

  if (!validRoles.includes(identity.role as UserRole)) {
    return null;
  }

  return {
    id: identity.id,
    role: identity.role as UserRole,
  };
}

async function completeLogin(token: AuthToken): Promise<AuthResult> {
  const fallbackUser = getFallbackUser(token.access_token);

  if (!fallbackUser) {
    throw new Error(
      "Login succeeded, but the account ID or role could not be identified.",
    );
  }

  // Save the token under the correct role-specific key.
  // This also makes that role active in the current tab.
  tokenStorage.set(token.access_token, fallbackUser.role);

  let user: User = fallbackUser;

  try {
    // The API client now uses the newly saved token.
    user = await authApi.me(fallbackUser.id);
  } catch {
    // Keep the token-derived user if the profile endpoint fails.
  }

  // Prefer the actual role returned by the user profile.
  // Do not allow the profile to silently switch to a different role.
  if (user.id !== fallbackUser.id || user.role !== fallbackUser.role) {
    throw new Error(
      "The user profile does not match the authenticated account.",
    );
  }

  return {
    ...token,
    user,
  };
}

export const login = createAsyncThunk<
  AuthResult,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  try {
    const token = await authApi.login(body);

    return await completeLogin(token);
  } catch (error) {
    return rejectWithValue((error as Error).message || "Login failed");
  }
});

export const googleLogin = createAsyncThunk<
  AuthResult,
  string,
  { rejectValue: string }
>("auth/googleLogin", async (credential, { rejectWithValue }) => {
  try {
    const token = await authApi.googleLogin(credential);

    return await completeLogin(token);
  } catch (error) {
    return rejectWithValue((error as Error).message || "Google sign-in failed");
  }
});

export const register = createAsyncThunk<
  { message: string },
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    return await authApi.register(body);
  } catch (error) {
    return rejectWithValue((error as Error).message || "Registration failed");
  }
});
