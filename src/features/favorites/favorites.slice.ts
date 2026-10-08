import { createSlice } from "@reduxjs/toolkit";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from "./favorites.thunks";
import type { FavoritesState } from "./favorites.types";

const initialState: FavoritesState = { items: [], status: "idle", error: null };

const slice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites(s) {
      s.items = [];
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchFavorites.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchFavorites.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchFavorites.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load favorites";
      });
    b.addCase(addFavorite.fulfilled, (s, a) => {
      if ("id" in a.payload && !s.items.some((x) => x.property_id === a.payload.property_id))
        s.items.push(a.payload);
    }).addCase(removeFavorite.fulfilled, (s, a) => {
      s.items = s.items.filter((x) => x.property_id !== a.payload);
    });
  },
});

export const { clearFavorites } = slice.actions;
export default slice.reducer;
