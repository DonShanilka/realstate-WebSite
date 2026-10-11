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

  // Build the contact list from messages involving the current user.
  const contacts = useMemo<ConversationContact[]>(() => {
    if (currentUserId === null) {
      return [];
    }

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
        return;
      }

      if (selectedId === null) {
        setLocalError("Please select a conversation.");
        return;
      }

      if (currentUserId !== null && selectedId === currentUserId) {
        setLocalError("You cannot send a message to yourself.");
        return;
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

  return (
    <main className="w-full px-5 py-10 sm:px-10 lg:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>

        <p className="mt-2 text-slate-500">
          {conversationPropertyId !== null
            ? `Discuss property #${conversationPropertyId} directly with its assigned agent.`
            : "Chat directly with property contacts."}
        </p>
      </div>

      {!token && <ErrorAlert message="Sign in to access your messages." />}

      {(localError || messagesState.error) && (
        <div className="mb-4">
          <ErrorAlert message={localError || messagesState.error || ""} />
        </div>
      )}

      <div className="grid min-h-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[280px_minmax(0,1fr)]">
        <ConversationList
          contacts={contacts}
          selectedId={selectedId}
          selectedPropertyId={conversationPropertyId}
          loading={messagesState.status === "loading"}
          onSelect={handleSelectContact}
        />

        <section className="flex min-h-[500px] min-w-0 flex-col">
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
            <div className="m-auto max-w-md p-6 text-center">
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
