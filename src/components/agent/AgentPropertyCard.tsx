import { Link } from "react-router-dom";
import type { Property } from "../../types";
import propertyPlaceholder from "../../assets/property-placeholder.svg";
import { formatPrice } from "../../utils/format";

export function AgentPropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/properties/${property.id}`}
      state={{ property }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-400 hover:shadow-md"
    >
      <img
        src={property.image_url || propertyPlaceholder}
        alt={property.title}
        className="aspect-[1.6] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = propertyPlaceholder;
        }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold text-slate-950">
            {property.title}
          </h3>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {property.status || "Available"}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {[property.city, property.district].filter(Boolean).join(", ") ||
            "Location not listed"}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-slate-950">
            {formatPrice(property.price)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            View listing →
          </span>
        </div>
      </div>
    </Link>
  );
}
