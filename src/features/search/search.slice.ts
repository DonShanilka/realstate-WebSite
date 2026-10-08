import { createSlice } from "@reduxjs/toolkit";
import { runNaturalSearch, runSearch } from "./search.thunks";
import type { SearchState } from "./search.types";

const initialState: SearchState = { result: null, status: "idle", error: null };

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch(s) {
      s.result = null;
      s.status = "idle";
      s.error = null;
    },
    setSearchError(s, a: { payload: string }) {
      s.status = "failed";
      s.error = a.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(runSearch.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(runSearch.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.result = a.payload;
      })
      .addCase(runSearch.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Search failed";
      });
    b.addCase(runNaturalSearch.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(runNaturalSearch.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.result = a.payload;
      })
      .addCase(runNaturalSearch.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Search failed";
      });
  },
});

export const { clearSearch, setSearchError } = slice.actions;
export default slice.reducer;
