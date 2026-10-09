import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorAlert, Field } from "../../components/ui";
import { createBooking } from "../../features/bookings/booking.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function BookViewing() {
  const [params] = useSearchParams();
  const propertyId = Number(params.get("property_id"));
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const bookingStatus = useAppSelector((state) => state.bookings.status);
  const property = useAppSelector((state) =>
    state.properties.items.find((item) => item.id === propertyId),
  );
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (!auth.token) return setError("Sign in before requesting a viewing.");
    if (!Number.isInteger(propertyId) || propertyId <= 0)
      return setError("Choose a property before booking a viewing.");
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn))
      return setError("Choose an end date and time after the start date.");
    try {
      await dispatch(
        createBooking({
          propertyId,
          check_in: new Date(checkIn).toISOString(),
          check_out: new Date(checkOut).toISOString(),
        }),
      ).unwrap();
      setSaved(true);
    } catch (cause) {
      setError(cause as string);
    }
  }
  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Book a Viewing</h1>
        <p className="mt-2 text-slate-500">
          Schedule a property viewing with the seller.
        </p>
      </div>
      {!propertyId ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-slate-600">
            Select a property from the listings to request a viewing.
          </p>
          <Link className="mt-4 inline-block font-semibold" to="/search">
            Browse properties →
          </Link>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="max-w-xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div>
            <p className="text-sm text-slate-500">Property</p>
            <p className="mt-1 font-semibold text-slate-900">
              {property?.title ?? `Property #${propertyId}`}
            </p>
            <Link
              to={`/properties/${propertyId}`}
              className="mt-1 inline-block text-sm font-medium"
            >
              View details →
            </Link>
          </div>
          <Field
            label="Viewing starts"
            type="datetime-local"
            required
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
          />
          <Field
            label="Viewing ends"
            type="datetime-local"
            required
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
          />
          {error && <ErrorAlert message={error} />}
          {saved && (
            <p role="status" className="text-sm font-medium">
              Viewing request sent.
            </p>
          )}
          <button
            type="submit"
            disabled={bookingStatus === "loading"}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Request viewing
          </button>
        </form>
      )}
    </main>
  );
}
