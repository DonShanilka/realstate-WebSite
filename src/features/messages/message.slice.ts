import { createSlice } from "@reduxjs/toolkit";
import {
  fetchConversation,
  fetchMyMessages,
  fetchPropertyConversation,
  sendMessage,
} from "./message.thunks";
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
    b.addCase(loggedOut, (s) => {
      s.conversations = {};
      s.inbox = [];
      s.status = "idle";
      s.error = null;
    });
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
    b.addCase(fetchPropertyConversation.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchPropertyConversation.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.conversations[a.payload.key] = a.payload.messages;
      })
      .addCase(fetchPropertyConversation.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load this property conversation";
      });
    b.addCase(sendMessage.fulfilled, (s, a) => {
      s.status = "succeeded";
      const key = a.meta.arg.property_id
        ? `${a.meta.arg.property_id}:${a.meta.arg.receiver_id}`
        : String(a.meta.arg.receiver_id);
      const conversation = (s.conversations[key] ??= []);
      if (!conversation.some((item) => item.id === a.payload.id))
        conversation.push(a.payload);
      s.inbox.unshift(a.payload);
    })
      .addCase(sendMessage.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(sendMessage.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not send message";
      });
    b.addCase(fetchMyMessages.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchMyMessages.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.inbox = a.payload;
      })
      .addCase(fetchMyMessages.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load messages";
      });
  },
});

export const { clearConversations } = slice.actions;
export default slice.reducer;
