import { createAsyncThunk } from "@reduxjs/toolkit";
import { propertyApi } from "./property.api";
import type { Property } from "../../types";

type ThunkConfig = { rejectValue: string };

export const fetchProperties = createAsyncThunk<Property[], void, { state: { properties: { status: string } }; rejectValue: string }>(
  "properties/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await propertyApi.list();
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
  { condition: (_, { getState }) => getState().properties.status !== "loading" },
);

export const fetchProperty = createAsyncThunk<Property, number, ThunkConfig>(
  "properties/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await propertyApi.get(id);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);
