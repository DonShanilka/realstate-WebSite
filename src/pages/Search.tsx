import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { formatPrice, toNumber } from "../format";
import { PropertyGrid } from "../components/property/PropertyCard";
import { Button, Chip, ErrorAlert, Field, PageHeader, SelectField, Spinner, TextArea } from "../components/ui";
import type { Property, SearchFilters } from "../types";

type Mode = "natural" | "filters";

interface Outcome {
  properties: Property[];
  message: string;
  parsed?: Record<string, string | number | string[]>;
}

const emptyFilters = {
  keyword: "", city: "", district: "", property_type: "",
  min_price: "", max_price: "", bedrooms: "", bathrooms: "",
  min_area: "", max_area: "", sort: "latest",
};

export default function Search() {
  const [params] = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [mode, setMode] = useState<Mode>("natural");
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(emptyFilters);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runNatural(text: string) {
    setLoading(true);
    setError("");
    try {
      const result = await api.naturalSearch(text);
      setOutcome({ properties: result.data, message: result.message, parsed: result.parsed_filters });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function runFilters() {
    setLoading(true);
    setError("");
    const payload: SearchFilters = {
      keyword: filters.keyword.trim() || undefined,
      city: filters.city.trim() || undefined,
      district: filters.district.trim() || undefined,
      property_type: filters.property_type || undefined,
      min_price: toNumber(filters.min_price),
      max_price: toNumber(filters.max_price),
      bedrooms: toNumber(filters.bedrooms),
      bathrooms: toNumber(filters.bathrooms),
      min_area: toNumber(filters.min_area),
      max_area: toNumber(filters.max_area),
      sort: filters.sort as SearchFilters["sort"],
    };
    try {
      const result = await api.search(payload);
      setOutcome({
        properties: result.data,
        message: result.total === 0 ? "No properties match these filters." : `Found ${result.total} properties.`,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery.trim().length >= 3) void runNatural(initialQuery.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (mode === "natural") {
      if (query.trim().length < 3) return setError("Please describe what you are looking for (at least 3 characters).");
      void runNatural(query.trim());
    } else {
      void runFilters();
    }
  }

  const set = (key: keyof typeof emptyFilters) => (e: { target: { value: string } }) =>
    setFilters((current) => ({ ...current, [key]: e.target.value }));

  return (
    <>
      <PageHeader
        title="Advanced Search"
        subtitle="Describe your ideal property in your own words, or use detailed filters."
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div role="tablist" aria-label="Search type" className="mb-5 inline-flex rounded-lg bg-slate-100 p-1">
          {([["natural", "Describe it"], ["filters", "Filters"]] as const).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === value ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          {mode === "natural" ? (
            <div className="space-y-4">
              <TextArea
                label="What are you looking for?"
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I need a 3 bedroom house in Colombo under 30 million with parking."
              />
              <p className="text-xs text-slate-500">
                We understand location, property type, bedrooms, bathrooms, budget and features like parking or a garden.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Keyword" value={filters.keyword} onChange={set("keyword")} placeholder="Villa, modern…" />
              <Field label="City" value={filters.city} onChange={set("city")} placeholder="Colombo" />
              <Field label="District" value={filters.district} onChange={set("district")} placeholder="Colombo" />
              <SelectField label="Property type" value={filters.property_type} onChange={set("property_type")}>
                <option value="">Any</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="LAND">Land</option>
              </SelectField>
              <Field label="Min price (Rs.)" type="number" min={0} value={filters.min_price} onChange={set("min_price")} />
              <Field label="Max price (Rs.)" type="number" min={0} value={filters.max_price} onChange={set("max_price")} />
              <Field label="Min bedrooms" type="number" min={0} value={filters.bedrooms} onChange={set("bedrooms")} />
              <Field label="Min bathrooms" type="number" min={0} value={filters.bathrooms} onChange={set("bathrooms")} />
              <Field label="Min area (sq.ft)" type="number" min={0} value={filters.min_area} onChange={set("min_area")} />
              <Field label="Max area (sq.ft)" type="number" min={0} value={filters.max_area} onChange={set("max_area")} />
              <SelectField label="Sort by" value={filters.sort} onChange={set("sort")}>
                <option value="latest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </SelectField>
            </div>
          )}
          <div className="mt-5 flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </Button>
            {mode === "filters" && (
              <Button type="button" variant="secondary" onClick={() => setFilters(emptyFilters)}>
                Clear
              </Button>
            )}
          </div>
        </form>

        <div className="mt-8" aria-live="polite">
          {loading && <Spinner label="Searching properties" />}
          {error && <ErrorAlert message={error} />}
          {outcome && !loading && (
            <div className="space-y-4">
              <p className="text-slate-700">{outcome.message}</p>
              {outcome.parsed && Object.keys(outcome.parsed).length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-500">We understood:</span>
                  {Object.entries(outcome.parsed).map(([key, value]) => (
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
              <PropertyGrid properties={outcome.properties} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
