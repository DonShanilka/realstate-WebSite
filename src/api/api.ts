import type {
  AssistantResponse,
  NaturalSearchResult,
  PriceModelStatus,
  PricePrediction,
  PricePredictionRequest,
  Property,
  SearchFilters,
  SearchResult,
} from "../types";

import { jsonBody, request } from "./client";
export { ApiError } from "./client";

const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", ...jsonBody(body) });

export const api = {
  async listProperties(): Promise<Property[]> {
    const result = await request<{ data: Property[] }>("/properties/getAllProperty");
    return result.data;
  },

  search(filters: SearchFilters): Promise<SearchResult> {
    const params = new URLSearchParams({ limit: "24" });
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== "") params.set(key, String(value));
    }
    return request<SearchResult>(`/search/?${params}`);
  },

  naturalSearch: (query: string) => post<NaturalSearchResult>("/search/natural", { query }),
  askAssistant: (question: string) => post<AssistantResponse>("/assistant/property", { question }),
  predictPrice: (payload: PricePredictionRequest) => post<PricePrediction>("/price-prediction/predict", payload),
  priceModelStatus: () => request<PriceModelStatus>("/price-prediction/status"),
};
