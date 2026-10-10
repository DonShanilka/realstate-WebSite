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

export const fetchAssignedProperties = createAsyncThunk<Property[], void, ThunkConfig>(
  "properties/fetchAssigned",
  async (_, { rejectWithValue }) => {
    try { return await propertyApi.assignedToMe(); }
    catch (e) { return rejectWithValue((e as Error).message); }
  },
);

export const assignPropertyAgent = createAsyncThunk<
  Property,
  { propertyId: number; agentId: number | null },
  ThunkConfig
>("properties/assignAgent", async (assignment, { rejectWithValue }) => {
  try { return await propertyApi.assignAgent(assignment.propertyId, assignment.agentId); }
  catch (e) { return rejectWithValue((e as Error).message); }
});
