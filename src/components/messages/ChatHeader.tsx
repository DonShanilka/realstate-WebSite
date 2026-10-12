interface ChatHeaderProps {
  userId: number;
  propertyId: number | null;
}

export default function ChatHeader({ userId, propertyId }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm 
        font-bold text-blue-700 ring-1 ring-blue-100"
        >
          A
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            Agent #{userId}
          </h2>

          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Property agent</span>

            {propertyId !== null && (
              <>
                <span className="text-slate-300">·</span>
                <span className="truncate">Property #{propertyId}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:flex">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M12 3.5 5 6.3v5.1c0 4.2 2.8 7.4 7 9.1 4.2-1.7 7-4.9 7-9.1V6.3l-7-2.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m9 12 2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Private chat
      </div>
    </header>
  );
}
