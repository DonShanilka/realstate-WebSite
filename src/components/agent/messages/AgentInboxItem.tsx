import type { AgentConversationItem } from "./types";

interface AgentInboxItemProps {
  conversation: AgentConversationItem;
  active: boolean;
  onClick: () => void;
}

export default function AgentInboxItem({
  conversation,
  active,
  onClick,
}: AgentInboxItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 ${
        active ? "bg-blue-50/70" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
          {(conversation.buyer_name || "B").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {conversation.buyer_name || "Buyer"}
            </h3>
            {conversation.unread_count > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                {conversation.unread_count > 99
                  ? "99+"
                  : conversation.unread_count}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            {conversation.property_title || "Property"}
          </p>
          <p className="mt-2 truncate text-sm text-slate-600">
            {conversation.last_message || "No messages yet"}
          </p>
        </div>
      </div>
    </button>
  );
}
