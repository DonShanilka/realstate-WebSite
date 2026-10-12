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
      aria-pressed={selected}
      className={`relative flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition-colors ${
        selected ? "bg-blue-50/70" : "bg-white hover:bg-slate-50"
      }`}
    >
      {selected && (
        <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-blue-600" />
      )}

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        A
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`truncate text-sm ${
              selected
                ? "font-semibold text-slate-950"
                : "font-medium text-slate-800"
            }`}
          >
            Agent #{userId}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-slate-500">
          {propertyId !== null
            ? `Property #${propertyId}`
            : "General conversation"}
        </p>

        <p className="mt-2 truncate text-xs text-slate-400">
          Open conversation
        </p>
      </div>
    </button>
  );
}
