import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile, updateProfile } from "./profile.thunks";
import type { ProfileState } from "./profile.types";
import { loggedOut } from "../auth/auth.slice";

const initialState: ProfileState = { user: null, status: "idle", error: null };

const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(s) {
      s.user = null;
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loggedOut, (s) => { s.user = null; s.status = "idle"; s.error = null; });
    b.addCase(fetchProfile.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload;
      })
      .addCase(fetchProfile.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load profile";
      });
    b.addCase(updateProfile.fulfilled, (s, a) => {
      s.user = a.payload;
    }).addCase(updateProfile.rejected, (s, a) => {
      s.error = a.payload ?? "Could not update profile";
    });
  },
});

export const { clearProfile } = slice.actions;
export default slice.reducer;
