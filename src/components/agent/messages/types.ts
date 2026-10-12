import type { FormEvent } from "react";

/**
 * Message returned by the backend.
 */
export interface AgentChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  property_id: number;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

/**
 * The latest message may be returned as either a string
 * or a message object by different API responses.
 */
export type AgentLastMessage = string | AgentChatMessage | null;

/**
 * A conversation shown in the agent inbox.
 */
export interface AgentConversationItem {
  property_id: number;
  property_title: string;
  buyer_id: number;
  buyer_name: string;
  buyer_email?: string;
  last_message: AgentLastMessage;
  last_message_at?: string;
  unread_count: number;
}

/**
 * Props passed to the inbox item.
 */
export interface AgentInboxItemProps {
  conversation: AgentConversationItem;
  selected: boolean;
  onSelect: (conversation: AgentConversationItem) => void;
}

/**
 * Props passed to the inbox.
 */
export interface AgentInboxProps {
  conversations: AgentConversationItem[];
  selectedConversation: AgentConversationItem | null;
  loading?: boolean;
  onSelect: (conversation: AgentConversationItem) => void;
}

/**
 * Props passed to the conversation view.
 */
export interface AgentConversationProps {
  conversation: AgentConversationItem;
  messages: AgentChatMessage[];
  currentUserId: number | null;
  draft: string;
  threadLoading?: boolean;
  sending?: boolean;
  onDraftChange: (value: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * Props passed to the messages page UI.
 */
export interface AgentMessagesUIProps {
  conversations: AgentConversationItem[];
  selectedConversation: AgentConversationItem | null;
  messages: AgentChatMessage[];
  currentUserId: number | null;
  draft: string;
  loading?: boolean;
  threadLoading?: boolean;
  sending?: boolean;
  error?: string;
  onSelectConversation: (conversation: AgentConversationItem) => void;
  onDraftChange: (value: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
  onClearError?: () => void;
}
