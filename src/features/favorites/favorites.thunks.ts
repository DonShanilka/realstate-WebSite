import { createAsyncThunk } from "@reduxjs/toolkit";
import { favoritesApi } from "./favorites.api";
import type { Favorite } from "./favorites.types";

type Config = { rejectValue: string };

export const fetchFavorites = createAsyncThunk<Favorite[], void, { state: { favorites: { status: string } }; rejectValue: string }>(
  "favorites/list",
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesApi.list();
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
  { condition: (_, { getState }) => getState().favorites.status !== "loading" },
);

export const addFavorite = createAsyncThunk<Favorite | { property_id: number; message: string }, number, Config>(
  "favorites/add",
  async (id, { rejectWithValue }) => {
    try {
      const saved = await favoritesApi.add(id);
      if ("property_id" in saved) return saved;
      const current = (await favoritesApi.list()).find((favorite) => favorite.property_id === id);
      return current ?? { property_id: id, message: saved.message };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const removeFavorite = createAsyncThunk<number, number, Config>(
  "favorites/remove",
  async (id, { rejectWithValue }) => {
    try {
      await favoritesApi.remove(id);
      return id;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);
