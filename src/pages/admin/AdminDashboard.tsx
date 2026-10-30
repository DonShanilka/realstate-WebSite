import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import BookingAnalyticsChart from "../../components/agent/dashboard/BookingAnalyticsChart";
import RecentBookings from "../../components/agent/dashboard/RecentBookings";
import { ErrorAlert, Spinner } from "../../components/ui";
import {
  adminApi,
  type AdminDashboardData,
} from "../../features/admin/admin.api";
import { useAppSelector } from "../../hooks/redux";
import { readTokenUser } from "../../utils/storage";

const metrics = [
  {
    key: "properties",
    label: "Properties",
    note: "All listed properties",
    icon: "⌂",
  },
  { key: "users", label: "Users", note: "Registered accounts", icon: "♙" },
  {
    key: "agents",
    label: "Active agents",
    note: "Agents able to receive listings",
    icon: "◉",
  },
  {
    key: "bookings",
    label: "Bookings",
    note: "All viewing requests",
    icon: "▦",
  },
  {
    key: "pending_bookings",
    label: "Pending bookings",
    note: "Awaiting a decision",
    icon: "◷",
  },
  {
    key: "unread_messages",
    label: "Unread messages",
    note: "Messages awaiting a reply",
    icon: "✉",
  },
] as const;

export default function AdminDashboard() {
  const auth = useAppSelector((state) => state.auth);
  const role = auth.user?.role ?? readTokenUser(auth.token).role;
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.token || role !== "ADMIN") return;
    let active = true;
    setLoading(true);
    setError("");
    setDashboard(null);
    void adminApi
      .dashboard()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            (cause as Error).message || "Could not load the admin dashboard.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [auth.token, role]);

  if (!auth.token) {
    return <Navigate to="/login" replace state={{ returnTo: "/admin" }} />;
  }
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          EstateAI administration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Admin dashboard
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Live overview of listings, accounts, viewing requests, and messages.
        </p>
      </header>

      {loading && <Spinner label="Loading admin data" />}
      {error && <ErrorAlert message={error} />}

      {dashboard && !loading && (
        <>
          <section
            aria-label="Platform statistics"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {metrics.map((metric) => (
              <article
                key={metric.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                      {dashboard.stats[metric.key].toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {metric.note}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-700"
                  >
                    {metric.icon}
                  </span>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.9fr)]">
            <BookingAnalyticsChart data={dashboard.analytics} />
            <RecentBookings
              bookings={dashboard.recent_bookings}
              totalCount={dashboard.stats.bookings}
            />
          </section>
        </>
      )}
    </main>
  );
}
