import { createSlice } from "@reduxjs/toolkit";
import {
  cancelBooking,
  createBooking,
  fetchBookings,
  updateBookingStatus,
} from "./booking.thunks";
import type { BookingState } from "./booking.types";
import { loggedOut } from "../auth/auth.slice";

const initialState: BookingState = { items: [], status: "idle", error: null };

const slice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookings(s) {
      s.items = [];
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loggedOut, (s) => { s.items = []; s.status = "idle"; s.error = null; });
    b.addCase(fetchBookings.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchBookings.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchBookings.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load bookings";
      });
    b.addCase(createBooking.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(createBooking.fulfilled, (s, a) => { s.status = "succeeded"; s.items.unshift(a.payload); })
      .addCase(createBooking.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Could not create booking"; });
    b.addCase(updateBookingStatus.fulfilled, (s, a) => {
        s.items = s.items.map((item) =>
          item.id === a.payload.id ? a.payload : item,
        );
      })
      .addCase(cancelBooking.fulfilled, (s, a) => {
        s.items = s.items.filter((item) => item.id !== a.payload);
      });
  },
});

export const { clearBookings } = slice.actions;
export default slice.reducer;
