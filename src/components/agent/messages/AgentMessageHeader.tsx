import type { AgentConversationItem } from "./types";

interface AgentMessageHeaderProps {
  conversation: AgentConversationItem;
}

export default function AgentMessageHeader({
  conversation,
}: AgentMessageHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
        {(conversation.buyer_name || "B").charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-slate-900">
          {conversation.buyer_name || "Buyer"}
        </h2>
        <p className="truncate text-xs text-slate-500">
          {conversation.buyer_email || "Buyer conversation"}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <p className="truncate text-xs text-slate-600">
            {conversation.property_title || "Property"}
          </p>
        </div>
      </div>
    </header>
  );
}
