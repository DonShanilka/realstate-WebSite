import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

import AgentMessagesUI from "../../components/agent/messages/AgentMessagesUI";

import type {
  AgentConversationItem,
  AgentChatMessage,
} from "../../components/agent/messages/types";

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

  // Optional IDs when navigating from a property or buyer page.
  const propertyId = Number(params.get("property_id")) || null;
  const buyerId = Number(params.get("buyer_id")) || null;

  // Logged-in agent ID.
  const userId = useAppSelector((state) => {
    const id = state.auth.user?.id;
    return id != null ? Number(id) : null;
  });

  // Inbox conversations.
  const [conversations, setConversations] = useState<AgentInboxConversation[]>(
    [],
  );

  // Currently selected conversation.
  const [selected, setSelected] = useState<AgentInboxConversation | null>(null);

  // Messages belonging to the selected conversation.
  const [thread, setThread] = useState<Message[]>([]);

  // Message input.
  const [draft, setDraft] = useState("");

  // Loading states.
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Error message.
  const [error, setError] = useState("");

  // Load agent inbox
  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await messageApi.agentInbox();

      setConversations(data);

      setSelected((current) => {
        // Keep the current conversation selected after refreshing.
        if (current) {
          return (
            data.find(
              (item) =>
                Number(item.property_id) === Number(current.property_id) &&
                Number(item.buyer_id) === Number(current.buyer_id),
            ) ?? null
          );
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

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  // Load selected conversation and mark it as read
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

        if (!active) {
          return;
        }

        if (Array.isArray(data)) {
          setThread(data);
        } else {
          console.error("Unexpected conversation response:", data);

          setThread([]);
          setError("The conversation returned an unexpected response.");

          return;
        }

        // Mark incoming messages as read.
        try {
          await messageApi.markPropertyConversationRead(
            Number(selected!.property_id),
            Number(selected!.buyer_id),
          );

          if (!active) {
            return;
          }

          // Refresh inbox so unread badges display the latest counts.
          const updatedInbox = await messageApi.agentInbox();

          if (!active) {
            return;
          }

          setConversations(updatedInbox);

          // Update selected conversation without changing its IDs.
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

  // Send message
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected || !draft.trim() || sending) {
      return;
    }

    const messageText = draft.trim();

    setSending(true);
    setError("");

    try {
      // Send message using your existing Redux thunk.
      const sent = await dispatch(
        sendMessage({
          receiver_id: Number(selected.buyer_id),
          property_id: Number(selected.property_id),
          message: messageText,
        }),
      ).unwrap();

      // Add the new message without duplicating it.
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

      // Refresh inbox previews and unread counts.
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

  // Normalize last_message
  /**
   * Depending on the backend response, last_message may be
   * a string or an object containing a message property.
   */
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

  // Prepare data for the UI components
  const uiConversations: AgentConversationItem[] = conversations.map(
    (conversation) => ({
      property_id: Number(conversation.property_id),
      property_title: conversation.property_title || "Property",
      buyer_id: Number(conversation.buyer_id),
      buyer_name: conversation.buyer_name || "Buyer",
      buyer_email: conversation.buyer_email || "",
      last_message: getLastMessageText(conversation),
      last_message_at: conversation.last_message_at,
      unread_count: Number(conversation.unread_count) || 0,
    }),
  );

  const uiSelectedConversation: AgentConversationItem | null = selected
    ? {
        property_id: Number(selected.property_id),
        property_title: selected.property_title || "Property",
        buyer_id: Number(selected.buyer_id),
        buyer_name: selected.buyer_name || "Buyer",
        buyer_email: selected.buyer_email || "",
        last_message: getLastMessageText(selected),
        last_message_at: selected.last_message_at,
        unread_count: Number(selected.unread_count) || 0,
      }
    : null;

  const uiMessages: AgentChatMessage[] = thread.map((message) => ({
    id: Number(message.id),
    sender_id: Number(message.sender_id),
    receiver_id: Number(message.receiver_id),
    property_id: Number(message.property_id ?? selected?.property_id ?? 0),
    message: message.message,
    created_at: message.created_at,
  }));

  // Render UI-only component
  return (
    <AgentMessagesUI
      conversations={uiConversations}
      selectedConversation={uiSelectedConversation}
      messages={uiMessages}
      currentUserId={userId}
      draft={draft}
      loading={loading}
      threadLoading={threadLoading}
      sending={sending}
      error={error}
      onSelectConversation={(conversation: any) => {
        setSelected({
          property_id: conversation.property_id,
          property_title: conversation.property_title,
          buyer_id: conversation.buyer_id,
          buyer_name: conversation.buyer_name,
          buyer_email: conversation.buyer_email || "",
          last_message: conversation.last_message,
          last_message_at: conversation.last_message_at,
          unread_count: conversation.unread_count,
        });

        setError("");
      }}
      onDraftChange={setDraft}
      onSendMessage={submit}
    />
  );
}
