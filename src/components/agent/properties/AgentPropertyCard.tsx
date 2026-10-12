import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

import { formatPrice, formatType, location } from "../../../utils/format";
import type { Property } from "../../../types";

import propertyPlaceholder from "../../../assets/property-placeholder.svg";

interface AgentPropertyCardProps {
  property: Property;
}

export function AgentPropertyCard({
  property,
}: AgentPropertyCardProps) {
  const navigate = useNavigate();

  const place = location([property.city, property.district]);

  const propertyTags = [
    formatType(property.property_type),
    property.bedrooms != null
      ? `${property.bedrooms} bedrooms`
      : null,
    property.area_size != null
      ? `${property.area_size.toLocaleString()} sq.ft`
      : null,
  ].filter((tag): tag is string => Boolean(tag));

  const status = property.status || "Available";

  const openPropertyDetails = () => {
    navigate(`/agent/properties/${property.id}`, {
      state: { property },
    });
  };

  const handleMessageBuyer = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    navigate(`/agent/messages?property_id=${property.id}`);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:border-slate-300 hover:shadow-lg">
      <div className="relative aspect-[1.46] w-full overflow-hidden bg-slate-100">
        <img
          src={property.image_url || propertyPlaceholder}
          alt={property.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = propertyPlaceholder;
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-slate-800 shadow-sm">
          {status.toLowerCase().replaceAll("_", " ")}
        </span>

        <span className="absolute bottom-4 right-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white">
          Agent listing
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {formatType(property.property_type)}
          </p>

          <h3 className="mt-1 line-clamp-2 text-xl font-semibold tracking-tight text-slate-950">
            {property.title}
          </h3>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <span aria-hidden="true">⌖</span>
          <span className="line-clamp-1">
            {place || "Location not listed"}
          </span>
        </p>

        {propertyTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {propertyTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs font-medium text-slate-500">
            Listed price
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            {formatPrice(property.price)}
          </p>
        </div>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
          {property.description ||
            `View the details of ${property.title}${
              place ? ` in ${place}` : ""
            }.`}
        </p>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={handleMessageBuyer}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-950 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">✉</span>
            Message Buyer
          </button>
        </div>
      </div>
    </article>
  );
}