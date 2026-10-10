import { useState } from "react";
import type { FormEvent } from "react";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = draft.trim();

    if (!message || sending || disabled) {
      return;
    }

    await onSend(message);
    setDraft("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-slate-200 p-3"
    >
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Write a message…"
        aria-label="Message"
        disabled={sending || disabled}
      />

      <button
        type="submit"
        disabled={!draft.trim() || sending || disabled}
        className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}