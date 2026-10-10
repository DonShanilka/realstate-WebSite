import { jsonBody, request } from "../../api/client";
import type { Message } from "./message.types";

export interface AgentInboxConversation {
  property_id: number;
  property_title: string;
  buyer_id: number;
  buyer_name: string;
  buyer_email: string;
  last_message: string;
  last_message_at?: string;
  unread_count: number;
}

export const messageApi = {
  mine: () => request<Message[]>("/chat/my"),
  conversation: (userId: number) =>
    request<Message[]>(`/chat/conversation/${userId}`),
  propertyConversation: (propertyId: number, userId: number) =>
    request<Message[]>(`/chat/property/${propertyId}/conversation/${userId}`),
  markPropertyConversationRead: (propertyId: number, userId: number) =>
    request<{ updated: number }>(
      `/chat/property/${propertyId}/conversation/${userId}/read`,
      { method: "POST" },
    ),
  agentInbox: () => request<AgentInboxConversation[]>("/chat/agent/inbox"),
  send: (body: {
    receiver_id: number;
    property_id?: number;
    message: string;
  }) => request<Message>("/chat/send", { method: "POST", ...jsonBody(body) }),
};
