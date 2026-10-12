import type { DashboardBooking } from "./BookingCalendar";

interface RecentBookingsProps {
  bookings: DashboardBooking[];
  loading?: boolean;
}

export default function RecentBookings({
  bookings,
  loading = false,
}: RecentBookingsProps) {
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Latest activity
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            Recent bookings
          </h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {bookings.length} total
        </span>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Loading bookings...
        </p>
      ) : recentBookings.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          No booking requests available.
        </p>
      ) : (
        <div className="mt-5 divide-y divide-slate-100">
          {recentBookings.map((booking) => (
            <article
              key={booking.id}
              className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {booking.propertyTitle}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {booking.buyerName}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {new Date(booking.date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <span className="w-fit shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                {booking.status.replaceAll("_", " ").toLowerCase()}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
