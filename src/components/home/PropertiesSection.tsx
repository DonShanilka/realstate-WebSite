import { Link } from "react-router-dom";
import type { Property } from "../../types";
import { PropertyGrid } from "../property/PropertyCard";
import { ErrorAlert, Spinner } from "../ui";

export function PropertiesSection({
  properties,
  loading,
  error,
}: {
  properties: Property[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <section className="w-full bg-slate-50 px-[50px] py-12 sm:px-[100px] sm:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xl uppercase text-slate-950">OUR PROPERTIES</p>
          <h2 className="mt-2 text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
            Discover Your Ideal Property
          </h2>
        </div>
        <Link
          to="/search"
          className="text-sm font-semibold text-slate-950 hover:text-black"
        >
          Browse all properties →
        </Link>
      </div>
      {loading && <Spinner label="Loading properties" />}
      {error && <ErrorAlert message={error} />}
      {!loading && !error && properties.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No properties have been listed yet.
        </p>
      )}
      {properties.length > 0 && <PropertyGrid properties={properties} />}
    </section>
  );
}
