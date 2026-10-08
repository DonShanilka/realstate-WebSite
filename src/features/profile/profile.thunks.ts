import { createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "./profile.api";
import type { User } from "../auth/auth.types";

type Config = { rejectValue: string };

export const fetchProfile = createAsyncThunk<User, number, Config>(
  "profile/fetch",
  async (id, { rejectWithValue }) => {
    try {
      return await profileApi.get(id);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const updateProfile = createAsyncThunk<
  User,
  {
    id: number;
    changes: Partial<Pick<User, "full_name" | "phone" | "profile_image">>;
  },
  Config
>("profile/update", async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await profileApi.update(id, changes);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});
