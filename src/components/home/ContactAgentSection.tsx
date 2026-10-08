import { Link } from "react-router-dom";

export function ContactAgentSection() {
  return (
    <section className="w-full px-[50px] py-14 sm:px-[100px] sm:py-20">
      <div className="grid overflow-hidden rounded-3xl bg-slate-950 text-white lg:grid-cols-[1fr_0.85fr]">
        <div className="p-7 sm:p-10 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
            Personal help, when you need it
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Connect with our agents
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-50 sm:text-base">
            Have a question about a listing or want help planning a viewing?
            Start a conversation with our team.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/messages"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-50"
            >
              Contact an agent ↗
            </Link>
            <Link
              to="/book-viewing"
              className="rounded-full border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Plan a viewing
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
              Local insight for your next move
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-100">
              From first questions to a shortlist that feels right.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
