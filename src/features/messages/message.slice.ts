import { createSlice } from "@reduxjs/toolkit";
import { fetchConversation, sendMessage } from "./message.thunks";
import type { MessagesState } from "./message.types";
const initialState: MessagesState = { conversations: {}, status: "idle", error: null };
const slice = createSlice({ name: "messages", initialState, reducers: {}, extraReducers: (b) => { b.addCase(fetchConversation.pending, (s) => { s.status = "loading"; s.error = null; }).addCase(fetchConversation.fulfilled, (s, a) => { s.status = "succeeded"; s.conversations[a.payload.userId] = a.payload.messages; }).addCase(fetchConversation.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Could not load messages"; }).addCase(sendMessage.fulfilled, (s, a) => { const id = a.payload.receiver_id; (s.conversations[id] ??= []).push(a.payload); }); } });
export default slice.reducer;
