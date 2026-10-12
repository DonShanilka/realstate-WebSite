import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { ConversationContact } from "../../../components/messages/ConversationList";

import {
  fetchConversation,
  fetchMyMessages,
  fetchPropertyConversation,
  sendMessage,
} from "../message.thunks";

import { messageApi } from "../message.api";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

export function useBuyerMessages() {
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

  return {
    token,
    messagesError: messagesState.error,
    currentUserId,

    selectedId,
    selectedPropertyId: conversationPropertyId,
    isSelfConversation,

    contacts,
    activeMessages,

    sending,
    localError,
    isLoadingContacts,

    handleSelectContact,
    handleSendMessage,
  };
}
