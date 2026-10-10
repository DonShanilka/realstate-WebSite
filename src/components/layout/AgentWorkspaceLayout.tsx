import { useEffect } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AgentSidebar } from "../agent/AgentSidebar";
import { AgentTopbar } from "../agent/AgentTopbar";
import { logout } from "../../features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { readTokenUser } from "../../utils/storage";
import { agentNavigation } from "../agent/agentNavigation";

export default function AgentWorkspaceLayout() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const role = auth.user?.role ?? readTokenUser(auth.token).role;

  const pageName =
    agentNavigation.find((item) =>
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
      <AgentSidebar />
      <div className="min-h-screen lg:pl-72">
        <AgentTopbar pageName={pageName} fullName={auth.user?.full_name} />
        <Outlet />
      </div>
      <div className="fixed bottom-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
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
      <div className="fixed bottom-0 left-0 z-30 flex w-full gap-2 border-t border-slate-200 bg-white p-3 lg:hidden">
        <Link
          to="/search"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700"
        >
          Marketplace
        </Link>
        <button
          type="button"
          onClick={() => {
            dispatch(logout());
            navigate("/", { replace: true });
          }}
          className="flex-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
        >
          Sign out
        </button>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
