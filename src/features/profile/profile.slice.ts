import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile, updateProfile } from "./profile.thunks";
import type { ProfileState } from "./profile.types";
const initialState: ProfileState = { user: null, status: "idle", error: null };
const slice = createSlice({ name: "profile", initialState, reducers: {}, extraReducers: (b) => { b.addCase(fetchProfile.pending, (s) => { s.status = "loading"; s.error = null; }).addCase(fetchProfile.fulfilled, (s, a) => { s.status = "succeeded"; s.user = a.payload; }).addCase(fetchProfile.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Could not load profile"; }).addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload; }); } });
export default slice.reducer;
