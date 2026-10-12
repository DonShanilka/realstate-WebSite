import type { AgentConversationItem, AgentInboxItemProps } from "./types";

function getLastMessageText(
  lastMessage: AgentConversationItem["last_message"],
): string {
  if (typeof lastMessage === "string") {
    return lastMessage;
  }

  if (
    lastMessage &&
    typeof lastMessage === "object" &&
    typeof lastMessage.message === "string"
  ) {
    return lastMessage.message;
  }

  return "No messages yet";
}

function formatTime(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AgentInboxItem({
  conversation,
  selected,
  onSelect,
}: AgentInboxItemProps) {
  const lastMessageText = getLastMessageText(conversation.last_message);

  const unreadCount = Math.max(0, conversation.unread_count ?? 0);

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      aria-pressed={selected}
      className={`w-full border-b border-slate-100 px-4 py-4 text-left transition-colors ${
        selected ? "bg-blue-50" : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Buyer avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {conversation.buyer_name?.charAt(0).toUpperCase() || "B"}
        </div>

        <div className="min-w-0 flex-1">
          {/* Property title + buyer name + time */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              {/* <p
                className="shrink min-w-0 truncate text-xs font-medium text-slate-600"
                title={conversation.property_title || "Property"}
              >
                {conversation.property_title || "Property"}
              </p> */}

              {/* <span className="shrink-0 text-xs text-slate-400">·</span> */}

              <h3
                className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900"
                title={conversation.buyer_name || "Unknown buyer"}
              >
                {conversation.buyer_name || "Unknown buyer"}
              </h3>
            </div>

            <span className="shrink-0 text-xs text-slate-400">
              {formatTime(conversation.last_message_at)}
            </span>
          </div>

          {/* Last message + unread count */}
          <div className=" flex items-center justify-between gap-2">
            <p className="min-w-0 flex-1 truncate text-sm text-slate-500">
              {lastMessageText}
            </p>

            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}