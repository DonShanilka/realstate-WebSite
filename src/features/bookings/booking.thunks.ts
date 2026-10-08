import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingApi } from "./booking.api";
import type { Booking } from "./booking.types";
export const fetchBookings = createAsyncThunk<Booking[], void, { rejectValue: string }>("bookings/list", async (_, { rejectWithValue }) => { try { return await bookingApi.mine(); } catch (e) { return rejectWithValue((e as Error).message); } });
export const createBooking = createAsyncThunk<Booking, { propertyId: number; check_in: string; check_out: string }, { rejectValue: string }>("bookings/create", async ({ propertyId, ...dates }, { rejectWithValue }) => { try { return await bookingApi.create(propertyId, dates); } catch (e) { return rejectWithValue((e as Error).message); } });
export const cancelBooking = createAsyncThunk<number, number, { rejectValue: string }>("bookings/cancel", async (id, { rejectWithValue }) => { try { await bookingApi.cancel(id); return id; } catch (e) { return rejectWithValue((e as Error).message); } });
