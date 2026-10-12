import { AgentPageHeader } from "../AgentPageHeader";

import AgentInbox from "./AgentInbox";
import AgentConversation from "./AgentConversation";

import type { AgentMessagesUIProps } from "./types";

export default function AgentMessagesUI({
  conversations,
  selectedConversation,
  messages,
  currentUserId,
  draft,
  loading = false,
  threadLoading = false,
  sending = false,
  error = "",
  onSelectConversation,
  onDraftChange,
  onSendMessage,
}: AgentMessagesUIProps) {
  return (
    <main className="mx-auto flex h-[calc(100dvh-80px)] min-h-0 w-full max-w-[1440px] flex-col overflow-hidden px-4 py-6 sm:px-8 sm:py-8">
      {/* Page header */}
      <div className="shrink-0">
        <AgentPageHeader
          eyebrow="Buyer communications"
          title="Messages"
          description="Manage conversations and reply to buyers about your properties."
        />
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mb-5 mt-4 shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Fixed inbox and conversation layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(120px,35%)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[320px_minmax(0,1fr)] md:grid-rows-1">
        {/* Inbox */}
        <AgentInbox
          conversations={conversations}
          selectedConversation={selectedConversation}
          loading={loading}
          onSelect={onSelectConversation}
        />

        {/* Conversation */}
        {selectedConversation ? (
          <AgentConversation
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            draft={draft}
            threadLoading={threadLoading}
            sending={sending}
            onDraftChange={onDraftChange}
            onSendMessage={onSendMessage}
          />
        ) : (
          <section className="hidden min-h-0 items-center justify-center overflow-hidden bg-slate-50 p-8 md:flex">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-blue-600 shadow-sm">
                ✉
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Your messages
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select a conversation from your inbox to read messages and reply
                to buyers.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
