import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

interface MessageInputProps {
  sending: boolean;
  disabled?: boolean;
  onSend: (message: string) => Promise<void>;
}

export default function MessageInput({
  sending,
  disabled = false,
  onSend,
}: MessageInputProps) {
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = draft.trim();

    if (!message || sending || disabled) return;

    setSendError("");

    try {
      await onSend(message);
      setDraft("");
    } catch {
      setSendError("Message could not be sent. Please try again.");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (draft.trim() && !sending && !disabled) {
        event.currentTarget.form?.requestSubmit();
      }
    }
  }

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
      {sendError && (
        <p role="alert" className="mb-2 px-1 text-xs text-red-600">
          {sendError}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-end gap-2 rounded-2xl border bg-white p-2 transition focus-within:border-blue-300 
            focus-within:ring-4 focus-within:ring-blue-50 ${
              disabled ? "border-slate-200 bg-slate-50" : "border-slate-200"
            }`}
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            className="max-h-32 min-h-[42px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-5 
            text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            placeholder="Write your message..."
            aria-label="Message"
            rows={1}
            disabled={sending || disabled}
          />

          <button
            type="submit"
            disabled={!draft.trim() || sending || disabled}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm 
            font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                <span className="hidden sm:inline">Sending</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="m21 3-7.2 18-3.8-7-7-3.8L21 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3 10 14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        <p className="mt-2 px-1 text-[10px] text-slate-400">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
}
