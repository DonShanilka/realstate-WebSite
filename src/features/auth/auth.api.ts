import { jsonBody, request } from "../../api/client";
import type {
  AuthToken,
  LoginCredentials,
  RegisterPayload,
  User,
} from "./auth.types";

export const authApi = {
  login: (body: LoginCredentials) =>
    request<AuthToken>("/auth/login", { method: "POST", ...jsonBody(body) }),
  register: (body: RegisterPayload) =>
    request<{ message: string }>("/auth/register", {
      method: "POST",
      ...jsonBody(body),
    }),
  me: (id: number) => request<User>(`/users/${id}`),
  updateProfile: (
    id: number,
    body: Partial<Pick<User, "full_name" | "phone" | "profile_image">>,
  ) =>
    request<{ message: string; data: User }>(`/users/${id}`, {
      method: "PUT",
      ...jsonBody(body),
    }).then((result) => result.data),
};
