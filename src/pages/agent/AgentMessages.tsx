import AgentMessagesUI from "../../components/agent/messages/AgentMessagesUI";
import useAgentMessages from "../../features/messages/hooks/useAgentMessages";

export default function AgentMessages() {
  const {
    userId,
    conversations,
    loading,
    selected,
    selectConversation,
    thread,
    draft,
    setDraft,
    threadLoading,
    sending,
    error,
    setError,
    submit,
    getLastMessageText,
  } = useAgentMessages();

  return (
    <AgentMessagesUI
      conversations={conversations}
      currentUserId={userId}
      selectedConversation={selected}
      messages={thread}
      draft={draft}
      loading={loading}
      threadLoading={threadLoading}
      sending={sending}
      error={error}
      onSelectConversation={selectConversation}
      onDraftChange={setDraft}
      onSendMessage={submit}
      getLastMessageText={getLastMessageText}
      onClearError={() => setError("")}
    />
  );
}