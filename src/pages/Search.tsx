import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchControls } from "../components/search/SearchControls";
import type {
  SearchFilterValues,
  SearchMode,
} from "../components/search/SearchControls";
import { SearchResults } from "../components/search/SearchResults";
import { runNaturalSearch, runSearch } from "../features/search/search.thunks";
import { setSearchError } from "../features/search/search.slice";
import { fetchProperties } from "../features/properties/property.thunks";
import type { SearchFilters } from "../types";
import { toNumber } from "../format";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

const emptyFilters: SearchFilterValues = {
  keyword: "",
  city: "",
  district: "",
  property_type: "",
  min_price: "",
  max_price: "",
  bedrooms: "",
  bathrooms: "",
  min_area: "",
  max_area: "",
  sort: "latest",
};

export default function Search() {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.search);
  const properties = useAppSelector((state) => state.properties);
  const initialQuery = params.get("q") ?? "";
  const [mode, setMode] = useState<SearchMode>("natural");
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(emptyFilters);

  const result = search.result;
  const resultProperties = result?.data;
  const resultMessage = result
    ? "message" in result
      ? result.message
      : result.total
        ? `Found ${result.total} properties.`
        : "No properties match these filters."
    : undefined;
  const parsed =
    result && "parsed_filters" in result ? result.parsed_filters : undefined;

  useEffect(() => {
    if (initialQuery.trim().length >= 3)
      void dispatch(runNaturalSearch(initialQuery.trim()));
  }, [dispatch, initialQuery]);

  useEffect(() => {
    if (properties.status === "idle") void dispatch(fetchProperties());
  }, [dispatch, properties.status]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (mode === "natural") {
      if (query.trim().length < 3) {
        dispatch(
          setSearchError(
            "Please describe what you are looking for (at least 3 characters).",
          ),
        );
        return;
      }
      void dispatch(runNaturalSearch(query.trim()));
      return;
    }

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
    void dispatch(runSearch(payload));
  }

  function updateFilter(key: keyof SearchFilterValues, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <main className="w-full px-[50px] py-2 sm:px-[100px]">
        <SearchControls
          mode={mode}
          onModeChange={setMode}
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={() => setFilters(emptyFilters)}
          onSubmit={submit}
          loading={search.status === "loading"}
        />
        <SearchResults
          properties={resultProperties ?? properties.items}
          message={resultMessage}
          parsed={parsed}
          searching={search.status === "loading"}
          searchError={search.error ?? ""}
          loadingInventory={
            properties.status === "idle" || properties.status === "loading"
          }
          inventoryError={properties.error}
        />
      </main>
    </>
  );
}
