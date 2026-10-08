import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { askAssistant } from "../features/assistant/assistant.slice";
import { formatPrice, formatType, location } from "../utils/format";
import { Button, Chip, ErrorAlert, PageHeader, Spinner } from "../components/ui";
import type { AssistantProperty } from "../types";

const suggestions = [
  "Which property is best for a family of four?",
  "Recommend a 3 bedroom house in Colombo under 30 million with parking.",
  "What is the best villa for a large family?",
];

function Recommendation({ property, highlight }: { property: AssistantProperty; highlight?: boolean }) {
  const place = location([property.city, property.district]);
  return (
    <div className={`flex gap-4 rounded-lg border p-3 ${highlight ? "border-slate-300 bg-slate-50/60" : "border-slate-200 bg-white"}`}>
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-slate-50">
        {property.image_url && (
          <img
            src={property.image_url}
            alt=""
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 space-y-1 text-sm">
        <p className="font-semibold text-slate-900">
          {property.title} <span className="font-normal text-slate-400">#{property.id}</span>
        </p>
        <p className="text-slate-500">
          {[formatType(property.property_type), place].filter(Boolean).join(" · ")}
        </p>
        <p className="font-semibold text-slate-950">
          {formatPrice(property.price)} · {property.bedrooms ?? "–"} bed · {property.bathrooms ?? "–"} bath
        </p>
        {property.reasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {property.reasons.map((reason) => (
              <Chip key={reason}>{reason}</Chip>
            ))}
          </div>
        )}
        {property.caveats.length > 0 && <p className="pt-1 text-xs text-slate-600">Note: {property.caveats.join("; ")}</p>}
      </div>
    </div>
  );
}

export default function Assistant() {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const { turns, status, error } = useAppSelector((state) => state.assistant);
  const initialQuestion = params.get("ask") ?? "";
  const [question, setQuestion] = useState("");
  const loading = status === "loading";
  const endRef = useRef<HTMLDivElement>(null);
  const autoAsked = useRef<string | null>(null);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (trimmed.length < 3 || loading) return;
    setQuestion("");
    await dispatch(askAssistant(trimmed));
  }

  useEffect(() => {
    if (!initialQuestion || autoAsked.current === initialQuestion) return;
    autoAsked.current = initialQuestion;
    void ask(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, loading]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  return (
    <>
      <PageHeader
        title="AI Property Assistant"
        subtitle="Ask a question and get a recommendation based on the properties in our database."
      />
      <div className="mx-auto max-w-3xl px-[50px] py-8 sm:px-[100px]">
        {turns.length === 0 && (
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-slate-600">Try asking:</p>
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => void ask(suggestion)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6" aria-live="polite">
          {turns.map((turn, index) => (
            <div key={`${turn.question}-${index}`} className="space-y-3">
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-slate-950 px-4 py-2.5 text-sm text-white">
                {turn.question}
              </div>
              {turn.response && (
                <div className="space-y-3 rounded-2xl rounded-bl-sm border border-slate-200 bg-white p-4">
                  <p className="text-sm leading-relaxed text-slate-800">{turn.response.answer}</p>
                  {turn.response.recommendation && <Recommendation property={turn.response.recommendation} highlight />}
                  {turn.response.alternatives.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Other options</p>
                      {turn.response.alternatives.map((alt) => (
                        <Recommendation key={alt.id} property={alt} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && <Spinner label="Thinking" />}
          {error && <ErrorAlert message={error} />}
          <div ref={endRef} />
        </div>

        <form onSubmit={submit} className="sticky bottom-4 mt-6 flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-black/5">
          <label htmlFor="assistant-question" className="sr-only">
            Your question
          </label>
          <input
            id="assistant-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about properties, budgets or neighbourhoods…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
          />
          <Button type="submit" disabled={loading || question.trim().length < 3}>
            Ask
          </Button>
        </form>
      </div>
    </>
  );
}
