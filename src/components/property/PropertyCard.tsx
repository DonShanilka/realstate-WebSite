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
        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden bg-blue-50">
          {property.image_url && !imageFailed ? (
            <img
              src={property.image_url}
              alt={property.title}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-blue-300">
              No photo
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Title + Type */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-900">{property.title}</h3>

            <Chip>{formatType(property.property_type)}</Chip>
          </div>

          {/* Location */}
          {place && <p className="text-sm text-slate-500">{place}</p>}

          {/* Price */}
          <p className="text-lg font-bold text-blue-700">
            {formatPrice(property.price)}
          </p>

          {/* Features */}
          <dl className="flex gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
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
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Ask AI →
            </Link>

            <Link
              to={`/properties/${property.id}`}
              state={{ property }}
              onClick={(event) => event.stopPropagation()}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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
