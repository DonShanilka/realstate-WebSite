// src/features/messages/hooks/useAgentMessages.ts

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

  // URL PARAMETERS
  const propertyId = Number(params.get("property_id")) || null;
  const buyerId = Number(params.get("buyer_id")) || null;

  // AUTHENTICATED USER
  const userId = useAppSelector((state) => {
    const id = state.auth.user?.id;

    return id != null ? Number(id) : null;
  });

  // STATE
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

  // LOAD AGENT INBOX
  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await messageApi.agentInbox();

      setConversations(data);

      setSelected((current) => {
        // Preserve the currently selected conversation.
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

        // Select a conversation requested through URL parameters.
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

  // Load inbox when the hook is mounted or URL target changes.
  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  // SELECT CONVERSATION
  const selectConversation = useCallback(
    (conversation: AgentInboxConversation) => {
      setSelected(conversation);
      setError("");
    },
    [],
  );

  // LOAD SELECTED CONVERSATION
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

        // Ignore results if another conversation was selected.
        if (!active) {
          return;
        }

        if (!Array.isArray(data)) {
          console.error("Unexpected conversation response:", data);

          setThread([]);

          setError("The conversation returned an unexpected response.");

          return;
        }

        setThread(data);

        // Mark the selected conversation as read.
        try {
          await messageApi.markPropertyConversationRead(
            currentPropertyId,
            currentBuyerId,
          );

          if (!active) {
            return;
          }

          // Refresh inbox to update unread counts.
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

  // SEND MESSAGE
  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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

        // Prevent duplicate messages in the thread.
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

        // Refresh inbox after sending the message.
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
    },
    [dispatch, selected, draft, sending],
  );

  // LAST MESSAGE TEXT HELPER
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

  // RETURN VALUES FOR THE PAGE / UI
  return {
    // Auth
    userId,

    // Inbox
    conversations,
    loading,
    loadInbox,

    // Selected conversation
    selected,
    selectConversation,

    // Messages
    thread,
    threadLoading,

    // Composer
    draft,
    setDraft,
    submit,
    sending,

    // Errors
    error,
    setError,

    // Helpers
    getLastMessageText,
  };
}
