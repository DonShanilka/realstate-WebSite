import { Link, NavLink } from "react-router-dom";
import { agentNavigation } from "./agentNavigation";

export function AgentTopbar({
  pageName,
  fullName,
}: {
  pageName: string;
  fullName?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-3 lg:gap-0">
          <Link
            to="/agent"
            className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-xs font-bold text-white lg:hidden"
          >
            E
          </Link>
          <div>
            <p className="text-xs font-medium text-slate-400">Agent workspace</p>
            <h1 className="text-sm font-semibold text-slate-950">{pageName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:inline">
            {fullName || "EstateAI Agent"}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            {(fullName?.[0] || "A").toUpperCase()}
          </span>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden"
        aria-label="Agent navigation"
      >
        {agentNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
