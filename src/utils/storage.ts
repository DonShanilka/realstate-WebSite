const TOKEN_KEY = "estateai_access_token";

export const tokenStorage = {
  get: () => (typeof localStorage === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export function readTokenUser(token: string | null): { id: number | null; role: string | null } {
  if (!token) return { id: null, role: null };
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return { id: Number(payload.user_id) || null, role: payload.role ?? null };
  } catch {
    return { id: null, role: null };
  }
}
