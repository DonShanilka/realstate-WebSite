import { useEffect, useState } from "react";
import { formatPrice } from "../../format";
import type { Property } from "../../types";
import { PropertyGrid } from "../property/PropertyCard";
import { Chip, ErrorAlert, Spinner } from "../ui";

interface SearchResultsProps {
  properties: Property[];
  message?: string;
  parsed?: Record<string, string | number | string[]>;
  searching: boolean;
  searchError: string;
  loadingInventory: boolean;
  inventoryError: string | null;
}

const pageSize = 30;

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
  const totalPages = Math.ceil(properties.length / pageSize);
  const visibleProperties = properties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [properties]);

  return (
    <div className="mt-8 space-y-4" aria-live="polite">
      {searching && <Spinner label="Searching properties" />}
      {searchError && <ErrorAlert message={searchError} />}
      {!searching && (
        <>
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

          {parsed && Object.keys(parsed).length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">We understood:</span>
              {Object.entries(parsed).map(([key, value]) => (
                <Chip key={key}>
                  {key.replace("_", " ")}:{" "}
                  {Array.isArray(value)
                    ? value.join(", ")
                    : key.endsWith("price") && typeof value === "number"
                      ? formatPrice(value)
                      : String(value)}
                </Chip>
              ))}
            </div>
          )}

          {loadingInventory && properties.length === 0 ? (
            <Spinner label="Loading properties" />
          ) : inventoryError && properties.length === 0 ? (
            <ErrorAlert message={inventoryError} />
          ) : visibleProperties.length > 0 ? (
            <PropertyGrid properties={visibleProperties} />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              {message
                ? "No properties match this search."
                : "No properties have been listed yet."}
            </p>
          )}

          {totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 pt-4"
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
                role="tablist"
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
                    role="tab"
                    aria-selected={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-semibold transition ${currentPage === page ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 text-slate-700 hover:border-slate-950"}`}
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
