import { createSlice } from "@reduxjs/toolkit";
import { fetchProperties, fetchProperty } from "./property.thunks";
import type { PropertyState } from "./property.types";
const initialState: PropertyState = { items: [], selected: null, status: "idle", error: null };
const slice = createSlice({ name: "properties", initialState, reducers: { clearSelectedProperty(s) { s.selected = null; } }, extraReducers: (b) => {
 b.addCase(fetchProperties.pending, (s) => { s.status = "loading"; s.error = null; }).addCase(fetchProperties.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; }).addCase(fetchProperties.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Could not load properties"; });
 b.addCase(fetchProperty.fulfilled, (s, a) => { s.selected = a.payload; });
} });
export const { clearSelectedProperty } = slice.actions;
export default slice.reducer;
