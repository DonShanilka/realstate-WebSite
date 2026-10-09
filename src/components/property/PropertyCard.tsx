import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, formatType, location } from "../../utils/format";
import type { Property } from "../../types";
import propertyPlaceholder from "../../assets/property-placeholder.svg";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from "../../features/favorites/favorites.thunks";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const { items: favorites, status: favoriteStatus } = useAppSelector(
    (state) => state.favorites,
  );

  const isFavorite = favorites.some(
    (favorite) => favorite.property_id === property.id,
  );

  useEffect(() => {
    if (token && favoriteStatus === "idle") void dispatch(fetchFavorites());
  }, [dispatch, favoriteStatus, token]);

  const place = location([property.city, property.district]);
  return (
    <article
      onClick={() =>
        navigate(`/properties/${property.id}`, { state: { property } })
      }
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/properties/${property.id}`, { state: { property } });
        }
      }}
      role="link"
      tabIndex={0}
      className="group flex h-full cursor-pointer flex-col rounded-3xl bg-white transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
    >
      <div className="relative aspect-[1.46] w-full overflow-hidden rounded-3xl bg-slate-100">
        <img
          src={
            property.image_url && !imageFailed
              ? property.image_url
              : propertyPlaceholder
          }
          alt={property.title}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          title={
            token
              ? isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
              : "Sign in to save properties"
          }
          aria-label={
            token
              ? isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
              : "Sign in to save properties"
          }
          disabled={!token}
          onClick={(event) => {
            event.stopPropagation();
            if (isFavorite) void dispatch(removeFavorite(property.id));
            else void dispatch(addFavorite(property.id));
          }}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-xl text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="line-clamp-1 text-xl font-medium tracking-tight text-slate-950 sm:text-2xl">
          {property.title}
        </h3>
        <div className="mt-3 flex min-h-[68px] flex-wrap content-start gap-2">
          {[
            formatType(property.property_type),
            property.bedrooms ? `${property.bedrooms} bedrooms` : null,
            property.area_size
              ? `${property.area_size.toLocaleString()} sq.ft`
              : null,
            place,
            property.status ? property.status.toLowerCase() : null,
          ]
            .filter((tag): tag is string => Boolean(tag))
            .map((tag) => (
              <span
                key={tag}
                className="h-fit rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 sm:text-sm"
              >
                {tag}
              </span>
            ))}
        </div>
        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
          {formatPrice(property.price)}
        </p>
        <p className="mt-2 min-h-12 line-clamp-2 text-sm leading-6 text-slate-600">
          {property.description ||
            `Explore ${property.title}${place ? ` in ${place}` : ""} and view the full property details.`}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Link
            to={`/assistant?ask=${encodeURIComponent(
              `Tell me about ${property.title} in ${
                property.city ?? "this area"
              }`,
            )}`}
            onClick={(event) => event.stopPropagation()}
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            Ask AI →
          </Link>

          <Link
            to={`/properties/${property.id}`}
            state={{ property }}
            onClick={(event) => event.stopPropagation()}
            className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-950"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PROPERTY GRID
========================================================= */

export function PropertyGrid({ properties }: { properties: Property[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
