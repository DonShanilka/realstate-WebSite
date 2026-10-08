import { jsonBody, request } from "../../api/client";
import type { PriceModelStatus, PricePrediction, PricePredictionRequest } from "../../types";
export const predictionApi = { status: () => request<PriceModelStatus>("/price-prediction/status"), predict: (body: PricePredictionRequest) => request<PricePrediction>("/price-prediction/predict", { method: "POST", ...jsonBody(body) }) };
