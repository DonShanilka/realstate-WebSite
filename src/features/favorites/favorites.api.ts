import { request } from "../../api/client";
import type { Favorite } from "./favorites.types";

export const favoritesApi = {
  list: () => request<Favorite[]>("/favorites/"),
  add: (propertyId: number) =>
    request<Favorite | { message: string }>(`/favorites/${propertyId}`, { method: "POST" }),
  remove: (propertyId: number) =>
    request<{ message: string }>(`/favorites/${propertyId}`, { method: "DELETE" }),
};
