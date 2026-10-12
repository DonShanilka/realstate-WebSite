import { useEffect } from "react";
import { Link } from "react-router-dom";
// import { PropertyGrid } from "../../components/property/PropertyCard";
import { ErrorAlert, Spinner } from "../../components/ui";
import { fetchFavorites } from "../../features/favorites/favorites.thunks";
import { fetchProperties } from "../../features/properties/property.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function Favorites() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites);
  const properties = useAppSelector((state) => state.properties);

  useEffect(() => {
    if (auth.token && favorites.status === "idle")
      void dispatch(fetchFavorites());
    if (auth.token && properties.status === "idle")
      void dispatch(fetchProperties());
  }, [auth.token, dispatch, favorites.status, properties.status]);

  const cards = favorites.items
    .map(
      (item) =>
        item.property ??
        properties.items.find((property) => property.id === item.property_id),
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Favorites</h1>

        <p className="mt-2 text-slate-500">
          Properties you have saved for later.
        </p>
      </div>

      {!auth.token && (
        <div className="mb-5">
          <ErrorAlert message="Sign in to view your saved properties." />
        </div>
      )}
      {favorites.status === "loading" && <Spinner label="Loading favorites" />}
      {favorites.error && <ErrorAlert message={favorites.error} />}
      {/* {favorites.status === "succeeded" && cards.length > 0 && (
        <PropertyGrid properties={cards} />
      )} */}
      {auth.token &&
        favorites.status === "succeeded" &&
        favorites.items.length === 0 && (
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
        )}
    </main>
  );
}
