import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatType, location } from "../format";
import type { Property } from "../types";
import { Chip } from "./ui";

export function PropertyCard({ property }: { property: Property }) {
  const [imageFailed, setImageFailed] = useState(false);
  const place = location([property.city, property.district]);
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-lg hover:shadow-blue-900/5">
      <div className="aspect-[16/10] bg-blue-50">
        {property.image_url && !imageFailed ? (
          <img
            src={property.image_url}
            alt={property.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-blue-300">No photo</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-900">{property.title}</h3>
          <Chip>{formatType(property.property_type)}</Chip>
        </div>
        {place && <p className="text-sm text-slate-500">{place}</p>}
        <p className="text-lg font-bold text-blue-700">{formatPrice(property.price)}</p>
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
        <Link
          to={`/assistant?ask=${encodeURIComponent(`Tell me about ${property.title} in ${property.city ?? "this area"}`)}`}
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Ask AI about this →
        </Link>
      </div>
    </article>
  );
}

export function PropertyGrid({ properties }: { properties: Property[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
