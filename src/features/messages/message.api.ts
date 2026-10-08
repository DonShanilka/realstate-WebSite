import { jsonBody, request } from "../../api/client";
import type { Message } from "./message.types";

export const messageApi = {
  mine: () => request<Message[]>("/chat/my"),
  conversation: (userId: number) =>
    request<Message[]>(`/chat/conversation/${userId}`),
  send: (body: {
    receiver_id: number;
    property_id?: number;
    message: string;
  }) => request<Message>("/chat/send", { method: "POST", ...jsonBody(body) }),
};
