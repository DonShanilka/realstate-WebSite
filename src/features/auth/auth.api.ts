import { jsonBody, request } from "../../api/client";
import { tokenStorage, readTokenUser } from "../../utils/storage";
import type {
  AuthToken,
  LoginCredentials,
  RegisterPayload,
  User,
} from "./auth.types";

export const authApi = {
  login: async (body: LoginCredentials) => {
    const result = await request<AuthToken>("/auth/login", { method: "POST", ...jsonBody(body) });
    tokenStorage.set(result.access_token);
    const identity = readTokenUser(result.access_token);
    if (identity.id) {
      try { return { ...result, user: await request<User>(`/users/${identity.id}`) }; }
      catch { return { ...result, user: null }; }
    }
    return { ...result, user: null };
  },
  register: (body: RegisterPayload) =>
    request<{ message: string }>("/auth/register", {
      method: "POST",
      ...jsonBody(body),
    }),
  me: (id: number) => request<User>(`/users/${id}`),
  updateProfile: (
    id: number,
    body: Partial<Pick<User, "full_name" | "phone" | "profile_image">>,
  ) => request<User>(`/users/${id}`, { method: "PUT", ...jsonBody(body) }),
};
