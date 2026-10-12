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
    <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-slate-200 bg-white md:border-b-0 md:border-r">
      <div className="shrink-0 border-b border-slate-200 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Conversations
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your property discussions
            </p>
          </div>

          <span
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 text-xs 
          font-semibold text-slate-700"
          >
            {contacts.length}
          </span>
        </div>
      </div>

      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          >
            <circle
              cx="10.8"
              cy="10.8"
              r="6.8"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="m16 16 4 4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>

          <span className="text-xs text-slate-400">Your conversations</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && (
          <div className="space-y-3 p-4" aria-live="polite">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl p-3"
              >
                <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                  <div className="h-2.5 w-full rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && contacts.length === 0 && (
          <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v9.5A1.75 1.75 0 0 1 18.25 17H9l-5 
                  3v-3.5a1.7 1.7 0 0 1 0-.25V5.75Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 9h8M8 12.5h5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No conversations yet
            </h3>

            <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-500">
              Your conversations with property agents will appear here.
            </p>
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
      </div>

      <div className="shrink-0 border-t border-slate-100 px-4 py-3">
        <p className="text-center text-[11px] text-slate-400">
          EstateAI · Buyer messages
        </p>
      </div>
    </aside>
  );
}
