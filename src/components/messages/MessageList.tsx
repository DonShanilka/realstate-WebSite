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
      block: "end",
    });
  }, [messages]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50/70">
      <div className="shrink-0 px-4 pt-4 sm:px-6">
        <div className="flex items-center justify-center">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-400 shadow-sm">
            Conversation messages
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center p-5">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            Loading messages...
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v9.5A1.75 1.75 0 0 1 18.25 17H9l-5 3v-3.5a1.7 1.7 0 0 1 0-.25V5.75Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                Start the conversation
              </h3>

              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                Send a message to discuss the property with your agent.
              </p>
            </div>
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
      )}
    </div>
  );
}
