import { Link } from "react-router-dom";
import type { Property } from "../../types";
import { PropertyGrid } from "../property/PropertyCard";
import { Spinner } from "../ui";

export function LatestProjectsSection({
  projects,
  loading,
}: {
  projects: Property[];
  loading: boolean;
}) {
  return (
    <section className="w-full px-[50px] py-12 sm:px-[100px] sm:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-2xl uppercase text-slate-950">Recently added</p>
          <h2 className="mt-2 text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
            Our Latest Project
          </h2>
        </div>
        <Link
          to="/search"
          className="text-sm font-semibold text-slate-950 hover:text-black"
        >
          Explore all properties →
        </Link>
      </div>
      {loading && <Spinner label="Loading latest properties" />}
      {!loading && projects.length > 0 && (
        <PropertyGrid properties={projects} />
      )}
      {!loading && projects.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          New projects will appear here when listed.
        </p>
      )}
    </section>
  );
}
