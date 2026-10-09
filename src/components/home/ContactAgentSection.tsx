import { Link } from "react-router-dom";

export function ContactAgentSection() {
  return (
    <section className="w-full px-[50px] py-14 sm:px-[100px] sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
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
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
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
      </div>
    </section>
  );
}
