import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../api/api";
import { ErrorAlert, Spinner } from "../components/ui";
import { formatPrice, formatType, location } from "../utils/format";
import type { Property } from "../types";

export default function PropertyDetails() {
  const { id } = useParams();
  const route = useLocation();
  const initialProperty = (route.state as { property?: Property } | null)?.property;
  const [property, setProperty] = useState<Property | null>(
    initialProperty?.id === Number(id) ? initialProperty : null,
  );
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialProperty?.id === Number(id)) {
      setProperty(initialProperty);
      setLoading(false);
      setError("");
      return;
    }
    let active = true;
    setProperty(null);
    setLoading(true);
    api.listProperties()
      .then((properties) => {
        if (!active) return;
        const found = properties.find((item) => item.id === Number(id));
        if (found) setProperty(found);
        else setError("This property could not be found.");
      })
      .catch((cause: Error) => active && setError(cause.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id, initialProperty]);

  if (loading) return <div className="w-full px-[50px] py-12 sm:px-[100px]"><Spinner label="Loading property" /></div>;
  if (error || !property) {
    return (
      <div className="w-full px-[50px] py-8 sm:px-[100px]">
        <Link to="/search" className="mb-5 inline-block text-sm font-medium text-slate-950 hover:text-black">← Back to properties</Link>
        <ErrorAlert message={error || "This property could not be found."} />
      </div>
    );
  }

  const place = location([property.address, property.city, property.district]);
  const mapQuery = encodeURIComponent(place || property.title);

  return (
    <main className="w-full px-[50px] py-5 sm:px-[100px] sm:py-8">
      <Link to="/search" className="mb-4 inline-flex text-sm font-medium text-slate-950 hover:text-black">← Back to properties</Link>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.8fr)]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl bg-slate-200">
            {property.image_url ? (
              <img src={property.image_url} alt={property.title} className="aspect-[16/7] w-full object-cover" />
            ) : (
              <div className="grid aspect-[16/7] place-items-center text-sm text-slate-500">No property photo available</div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-950">{formatType(property.property_type)}</span>
            {property.status && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-800">{property.status.toLowerCase()}</span>}
          </div>
          <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{property.title}</h1>
              {place && <p className="mt-1 text-sm text-slate-500">⌖ <span className="ml-1">{place}</span></p>}
            </div>
            <p className="shrink-0 text-2xl font-bold text-slate-950">{formatPrice(property.price)}</p>
          </div>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="text-base font-bold text-slate-900">Property features</h2>
            <div className="mt-3 grid grid-cols-2 gap-y-3 sm:grid-cols-4">
              <Feature label="Bedrooms" value={property.bedrooms != null ? `${property.bedrooms}` : "—"} detail="Bedrooms" />
              <Feature label="Bathrooms" value={property.bathrooms != null ? `${property.bathrooms}` : "—"} detail="Bathrooms" />
              <Feature label="Area" value={property.area_size != null ? property.area_size.toLocaleString() : "—"} detail="sq. ft." />
              <Feature label="Listing" value={formatType(property.property_type)} detail={property.status || "Property"} />
            </div>
          </section>

          {property.description && (
            <section className="mt-5">
              <h2 className="text-base font-bold text-slate-900">About this property</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{property.description}</p>
            </section>
          )}

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Location</h2>
                <p className="mt-1 text-sm text-slate-500">{place || "Location not specified"}</p>
              </div>
              {place && <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-semibold text-slate-950 hover:text-black">Open map ↗</a>}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Asking price</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{formatPrice(property.price)}</p>
            <p className="mt-1 text-sm text-slate-500">{formatType(property.property_type)}{place ? ` · ${place}` : ""}</p>
            <div className="my-4 border-t border-slate-100" />
            <dl className="space-y-2 text-sm">
              <SummaryRow label="Property ID" value={`#${property.id}`} />
              <SummaryRow label="Status" value={property.status || "Not specified"} />
              <SummaryRow label="District" value={property.district || "Not specified"} />
            </dl>
            <Link to={`/assistant?ask=${encodeURIComponent(`Tell me everything about ${property.title}`)}`} className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black">Ask AI about this property</Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-bold text-slate-900">Property video</h2>
            {property.video_url ? (
              <video src={property.video_url} controls className="max-h-56 w-full rounded-xl bg-slate-950" aria-label={`Video tour of ${property.title}`} />
            ) : (
              <div className="grid aspect-video place-items-center rounded-xl bg-slate-100 text-center text-sm text-slate-400"><span><span className="mb-1 block text-2xl">▷</span>Video tour not available</span></div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function Feature({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div><p className="text-xs font-medium text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-slate-900">{value}</p><p className="text-xs text-slate-500">{detail}</p></div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold capitalize text-slate-800">{value}</dd></div>;
}
