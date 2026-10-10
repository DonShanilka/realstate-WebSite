import { Link, NavLink } from "react-router-dom";
import { agentNavigation } from "./agentNavigation";

export function AgentSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <Link
        to="/agent"
        className="flex h-20 items-center gap-3 border-b border-slate-100 px-7"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">
          E
        </span>
        <span>
          <span className="block text-lg font-bold tracking-tight">EstateAI</span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Agent workspace
          </span>
        </span>
      </Link>

      <div className="px-5 pt-8">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
        <nav className="mt-3 space-y-1" aria-label="Agent navigation">
          {agentNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <span
                className="grid h-6 w-6 place-items-center text-lg"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
