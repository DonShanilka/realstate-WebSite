import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { PropertyGrid } from "../components/property/PropertyCard";
import { ErrorAlert, Spinner } from "../components/ui";
import type { Property } from "../types";

const tools = [
  {
    number: "01",
    title: "Search your way",
    text: "Find a home with plain language or precise filters for location, price and features.",
    to: "/search",
    action: "Explore search",
  },
  {
    number: "02",
    title: "Ask for a second opinion",
    text: "Compare listings and get practical answers from the EstateAI property assistant.",
    to: "/assistant",
    action: "Meet the assistant",
  },
  {
    number: "03",
    title: "Understand the price",
    text: "Get a data-backed estimate and expected range for a property in Sri Lanka.",
    to: "/price-prediction",
    action: "Estimate a price",
  },
];

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const heroImage = properties.find((property) => property.image_url)?.image_url;

  useEffect(() => {
    api
      .listProperties()
      .then((list) => {
        setTotalProperties(list.length);
        setProperties(list.slice(0, 6));
      })
      .catch((cause: Error) => setError(cause.message))
      .finally(() => setLoading(false));
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length >= 3) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <>
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-slate-900 text-white sm:min-h-[70vh]">
        {heroImage && !heroImageFailed ? (
          <img
            src={heroImage}
            alt="Featured home from the latest property listings"
            onError={() => setHeroImageFailed(true)}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : (
          <img
            src={fallbackHeroImage}
            alt="Modern architectural home"
            onError={() => setHeroImageFailed(true)}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-slate-950/5" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/5" />

        <div className="relative w-full px-[50px] pb-10 pt-14 sm:px-[100px] sm:pb-14 sm:pt-16">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            <span className="h-px w-8 bg-white/70" />
            Find your place in Sri Lanka
          </div>

          <h1 className="mt-7 max-w-6xl text-[clamp(3.6rem,11vw,10rem)] font-semibold uppercase leading-[0.78] tracking-[-0.075em] text-white">
            Find your
            <br />
            <span className="text-white/75">place.</span>
          </h1>

          <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-md">
              <p className="text-lg leading-snug text-white sm:text-xl">
                A better way to discover a home that feels like yours.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
                >
                  Explore properties <span aria-hidden="true">↗</span>
                </Link>
                <Link
                  to="/assistant"
                  className="inline-flex items-center rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ask EstateAI
                </Link>
              </div>
            </div>

            <div className="w-full max-w-xs self-end rounded-2xl border border-white/30 bg-white/95 p-5 text-slate-900 shadow-xl backdrop-blur-sm lg:mb-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold tracking-tight">{loading ? "—" : `${totalProperties}+`}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">homes to explore on EstateAI</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-lg text-white" aria-hidden="true">↗</span>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                New listings, search and AI insights
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-5 top-6 hidden text-right text-[10px] font-medium uppercase tracking-[0.22em] text-white/75 sm:block sm:right-8">
          <span className="block">Homes, considered</span>
          <span className="mt-1 block">EstateAI · Sri Lanka</span>
        </div>
      </section>

      <section className="w-full px-[50px] py-12 sm:px-[100px] sm:py-16">
        <div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">A considered move</p>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Find the right home, with a little more clarity.
            </h2>
            <form onSubmit={onSubmit} className="flex w-full max-w-md shrink-0 rounded-full border border-slate-300 bg-white p-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15">
              <label htmlFor="home-search" className="sr-only">Describe the property you want</label>
              <input
                id="home-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try ‘a 3 bedroom home in Colombo’"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button type="submit" aria-label="Search properties" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-700 text-lg text-white transition hover:bg-blue-800">→</button>
            </form>
          </div>
        </div>

        <div className="grid gap-4 pt-8 md:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-slate-900/5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.16em] text-slate-400">{tool.number}</span>
                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" aria-hidden="true">↗</span>
              </div>
              <h3 className="mt-7 text-lg font-semibold text-slate-900">{tool.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{tool.text}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-blue-700">{tool.action}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="w-full bg-slate-50 px-[50px] py-12 sm:px-[100px] sm:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">A place to begin</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Latest properties</h2>
          </div>
          <Link to="/search" className="text-sm font-semibold text-blue-700 hover:text-blue-900">Browse all properties →</Link>
        </div>
        {loading && <Spinner label="Loading properties" />}
        {error && <ErrorAlert message={error} />}
        {!loading && !error && properties.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No properties have been listed yet.</p>
        )}
        {properties.length > 0 && <PropertyGrid properties={properties} />}
      </section>
    </>
  );
}
