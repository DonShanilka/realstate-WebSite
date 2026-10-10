import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingApi } from "./booking.api";
import type { Booking } from "./booking.types";

type Config = { rejectValue: string };

export const fetchBookings = createAsyncThunk<Booking[], void, Config>(
  "bookings/list",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingApi.mine();
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const fetchAgentBookings = createAsyncThunk<Booking[], void, Config>(
  "bookings/agentList",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingApi.forAgent();
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const createBooking = createAsyncThunk<
  Booking,
  { propertyId: number; check_in: string; check_out: string },
  Config
>("bookings/create", async ({ propertyId, ...dates }, { rejectWithValue }) => {
  try {
    return await bookingApi.create(propertyId, dates);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const updateBookingStatus = createAsyncThunk<
  Booking,
  { id: number; status: string },
  Config
>("bookings/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await bookingApi.updateStatus(id, status);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const cancelBooking = createAsyncThunk<number, number, Config>(
  "bookings/cancel",
  async (id, { rejectWithValue }) => {
    try {
      await bookingApi.cancel(id);
      return id;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);
