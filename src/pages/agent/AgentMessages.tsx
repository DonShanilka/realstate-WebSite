import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ErrorAlert, Spinner } from "../../components/ui";
import {
  messageApi,
  type AgentInboxConversation,
} from "../../features/messages/message.api";
import type { Message } from "../../features/messages/message.types";
import { sendMessage } from "../../features/messages/message.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AgentPageHeader } from "../../components/agent/AgentPageHeader";
import { useSearchParams } from "react-router-dom";

export default function AgentMessages() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const propertyId = Number(params.get("property_id")) || null;
  const buyerId = Number(params.get("buyer_id")) || null;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [conversations, setConversations] = useState<AgentInboxConversation[]>(
    [],
  );
  const [selected, setSelected] = useState<AgentInboxConversation | null>(null);
  const [thread, setThread] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function loadInbox() {
    setLoading(true);
    setError("");
    try {
      const data = await messageApi.agentInbox();
      setConversations(data);
      setSelected((current) =>
        current
          ? (data.find(
              (item) =>
                item.property_id === current.property_id &&
                item.buyer_id === current.buyer_id,
            ) ?? null)
          : propertyId && buyerId
            ? (data.find(
                (item) =>
                  item.property_id === propertyId && item.buyer_id === buyerId,
              ) ?? null)
            : null,
      );
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInbox();
  }, []);

  useEffect(() => {
    if (!selected) {
      setThread([]);
      setThreadLoading(false);
      return;
    }
    let active = true;
    setThread([]);
    setThreadLoading(true);
    setError("");
    void Promise.all([
      messageApi.propertyConversation(selected.property_id, selected.buyer_id),
      messageApi.markPropertyConversationRead(
        selected.property_id,
        selected.buyer_id,
      ),
    ])
      .then(([data]) => {
        if (active) setThread(data);
      })
      .catch((cause: Error) => {
        if (active) setError(cause.message);
      })
      .finally(() => {
        if (active) setThreadLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selected?.property_id, selected?.buyer_id]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected || !draft.trim()) return;
    setSending(true);
    setError("");
    try {
      const sent = await dispatch(
        sendMessage({
          receiver_id: selected.buyer_id,
          property_id: selected.property_id,
          message: draft.trim(),
        }),
      ).unwrap();
      setThread((current) =>
        current.some((item) => item.id === sent.id)
          ? current
          : [...current, sent],
      );
      setDraft("");
      void loadInbox();
    } catch (cause) {
      setError(String(cause));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
      <AgentPageHeader
        eyebrow="Buyer conversations"
        title="Messages"
        description="Reply to buyers in the context of the property they contacted you about."
      />
      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}
      <div className="grid min-h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 md:border-b-0 md:border-r">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Buyer inbox</h2>
            <p className="mt-1 text-xs text-slate-500">
              Conversations are grouped by property and buyer.
            </p>
          </div>
          {loading ? (
            <div className="p-5">
              <Spinner label="Loading buyer conversations" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-sm leading-6 text-slate-500">
              No buyer messages yet. Messages about your assigned properties
              will appear here.
            </div>
          ) : (
            conversations.map((conversation) => {
              const active =
                selected?.property_id === conversation.property_id &&
                selected.buyer_id === conversation.buyer_id;
              return (
                <button
                  key={`${conversation.property_id}:${conversation.buyer_id}`}
                  onClick={() => setSelected(conversation)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${active ? "bg-slate-50" : ""}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">
                      {conversation.buyer_name}
                    </span>
                    {conversation.unread_count > 0 && (
                      <span className="rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">
                        {conversation.unread_count}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {conversation.property_title}
                  </span>
                  <span className="mt-2 block truncate text-sm text-slate-600">
                    {conversation.last_message}
                  </span>
                </button>
              );
            })
          )}
        </aside>
        <section className="flex min-h-[560px] flex-col">
          {selected ? (
            <>
              <header className="border-b border-slate-200 px-5 py-4">
                <p className="font-semibold text-slate-900">
                  {selected.buyer_name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.property_title}
                </p>
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {threadLoading && <Spinner label="Loading conversation" />}
                {thread.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.sender_id === userId ? "ml-auto bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}`}
                  >
                    {message.message}
                    <p
                      className={`mt-1 text-[10px] ${message.sender_id === userId ? "text-slate-300" : "text-slate-500"}`}
                    >
                      {message.created_at
                        ? new Date(message.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>
                ))}
                {!threadLoading && thread.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No messages in this conversation yet.
                  </p>
                )}
              </div>
              <form
                onSubmit={submit}
                className="flex gap-2 border-t border-slate-200 p-4"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  aria-label="Write a reply"
                  placeholder="Write a reply…"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-600"
                />
                <button
                  disabled={sending || !draft.trim()}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="m-auto max-w-sm px-6 text-center">
              <div className="text-3xl">◇</div>
              <h2 className="mt-3 font-semibold text-slate-900">
                Choose a conversation
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select a buyer to read and reply to messages connected to a
                property.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
