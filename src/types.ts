export interface Property {
  id: number;
  title: string;
  description: string | null;
  price: number;
  property_type: string | null;
  status: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_size: number | null;
  address: string | null;
  city: string | null;
  district: string | null;
  country: string | null;
  image_url: string | null;
  video_url?: string | null;
  owner_id?: number | null;
  agent_id?: number | null;
}

export interface SearchFilters {
  keyword?: string;
  city?: string;
  district?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  sort?: "latest" | "price_asc" | "price_desc";
}

export interface SearchResult {
  total: number;
  page: number;
  limit: number;
  data: Property[];
}

export interface NaturalSearchResult {
  message: string;
  parsed_filters: Record<string, string | number | string[]>;
  total: number;
  data: Property[];
  matched_filters?: string[];
  relaxed_filters?: string[];
  unverified_features?: string[];
}

export interface AssistantProperty {
  id: number;
  title: string;
  price: number;
  city: string | null;
  district: string | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  image_url: string | null;
  reasons: string[];
  caveats: string[];
}

export interface AssistantResponse {
  answer: string;
  recommendation: AssistantProperty | null;
  alternatives: AssistantProperty[];
  retrieved_count: number;
}

export interface PricePredictionRequest {
  city: string;
  district?: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  house_area_sqft?: number;
  land_area_perches?: number;
}

export interface PricePrediction {
  estimated_price_million: number;
  expected_range_million: { low: number; high: number };
  display: { estimated_market_price: string; expected_range: string };
  range_coverage: number;
  validation_mae_million: number;
  validation_r2: number | null;
  training_rows: number;
  features_used: string[];
  limitations: string[];
}

export interface PriceModelStatus {
  ready: boolean;
  usable_training_records: number;
  minimum_training_records: number;
}
