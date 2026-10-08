import { API_BASE_URL } from "../../api/client";
import { tokenStorage } from "../../utils/storage";

export function createMessageSocket(): WebSocket {
  const url = new URL("/ws", API_BASE_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

  const token = tokenStorage.get();
  if (!token) throw new Error("Sign in before connecting to messaging.");
  url.searchParams.set("token", token);

  return new WebSocket(url);
}
