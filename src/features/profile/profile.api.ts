import { jsonBody, request } from "../../api/client";
import type { User } from "../auth/auth.types";

export const profileApi = {
  get: (id: number) => request<User>(`/users/${id}`),
  update: async (
    id: number,
    changes: Partial<Pick<User, "full_name" | "phone" | "profile_image">>,
  ) =>
    (
      await request<{ message: string; data: User }>(`/users/${id}`, {
        method: "PUT",
        ...jsonBody(changes),
      })
    ).data,
};
