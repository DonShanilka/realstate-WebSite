import type { Property } from "../../types";

export interface Booking {
  id: number;
  property_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  status: string;
  total_price?: number;
  created_at?: string;
  buyer?: { id: number; full_name: string; email: string; phone?: string | null };
  property?: Property;
}

export interface BookingState {
  items: Booking[];
  agentItems: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  agentStatus: "idle" | "loading" | "succeeded" | "failed";
  agentError: string | null;
}
