import type {
  NaturalSearchResult,
  SearchFilters,
  SearchResult,
} from "../../types";

export type { NaturalSearchResult, SearchFilters, SearchResult };

export interface SearchState {
  result: SearchResult | NaturalSearchResult | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
