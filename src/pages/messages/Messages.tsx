import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ErrorAlert } from "../../components/ui";

import ConversationList from "../../components/messages/ConversationList";
import type { ConversationContact } from "../../components/messages/ConversationList";

import ChatHeader from "../../components/messages/ChatHeader";
import MessageList from "../../components/messages/MessageList";
import MessageInput from "../../components/messages/MessageInput";

import {
  fetchConversation,
  fetchMyMessages,
  fetchPropertyConversation,
  sendMessage,
} from "../../features/messages/message.thunks";

import { messageApi } from "../../features/messages/message.api";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function Messages() {
  const [params] = useSearchParams();

  const propertyIdFromUrl = Number(params.get("property_id")) || null;
  const assignedAgentIdFromUrl = Number(params.get("agent_id")) || null;

  const dispatch = useAppDispatch();

  const { token, user } = useAppSelector((state) => state.auth);
  const messagesState = useAppSelector((state) => state.messages);

  const currentUserId = user?.id != null ? Number(user.id) : null;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );
  const [sending, setSending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const conversationPropertyId = selectedPropertyId;

  const isSelfConversation =
    currentUserId !== null &&
    selectedId !== null &&
    currentUserId === selectedId;

  // Load the logged-in user's messages.
  useEffect(() => {
    if (!token) return;

    void dispatch(fetchMyMessages())
      .unwrap()
      .catch((error: unknown) => {
        console.error("Could not load conversations:", error);
      });
  }, [dispatch, token]);

  // Open a conversation when navigating from a property page.
  useEffect(() => {
    if (propertyIdFromUrl === null || assignedAgentIdFromUrl === null) {
      return;
    }

    if (currentUserId !== null && assignedAgentIdFromUrl === currentUserId) {
      setSelectedId(null);
      setSelectedPropertyId(null);

      setLocalError(
        "The assigned agent ID matches your account. Please verify the property agent.",
      );

      return;
    }

    setSelectedId(assignedAgentIdFromUrl);
    setSelectedPropertyId(propertyIdFromUrl);
    setLocalError(null);
  }, [propertyIdFromUrl, assignedAgentIdFromUrl, currentUserId]);

  // Build the contact list from existing messages.
  const contacts = useMemo<ConversationContact[]>(() => {
    if (currentUserId === null) return [];

    const byConversation = new Map<string, ConversationContact>();

    for (const message of messagesState.inbox) {
      const senderId = Number(message.sender_id);
      const receiverId = Number(message.receiver_id);

      if (senderId !== currentUserId && receiverId !== currentUserId) {
        continue;
      }

      const contactId = senderId === currentUserId ? receiverId : senderId;

      if (
        !Number.isFinite(contactId) ||
        contactId <= 0 ||
        contactId === currentUserId
      ) {
        continue;
      }

      const contactPropertyId =
        message.property_id != null ? Number(message.property_id) : null;

      const key = `${contactId}:${contactPropertyId ?? "general"}`;

      byConversation.set(key, {
        userId: contactId,
        propertyId: contactPropertyId,
      });
    }

    return [...byConversation.values()];
  }, [messagesState.inbox, currentUserId]);

  // Select a contact.
  const handleSelectContact = useCallback(
    (contact: ConversationContact) => {
      if (currentUserId !== null && contact.userId === currentUserId) {
        setLocalError("You cannot open a conversation with yourself.");
        return;
      }

      setSelectedId(Number(contact.userId));
      setSelectedPropertyId(
        contact.propertyId != null ? Number(contact.propertyId) : null,
      );
      setLocalError(null);
    },
    [currentUserId],
  );

  // Load the selected conversation.
  useEffect(() => {
    if (
      !token ||
      selectedId === null ||
      selectedId <= 0 ||
      isSelfConversation
    ) {
      return;
    }

    let cancelled = false;

    async function loadConversation() {
      try {
        if (conversationPropertyId !== null) {
          await dispatch(
            fetchPropertyConversation({
              propertyId: conversationPropertyId,
              userId: selectedId!,
            }),
          ).unwrap();
        } else {
          await dispatch(fetchConversation(selectedId!)).unwrap();
        }
      } catch (error: unknown) {
        if (!cancelled) {
          console.error("Could not load conversation:", error);

          setLocalError(
            error instanceof Error
              ? error.message
              : "Could not load this conversation.",
          );
        }
      }
    }

    void loadConversation();

    return () => {
      cancelled = true;
    };
  }, [token, selectedId, conversationPropertyId, isSelfConversation, dispatch]);

  // Mark property-specific messages as read.
  useEffect(() => {
    if (
      !token ||
      selectedId === null ||
      conversationPropertyId === null ||
      isSelfConversation
    ) {
      return;
    }

    let cancelled = false;

    async function markAsRead() {
      try {
        await messageApi.markPropertyConversationRead(
          conversationPropertyId!,
          selectedId!,
        );

        if (!cancelled) {
          await dispatch(fetchMyMessages()).unwrap();
        }
      } catch (error: unknown) {
        if (!cancelled) {
          console.error("Could not mark messages as read:", error);
        }
      }
    }

    void markAsRead();

    return () => {
      cancelled = true;
    };
  }, [token, selectedId, conversationPropertyId, isSelfConversation, dispatch]);

  // Send a message.
  const handleSendMessage = useCallback(
    async (message: string): Promise<void> => {
      if (!token) {
        setLocalError("Please sign in to send messages.");
        throw new Error("Please sign in to send messages.");
      }

      if (selectedId === null) {
        setLocalError("Please select a conversation.");
        throw new Error("Please select a conversation.");
      }

      if (currentUserId !== null && selectedId === currentUserId) {
        setLocalError("You cannot send a message to yourself.");
        throw new Error("You cannot send a message to yourself.");
      }

      const receiverId = selectedId;
      const propertyId = conversationPropertyId;

      setSending(true);
      setLocalError(null);

      try {
        await dispatch(
          sendMessage({
            receiver_id: receiverId,
            property_id: propertyId ?? undefined,
            message,
          }),
        ).unwrap();

        if (propertyId !== null) {
          await dispatch(
            fetchPropertyConversation({
              propertyId,
              userId: receiverId,
            }),
          ).unwrap();
        } else {
          await dispatch(fetchConversation(receiverId)).unwrap();
        }

        await dispatch(fetchMyMessages()).unwrap();
      } catch (error: unknown) {
        console.error("Could not send message:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Could not send the message.";

        setLocalError(errorMessage);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [token, selectedId, currentUserId, conversationPropertyId, dispatch],
  );

  // Match the Redux conversation cache key.
  const conversationKey =
    selectedId !== null
      ? conversationPropertyId !== null
        ? `${conversationPropertyId}:${selectedId}`
        : String(selectedId)
      : null;

  // Filter messages to the selected contact only.
  const activeMessages = useMemo(() => {
    if (!conversationKey || selectedId === null || currentUserId === null) {
      return [];
    }

    const conversation = messagesState.conversations[conversationKey] ?? [];

    return conversation.filter((message) => {
      const senderId = Number(message.sender_id);
      const receiverId = Number(message.receiver_id);

      return (
        (senderId === currentUserId && receiverId === selectedId) ||
        (senderId === selectedId && receiverId === currentUserId)
      );
    });
  }, [conversationKey, messagesState.conversations, currentUserId, selectedId]);

  const isLoadingContacts = messagesState.status === "loading";

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

      {!token && (
        <div className="mb-4 shrink-0">
          <ErrorAlert message="Sign in to access your messages." />
        </div>
      )}

      {(localError || messagesState.error) && (
        <div className="mb-4 shrink-0">
          <ErrorAlert message={localError || messagesState.error || ""} />
        </div>
      )}

      {/* Main inbox layout */}
      <section className="grid min-h-[650px] flex-1 grid-cols-1 grid-rows-[minmax(200px,34%)_minmax(420px,1fr)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:min-h-[600px] md:grid-cols-[320px_minmax(0,1fr)] md:grid-rows-1">
        {/* Conversation sidebar */}
        <ConversationList
          contacts={contacts}
          selectedId={selectedId}
          selectedPropertyId={conversationPropertyId}
          loading={isLoadingContacts}
          onSelect={handleSelectContact}
        />

        {/* Chat panel */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white">
          {selectedId !== null && !isSelfConversation ? (
            <>
              <ChatHeader
                userId={selectedId}
                propertyId={conversationPropertyId}
              />

              <MessageList
                messages={activeMessages}
                currentUserId={currentUserId ?? -1}
              />

              <MessageInput sending={sending} onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex min-h-[420px] flex-1 items-center justify-center bg-slate-50/70 p-6 sm:p-10">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-blue-600 shadow-sm">
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
