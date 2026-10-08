import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, formatType, location } from "../../utils/format";
import type { Property } from "../../types";
import { Chip } from "../ui";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const navigate = useNavigate();

  const place = location([property.city, property.district]);
  const fallbackImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return (
      <article
        onClick={() => navigate(`/properties/${property.id}`, { state: { property } })}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate(`/properties/${property.id}`, { state: { property } });
          }
        }}
        role="link"
        tabIndex={0}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-slate-950"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
          <img
            src={property.image_url && !imageFailed ? property.image_url : fallbackImage}
            alt={property.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />
          <div className="absolute left-4 top-4">
            <Chip>{formatType(property.property_type)}</Chip>
          </div>
          {property.status && (
            <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-slate-950/25 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur-sm">
              {property.status.toLowerCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-5">
          {/* Title + Type */}
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-slate-900">{property.title}</h3>

          {/* Location */}
          {place && <p className="-mt-1 text-sm text-slate-500">⌖ <span className="ml-1">{place}</span></p>}

          {/* Price */}
          <p className="text-xl font-bold tracking-tight text-slate-900">
            {formatPrice(property.price)}
          </p>

          {/* Features */}
          <dl className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-500">
            <div>
              <dt className="sr-only">Bedrooms</dt>
              <dd>{property.bedrooms ?? "–"} bed</dd>
            </div>

            <div>
              <dt className="sr-only">Bathrooms</dt>
              <dd>{property.bathrooms ?? "–"} bath</dd>
            </div>

            {property.area_size != null && (
              <div>
                <dt className="sr-only">Area</dt>
                <dd>{property.area_size.toLocaleString()} sq.ft</dd>
              </div>
            )}
          </dl>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-1">
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
