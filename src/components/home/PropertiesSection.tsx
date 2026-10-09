import { useMemo, useState } from "react";
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
  const [activeType, setActiveType] = useState("all");
  const propertyTypes = useMemo(
    () => Array.from(new Set(properties.map((property) => property.property_type).filter((type): type is string => Boolean(type)))),
    [properties],
  );
  const visibleProperties = activeType === "all"
    ? properties
    : properties.filter((property) => property.property_type?.toLowerCase() === activeType);

  return (
    <section className="w-full bg-white px-[50px] py-16 sm:px-[100px] sm:py-20">
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <p className="text-sm uppercase tracking-wide text-slate-900">Our Properties</p>
          <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Discover Your Ideal Property
          </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-slate-600 sm:pb-1">
            Discover a home that fits your lifestyle, from a convenient city apartment to a spacious family home.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2.5" aria-label="Filter properties by type">
          {[{ label: "All properties", value: "all" }, ...propertyTypes.map((type) => ({ label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(), value: type.toLowerCase() }))].map((type) => (
            <button
              key={type.value}
              type="button"
              aria-pressed={activeType === type.value}
              onClick={() => setActiveType(type.value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${activeType === type.value ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-800 hover:border-slate-400"}`}
            >
              {type.label}
            </button>
          ))}
          {/* <Link to="/search" className="ml-auto inline-flex items-center px-2 py-2 text-sm font-semibold text-slate-950 hover:underline">
            Browse all properties <span className="ml-1" aria-hidden="true">↗</span>
          </Link> */}
        </div>

        {loading && <Spinner label="Loading properties" />}
        {error && <ErrorAlert message={error} />}
        {!loading && !error && properties.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No properties have been listed yet.
          </p>
        )}
        {!loading && !error && properties.length > 0 && visibleProperties.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No properties found in this category.
          </p>
        )}
        {visibleProperties.length > 0 && <PropertyGrid properties={visibleProperties} />}
      </div>
    </section>
  );
}
