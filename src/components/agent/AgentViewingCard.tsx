import { useState } from "react";
import { Link } from "react-router-dom";
import { updateBookingStatus } from "../../features/bookings/booking.thunks";
import { useAppDispatch } from "../../hooks/redux";
import type { Booking } from "../../features/bookings/booking.types";
import type { Property } from "../../types";

export function AgentViewingCard({
  booking,
  property,
}: {
  booking: Booking;
  property?: Property;
}) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const status = booking.status.toLowerCase();
  
  async function update(status: string) {
    setSaving(true);
    setError("");
    try {
      await dispatch(updateBookingStatus({ id: booking.id, status })).unwrap();
    } catch (cause) {
      setError(String(cause));
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h3 className="font-semibold">
          {property?.title ?? `Property #${booking.property_id}`}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {new Date(booking.check_in).toLocaleDateString()} –{" "}
          {new Date(booking.check_out).toLocaleDateString()}
        </p>
        {booking.buyer && (
          <div className="mt-2 text-sm text-slate-600">
            <p className="font-medium text-slate-800">
              {booking.buyer.full_name}
            </p>
            <a
              className="hover:underline"
              href={`mailto:${booking.buyer.email}`}
            >
              {booking.buyer.email}
            </a>
            {booking.buyer.phone && <p>{booking.buyer.phone}</p>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700">
          {booking.status}
        </span>
        {property && (
          <Link
            to={`/properties/${property.id}`}
            state={{ property }}
            className="text-sm font-semibold"
          >
            View property →
          </Link>
        )}
        {booking.buyer && (
          <Link
            to={`/agent/messages?property_id=${booking.property_id}&buyer_id=${booking.buyer.id}`}
            className="text-sm font-semibold text-slate-700 hover:text-slate-950"
          >
            Message buyer →
          </Link>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {status === "pending" && (
          <>
            <button
              disabled={saving}
              onClick={() => void update("confirmed")}
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              disabled={saving}
              onClick={() => void update("cancelled")}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
            >
              Decline
            </button>
          </>
        )}
        {status === "confirmed" && (
          <button
            disabled={saving}
            onClick={() => void update("completed")}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
          >
            Mark complete
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="w-full text-sm text-red-700">
          {error}
        </p>
      )}
    </article>
  );
}
