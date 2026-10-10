import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AgentEmptyState } from "../../components/agent/AgentEmptyState";
import { AgentPageHeader } from "../../components/agent/AgentPageHeader";
import { AgentPropertyCard } from "../../components/agent/AgentPropertyCard";
import { ErrorAlert, Spinner } from "../../components/ui";
import { fetchAssignedProperties } from "../../features/properties/property.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function AgentProperties() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const properties = useAppSelector((state) => state.properties);

  useEffect(() => {
    if (auth.token) void dispatch(fetchAssignedProperties());
  }, [auth.token, dispatch]);

  const myProperties = properties.assignedItems;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
      <AgentPageHeader
        eyebrow="Your portfolio"
        title="My properties"
        description="Properties assigned to your agent account, along with their active listings."
        action={
          <Link
            to="/search"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open marketplace <span aria-hidden="true">↗</span>
          </Link>
        }
      />

      {properties.status === "loading" && (
        <Spinner label="Loading your assigned properties" />
      )}
      {properties.error && <ErrorAlert message={properties.error} />}
      {properties.status === "succeeded" && myProperties.length === 0 && (
        <AgentEmptyState
          icon="⌂"
          title="No properties linked to your account yet"
          description="Once your listings are added to EstateAI, they will appear here."
          action={
            <Link
              to="/search"
              className="text-sm font-semibold text-slate-950 underline underline-offset-4"
            >
              Browse the marketplace
            </Link>
          }
        />
      )}
      {myProperties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myProperties.map((property) => (
            <AgentPropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
