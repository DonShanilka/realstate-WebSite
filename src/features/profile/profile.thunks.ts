import { createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "./profile.api";
import type { User } from "../auth/auth.types";
export const fetchProfile = createAsyncThunk<User, number, { rejectValue: string }>("profile/fetch", async (id, { rejectWithValue }) => { try { return await profileApi.me(id); } catch (e) { return rejectWithValue((e as Error).message); } });
export const updateProfile = createAsyncThunk<User, { id: number; changes: Partial<Pick<User, "full_name" | "phone" | "profile_image">> }, { rejectValue: string }>("profile/update", async ({ id, changes }, { rejectWithValue }) => { try { return await profileApi.updateProfile(id, changes); } catch (e) { return rejectWithValue((e as Error).message); } });
