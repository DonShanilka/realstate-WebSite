import type { AgentChatMessage } from "./types";

interface AgentMessageBubbleProps {
  message: AgentChatMessage;
  isOwnMessage: boolean;
}

export default function AgentMessageBubble({
  message,
  isOwnMessage,
}: AgentMessageBubbleProps) {
  return (
    <div
      className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          isOwnMessage
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.message}
        </p>
        {message.created_at && (
          <p
            className={`mt-1.5 text-right text-[10px] ${
              isOwnMessage ? "text-blue-100" : "text-slate-400"
            }`}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
