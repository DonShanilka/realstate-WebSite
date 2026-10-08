import { createAsyncThunk } from "@reduxjs/toolkit";
import { favoritesApi } from "./favorites.api";
import type { Favorite } from "./favorites.types";
export const fetchFavorites = createAsyncThunk<Favorite[], void, { rejectValue: string }>("favorites/list", async (_, { rejectWithValue }) => { try { return await favoritesApi.list(); } catch (e) { return rejectWithValue((e as Error).message); } });
export const addFavorite = createAsyncThunk<Favorite, number, { rejectValue: string }>("favorites/add", async (id, { rejectWithValue }) => { try { return await favoritesApi.add(id); } catch (e) { return rejectWithValue((e as Error).message); } });
export const removeFavorite = createAsyncThunk<number, number, { rejectValue: string }>("favorites/remove", async (id, { rejectWithValue }) => { try { await favoritesApi.remove(id); return id; } catch (e) { return rejectWithValue((e as Error).message); } });
