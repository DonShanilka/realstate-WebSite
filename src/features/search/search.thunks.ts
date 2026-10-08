import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchApi } from "./search.api";
import type { NaturalSearchResult, SearchFilters, SearchResult } from "../../types";
export const runSearch = createAsyncThunk<SearchResult, SearchFilters, { rejectValue: string }>("search/filters", async (filters, { rejectWithValue }) => { try { return await searchApi.filters(filters); } catch (e) { return rejectWithValue((e as Error).message); } });
export const runNaturalSearch = createAsyncThunk<NaturalSearchResult, string, { rejectValue: string }>("search/natural", async (query, { rejectWithValue }) => { try { return await searchApi.natural(query); } catch (e) { return rejectWithValue((e as Error).message); } });
