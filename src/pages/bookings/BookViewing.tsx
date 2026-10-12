import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorAlert, Field } from "../../components/ui";
import { createBooking } from "../../features/bookings/booking.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchProperty } from "../../features/properties/property.thunks";
import { readTokenUser } from "../../utils/storage";

export default function BookViewing() {
  const [params] = useSearchParams();
  const propertyId = Number(params.get("property_id"));
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const userRole = auth.user?.role ?? readTokenUser(auth.token).role;
  const bookingStatus = useAppSelector((state) => state.bookings.status);
  const property = useAppSelector(
    (state) =>
      state.properties.items.find((item) => item.id === propertyId) ??
      (state.properties.selected?.id === propertyId
        ? state.properties.selected
        : null),
  );
  const propertyStatus = useAppSelector((state) => state.properties.status);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (propertyId > 0 && !property && propertyStatus !== "loading")
      void dispatch(fetchProperty(propertyId));
  }, [dispatch, property, propertyId, propertyStatus]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (!auth.token) return setError("Sign in before requesting a viewing.");
    if (userRole !== "BUYER")
      return setError(
        "Only a buyer account can request a property viewing. Sign in with a buyer account to continue.",
      );
    if (!Number.isInteger(propertyId) || propertyId <= 0)
      return setError("Choose a property before booking a viewing.");
    if (!property)
      return setError(
        "The property details are still loading. Please try again shortly.",
      );
    if (!property.agent_id)
      return setError(
        "This property does not have an agent assigned yet, so a viewing request cannot be routed.",
      );
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
          Your request will be sent to the agent assigned to this property.
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
            <p className="mt-2 text-xs text-slate-500">
              {property?.agent_id
                ? `Assigned agent · #${property.agent_id}`
                : property
                  ? "No agent has been assigned to this listing yet."
                  : "Loading property and assigned agent…"}
            </p>
          </div>
          {property && !property.agent_id && (
            <ErrorAlert message="This listing has no assigned agent, so the request cannot reach an agent yet. The property owner or an admin must assign an agent first." />
          )}
          {auth.token && userRole !== "BUYER" && (
            <ErrorAlert message="Viewing requests are available to buyer accounts. Sign in as a buyer to request this viewing." />
          )}
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
            disabled={bookingStatus === "loading" || !property?.agent_id}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Request viewing
          </button>
        </form>
      )}
    </main>
  );
}
