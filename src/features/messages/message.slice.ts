import { createSlice } from "@reduxjs/toolkit";
import { fetchConversation, fetchMyMessages, sendMessage } from "./message.thunks";
import type { MessagesState } from "./message.types";
import { loggedOut } from "../auth/auth.slice";

const initialState: MessagesState = {
  conversations: {},
  inbox: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearConversations(s) {
      s.conversations = {};
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loggedOut, (s) => { s.conversations = {}; s.inbox = []; s.status = "idle"; s.error = null; });
    b.addCase(fetchConversation.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchConversation.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.conversations[a.payload.userId] = a.payload.messages;
      })
      .addCase(fetchConversation.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load messages";
      });
    b.addCase(sendMessage.fulfilled, (s, a) => {
      const conversation = s.conversations[a.meta.arg.receiver_id] ??= [];
      if (!conversation.some((item) => item.id === a.payload.id)) conversation.push(a.payload);
      s.inbox.unshift(a.payload);
    });
    b.addCase(fetchMyMessages.fulfilled, (s, a) => { s.inbox = a.payload; });
  },
});

export const { clearConversations } = slice.actions;
export default slice.reducer;
