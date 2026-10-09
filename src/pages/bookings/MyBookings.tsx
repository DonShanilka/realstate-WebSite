import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ErrorAlert, Spinner } from "../../components/ui";
import {
  cancelBooking,
  fetchBookings,
} from "../../features/bookings/booking.thunks";
import { fetchProperties } from "../../features/properties/property.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { formatPrice } from "../../utils/format";
export default function MyBookings() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const bookings = useAppSelector((state) => state.bookings);
  const properties = useAppSelector((state) => state.properties.items);

  useEffect(() => {
    if (auth.token && bookings.status === "idle")
      void dispatch(fetchBookings());
    if (auth.token && properties.length === 0) void dispatch(fetchProperties());
  }, [auth.token, bookings.status, dispatch, properties.length]);

  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>

        <p className="mt-2 text-slate-500">
          Manage your property viewing requests and bookings.
        </p>
      </div>

      {!auth.token && (
        <ErrorAlert message="Sign in to see your viewing requests." />
      )}
      {bookings.status === "loading" && <Spinner label="Loading bookings" />}
      {bookings.error && <ErrorAlert message={bookings.error} />}
      {auth.token &&
        bookings.status === "succeeded" &&
        bookings.items.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.items.map((booking) => {
              const property =
                booking.property ??
                properties.find((item) => item.id === booking.property_id);
              return (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {property?.title ?? `Property #${booking.property_id}`}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(booking.check_in).toLocaleDateString()} –{" "}
                        {new Date(booking.check_out).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize">
                      {booking.status}
                    </span>
                  </div>
                  {property && (
                    <p className="mt-3 text-sm font-semibold">
                      {formatPrice(property.price)}
                    </p>
                  )}
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/properties/${booking.property_id}`}
                      className="text-sm font-semibold"
                    >
                      View property →
                    </Link>
                    <button
                      onClick={() => void dispatch(cancelBooking(booking.id))}
                      className="text-sm font-semibold text-slate-600 hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      {auth.token &&
        bookings.status === "succeeded" &&
        bookings.items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your upcoming and previous property viewings will appear here.
            </p>
          </div>
        )}
    </main>
  );
}
