import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatType, location } from "../../utils/format";
import type { Property } from "../../types";

interface PropertyDetailsModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetailsModal({
  property,
  isOpen,
  onClose,
}: PropertyDetailsModalProps) {
  const place = location([property.city, property.district]);

  /*
   * Close modal when pressing ESC
   */
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`property-title-${property.id}`}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* =====================================================
            HEADER IMAGE
        ====================================================== */}

        <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
          {property.image_url ? (
            <img
              src={property.image_url}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-slate-400">
              No image available
            </div>
          )}

          {/* Dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close property details"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-2xl text-white backdrop-blur transition hover:bg-black/70"
          >
            ×
          </button>

          {/* Property title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
                {formatType(property.property_type)}
              </span>

              {property.status && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                  {property.status}
                </span>
              )}
            </div>

            <h2
              id={`property-title-${property.id}`}
              className="text-2xl font-bold sm:text-3xl"
            >
              {property.title}
            </h2>

            {place && <p className="mt-1 text-sm text-white/80">{place}</p>}
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="p-6">
          {/* Price */}
          <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Property Price</p>

              <p className="text-3xl font-bold text-blue-700">
                {formatPrice(property.price)}
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Property ID: #{property.id}
            </div>
          </div>

          {/* =====================================================
              PROPERTY INFORMATION
          ====================================================== */}

          <section>
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Property Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Property Type"
                value={formatType(property.property_type)}
              />

              <InfoItem label="Status" value={property.status} />

              <InfoItem label="Price" value={formatPrice(property.price)} />

              <InfoItem
                label="Bedrooms"
                value={
                  property.bedrooms != null
                    ? `${property.bedrooms} bedrooms`
                    : null
                }
              />

              <InfoItem
                label="Bathrooms"
                value={
                  property.bathrooms != null
                    ? `${property.bathrooms} bathrooms`
                    : null
                }
              />

              <InfoItem
                label="Area"
                value={
                  property.area_size != null
                    ? `${property.area_size.toLocaleString()} sq.ft`
                    : null
                }
              />
            </div>
          </section>

          {/* =====================================================
              LOCATION
          ====================================================== */}

          <section className="mt-8">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Location</h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="City" value={property.city} />

              <InfoItem label="District" value={property.district} />

              <InfoItem label="Location" value={place} />
            </div>
          </section>

          {/* =====================================================
              DESCRIPTION
          ====================================================== */}

          {property.description && (
            <section className="mt-8">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Description
              </h3>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {property.description}
                </p>
              </div>
            </section>
          )}

          {/* =====================================================
              ALL PROPERTY DATA
          ====================================================== */}

          <section className="mt-8">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Property Details
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="divide-y divide-slate-200">
                <DetailRow label="Property ID" value={property.id} />

                <DetailRow label="Title" value={property.title} />

                <DetailRow
                  label="Property Type"
                  value={formatType(property.property_type)}
                />

                <DetailRow label="Status" value={property.status} />

                <DetailRow label="Price" value={formatPrice(property.price)} />

                <DetailRow label="Bedrooms" value={property.bedrooms} />

                <DetailRow label="Bathrooms" value={property.bathrooms} />

                <DetailRow
                  label="Area Size"
                  value={
                    property.area_size != null
                      ? `${property.area_size.toLocaleString()} sq.ft`
                      : null
                  }
                />

                <DetailRow label="City" value={property.city} />

                <DetailRow label="District" value={property.district} />

                <DetailRow label="Description" value={property.description} />

                <DetailRow label="Image URL" value={property.image_url} />

                <DetailRow label="Video URL" value={property.video_url} />
              </div>
            </div>
          </section>

          {/* =====================================================
              VIDEO
          ====================================================== */}

          {property.video_url && (
            <section className="mt-8">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Property Video
              </h3>

              <div className="overflow-hidden rounded-xl bg-black">
                <video
                  src={property.video_url}
                  controls
                  className="max-h-[450px] w-full"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            </section>
          )}

          {/* =====================================================
              ACTION BUTTONS
          ====================================================== */}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <Link
              to={`/assistant?ask=${encodeURIComponent(
                `Tell me everything about ${property.title}`,
              )}`}
              onClick={onClose}
              className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ask AI About This Property
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value !== null && value !== undefined && value !== ""
          ? value
          : "Not specified"}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const displayValue =
    value !== null && value !== undefined && value !== ""
      ? String(value)
      : "Not specified";

  return (
    <div className="grid gap-2 px-4 py-3 sm:grid-cols-3">
      <div className="text-sm font-medium text-slate-500">{label}</div>

      <div className="break-all text-sm text-slate-800 sm:col-span-2">
        {displayValue}
      </div>
    </div>
  );
}
