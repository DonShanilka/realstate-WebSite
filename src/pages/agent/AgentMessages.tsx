import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

import { ErrorAlert, Spinner } from "../../components/ui";
import { AgentPageHeader } from "../../components/agent/AgentPageHeader";

import {
  messageApi,
  type AgentInboxConversation,
} from "../../features/messages/message.api";

import type { Message } from "../../features/messages/message.types";
import { sendMessage } from "../../features/messages/message.thunks";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function AgentMessages() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  const propertyId = Number(params.get("property_id")) || null;
  const buyerId = Number(params.get("buyer_id")) || null;

  const userId = useAppSelector((state) => {
    const id = state.auth.user?.id;
    return id != null ? Number(id) : null;
  });

  const [conversations, setConversations] = useState<AgentInboxConversation[]>(
    [],
  );

  const [selected, setSelected] = useState<AgentInboxConversation | null>(null);

  const [thread, setThread] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  // Load the agent's inbox.
  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await messageApi.agentInbox();

      setConversations(data);

      setSelected((current) => {
        // Preserve the current conversation after refreshing.
        if (current) {
          return (
            data.find(
              (item) =>
                Number(item.property_id) === Number(current.property_id) &&
                Number(item.buyer_id) === Number(current.buyer_id),
            ) ?? null
          );
        }

        // Select the requested conversation when navigating
        // from a property or buyer page.
        if (propertyId !== null && buyerId !== null) {
          return (
            data.find(
              (item) =>
                Number(item.property_id) === propertyId &&
                Number(item.buyer_id) === buyerId,
            ) ?? null
          );
        }

        return null;
      });
    } catch (cause) {
      console.error("Failed to load agent inbox:", cause);

      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load the buyer inbox.",
      );
    } finally {
      setLoading(false);
    }
  }, [propertyId, buyerId]);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  // Load the selected buyer's conversation.
  useEffect(() => {
    if (!selected) {
      setThread([]);
      setThreadLoading(false);
      return;
    }

    let active = true;

    async function loadThread() {
      setThread([]);
      setThreadLoading(true);
      setError("");

      try {
        const data = await messageApi.propertyConversation(
          Number(selected!.property_id),
          Number(selected!.buyer_id),
        );

        if (!active) return;

        // Protect the component from unexpected response shapes.
        if (Array.isArray(data)) {
          setThread(data);
        } else {
          console.error("Unexpected conversation response:", data);
          setThread([]);
          setError("The conversation returned an unexpected response.");
          return;
        }

        // Mark the conversation as read.
        try {
          await messageApi.markPropertyConversationRead(
            Number(selected!.property_id),
            Number(selected!.buyer_id),
          );

          // Refresh the inbox to update unread counts.
          const updatedInbox = await messageApi.agentInbox();

          setConversations(updatedInbox);

          // Keep the currently selected conversation open.
          const updatedSelected = updatedInbox.find(
            (item) =>
              Number(item.property_id) === Number(selected!.property_id) &&
              Number(item.buyer_id) === Number(selected!.buyer_id),
          );

          if (updatedSelected) {
            setSelected(updatedSelected);
          }
        } catch (cause) {
          console.error(
            "Failed to mark conversation as read or refresh inbox:",
            cause,
          );
        }
      } catch (cause) {
        if (!active) return;

        console.error("Failed to load conversation:", cause);

        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load this conversation.",
        );
      } finally {
        if (active) {
          setThreadLoading(false);
        }
      }
    }

    void loadThread();

    return () => {
      active = false;
    };
  }, [selected?.property_id, selected?.buyer_id]);

  // Send a reply to the selected buyer.
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected || !draft.trim() || sending) {
      return;
    }

    const messageText = draft.trim();

    setSending(true);
    setError("");

    try {
      const sent = await dispatch(
        sendMessage({
          receiver_id: Number(selected.buyer_id),
          property_id: Number(selected.property_id),
          message: messageText,
        }),
      ).unwrap();

      setThread((current) => {
        const alreadyExists = current.some(
          (item) => Number(item.id) === Number(sent.id),
        );

        if (alreadyExists) {
          return current;
        }

        return [...current, sent];
      });

      setDraft("");

      // Refresh the inbox without closing the selected conversation.
      try {
        const data = await messageApi.agentInbox();

        setConversations(data);

        const refreshedConversation = data.find(
          (item) =>
            Number(item.property_id) === Number(selected.property_id) &&
            Number(item.buyer_id) === Number(selected.buyer_id),
        );

        if (refreshedConversation) {
          setSelected(refreshedConversation);
        }
      } catch (refreshError) {
        console.error("Could not refresh agent inbox:", refreshError);
      }
    } catch (cause) {
      console.error("Failed to send message:", cause);

      setError(
        cause instanceof Error
          ? cause.message
          : typeof cause === "string"
            ? cause
            : "Could not send the message.",
      );
    } finally {
      setSending(false);
    }
  }

  // Safely render last_message whether it is a string or an object.
  function getLastMessageText(conversation: AgentInboxConversation): string {
    const lastMessage: unknown = conversation.last_message;

    if (typeof lastMessage === "string") {
      return lastMessage;
    }

    if (
      lastMessage !== null &&
      typeof lastMessage === "object" &&
      "message" in lastMessage
    ) {
      const messageText = (lastMessage as { message?: unknown }).message;

      if (typeof messageText === "string") {
        return messageText;
      }
    }

    return "No messages yet";
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
        {/* Buyer inbox */}
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
                Number(selected?.property_id) ===
                  Number(conversation.property_id) &&
                Number(selected?.buyer_id) === Number(conversation.buyer_id);

              return (
                <button
                  key={`${conversation.property_id}:${conversation.buyer_id}`}
                  type="button"
                  onClick={() => {
                    setSelected(conversation);
                    setError("");
                  }}
                  aria-pressed={active}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                    active ? "bg-slate-50" : ""
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">
                      {conversation.buyer_name || "Buyer"}
                    </span>

                    {Number(conversation.unread_count) > 0 && (
                      <span className="rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">
                        {conversation.unread_count}
                      </span>
                    )}
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    {conversation.property_title || "Property"}
                  </span>

                  <span className="mt-2 block truncate text-sm text-slate-600">
                    {getLastMessageText(conversation)}
                  </span>
                </button>
              );
            })
          )}
        </aside>

        {/* Conversation panel */}
        <section className="flex min-h-[560px] min-w-0 flex-col">
          {selected ? (
            <>
              <header className="border-b border-slate-200 px-5 py-4">
                <p className="font-semibold text-slate-900">
                  {selected.buyer_name || "Buyer"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selected.property_title || "Property"}
                </p>
              </header>

              {/* Message history */}
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {threadLoading && <Spinner label="Loading conversation" />}

                {!threadLoading &&
                  thread.map((message) => {
                    const isOwnMessage = Number(message.sender_id) === userId;

                    return (
                      <div
                        key={message.id}
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          isOwnMessage
                            ? "ml-auto bg-slate-950 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.message}
                        </p>

                        <p
                          className={`mt-1 text-[10px] ${
                            isOwnMessage ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {message.created_at
                            ? new Date(message.created_at).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    );
                  })}

                {!threadLoading && thread.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No messages in this conversation yet.
                  </p>
                )}
              </div>

              {/* Message input */}
              <form
                onSubmit={submit}
                className="flex gap-2 border-t border-slate-200 p-4"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  aria-label="Write a reply"
                  placeholder="Write a reply..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-600"
                />

                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
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
