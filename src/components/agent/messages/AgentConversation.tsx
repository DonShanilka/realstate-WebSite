import AgentMessageHeader from "./AgentMessageHeader";
import AgentMessageBubble from "./AgentMessageBubble";
import AgentMessageInput from "./AgentMessageInput";

import type { AgentChatMessage, AgentConversationItem } from "./types";

import type { FormEvent } from "react";

interface AgentConversationProps {
  conversation: AgentConversationItem;
  messages: AgentChatMessage[];
  currentUserId: number | null;
  draft: string;
  threadLoading: boolean;
  sending: boolean;
  onDraftChange: (value: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AgentConversation({
  conversation,
  messages,
  currentUserId,
  draft,
  threadLoading,
  sending,
  onDraftChange,
  onSendMessage,
}: AgentConversationProps) {
  return (
    <section className="flex min-h-[560px] min-w-0 flex-col bg-slate-50">
      <AgentMessageHeader conversation={conversation} />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
        {threadLoading ? (
          <div className="m-auto space-y-4">
            <div className="h-12 w-56 animate-pulse rounded-2xl bg-slate-200" />
            <div className="ml-12 h-12 w-64 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-16 w-48 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        ) : messages.length === 0 ? (
          <div className="m-auto max-w-xs px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
              💬
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Start a conversation
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Send a message to discuss this property with the buyer.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <AgentMessageBubble
              key={message.id}
              message={message}
              isOwnMessage={Number(message.sender_id) === Number(currentUserId)}
            />
          ))
        )}
      </div>

      <AgentMessageInput
        value={draft}
        sending={sending}
        onChange={onDraftChange}
        onSubmit={onSendMessage}
      />
    </section>
  );
}
