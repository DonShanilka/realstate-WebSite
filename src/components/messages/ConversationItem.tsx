interface ConversationItemProps {
  userId: number;
  propertyId: number | null;
  selected: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  userId,
  propertyId,
  selected,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full border-b border-slate-100 p-4 text-left text-sm transition hover:bg-slate-50 ${
        selected ? "bg-slate-100" : ""
      }`}
    >
      <span className="block font-medium text-slate-900">
        Conversation with user #{userId}
      </span>

      {propertyId !== null && (
        <span className="mt-1 block text-xs text-slate-500">
          Property #{propertyId}
        </span>
      )}
    </button>
  );
}
