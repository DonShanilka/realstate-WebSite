import { tokenStorage } from "../utils/storage";

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://127.0.0.1:8000";
export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) { super(message); this.name = "ApiError"; }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = tokenStorage.get();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try { response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers }); }
  catch { throw new ApiError(`Cannot reach the server. Make sure the backend is running on ${API_BASE_URL}.`); }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.detail;
    const message = typeof detail === "string" ? detail : detail?.message ?? (Array.isArray(detail) ? "Please check the submitted fields." : `Request failed (${response.status}).`);
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export const jsonBody = (body: unknown): Pick<RequestInit, "headers" | "body"> => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
