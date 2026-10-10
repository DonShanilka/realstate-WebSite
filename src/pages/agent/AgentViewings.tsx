import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AgentEmptyState } from "../../components/agent/AgentEmptyState";
import { AgentPageHeader } from "../../components/agent/AgentPageHeader";
import { AgentViewingCard } from "../../components/agent/AgentViewingCard";
import { ErrorAlert, Spinner } from "../../components/ui";
import { fetchAgentBookings } from "../../features/bookings/booking.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function AgentViewings() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const bookings = useAppSelector((state) => state.bookings);

  useEffect(() => {
    if (auth.token) void dispatch(fetchAgentBookings());
  }, [auth.token, dispatch]);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
      <AgentPageHeader
        eyebrow="Schedule"
        title="Viewing requests"
        description="Keep an eye on the viewings associated with your EstateAI account."
      />

      {bookings.agentStatus === "loading" && (
        <Spinner label="Loading viewing requests" />
      )}
      {bookings.agentError && <ErrorAlert message={bookings.agentError} />}
      {bookings.agentStatus === "succeeded" &&
        bookings.agentItems.length === 0 && (
          <AgentEmptyState
            icon="◷"
            title="No viewings to show"
            description="Viewing requests linked to your account will appear here when they are available."
            action={
              <Link
                to="/agent/properties"
                className="inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Browse properties
              </Link>
            }
          />
        )}
      {bookings.agentItems.length > 0 && (
        <div className="space-y-3">
          {bookings.agentItems.map((booking) => (
            <AgentViewingCard
              key={booking.id}
              booking={booking}
              property={booking.property}
            />
          ))}
        </div>
      )}
    </main>
  );
}
