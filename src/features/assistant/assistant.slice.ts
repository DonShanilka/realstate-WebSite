import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { assistantApi } from "./assistant.api";
import type { AssistantState } from "./assistant.types";

export const askAssistant = createAsyncThunk<
  { question: string; response: Awaited<ReturnType<typeof assistantApi.ask>> },
  string,
  { rejectValue: string }
>("assistant/ask", async (question, { rejectWithValue }) => {
  try {
    return { question, response: await assistantApi.ask(question) };
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

const initialState: AssistantState = { turns: [], status: "idle", error: null };

const slice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    clearAssistant(s) {
      s.turns = [];
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(askAssistant.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(askAssistant.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.turns.push(a.payload);
      })
      .addCase(askAssistant.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Assistant request failed";
      });
  },
});

export const { clearAssistant } = slice.actions;
export default slice.reducer;
