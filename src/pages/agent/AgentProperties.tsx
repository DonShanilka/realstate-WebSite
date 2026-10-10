import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ErrorAlert, Spinner } from "../../components/ui";
import { fetchProperties } from "../../features/properties/property.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { formatPrice } from "../../utils/format";
import { readTokenUser } from "../../utils/storage";
import propertyPlaceholder from "../../assets/property-placeholder.svg";

export default function AgentProperties() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const properties = useAppSelector((state) => state.properties);
  const userId = auth.user?.id ?? readTokenUser(auth.token).id;

  useEffect(() => {
    if (properties.status === "idle") void dispatch(fetchProperties());
  }, [dispatch, properties.status]);

  const myProperties = properties.items.filter(
    (property) => property.owner_id === userId,
  );

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Your portfolio</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">My properties</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review the properties currently linked to your agent account.
          </p>
        </div>
        <Link to="/search" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Open advanced search <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {properties.status === "loading" && <Spinner label="Loading property listings" />}
      {properties.error && <ErrorAlert message={properties.error} />}
      {properties.status === "succeeded" && myProperties.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="font-semibold">No properties linked to your account yet</h3>
          <p className="mt-2 text-sm text-slate-500">Once your listings are added to EstateAI, they will appear here.</p>
          <Link to="/search" className="mt-4 inline-flex text-sm font-semibold text-slate-950 underline underline-offset-4">Browse marketplace</Link>
        </div>
      )}
      {myProperties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myProperties.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              state={{ property }}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-400 hover:shadow-md"
            >
              <img
                src={property.image_url || propertyPlaceholder}
                alt={property.title}
                className="aspect-[1.6] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = propertyPlaceholder;
                }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 font-semibold text-slate-950">{property.title}</h3>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    {property.status || "Available"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {[property.city, property.district].filter(Boolean).join(", ") || "Location not listed"}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-semibold text-slate-950">{formatPrice(property.price)}</span>
                  <span className="text-xs font-semibold text-slate-500">View listing →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
