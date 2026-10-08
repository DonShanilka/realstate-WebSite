import { Link } from "react-router-dom";

export default function Favorites() {
  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Favorites</h1>

        <p className="mt-2 text-slate-500">
          Properties you have saved for later.
        </p>
      </div>

      {/* Empty state - replace with Redux data later */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-2xl">
          ♡
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          No favorite properties yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Save properties you like and easily find them again here.
        </p>

        <Link
          to="/search"
          className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-950"
        >
          Browse Properties
        </Link>
      </div>
    </main>
  );
}
