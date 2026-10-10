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
      className={`flex w-full ${
        isMyMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] break-words rounded-xl px-3 py-2 text-sm ${
          isMyMessage
            ? "bg-slate-950 text-white"
            : "bg-slate-100 text-slate-900"
        }`}
      >
        {message.message}
      </div>
    </div>
  );
}