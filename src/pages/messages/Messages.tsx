import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ErrorAlert, Spinner } from "../../components/ui";
import {
  fetchConversation,
  fetchMyMessages,
  fetchPropertyConversation,
  sendMessage,
} from "../../features/messages/message.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useSearchParams } from "react-router-dom";
import { messageApi } from "../../features/messages/message.api";
export default function Messages() {
  const [params] = useSearchParams();
  const propertyId = Number(params.get("property_id")) || null;
  const assignedAgentId = Number(params.get("agent_id")) || null;
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const messages = useAppSelector((state) => state.messages);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (token && messages.status === "idle") void dispatch(fetchMyMessages());
  }, [dispatch, messages.status, token]);

  useEffect(() => {
    if (propertyId && assignedAgentId) {
      setSelectedId(assignedAgentId);
      setSelectedPropertyId(propertyId);
    }
  }, [assignedAgentId, propertyId]);

  const contacts = useMemo(() => {
    const byProperty = new Map<string, { userId: number; propertyId: number | null }>();
    for (const item of messages.inbox) {
      const contactId = item.sender_id === user?.id ? item.receiver_id : item.sender_id;
      const propertyKey = item.property_id ?? null;
      const key = `${contactId}:${propertyKey ?? "general"}`;
      byProperty.set(key, { userId: contactId, propertyId: propertyKey });
    }
    return [...byProperty.values()];
  }, [messages.inbox, user?.id]);

  const conversationPropertyId = propertyId ?? selectedPropertyId;

  useEffect(() => {
    if (!selectedId) return;
    if (conversationPropertyId) {
      const key = `${conversationPropertyId}:${selectedId}`;
      if (messages.conversations[key] === undefined)
        void dispatch(fetchPropertyConversation({ propertyId: conversationPropertyId, userId: selectedId }));
    } else if (messages.conversations[String(selectedId)] === undefined) {
      void dispatch(fetchConversation(selectedId));
    }
  }, [conversationPropertyId, dispatch, messages.conversations, selectedId]);

  useEffect(() => {
    if (!token || !selectedId || !conversationPropertyId) return;
    void messageApi.markPropertyConversationRead(conversationPropertyId, selectedId)
      .then(() => dispatch(fetchMyMessages()))
      .catch(() => undefined);
  }, [conversationPropertyId, dispatch, selectedId, token]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !draft.trim()) return;
    void dispatch(
      sendMessage({ receiver_id: selectedId, property_id: conversationPropertyId ?? undefined, message: draft.trim() }),
    )
      .unwrap()
      .then(() => setDraft(""))
      .catch(() => undefined);
  }

  const activeMessages = selectedId
    ? (messages.conversations[conversationPropertyId ? `${conversationPropertyId}:${selectedId}` : String(selectedId)] ?? [])
    : [];

  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>

        <p className="mt-2 text-slate-500">
          {conversationPropertyId ? `Discuss property #${conversationPropertyId} directly with its assigned agent.` : "Chat directly with property contacts."}
        </p>
      </div>

      {!token && <ErrorAlert message="Sign in to access your messages." />}
      {messages.error && (
        <div className="mb-4">
          <ErrorAlert message={messages.error} />
        </div>
      )}
      <div className="grid min-h-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[280px_1fr]">
        {/* Conversations */}
        <aside className="border-b border-slate-200 md:border-b-0 md:border-r">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Conversations</h2>
          </div>

          {messages.status === "loading" && (
            <div className="p-5">
              <Spinner label="Loading messages" />
            </div>
          )}
          {token && contacts.length === 0 && messages.status !== "loading" && (
            <div className="p-6 text-center text-sm text-slate-400">
              No conversations yet.
            </div>
          )}
          {contacts.map((contact) => (
            <button
              key={`${contact.userId}:${contact.propertyId ?? "general"}`}
              onClick={() => { setSelectedId(contact.userId); setSelectedPropertyId(contact.propertyId); }}
              className={`block w-full border-b border-slate-100 p-4 text-left text-sm hover:bg-slate-50 ${selectedId === contact.userId && conversationPropertyId === contact.propertyId ? "bg-slate-100" : ""}`}
            >
              <span className="block font-medium">Conversation with user #{contact.userId}</span>
              {contact.propertyId && <span className="mt-1 block text-xs text-slate-500">Property #{contact.propertyId}</span>}
            </button>
          ))}
        </aside>

        {/* Chat */}
        <section className="flex min-h-[500px] flex-col">
          {selectedId ? (
            <>
              <div className="border-b border-slate-200 p-4 font-semibold">
                {assignedAgentId === selectedId ? "Property agent" : `User #${selectedId}`}
                {conversationPropertyId && <p className="mt-1 text-xs font-normal text-slate-500">Property #{conversationPropertyId}</p>}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {activeMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${message.sender_id === user?.id ? "ml-auto bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}`}
                  >
                    {message.message}
                  </div>
                ))}
              </div>
              <form
                onSubmit={submit}
                className="flex gap-2 border-t border-slate-200 p-3"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Write a message…"
                  aria-label="Message"
                />
                <button
                  className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                  disabled={!draft.trim()}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="m-auto text-center">
              <div className="text-4xl">💬</div>

              <h2 className="mt-3 font-semibold text-slate-900">
                Select a conversation
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your messages will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
