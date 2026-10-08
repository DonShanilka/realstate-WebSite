import { createAsyncThunk } from "@reduxjs/toolkit";
import { messageApi } from "./message.api";
import type { Message } from "./message.types";

type Config = { rejectValue: string };

export const fetchConversation = createAsyncThunk<
  { userId: number; messages: Message[] },
  number,
  Config
>("messages/conversation", async (userId, { rejectWithValue }) => {
  try {
    return { userId, messages: await messageApi.conversation(userId) };
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const fetchMyMessages = createAsyncThunk<Message[], void, Config>(
  "messages/inbox",
  async (_, { rejectWithValue }) => {
    try { return await messageApi.mine(); }
    catch (e) { return rejectWithValue((e as Error).message); }
  },
);

export const sendMessage = createAsyncThunk<
  Message,
  { receiver_id: number; property_id?: number; message: string },
  Config
>("messages/send", async (body, { rejectWithValue }) => {
  try {
    return await messageApi.send(body);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});
