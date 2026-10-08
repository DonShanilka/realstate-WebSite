import type {
  PriceModelStatus,
  PricePrediction,
  PricePredictionRequest,
} from "../../types";

export type { PriceModelStatus, PricePrediction, PricePredictionRequest };

export interface PredictionState {
  model: PriceModelStatus | null;
  result: PricePrediction | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
