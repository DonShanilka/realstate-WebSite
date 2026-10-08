import { createSlice } from "@reduxjs/toolkit";
import { cancelBooking, createBooking, fetchBookings } from "./booking.thunks";
import type { BookingState } from "./booking.types";
const initialState: BookingState = { items: [], status: "idle", error: null };
const slice = createSlice({ name: "bookings", initialState, reducers: {}, extraReducers: (b) => {
 b.addCase(fetchBookings.pending, (s) => { s.status = "loading"; s.error = null; }).addCase(fetchBookings.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; }).addCase(fetchBookings.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Could not load bookings"; });
 b.addCase(createBooking.fulfilled, (s, a) => { s.items.unshift(a.payload); }).addCase(cancelBooking.fulfilled, (s, a) => { s.items = s.items.filter((x) => x.id !== a.payload); });
} });
export default slice.reducer;
