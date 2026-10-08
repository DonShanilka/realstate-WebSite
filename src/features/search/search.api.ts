import { jsonBody, request } from "../../api/client";
import type {
  NaturalSearchResult,
  SearchFilters,
  SearchResult,
} from "../../types";

export const searchApi = {
  filters(filters: SearchFilters) {
    const params = new URLSearchParams({ limit: "24" });
    for (const [key, value] of Object.entries(filters))
      if (value !== undefined && value !== "") params.set(key, String(value));
    return request<SearchResult>(`/search/?${params}`);
  },
  natural: (query: string) =>
    request<NaturalSearchResult>("/search/natural", {
      method: "POST",
      ...jsonBody({ query }),
    }),
};
