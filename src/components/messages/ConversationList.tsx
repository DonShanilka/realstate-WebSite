import ConversationItem from "./ConversationItem";

export interface ConversationContact {
  userId: number;
  propertyId: number | null;
}

interface ConversationListProps {
  contacts: ConversationContact[];
  selectedId: number | null;
  selectedPropertyId: number | null;
  loading: boolean;
  onSelect: (contact: ConversationContact) => void;
}

export default function ConversationList({
  contacts,
  selectedId,
  selectedPropertyId,
  loading,
  onSelect,
}: ConversationListProps) {
  return (
    <aside className="border-b border-slate-200 md:border-b-0 md:border-r">
      <div className="border-b border-slate-200 p-4">
        <h2 className="font-semibold text-slate-900">Conversations</h2>
      </div>

      {loading && (
        <div className="p-5 text-sm text-slate-500">
          Loading conversations...
        </div>
      )}

      {!loading && contacts.length === 0 && (
        <div className="p-6 text-center text-sm text-slate-400">
          No conversations yet.
        </div>
      )}

      {!loading &&
        contacts.map((contact) => (
          <ConversationItem
            key={`${contact.userId}:${contact.propertyId ?? "general"}`}
            userId={contact.userId}
            propertyId={contact.propertyId}
            selected={
              selectedId === contact.userId &&
              selectedPropertyId === contact.propertyId
            }
            onClick={() => onSelect(contact)}
          />
        ))}
    </aside>
  );
}
