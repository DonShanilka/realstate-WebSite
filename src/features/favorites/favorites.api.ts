import { request } from "../../api/client";
import type { Favorite } from "./favorites.types";
export const favoritesApi = { list: () => request<Favorite[]>("/favorites/"), add: (id: number) => request<Favorite>(`/favorites/${id}`, { method: "POST" }), remove: (id: number) => request<void>(`/favorites/${id}`, { method: "DELETE" }) };
