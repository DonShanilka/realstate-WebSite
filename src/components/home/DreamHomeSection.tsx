import { Link } from "react-router-dom";

export function DreamHomeSection() {
  return (
    <section className="w-full px-[50px] pb-14 sm:px-[100px] sm:pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-slate-950/30 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Your next chapter starts here
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Find your dream home faster.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Explore real listings, get clear answers, and take the next step
              with confidence.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/search"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              Start exploring ↗
            </Link>
            <Link
              to="/assistant"
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ask EstateAI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
