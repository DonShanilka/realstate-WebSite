import { useState } from "react";
import { Link } from "react-router-dom";

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85";

export function HomeHero({
  image,
  loading,
  propertyCount,
}: {
  image?: string | null;
  loading: boolean;
  propertyCount: number;
}) {
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  return (
    <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-slate-900 text-white sm:min-h-[70vh]">
      <img
        src={image && !heroImageFailed ? image : fallbackHeroImage}
        alt={
          image
            ? "Featured home from the latest property listings"
            : "Modern architectural home"
        }
        onError={() => setHeroImageFailed(true)}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
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
                className="inline-flex items-center gap-5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
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
                <p className="text-3xl font-bold tracking-tight">
                  {loading ? "—" : `${propertyCount}+`}
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  homes to explore on EstateAI
                </p>
              </div>
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-lg text-white"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-slate-900" />
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
  );
}
