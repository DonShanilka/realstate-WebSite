import { createAsyncThunk } from "@reduxjs/toolkit";
import { propertyApi } from "./property.api";
import type { Property } from "../../types";

type ThunkConfig = { rejectValue: string };

export const fetchProperties = createAsyncThunk<Property[], void, ThunkConfig>(
  "properties/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await propertyApi.list();
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
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
