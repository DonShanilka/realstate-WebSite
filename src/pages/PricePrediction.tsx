import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { toNumber } from "../format";
import { Button, ErrorAlert, Field, PageHeader, SelectField, Spinner } from "../components/ui";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchPredictionStatus, predictPrice } from "../features/pricePrediction/prediction.slice";

const initial = {
  city: "Colombo",
  district: "Colombo",
  property_type: "HOUSE",
  bedrooms: "3",
  bathrooms: "2",
  house_area_sqft: "2200",
  land_area_perches: "10",
};

export default function PricePredictionPage() {
  const dispatch = useAppDispatch();
  const { result, model: status, status: requestStatus, error: requestError } = useAppSelector((state) => state.prediction);
  const [form, setForm] = useState(initial);
  const [validationError, setValidationError] = useState("");
  const loading = requestStatus === "loading";
  const error = validationError || requestError || "";

  useEffect(() => {
    if (!status) void dispatch(fetchPredictionStatus());
  }, [dispatch, status]);

  const set = (key: keyof typeof initial) => (e: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setValidationError("");
    const bedrooms = toNumber(form.bedrooms);
    const bathrooms = toNumber(form.bathrooms);
    if (!form.city.trim() || bedrooms === undefined || bathrooms === undefined) {
      return setValidationError("City, bedrooms and bathrooms are required.");
    }
    void dispatch(predictPrice({
          city: form.city.trim(),
          district: form.district.trim() || undefined,
          property_type: form.property_type,
          bedrooms,
          bathrooms,
          house_area_sqft: toNumber(form.house_area_sqft),
          land_area_perches: toNumber(form.land_area_perches),
        }));
  }

  return (
    <>
      <PageHeader
        title="Price Prediction"
        subtitle="Enter a property's details and our model estimates its market price."
      />
      <div className="grid w-full gap-8 px-[50px] py-8 sm:px-[100px] lg:grid-cols-5">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location (city)" required value={form.city} onChange={set("city")} placeholder="Colombo" />
            <Field label="District" value={form.district} onChange={set("district")} placeholder="Colombo" />
            <SelectField label="Property type" value={form.property_type} onChange={set("property_type")}>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="LAND">Land</option>
            </SelectField>
            <div />
            <Field label="Bedrooms" type="number" min={0} max={20} required value={form.bedrooms} onChange={set("bedrooms")} />
            <Field label="Bathrooms" type="number" min={0} max={20} required value={form.bathrooms} onChange={set("bathrooms")} />
            <Field label="House area (sq.ft)" type="number" min={1} value={form.house_area_sqft} onChange={set("house_area_sqft")} />
            <Field
              label="Land area (perches)"
              type="number"
              min={1}
              value={form.land_area_perches}
              onChange={set("land_area_perches")}
              hint="Optional. Not used by the model until land data is available."
            />
          </div>
          <Button type="submit" disabled={loading || status?.ready === false}>
            {loading ? "Estimating…" : "Estimate price"}
          </Button>
          {status?.ready === false && (
            <p className="text-sm text-slate-700">
              The model needs {status.minimum_training_records} historical listings; {status.usable_training_records} available.
            </p>
          )}
        </form>

        <div className="lg:col-span-2" aria-live="polite">
          {loading && <Spinner label="Calculating estimate" />}
          {error && <ErrorAlert message={error} />}
          {result && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div>
                <p className="text-sm font-medium text-slate-950">Estimated market price</p>
                <p className="mt-1 text-4xl font-bold text-slate-900">{result.display.estimated_market_price}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Expected range</p>
                <p className="text-xl font-semibold text-slate-800">{result.display.expected_range}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Covers about {Math.round(result.range_coverage * 100)}% of the model's past errors.
                </p>
              </div>
              <dl className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
                <div>
                  <dt className="text-slate-500">Listings used</dt>
                  <dd className="font-semibold text-slate-800">{result.training_rows}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Avg. error</dt>
                  <dd className="font-semibold text-slate-800">±Rs. {result.validation_mae_million.toFixed(1)}M</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Fit (R²)</dt>
                  <dd className="font-semibold text-slate-800">{result.validation_r2 ?? "–"}</dd>
                </div>
              </dl>
              <ul className="list-disc space-y-1 pl-4 text-xs text-slate-500">
                {result.limitations.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
