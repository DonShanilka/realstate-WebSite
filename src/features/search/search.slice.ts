import { createSlice } from "@reduxjs/toolkit";
import { runNaturalSearch, runSearch } from "./search.thunks";
import type { SearchState } from "./search.types";
const initialState: SearchState = { result: null, status: "idle", error: null };
const slice = createSlice({ name: "search", initialState, reducers: { clearSearch(s) { s.result = null; s.status = "idle"; s.error = null; }, setSearchError(s, a: { payload: string }) { s.status = "failed"; s.error = a.payload; } }, extraReducers: (b) => { for (const thunk of [runSearch, runNaturalSearch]) b.addCase(thunk.pending, (s) => { s.status = "loading"; s.error = null; }).addCase(thunk.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Search failed"; }); b.addCase(runSearch.fulfilled, (s, a) => { s.status = "succeeded"; s.result = a.payload; }).addCase(runNaturalSearch.fulfilled, (s, a) => { s.status = "succeeded"; s.result = a.payload; }); } });
export const { clearSearch, setSearchError } = slice.actions;
export default slice.reducer;
