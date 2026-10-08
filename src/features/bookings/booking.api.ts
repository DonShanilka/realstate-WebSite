import { jsonBody, request } from "../../api/client";
import type { Booking } from "./booking.types";
export const bookingApi = { mine: () => request<Booking[]>("/bookings/my"), create: (id: number, dates: { check_in: string; check_out: string }) => request<Booking>(`/bookings/${id}`, { method: "POST", ...jsonBody(dates) }), updateStatus: (id: number, status: string) => request<Booking>(`/bookings/${id}`, { method: "PUT", ...jsonBody({ status }) }), cancel: (id: number) => request<void>(`/bookings/${id}`, { method: "DELETE" }) };
