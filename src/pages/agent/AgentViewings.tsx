import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ErrorAlert, Spinner } from "../../components/ui";
import { fetchBookings } from "../../features/bookings/booking.thunks";
import { fetchProperties } from "../../features/properties/property.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function AgentViewings() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const bookings = useAppSelector((state) => state.bookings);
  const properties = useAppSelector((state) => state.properties.items);

  useEffect(() => {
    if (auth.token && bookings.status === "idle") void dispatch(fetchBookings());
    if (auth.token && properties.length === 0) void dispatch(fetchProperties());
  }, [auth.token, bookings.status, dispatch, properties.length]);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Schedule</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Viewing requests</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Keep an eye on the viewings associated with your EstateAI account.
        </p>
      </div>

      {bookings.status === "loading" && <Spinner label="Loading viewings" />}
      {bookings.error && <ErrorAlert message={bookings.error} />}
      {bookings.status === "succeeded" && bookings.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-xl" aria-hidden="true">◷</span>
          <h3 className="mt-4 font-semibold">No viewings to show</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Viewing requests linked to your account will appear here when they are available.
          </p>
          <Link to="/agent/properties" className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
            Browse properties
          </Link>
        </div>
      )}
      {bookings.items.length > 0 && (
        <div className="space-y-3">
          {bookings.items.map((booking) => {
            const property = booking.property ?? properties.find((item) => item.id === booking.property_id);
            return (
              <article key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div>
                  <h3 className="font-semibold">{property?.title ?? `Property #${booking.property_id}`}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(booking.check_in).toLocaleDateString()} – {new Date(booking.check_out).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700">{booking.status}</span>
                  {property && <Link to={`/properties/${property.id}`} state={{ property }} className="text-sm font-semibold">View property →</Link>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
