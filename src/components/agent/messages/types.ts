export interface AgentConversationItem {
  property_id: number;
  property_title: string;
  buyer_id: number;
  buyer_name: string;
  buyer_email?: string;
  last_message: string;
  last_message_at?: string;
  unread_count: number;
}

export interface AgentChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  property_id: number;
  message: string;
  created_at?: string;
}

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

  onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
}
