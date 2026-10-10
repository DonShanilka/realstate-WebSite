import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const workspaceLinks = [
  {
    eyebrow: "01 / Marketplace",
    title: "Explore properties",
    description: "Browse listings and find the right homes for your clients.",
    to: "/agent/properties",
    action: "Open property listings",
  },
  {
    eyebrow: "02 / Viewings",
    title: "Viewing requests",
    description: "Keep track of appointments and upcoming property visits.",
    to: "/agent/viewings",
    action: "Open viewings",
  },
  {
    eyebrow: "03 / Conversations",
    title: "Client messages",
    description: "Continue conversations with buyers and property owners.",
    to: "/agent/messages",
    action: "Open messages",
  },
];

export default function AgentDashboard() {
  const auth = useAppSelector((state) => state.auth);

  return (
      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="absolute -right-16 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-4 -top-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Your EstateAI workspace
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome{auth.user?.full_name ? `, ${auth.user.full_name}` : " back"}.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              A focused space to help you connect clients with the right
              property and keep every conversation moving.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              <span className="h-2 w-2 rounded-full bg-white" />
              Property agent
            </div>
          </div>
          <div className="relative mt-10 grid gap-3 border-t border-white/15 pt-5 text-sm text-white/60 sm:grid-cols-3 sm:gap-8">
            <p>Discover homes for your clients</p>
            <p>Coordinate property viewings</p>
            <p>Stay close to every inquiry</p>
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Workspace tools
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Your day, in one place
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Choose a workspace to continue. Your agent tools use the same
              EstateAI account.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {workspaceLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg sm:p-7"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.17em] text-slate-400">
                  {item.eyebrow}
                </span>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-slate-950">
                  {item.action}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-6 text-xs text-slate-500 sm:mt-16">
          <span>EstateAI Agent Workspace</span>
          <span>Find the right place. Make the next move.</span>
        </footer>
      </main>
  );
}
