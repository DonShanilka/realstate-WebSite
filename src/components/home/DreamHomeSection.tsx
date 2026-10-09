import { Link } from "react-router-dom";

export function DreamHomeSection() {
  return (
    <section className="w-full px-[50px] pb-14 sm:px-[100px] sm:pb-20">
      <div className="grid overflow-hidden rounded-3xl bg-slate-950 text-white lg:grid-cols-[1fr_0.85fr]">
        <div className="p-7 sm:p-10 lg:p-14">
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
          <div className="mt-7 flex flex-wrap gap-3">
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
        <div className="relative hidden min-h-64 overflow-hidden bg-[radial-gradient(ellipse_at_70%_25%,#d4d4d8_0%,transparent_32%),linear-gradient(145deg,#27272a,#09090b)] lg:block">
          <div className="absolute -right-16 -top-20 h-80 w-80 rounded-full border border-white/20" />
          <div className="absolute -right-2 -top-6 h-56 w-56 rounded-full border border-white/25" />
          <div className="absolute bottom-10 left-10 max-w-xs rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <span className="text-3xl" aria-hidden="true">
              ⌖
            </span>
            <p className="mt-3 text-lg font-semibold">
              Your next chapter starts here
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-100">
              Find a place that feels like home, with clear guidance at every
              step.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
