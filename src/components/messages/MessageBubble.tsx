import type { Message } from "../../features/messages/message.types";

interface MessageBubbleProps {
  message: Message;
  currentUserId: number;
}

export default function MessageBubble({
  message,
  currentUserId,
}: MessageBubbleProps) {
  const isMyMessage = Number(message.sender_id) === currentUserId;

  return (
    <div
      className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[88%] flex-col sm:max-w-[75%] ${
          isMyMessage ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`break-words px-4 py-3 text-sm leading-6 shadow-sm ${
            isMyMessage
              ? "rounded-2xl rounded-br-md bg-slate-900 text-white"
              : "rounded-2xl rounded-bl-md border border-slate-200 bg-white text-slate-800"
          }`}
        >
          {message.message}
        </div>

        <span className="mt-1.5 px-1 text-[10px] text-slate-400">
          {isMyMessage ? "You" : "Agent"}
        </span>
      </div>
    </div>
  );
}
