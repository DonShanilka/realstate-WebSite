import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatPrice, formatType, location } from "../../format";
import type { Property } from "../../types";

import propertyPlaceholder from "../../assets/property-placeholder.svg";

import { Chip, ErrorAlert, Spinner } from "../ui";

interface SearchResultsProps {
  properties: Property[];
  message?: string;
  parsed?: Record<string, unknown>;
  searching: boolean;
  searchError: string;
  loadingInventory: boolean;
  inventoryError: string | null;
}

const pageSize = 30;

function formatParsedValue(key: string, value: unknown): string {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }

  if (typeof value === "number") {
    return key.toLowerCase().includes("price")
      ? formatPrice(value)
      : String(value);
  }

  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function SearchResults({
  properties,
  message,
  parsed,
  searching,
  searchError,
  loadingInventory,
  inventoryError,
}: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(properties.length / pageSize);

  const visibleProperties = properties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [properties]);

  const openProperty = (property: Property) => {
    navigate(`/properties/${property.id}`, {
      state: { property },
    });
  };

  return (
    <div className="mt-8 space-y-6" aria-live="polite">
      {/* Searching */}
      {searching && <Spinner label="Searching properties" />}

      {/* Search Error */}
      {searchError && <ErrorAlert message={searchError} />}

      {!searching && (
        <>
          {/* Results Header */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {message ? "Search Results" : "All Properties"}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {message ?? `${properties.length} properties available`}
              </p>
            </div>

            {totalPages > 1 && (
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, properties.length)} of{" "}
                {properties.length}
              </p>
            )}
          </div>

          {/* Parsed Search Filters */}
          {parsed && Object.keys(parsed).length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">We understood:</span>

              {Object.entries(parsed).map(([key, value]) => (
                <Chip key={key}>
                  {key.replaceAll("_", " ")}: {formatParsedValue(key, value)}
                </Chip>
              ))}
            </div>
          )}

          {/* Loading and Results */}
          {loadingInventory && properties.length === 0 ? (
            <Spinner label="Loading properties" />
          ) : inventoryError && properties.length === 0 ? (
            <ErrorAlert message={inventoryError} />
          ) : visibleProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProperties.map((property) => {
                const place = location([property.city, property.district]);

                const tags = [
                  formatType(property.property_type),
                  property.bedrooms ? `${property.bedrooms} bedrooms` : null,
                  property.area_size
                    ? `${property.area_size.toLocaleString()} sq.ft`
                    : null,
                  property.status
                    ? property.status.toLowerCase().replaceAll("_", " ")
                    : null,
                ].filter((tag): tag is string => Boolean(tag));

                return (
                  <article
                    key={property.id}
                    className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white transition duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-slate-950"
                  >
                    {/* Property Image */}
                    <button
                      type="button"
                      onClick={() => openProperty(property)}
                      aria-label={`View ${property.title} details`}
                      className="relative block aspect-[1.46] w-full overflow-hidden rounded-3xl bg-slate-100 text-left"
                    >
                      <img
                        src={property.image_url || propertyPlaceholder}
                        alt={property.title}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = propertyPlaceholder;
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />

                      {property.status && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700 shadow-sm">
                          {property.status.toLowerCase().replaceAll("_", " ")}
                        </span>
                      )}
                    </button>

                    {/* Property Details */}
                    <div className="flex flex-1 flex-col pt-4">
                      <h3 className="line-clamp-1 text-xl font-medium tracking-tight text-slate-950">
                        {property.title}
                      </h3>

                      {/* Property Features */}
                      <div className="mt-3 flex min-h-[60px] flex-wrap content-start gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="h-fit rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 sm:text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Location */}
                      <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                        {place || "Location not listed"}
                      </p>

                      {/* Price */}
                      <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                        {formatPrice(property.price)}
                      </p>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                        {property.description ||
                          `Explore ${property.title}${
                            place ? ` in ${place}` : ""
                          } and view the full property details.`}
                      </p>

                      {/* View Details */}
                      <div className="mt-auto flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => openProperty(property)}
                          className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                        >
                          View Details
                          <span aria-hidden="true"> →</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              {message
                ? "No properties match this search."
                : "No properties have been listed yet."}
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-8"
              aria-label="Property result pages"
            >
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <div
                role="group"
                aria-label="Choose property page"
                className="flex flex-wrap justify-center gap-2"
              >
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    aria-current={currentPage === page ? "page" : undefined}
                    onClick={() => setCurrentPage(page)}
                    className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 text-slate-700 hover:border-slate-950"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
