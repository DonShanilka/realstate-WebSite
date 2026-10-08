import type { User } from "../auth/auth.types";

export interface ProfileState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
