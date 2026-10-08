import { createSlice } from "@reduxjs/toolkit";
import { fetchConversation, sendMessage } from "./message.thunks";
import type { MessagesState } from "./message.types";

const initialState: MessagesState = {
  conversations: {},
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
      for (const conversation of Object.values(s.conversations))
        if (
          conversation.some(
            (m) =>
              m.sender_id === a.payload.receiver_id ||
              m.receiver_id === a.payload.receiver_id,
          )
        )
          conversation.push(a.payload);
    });
  },
});

export const { clearConversations } = slice.actions;
export default slice.reducer;
