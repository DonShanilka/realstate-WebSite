import type { FormEvent } from "react";
import { Link } from "react-router-dom";

const tools = [
  {
    number: "01",
    title: "Search your way",
    text: "Find a home with plain language or precise filters for location, price and features.",
    to: "/search",
    action: "Explore search",
  },
  {
    number: "02",
    title: "Ask for a second opinion",
    text: "Compare listings and get practical answers from the EstateAI property assistant.",
    to: "/assistant",
    action: "Meet the assistant",
  },
  {
    number: "03",
    title: "Understand the price",
    text: "Get a data-backed estimate and expected range for a property in Sri Lanka.",
    to: "/price-prediction",
    action: "Estimate a price",
  },
];

export function DiscoverSection({
  query,
  onQueryChange,
  onSubmit,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <section className="w-full px-[50px] py-12 sm:px-[100px] sm:py-16">
      <div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
          Discover your ideal property
        </p>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Find your <span className="text-slate-950">ideal</span> place to
            call home.
          </h2>
          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-md shrink-0 rounded-full border border-slate-300 bg-white p-1.5 focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-950/15"
          >
            <label htmlFor="home-search" className="sr-only">
              Describe the property you want
            </label>
            <input
              id="home-search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Try ‘a 3 bedroom home in Colombo’"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Search properties"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-950 text-lg text-white transition hover:bg-black"
            >
              →
            </button>
          </form>
        </div>
      </div>
      <div className="grid gap-4 pt-8 md:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                {tool.number}
              </span>
              <span
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-950"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
            <h3 className="mt-7 text-lg font-semibold text-slate-900">
              {tool.title}
            </h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
              {tool.text}
            </p>
            <span className="mt-5 inline-block text-sm font-semibold text-slate-950">
              {tool.action}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
