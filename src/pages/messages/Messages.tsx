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
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );
  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const currentUserId = user?.id != null ? Number(user.id) : null;

  const conversationPropertyId = propertyId ?? selectedPropertyId;

  const isSelfConversation =
    currentUserId !== null &&
    selectedId !== null &&
    currentUserId === Number(selectedId);

  // Load conversations from the backend.
  useEffect(() => {
    if (!token) return;

    void dispatch(fetchMyMessages())
      .unwrap()
      .then((result) => {
        console.log("Messages loaded:", result);
      })
      .catch((error: unknown) => {
        console.error("Failed to load messages:", error);
      });
  }, [dispatch, token]);

  // Debug conversation IDs.
  useEffect(() => {
    console.log("Messages conversation details:", {
      currentUserId,
      selectedId,
      propertyId,
      assignedAgentId,
      conversationPropertyId,
      currentUrl: window.location.href,
    });
  }, [
    currentUserId,
    selectedId,
    propertyId,
    assignedAgentId,
    conversationPropertyId,
  ]);

  // Select the assigned agent when coming from a property page.
  useEffect(() => {
    if (propertyId && assignedAgentId) {
      setSelectedId(assignedAgentId);
      setSelectedPropertyId(propertyId);
      setLocalError(null);
    }
  }, [propertyId, assignedAgentId]);

  // Build the contact list from messages.
  const contacts = useMemo(() => {
    const byProperty = new Map<
      string,
      { userId: number; propertyId: number | null }
    >();

    for (const item of messages.inbox) {
      const senderId = Number(item.sender_id);
      const receiverId = Number(item.receiver_id);

      // Find the other participant in this conversation.
      const contactId =
        senderId === currentUserId ? receiverId : senderId;

      // Never show the logged-in user as their own contact.
      if (currentUserId !== null && contactId === currentUserId) {
        continue;
      }

      const contactPropertyId = item.property_id ?? null;
      const key = `${contactId}:${contactPropertyId ?? "general"}`;

      byProperty.set(key, {
        userId: contactId,
        propertyId: contactPropertyId,
      });
    }

    return [...byProperty.values()];
  }, [messages.inbox, currentUserId]);

  // Load the selected conversation.
  useEffect(() => {
    if (!token || !selectedId) return;

    if (currentUserId !== null && Number(selectedId) === currentUserId) {
      setLocalError(
        "This conversation points to your own account. Check the agent ID on the property page.",
      );

      console.error("Invalid conversation: receiver is the logged-in user.", {
        currentUserId,
        selectedId,
        propertyId: conversationPropertyId,
      });

      return;
    }

    setLocalError(null);

    if (conversationPropertyId) {
      const key = `${conversationPropertyId}:${selectedId}`;

      if (messages.conversations[key] === undefined) {
        void dispatch(
          fetchPropertyConversation({
            propertyId: conversationPropertyId,
            userId: selectedId,
          }),
        )
          .unwrap()
          .catch((error: unknown) => {
            console.error("Failed to load property conversation:", error);
          });
      }
    } else {
      const key = String(selectedId);

      if (messages.conversations[key] === undefined) {
        void dispatch(fetchConversation(selectedId))
          .unwrap()
          .catch((error: unknown) => {
            console.error("Failed to load conversation:", error);
          });
      }
    }
  }, [
    token,
    currentUserId,
    selectedId,
    conversationPropertyId,
    dispatch,
    messages.conversations,
  ]);

  // Mark the selected property conversation as read.
  useEffect(() => {
    if (
      !token ||
      !selectedId ||
      !conversationPropertyId ||
      isSelfConversation
    ) {
      return;
    }

    void messageApi
      .markPropertyConversationRead(conversationPropertyId, selectedId)
      .then(() => {
        void dispatch(fetchMyMessages());
      })
      .catch((error: unknown) => {
        console.error("Could not mark conversation as read:", error);
      });
  }, [
    token,
    selectedId,
    conversationPropertyId,
    isSelfConversation,
    dispatch,
  ]);

  // Send a message.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setLocalError("Please sign in to send messages.");
      return;
    }

    if (!selectedId) {
      setLocalError("Please select a conversation first.");
      return;
    }

    if (currentUserId !== null && Number(selectedId) === currentUserId) {
      setLocalError(
        "You cannot message yourself. Please check the assigned agent ID.",
      );
      return;
    }

    const trimmedMessage = draft.trim();

    if (!trimmedMessage) {
      setLocalError("Please enter a message.");
      return;
    }

    setSending(true);
    setLocalError(null);

    void dispatch(
      sendMessage({
        receiver_id: Number(selectedId),
        property_id: conversationPropertyId ?? undefined,
        message: trimmedMessage,
      }),
    )
      .unwrap()
      .then(() => {
        setDraft("");

        // Refresh messages after a successful send.
        if (conversationPropertyId) {
          return dispatch(
            fetchPropertyConversation({
              propertyId: conversationPropertyId,
              userId: selectedId,
            }),
          ).unwrap();
        }

        return dispatch(fetchConversation(selectedId)).unwrap();
      })
      .then(() => {
        void dispatch(fetchMyMessages());
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.";

        setLocalError(errorMessage);
        console.error("Failed to send message:", error);
      })
      .finally(() => {
        setSending(false);
      });
  }

  const conversationKey = selectedId
    ? conversationPropertyId
      ? `${conversationPropertyId}:${selectedId}`
      : String(selectedId)
    : null;

  const activeMessages = conversationKey
    ? (messages.conversations[conversationKey] ?? [])
    : [];

  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>

        <p className="mt-2 text-slate-500">
          {conversationPropertyId
            ? `Discuss property #${conversationPropertyId} directly with its assigned agent.`
            : "Chat directly with property contacts."}
        </p>
      </div>

      {!token && <ErrorAlert message="Sign in to access your messages." />}

      {(localError || messages.error) && (
        <div className="mb-4">
          <ErrorAlert message={localError || messages.error || ""} />
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

          {token &&
            contacts.length === 0 &&
            messages.status !== "loading" && (
              <div className="p-6 text-center text-sm text-slate-400">
                No conversations yet.
              </div>
            )}

          {contacts.map((contact) => (
            <button
              key={`${contact.userId}:${contact.propertyId ?? "general"}`}
              type="button"
              onClick={() => {
                setSelectedId(contact.userId);
                setSelectedPropertyId(contact.propertyId);
                setLocalError(null);
              }}
              className={`block w-full border-b border-slate-100 p-4 text-left text-sm hover:bg-slate-50 ${
                selectedId === contact.userId &&
                conversationPropertyId === contact.propertyId
                  ? "bg-slate-100"
                  : ""
              }`}
            >
              <span className="block font-medium">
                Conversation with user #{contact.userId}
              </span>

              {contact.propertyId && (
                <span className="mt-1 block text-xs text-slate-500">
                  Property #{contact.propertyId}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Chat */}
        <section className="flex min-h-[500px] flex-col">
          {selectedId ? (
            <>
              <div className="border-b border-slate-200 p-4 font-semibold">
                {assignedAgentId === selectedId
                  ? "Property agent"
                  : `User #${selectedId}`}

                {conversationPropertyId && (
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    Property #{conversationPropertyId}
                  </p>
                )}
              </div>

              {isSelfConversation ? (
                <div className="m-auto max-w-md p-6 text-center">
                  <h2 className="font-semibold text-slate-900">
                    Invalid conversation
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    This conversation points to your own account. Open the
                    property page and check the assigned agent.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {activeMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                          Number(message.sender_id) === currentUserId
                            ? "ml-auto bg-slate-950 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        {message.message}
                      </div>
                    ))}

                    {activeMessages.length === 0 && (
                      <p className="py-8 text-center text-sm text-slate-400">
                        No messages in this conversation yet.
                      </p>
                    )}
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
                      disabled={sending}
                    />

                    <button
                      type="submit"
                      className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!draft.trim() || sending}
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </form>
                </>
              )}
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