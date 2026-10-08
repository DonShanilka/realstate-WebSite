import { Link } from "react-router-dom";

export function TestimonialsSection() {
  return (
    <section className="w-full bg-[#f5f7fa] px-[50px] py-14 sm:px-[100px] sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
            A better move starts here
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            What our clients are saying
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            Every home search is personal. We’re building EstateAI to make each
            step clearer, calmer, and easier to navigate.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <span
            className="text-5xl leading-none text-slate-950"
            aria-hidden="true"
          >
            “
          </span>
          <p className="mt-2 text-xl font-medium leading-relaxed tracking-tight text-slate-800 sm:text-2xl">
            Your experience can help make the next person’s home search better.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <div>
              <p className="font-semibold text-slate-900">
                Share your EstateAI experience
              </p>
              <p className="mt-1 text-sm text-slate-500">
                We’d love to hear what helped you.
              </p>
            </div>
            <Link
              to="/messages"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-950"
            >
              Get in touch ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
