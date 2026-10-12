import { ErrorAlert } from "../../components/ui";

import ConversationList from "../../components/messages/ConversationList";
import ChatHeader from "../../components/messages/ChatHeader";
import MessageList from "../../components/messages/MessageList";
import MessageInput from "../../components/messages/MessageInput";

import { useBuyerMessages } from "../../features/messages/hooks/useBuyerMessages";

export default function Messages() {
  const {
    token,
    messagesError,
    currentUserId,
    selectedId,
    selectedPropertyId,
    isSelfConversation,
    contacts,
    activeMessages,
    sending,
    localError,
    isLoadingContacts,
    handleSelectContact,
    handleSendMessage,
  } = useBuyerMessages();

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-[1440px] flex-col px-4 py-6 sm:px-8 sm:py-8">
      {/* Page header */}
      <header className="mb-6 shrink-0">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Buyer communications
        </p>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Messages
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Chat directly with property agents and manage your conversations
              in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Private conversations
          </div>
        </div>
      </header>

      {/* Authentication error */}
      {!token && (
        <div className="mb-4 shrink-0">
          <ErrorAlert message="Sign in to access your messages." />
        </div>
      )}

      {/* Messaging errors */}
      {(localError || messagesError) && (
        <div className="mb-4 shrink-0">
          <ErrorAlert message={localError || messagesError || ""} />
        </div>
      )}

      {/* Main inbox layout */}
      <section
        className="grid min-h-[650px] flex-1 grid-cols-1 grid-rows-[minmax(200px,34%)_minmax(420px,1fr)] 
      overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:min-h-[600px] 
      md:grid-cols-[320px_minmax(0,1fr)] md:grid-rows-1"
      >
        {/* Conversation sidebar */}
        <ConversationList
          contacts={contacts}
          selectedId={selectedId}
          selectedPropertyId={selectedPropertyId}
          loading={isLoadingContacts}
          onSelect={handleSelectContact}
        />

        {/* Chat panel */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white">
          {selectedId !== null && !isSelfConversation ? (
            <>
              <ChatHeader userId={selectedId} propertyId={selectedPropertyId} />

              <MessageList
                messages={activeMessages}
                currentUserId={currentUserId ?? -1}
              />

              <MessageInput sending={sending} onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex min-h-[420px] flex-1 items-center justify-center bg-slate-50/70 p-6 sm:p-10">
              <div className="max-w-sm text-center">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border 
                border-slate-200 bg-white text-blue-600 shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 18.5 3.5 20l1-4A8.5 8.5 0 1 1 7 18.5Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M8 10h8M8 13.5h5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900">
                  Your messages
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select a conversation from your inbox to view your messages
                  and chat with the property agent.
                </p>

                {contacts.length === 0 && !isLoadingContacts && (
                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Conversations will appear here when messages are exchanged
                    with an agent.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
