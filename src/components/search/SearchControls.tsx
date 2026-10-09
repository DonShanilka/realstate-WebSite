import type { FormEvent } from "react";
import { Button, Field, SelectField, TextArea } from "../ui";

export type SearchMode = "natural" | "filters";

export interface SearchFilterValues {
  keyword: string;
  city: string;
  district: string;
  property_type: string;
  min_price: string;
  max_price: string;
  bedrooms: string;
  bathrooms: string;
  min_area: string;
  max_area: string;
  sort: string;
}

interface SearchControlsProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  query: string;
  onQueryChange: (query: string) => void;
  filters: SearchFilterValues;
  onFilterChange: (key: keyof SearchFilterValues, value: string) => void;
  onClearFilters: () => void;
  onSubmit: (event: FormEvent) => void;
  loading: boolean;
}

export function SearchControls({
  mode,
  onModeChange,
  query,
  onQueryChange,
  filters,
  onFilterChange,
  onClearFilters,
  onSubmit,
  loading,
}: SearchControlsProps) {
  const set =
    (key: keyof SearchFilterValues) => (event: { target: { value: string } }) =>
      onFilterChange(key, event.target.value);

  return (
    <div className="sticky top-16 z-30 -mx-[50px] bg-white/95 px-[50px] py-1 backdrop-blur sm:-mx-[100px] sm:px-[100px]">
      <div
        role="tablist"
        aria-label="Search type"
        className="mb-2 inline-flex rounded-lg bg-slate-100 p-1"
      >
        {(
          [
            ["natural", "Describe it"],
            ["filters", "Filters"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => onModeChange(value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-slate-200 bg-white p-2 sm:p-3"
      >
        {mode === "natural" ? (
          <div className="space-y-1 [&_textarea]:!h-10 [&_textarea]:!min-h-0 [&_textarea]:!resize-none [&_textarea]:!py-2">
            <TextArea
              label="What are you looking for?"
              rows={1}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="I need a 3 bedroom house in Colombo under 30 million with parking."
            />
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 [&_input]:!py-1.5 [&_select]:!py-1.5 [&_label]:!mb-0 [&_label]:!text-xs">
            <Field
              label="Keyword"
              value={filters.keyword}
              onChange={set("keyword")}
              placeholder="Villa, modern…"
            />
            <Field
              label="City"
              value={filters.city}
              onChange={set("city")}
              placeholder="Colombo"
            />
            <Field
              label="District"
              value={filters.district}
              onChange={set("district")}
              placeholder="Colombo"
            />
            <SelectField
              label="Property type"
              value={filters.property_type}
              onChange={set("property_type")}
            >
              <option value="">Any</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="LAND">Land</option>
            </SelectField>
            <Field
              label="Min price (Rs.)"
              type="number"
              min={0}
              value={filters.min_price}
              onChange={set("min_price")}
            />
            <Field
              label="Max price (Rs.)"
              type="number"
              min={0}
              value={filters.max_price}
              onChange={set("max_price")}
            />
            <Field
              label="Min bedrooms"
              type="number"
              min={0}
              value={filters.bedrooms}
              onChange={set("bedrooms")}
            />
            <Field
              label="Min bathrooms"
              type="number"
              min={0}
              value={filters.bathrooms}
              onChange={set("bathrooms")}
            />
            <Field
              label="Min area (sq.ft)"
              type="number"
              min={0}
              value={filters.min_area}
              onChange={set("min_area")}
            />
            <Field
              label="Max area (sq.ft)"
              type="number"
              min={0}
              value={filters.max_area}
              onChange={set("max_area")}
            />
            <SelectField
              label="Sort by"
              value={filters.sort}
              onChange={set("sort")}
            >
              <option value="latest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </SelectField>
          </div>
        )}
        <div className="mt-2 flex gap-2">
          <Button type="submit" disabled={loading} className="!px-3 !py-2">
            {loading ? "Searching…" : "Search"}
          </Button>
          {mode === "filters" && (
            <Button type="button" variant="secondary" onClick={onClearFilters} className="!px-3 !py-2">
              Clear
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
