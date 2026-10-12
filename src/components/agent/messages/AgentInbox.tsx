import AgentInboxItem from "./AgentInboxItem";
import type { AgentConversationItem } from "./types";

interface AgentInboxProps {
  conversations: AgentConversationItem[];
  selectedConversation: AgentConversationItem | null;
  loading: boolean;
  onSelect: (conversation: AgentConversationItem) => void;
}

export default function AgentInbox({
  conversations,
  selectedConversation,
  loading,
  onSelect,
}: AgentInboxProps) {
  return (
    <aside className="flex min-h-0 flex-col border-b border-slate-200 md:border-b-0 md:border-r">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Inbox</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {conversations.length} chats
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">Messages from your buyers</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex animate-pulse gap-3">
                <div className="h-11 w-11 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">
              ✉
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No conversations yet
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Messages from buyers will appear here.
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <AgentInboxItem
              key={`${conversation.property_id}:${conversation.buyer_id}`}
              conversation={conversation}
              active={
                Number(selectedConversation?.property_id) ===
                  Number(conversation.property_id) &&
                Number(selectedConversation?.buyer_id) ===
                  Number(conversation.buyer_id)
              }
              onClick={() => onSelect(conversation)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
