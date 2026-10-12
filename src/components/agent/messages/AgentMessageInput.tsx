import type { FormEvent } from "react";

interface AgentMessageInputProps {
  value: string;
  sending: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AgentMessageInput({
  value,
  sending,
  onChange,
  onSubmit,
}: AgentMessageInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-slate-200 bg-white p-4"
    >
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="agent-message" className="sr-only">
            Write a message
          </label>
          <textarea
            id="agent-message"
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write a message..."
            className="max-h-32 min-h-12 w-full resize-y rounded-xl border border-slate-200bg-slate-50 px-4 py-3 text-sm
             text-slate-900 outline-none transition placeholder:text-slate-400
              focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={sending || !value.trim()}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm 
          font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending
            </>
          ) : (
            <>
              <span>Send</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </>
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Reply to the buyer about this property.
      </p>
    </form>
  );
}
