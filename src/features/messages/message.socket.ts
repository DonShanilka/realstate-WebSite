import { API_BASE_URL } from "../../api/client";
import { tokenStorage } from "../../utils/storage";
export function createMessageSocket(path = "/chat/ws"): WebSocket {
  const url = new URL(path, API_BASE_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  const token = tokenStorage.get();
  if (token) url.searchParams.set("token", token);
  return new WebSocket(url);
}
