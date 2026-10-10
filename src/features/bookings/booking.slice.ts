import { createSlice } from "@reduxjs/toolkit";
import {
  cancelBooking,
  createBooking,
  fetchBookings,
  fetchAgentBookings,
  updateBookingStatus,
} from "./booking.thunks";
import type { BookingState } from "./booking.types";
import { loggedOut } from "../auth/auth.slice";

const initialState: BookingState = {
  items: [],
  agentItems: [],
  status: "idle",
  error: null,
  agentStatus: "idle",
  agentError: null,
};

const slice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookings(s) {
      s.items = [];
      s.agentItems = [];
      s.status = "idle";
      s.error = null;
      s.agentStatus = "idle";
      s.agentError = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loggedOut, (s) => {
      s.items = [];
      s.agentItems = [];
      s.status = "idle";
      s.error = null;
      s.agentStatus = "idle";
      s.agentError = null;
    });
    b.addCase(fetchAgentBookings.pending, (s) => {
      s.agentStatus = "loading";
      s.agentError = null;
    })
      .addCase(fetchAgentBookings.fulfilled, (s, a) => {
        s.agentStatus = "succeeded";
        s.agentItems = a.payload;
      })
      .addCase(fetchAgentBookings.rejected, (s, a) => {
        s.agentStatus = "failed";
        s.agentError = a.payload ?? "Could not load agent viewings";
      });
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
    b.addCase(createBooking.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(createBooking.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items.unshift(a.payload);
      })
      .addCase(createBooking.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not create booking";
      });
    b.addCase(updateBookingStatus.fulfilled, (s, a) => {
      s.items = s.items.map((item) =>
        item.id === a.payload.id ? { ...item, ...a.payload } : item,
      );
      s.agentItems = s.agentItems.map((item) =>
        item.id === a.payload.id ? { ...item, ...a.payload } : item,
      );
    }).addCase(cancelBooking.fulfilled, (s, a) => {
      s.items = s.items.filter((item) => item.id !== a.payload);
    });
  },
});

export const { clearBookings } = slice.actions;
export default slice.reducer;
