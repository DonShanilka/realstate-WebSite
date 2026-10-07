import type {
  AssistantResponse,
  NaturalSearchResult,
  PriceModelStatus,
  PricePrediction,
  PricePredictionRequest,
  Property,
  SearchFilters,
  SearchResult,
} from "./types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://127.0.0.1:8000";

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Make sure the backend is running on " + BASE_URL + ".");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : detail?.message ?? (Array.isArray(detail) ? "Please check the highlighted fields." : "Something went wrong.");
    throw new ApiError(message);
  }
  return response.json() as Promise<T>;
}

const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });

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
