import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import propertyPlaceholder from "../../assets/property-placeholder.svg";
import type { Property } from "../../types";
import { formatType, location } from "../../utils/format";
import { Spinner } from "../ui";

export function LatestProjectsSection({
  projects,
  loading,
}: {
  projects: Property[];
  loading: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);

  const scrollProjects = (direction: -1 | 1) => {
    const firstCard = track.current?.firstElementChild as HTMLElement | null;
    const gap = track.current
      ? Number.parseFloat(getComputedStyle(track.current).columnGap) || 24
      : 24;
    track.current?.scrollBy({
      left:
        direction *
        ((firstCard?.offsetWidth ?? track.current.clientWidth) + gap),
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-white px-[50px] py-14 sm:px-[100px] sm:py-20">
      <div className="mb-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <h2 className="text-4xl font-medium leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Our Latest Projects
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Explore recently added homes and find a property that fits the way
            you want to live.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:justify-self-end">
          <button
            type="button"
            onClick={() => scrollProjects(-1)}
            aria-label="Previous projects"
            className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 text-xl text-slate-950 transition hover:bg-slate-100"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollProjects(1)}
            aria-label="Next projects"
            className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 text-xl text-slate-950 transition hover:bg-slate-100"
          >
            →
          </button>
          <Link
            to="/search"
            className="ml-1 inline-flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-950 transition hover:border-slate-400"
          >
            See all projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {loading && <Spinner label="Loading latest properties" />}
      {!loading && projects.length > 0 && (
        <div
          ref={track}
          className="flex items-stretch snap-x snap-mandatory gap-6 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      {!loading && projects.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          New projects will appear here when listed.
        </p>
      )}
    </section>
  );
}

function ProjectCard({ project }: { project: Property }) {
  const [imageFailed, setImageFailed] = useState(false);
  const tags = [
    project.property_type ? formatType(project.property_type) : null,
    project.bedrooms ? `${project.bedrooms} bedrooms` : null,
    project.area_size ? `${project.area_size.toLocaleString()} sq.ft` : null,
  ].filter((tag): tag is string => Boolean(tag));
  const place = location([project.city, project.district]);

  return (
    <article className="flex h-full min-w-0 basis-full shrink-0 snap-start flex-col lg:basis-[min(46vw,640px)]">
      <Link
        to={`/properties/${project.id}`}
        state={{ property: project }}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
      >
        <div className="aspect-[1.46] w-full overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={
              !imageFailed && project.image_url
                ? project.image_url
                : propertyPlaceholder
            }
            alt={project.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <h3 className="mt-5 line-clamp-1 min-h-9 text-2xl font-medium tracking-tight text-slate-950 sm:text-3xl">
          {project.title}
        </h3>
      </Link>
      <div className="mt-4 flex h-[42px] flex-nowrap gap-2.5 overflow-hidden">
        {tags.map((tag) => (
          <span
            key={tag}
            className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800"
          >
            {tag}
          </span>
        ))}
        {place && (
          <span className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800">
            {place}
          </span>
        )}
      </div>
      <p className="mt-6 min-h-[84px] max-w-2xl line-clamp-3 text-base leading-7 text-slate-600">
        {project.description ||
          `Explore ${project.title}${place ? ` in ${place}` : ""} and view the full property details.`}
      </p>
    </article>
  );
}
