export interface Booking { id: number; property_id: number; user_id?: number; check_in: string; check_out: string; status: string; property?: import("../../types").Property }
export interface BookingState { items: Booking[]; status: "idle" | "loading" | "succeeded" | "failed"; error: string | null }
