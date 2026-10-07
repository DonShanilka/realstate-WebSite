import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { PropertyGrid } from "../components/property/PropertyCard";
import { Button, ErrorAlert, Spinner } from "../components/ui";
import type { Property } from "../types";

const features = [
  {
    to: "/search",
    title: "Advanced Search",
    text: "Describe the home you want in plain words, or fine-tune filters for price, rooms and area.",
  },
  {
    to: "/assistant",
    title: "AI Assistant",
    text: "Ask which property suits your family and get an answer based on real listings.",
  },
  {
    to: "/price-prediction",
    title: "Price Prediction",
    text: "Enter a property's details to get an estimated market price and expected range.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listProperties()
      .then((list) => setProperties(list.slice(0, 6)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length >= 3) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find a home that fits your life, <span className="text-blue-600">with a little AI.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Search in plain English, ask our assistant for advice, and check what a property is worth.
          </p>
          <form onSubmit={onSubmit} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <label htmlFor="home-search" className="sr-only">
              Describe the property you want
            </label>
            <input
              id="home-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 3 bedroom house in Colombo under 30 million"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            <Button type="submit" className="px-6 py-3">
              Search
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-4 sm:px-6 md:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.to}
            to={feature.to}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
          >
            <h2 className="font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-1.5 text-sm text-slate-600">{feature.text}</p>
            <span className="mt-3 inline-block text-sm font-medium text-blue-600">Open →</span>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Latest properties</h2>
          <Link to="/search" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Browse with filters →
          </Link>
        </div>
        {loading && <Spinner label="Loading properties" />}
        {error && <ErrorAlert message={error} />}
        {!loading && !error && properties.length === 0 && (
          <p className="text-slate-500">No properties have been listed yet.</p>
        )}
        <PropertyGrid properties={properties} />
      </section>
    </>
  );
}
