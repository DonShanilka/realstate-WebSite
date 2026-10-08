import type { Property } from "../../types";

export interface Favorite {
  id: number;
  user_id: number;
  property_id: number;
  property?: Property;
  created_at?: string;
}

export interface FavoritesState {
  items: Favorite[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
