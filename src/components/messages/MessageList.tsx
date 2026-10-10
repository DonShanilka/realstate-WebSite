import { useEffect, useRef } from "react";
import type { Message } from "../../features/messages/message.types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  loading?: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  loading = false,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 p-5 text-center text-sm text-slate-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No messages in this conversation yet.
        </p>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUserId={currentUserId}
          />
        ))
      )}

      <div ref={bottomRef} />
    </div>
  );
}