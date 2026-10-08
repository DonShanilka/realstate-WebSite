import type { Property } from "../../types";

export type { Property };

export interface PropertyState {
  items: Property[];
  selected: Property | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
