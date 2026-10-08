import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { predictionApi } from "./prediction.api";
import type { PredictionState } from "./prediction.types";
import type {
  PriceModelStatus,
  PricePrediction,
  PricePredictionRequest,
} from "../../types";

type ThunkConfig = { rejectValue: string };

export const fetchPredictionStatus = createAsyncThunk<
  PriceModelStatus,
  void,
  ThunkConfig
>("prediction/status", async (_, { rejectWithValue }) => {
  try {
    return await predictionApi.status();
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const predictPrice = createAsyncThunk<
  PricePrediction,
  PricePredictionRequest,
  ThunkConfig
>("prediction/predict", async (body, { rejectWithValue }) => {
  try {
    return await predictionApi.predict(body);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

const initialState: PredictionState = {
  model: null,
  result: null,
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    clearPrediction(s) {
      s.result = null;
      s.error = null;
      s.status = "idle";
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchPredictionStatus.fulfilled, (s, a) => {
      s.model = a.payload;
    })
      .addCase(predictPrice.pending, (s) => {
        s.status = "loading";
        s.error = null;
        s.result = null;
      })
      .addCase(predictPrice.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.result = a.payload;
      })
      .addCase(predictPrice.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Price estimate failed";
      });
  },
});

export const { clearPrediction } = slice.actions;
export default slice.reducer;
