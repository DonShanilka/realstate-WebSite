import { useCallback, useEffect, useState } from "react";

import type { FormEvent } from "react";

import { useSearchParams } from "react-router-dom";

import { messageApi, type AgentInboxConversation } from "../message.api";

import type { Message } from "../message.types";

import { sendMessage } from "../message.thunks";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

export default function useAgentMessages() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  // URL parameters from the Agent Booking page.
  const propertyId = Number(params.get("property_id")) || null;
  const buyerId = Number(params.get("buyer_id")) || null;

  // Authenticated agent ID.
  const userId = useAppSelector((state) => {
    const id = state.auth.user?.id;

    return id != null ? Number(id) : null;
  });

  // Inbox state.
  const [conversations, setConversations] = useState<AgentInboxConversation[]>(
    [],
  );

  const [selected, setSelected] = useState<AgentInboxConversation | null>(null);

  // Conversation messages.
  const [thread, setThread] = useState<Message[]>([]);

  // Message composer.
  const [draft, setDraft] = useState("");

  // Loading states.
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Error state.
  const [error, setError] = useState("");

  /**
   * Create a temporary conversation target when an agent opens
   * a booking but no messages exist for that buyer/property yet.
   *
   * This lets the agent open the chat immediately.
   * The backend must still validate the buyer and property.
   */
  const createTargetConversation = useCallback(
    (
      targetPropertyId: number,
      targetBuyerId: number,
    ): AgentInboxConversation => {
      return {
        property_id: targetPropertyId,
        property_title: `Property #${targetPropertyId}`,
        buyer_id: targetBuyerId,
        buyer_name: `Buyer #${targetBuyerId}`,
        buyer_email: "",
        last_message: "No messages yet",
        last_message_at: undefined,
        unread_count: 0,
      };
    },
    [],
  );

  /**
   * Load the agent inbox.
   *
   * IMPORTANT:
   * If the URL includes property_id and buyer_id, select that
   * exact conversation even when it does not exist in the inbox.
   */
  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await messageApi.agentInbox();

      setConversations(data);

      setSelected((current) => {
        // Booking page supplies both IDs.
        if (propertyId !== null && buyerId !== null) {
          const existingConversation = data.find(
            (item) =>
              Number(item.property_id) === propertyId &&
              Number(item.buyer_id) === buyerId,
          );

          // Existing conversation.
          if (existingConversation) {
            return existingConversation;
          }

          // No conversation yet.
          // Still open the requested buyer/property chat.
          return createTargetConversation(propertyId, buyerId);
        }

        // If only a property ID exists, select a conversation
        // for that property if one is available.
        if (propertyId !== null) {
          const matchingConversations = data.filter(
            (item) => Number(item.property_id) === propertyId,
          );

          if (current) {
            const existingSelection = matchingConversations.find(
              (item) =>
                Number(item.property_id) === Number(current.property_id) &&
                Number(item.buyer_id) === Number(current.buyer_id),
            );

            if (existingSelection) {
              return existingSelection;
            }
          }

          return matchingConversations[0] ?? null;
        }

        // No target in the URL: preserve the current selection
        // if it still exists in the inbox.
        if (current) {
          const existingConversation = data.find(
            (item) =>
              Number(item.property_id) === Number(current.property_id) &&
              Number(item.buyer_id) === Number(current.buyer_id),
          );

          if (existingConversation) {
            return existingConversation;
          }
        }

        // Otherwise select the first available conversation.
        return data[0] ?? null;
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
  }, [propertyId, buyerId, createTargetConversation]);

  // Load the inbox when the page opens or the target changes.
  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  /**
   * Select an existing conversation from the inbox UI.
   */
  const selectConversation = useCallback(
    (conversation: AgentInboxConversation) => {
      setSelected(conversation);
      setDraft("");
      setError("");
    },
    [],
  );

  /**
   * Load messages for the selected buyer/property.
   *
   * An empty message array is a valid new conversation.
   */
  useEffect(() => {
    if (!selected) {
      setThread([]);
      setThreadLoading(false);
      return;
    }

    let active = true;

    const currentPropertyId = Number(selected.property_id);
    const currentBuyerId = Number(selected.buyer_id);

    async function loadThread() {
      setThread([]);
      setThreadLoading(true);
      setError("");

      try {
        const data = await messageApi.propertyConversation(
          currentPropertyId,
          currentBuyerId,
        );

        if (!active) {
          return;
        }

        if (!Array.isArray(data)) {
          console.error("Unexpected conversation response:", data);

          setThread([]);
          setError("The conversation returned an unexpected response.");

          return;
        }

        // Empty array means there are no messages yet.
        setThread(data);

        // Mark existing incoming messages as read.
        // This operation is best-effort: a read-status failure
        // must not prevent the agent from opening the chat.
        try {
          await messageApi.markPropertyConversationRead(
            currentPropertyId,
            currentBuyerId,
          );

          if (!active) {
            return;
          }

          const updatedInbox = await messageApi.agentInbox();

          if (!active) {
            return;
          }

          setConversations(updatedInbox);

          const updatedSelected = updatedInbox.find(
            (item) =>
              Number(item.property_id) === currentPropertyId &&
              Number(item.buyer_id) === currentBuyerId,
          );

          // Keep the temporary target if the conversation has
          // no messages and therefore is not in the inbox yet.
          if (updatedSelected) {
            setSelected(updatedSelected);
          }
        } catch (cause) {
          console.error(
            "Could not mark messages as read or refresh inbox:",
            cause,
          );
        }
      } catch (cause) {
        if (!active) {
          return;
        }

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

  /**
   * Send a message to the selected buyer.
   */
  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selected || !draft.trim() || sending) {
        return;
      }

      const messageText = draft.trim();

      const targetPropertyId = Number(selected.property_id);
      const targetBuyerId = Number(selected.buyer_id);

      if (
        !Number.isInteger(targetPropertyId) ||
        targetPropertyId <= 0 ||
        !Number.isInteger(targetBuyerId) ||
        targetBuyerId <= 0
      ) {
        setError("Invalid buyer or property.");
        return;
      }

      setSending(true);
      setError("");

      try {
        const sent = await dispatch(
          sendMessage({
            receiver_id: targetBuyerId,
            property_id: targetPropertyId,
            message: messageText,
          }),
        ).unwrap();

        // Add the sent message without creating duplicates.
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

        // Refresh the inbox so the new conversation appears.
        try {
          const data = await messageApi.agentInbox();

          setConversations(data);

          const refreshedConversation = data.find(
            (item) =>
              Number(item.property_id) === targetPropertyId &&
              Number(item.buyer_id) === targetBuyerId,
          );

          if (refreshedConversation) {
            setSelected(refreshedConversation);
          } else {
            // Keep the chat selected even if the inbox response
            // has not yet included the new conversation.
            setSelected(
              createTargetConversation(targetPropertyId, targetBuyerId),
            );
          }
        } catch (refreshError) {
          console.error("Could not refresh agent inbox:", refreshError);
        }
      } catch (cause: unknown) {
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
    },
    [dispatch, selected, draft, sending, createTargetConversation],
  );

  /**
   * Safely extract the latest message text.
   *
   * The backend may return last_message as either a string
   * or a message object.
   */
  const getLastMessageText = useCallback(
    (conversation: AgentInboxConversation): string => {
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
    },
    [],
  );

  return {
    // Authenticated user.
    userId,

    // Inbox.
    conversations,
    loading,
    loadInbox,

    // Selected conversation.
    selected,
    selectConversation,

    // Messages.
    thread,
    threadLoading,

    // Message composer.
    draft,
    setDraft,
    submit,
    sending,

    // Errors.
    error,
    setError,

    // Helpers.
    getLastMessageText,
  };
}
