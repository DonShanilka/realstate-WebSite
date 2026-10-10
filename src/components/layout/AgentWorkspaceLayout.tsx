import { useEffect } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { readTokenUser } from "../../utils/storage";

const navItems = [
  { to: "/agent", label: "Overview", icon: "▦", end: true },
  { to: "/agent/properties", label: "Properties", icon: "⌂" },
  { to: "/agent/viewings", label: "Viewings", icon: "◷" },
  { to: "/agent/messages", label: "Messages", icon: "◇" },
  { to: "/agent/profile", label: "Profile", icon: "◉" },
];

export default function AgentWorkspaceLayout() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const role = auth.user?.role ?? readTokenUser(auth.token).role;
  const pageName =
    navItems.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.label ?? "Agent workspace";

  useEffect(() => {
    if (auth.token && role !== "AGENT") navigate("/", { replace: true });
  }, [auth.token, navigate, role]);

  if (!auth.token) {
    return (
      <Navigate to="/login" replace state={{ returnTo: location.pathname }} />
    );
  }
  if (role !== "AGENT") return null;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <Link to="/agent" className="flex h-20 items-center gap-3 border-b border-slate-100 px-7">
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
            {navItems.map((item) => (
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
                <span className="grid h-6 w-6 place-items-center text-lg" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <Link
            to="/search"
            className="mb-3 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Open marketplace <span aria-hidden="true">↗</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              navigate("/", { replace: true });
            }}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex items-center gap-3 lg:gap-0">
              <Link to="/agent" className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-xs font-bold text-white lg:hidden">
                E
              </Link>
              <div>
                <p className="text-xs font-medium text-slate-400">Agent workspace</p>
                <h1 className="text-sm font-semibold text-slate-950">{pageName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:inline">
                {auth.user?.full_name || "EstateAI Agent"}
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                {(auth.user?.full_name?.[0] || "A").toUpperCase()}
              </span>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden" aria-label="Agent navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${
                    isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
