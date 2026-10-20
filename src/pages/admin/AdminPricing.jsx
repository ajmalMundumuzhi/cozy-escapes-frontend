
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";

const EMPTY_PRICING = {
  nightlyRate: "",
  cleaningFee: 0,
  minNights: 1,
  currency: "AUD",
  pricingNotes: "",
  weekendRates: [],
  seasonalRates: [],
  taxes: [],
  additionalFees: [],
};

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function getError(error) {
  return (
    error?.response?.data?.error?.message ||
    error?.message ||
    "Something went wrong."
  );
}

function formatMoney(value, currency = "AUD") {
  if (value === null || value === undefined || value === "") return "—";

  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
}

function toPricing(property) {
  return {
    ...EMPTY_PRICING,
    ...(property?.pricing || {}),
    nightlyRate: property?.pricing?.nightlyRate ?? "",
    cleaningFee: property?.pricing?.cleaningFee ?? 0,
    minNights: property?.pricing?.minNights ?? 1,
    currency: property?.pricing?.currency || "AUD",
    pricingNotes: property?.pricing?.pricingNotes || "",
    weekendRates: (property?.pricing?.weekendRates || []).map((rate) => ({
      ...rate,
      dayOfWeek: String(rate.dayOfWeek),
      nightlyRate: String(rate.nightlyRate ?? ""),
    })),
    seasonalRates: (property?.pricing?.seasonalRates || []).map((rate) => ({
      ...rate,
      name: rate.name || "",
      startDate: rate.startDate ? String(rate.startDate).slice(0, 10) : "",
      endDate: rate.endDate ? String(rate.endDate).slice(0, 10) : "",
      nightlyRate: String(rate.nightlyRate ?? ""),
    })),
    taxes: (property?.pricing?.taxes || []).map((tax) => ({
      ...tax,
      name: tax.name || "",
      rate: String(tax.rate ?? ""),
      appliesTo: Array.isArray(tax.appliesTo)
        ? tax.appliesTo
        : tax.appliesTo
          ? [tax.appliesTo]
          : ["accommodation"],
    })),
    additionalFees: (property?.pricing?.additionalFees || []).map((fee) => ({
      ...fee,
      name: fee.name || "",
      amount: String(fee.amount ?? ""),
      calculation: fee.calculation || "fixed_per_booking",
      taxable: Boolean(fee.taxable),
    })),
  };
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  step = "0.01",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        type="number"
        min={min}
        step={step}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
      />
    </label>
  );
}

function TextField({ label, value, onChange, required = false, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
      />
    </label>
  );
}

export default function AdminPricing() {
  const [properties, setProperties] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [pricing, setPricing] = useState(EMPTY_PRICING);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.properties({ limit: "100" });
      const payload = unwrap(response);

      const list = Array.isArray(payload)
        ? payload
        : payload?.properties || payload?.items || [];

      setProperties(list);

      setSelectedId((current) =>
        list.some((item) => item._id === current)
          ? current
          : list[0]?._id || ""
      );
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const selectedProperty = properties.find(
    (property) => property._id === selectedId
  );

  useEffect(() => {
    setPricing(toPricing(selectedProperty));
  }, [selectedProperty]);

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return properties;

    return properties.filter((property) =>
      [
        property.title,
        property.propertyId,
        property.location,
        property.city,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [properties, search]);

  function changeField(field, value) {
    setPricing((current) => ({ ...current, [field]: value }));
    setSuccess("");
  }

  function updateArrayItem(field, index, key, value) {
    setPricing((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
    setSuccess("");
  }

  function addArrayItem(field, item) {
    setPricing((current) => ({
      ...current,
      [field]: [...current[field], item],
    }));
    setSuccess("");
  }

  function removeArrayItem(field, index) {
    setPricing((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProperty) {
      setError("Select a property first.");
      return;
    }

    const nightlyRate = Number(pricing.nightlyRate);
    const cleaningFee = Number(pricing.cleaningFee);
    const minNights = Number(pricing.minNights);

    if (!Number.isFinite(nightlyRate) || nightlyRate <= 0) {
      setError("Nightly rate must be greater than zero.");
      return;
    }

    if (!Number.isFinite(cleaningFee) || cleaningFee < 0) {
      setError("Cleaning fee cannot be negative.");
      return;
    }

    if (!Number.isInteger(minNights) || minNights < 1) {
      setError("Minimum nights must be a whole number of at least 1.");
      return;
    }

    const weekendRates = pricing.weekendRates.map((rate) => ({
      ...rate,
      dayOfWeek: Number(rate.dayOfWeek),
      nightlyRate: Number(rate.nightlyRate),
    }));

    const seasonalRates = pricing.seasonalRates.map((rate) => ({
      ...rate,
      nightlyRate: Number(rate.nightlyRate),
    }));

    const taxes = pricing.taxes.map((tax) => ({
      ...tax,
      rate: Number(tax.rate),
    }));

    const additionalFees = pricing.additionalFees.map((fee) => ({
      ...fee,
      amount: Number(fee.amount),
      taxable: Boolean(fee.taxable),
    }));

    if (
      weekendRates.some(
        (rate) =>
          !Number.isInteger(rate.dayOfWeek) ||
          rate.dayOfWeek < 0 ||
          rate.dayOfWeek > 6 ||
          !Number.isFinite(rate.nightlyRate) ||
          rate.nightlyRate <= 0
      )
    ) {
      setError("Check weekend rates. Select a valid day and positive nightly rate.");
      return;
    }

    if (
      seasonalRates.some(
        (rate) =>
          !rate.name.trim() ||
          !rate.startDate ||
          !rate.endDate ||
          rate.endDate <= rate.startDate ||
          !Number.isFinite(rate.nightlyRate) ||
          rate.nightlyRate <= 0
      )
    ) {
      setError("Check seasonal rates. Each needs a name, valid dates, and positive nightly rate.");
      return;
    }

    if (
      taxes.some(
        (tax) =>
          !tax.name.trim() ||
          !Number.isFinite(tax.rate) ||
          tax.rate < 0 ||
          tax.rate > 100 ||
          !tax.appliesTo?.length
      )
    ) {
      setError("Check taxes. Rates must be between 0 and 100%, with at least one applicable category.");
      return;
    }

    if (
      additionalFees.some(
        (fee) =>
          !fee.name.trim() ||
          !Number.isFinite(fee.amount) ||
          fee.amount < 0 ||
          !["fixed_per_booking", "per_night", "per_guest_per_night"].includes(
            fee.calculation
          )
      )
    ) {
      setError("Check additional fees. Names, non-negative amounts, and valid calculations are required.");
      return;
    }

    setSaving(true);

    try {
      const updatedPricing = {
        ...pricing,
        nightlyRate,
        cleaningFee,
        minNights,
        currency: pricing.currency,
        pricingNotes: pricing.pricingNotes,
        weekendRates,
        seasonalRates,
        taxes,
        additionalFees,
      };

      const response = await adminApi.updateProperty(selectedId, {
        pricing: updatedPricing,
      });

      const payload = unwrap(response);
      const updatedProperty = payload?.property || payload;

      setProperties((current) =>
        current.map((property) =>
          property._id === selectedId
            ? { ...property, ...updatedProperty }
            : property
        )
      );

      setPricing(toPricing({ ...selectedProperty, ...updatedProperty }));
      setSuccess("Pricing saved successfully.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900";

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-gray-900">
              Pricing Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage property rates, seasonal pricing, taxes, and additional fees.
            </p>
          </header>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900">Properties</h2>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search properties..."
                className={`${inputClass} mt-3`}
              />

              {loading ? (
                <p className="py-6 text-sm text-gray-500">Loading properties...</p>
              ) : filteredProperties.length === 0 ? (
                <p className="py-6 text-sm text-gray-500">No properties found.</p>
              ) : (
                <div className="mt-3 max-h-[600px] space-y-2 overflow-y-auto">
                  {filteredProperties.map((property) => (
                    <button
                      key={property._id}
                      type="button"
                      onClick={() => {
                        setSelectedId(property._id);
                        setError("");
                        setSuccess("");
                      }}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selectedId === property._id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="block font-medium text-gray-900">
                        {property.title || "Untitled property"}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        ID: {property.propertyId || "—"}
                      </span>
                      <span className="mt-2 block text-sm text-gray-700">
                        {formatMoney(
                          property.pricing?.nightlyRate,
                          property.pricing?.currency || "AUD"
                        )}{" "}
                        / night
                      </span>
                      <span
                        className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          property.pricingConfigured
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {property.pricingConfigured
                          ? "Pricing configured"
                          : "Pricing incomplete"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </aside>

            <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              {!selectedProperty ? (
                <p className="py-10 text-center text-sm text-gray-500">
                  Select a property to manage its pricing.
                </p>
              ) : (
                <form onSubmit={handleSave} className="space-y-8">
                  <div className="border-b border-gray-200 pb-5">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedProperty.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedProperty.location || selectedProperty.city || "Location not set"}
                    </p>
                    <p className="mt-3 text-sm text-gray-600">
                      Current base rate:{" "}
                      <strong>
                        {formatMoney(
                          selectedProperty.pricing?.nightlyRate,
                          selectedProperty.pricing?.currency || "AUD"
                        )}
                      </strong>{" "}
                      per night
                    </p>
                  </div>

                  <section>
                    <h3 className="mb-4 font-semibold text-gray-900">
                      Base pricing
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <NumberField
                        label="Nightly rate"
                        value={pricing.nightlyRate}
                        min={0.01}
                        required
                        onChange={(value) => changeField("nightlyRate", value)}
                      />

                      <NumberField
                        label="Cleaning fee"
                        value={pricing.cleaningFee}
                        min={0}
                        onChange={(value) => changeField("cleaningFee", value)}
                      />

                      <NumberField
                        label="Minimum nights"
                        value={pricing.minNights}
                        min={1}
                        step="1"
                        required
                        onChange={(value) => changeField("minNights", value)}
                      />

                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-gray-700">
                          Currency
                        </span>
                        <select
                          value={pricing.currency}
                          onChange={(event) => changeField("currency", event.target.value)}
                          className={inputClass}
                        >
                          <option value="AUD">AUD — Australian Dollar</option>
                          <option value="USD">USD — US Dollar</option>
                          <option value="INR">INR — Indian Rupee</option>
                          <option value="GBP">GBP — British Pound</option>
                          <option value="EUR">EUR — Euro</option>
                          <option value="NZD">NZD — New Zealand Dollar</option>
                        </select>
                      </label>
                    </div>

                    <div className="mt-4">
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-gray-700">
                          Pricing notes
                        </span>
                        <textarea
                          rows={3}
                          value={pricing.pricingNotes}
                          onChange={(event) => changeField("pricingNotes", event.target.value)}
                          placeholder="Optional pricing information"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900">Weekend rates</h3>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("weekendRates", {
                            dayOfWeek: "6",
                            nightlyRate: "",
                          })
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        + Add rate
                      </button>
                    </div>

                    {pricing.weekendRates.length === 0 && (
                      <p className="text-sm text-gray-500">No custom weekend rates.</p>
                    )}

                    <div className="space-y-3">
                      {pricing.weekendRates.map((rate, index) => (
                        <div key={index} className="grid gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-[1fr_1fr_auto]">
                          <select
                            aria-label="Weekend rate day"
                            value={rate.dayOfWeek}
                            onChange={(event) => updateArrayItem("weekendRates", index, "dayOfWeek", event.target.value)}
                            className={inputClass}
                          >
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, dayIndex) => (
                              <option key={day} value={String(dayIndex)}>{day}</option>
                            ))}
                          </select>
                          <input
                            aria-label="Weekend nightly rate"
                            type="number"
                            min="0.01"
                            step="0.01"
                            required
                            value={rate.nightlyRate}
                            onChange={(event) => updateArrayItem("weekendRates", index, "nightlyRate", event.target.value)}
                            className={inputClass}
                            placeholder="Nightly rate"
                          />
                          <button type="button" onClick={() => removeArrayItem("weekendRates", index)} className="text-sm font-medium text-red-600">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900">Seasonal rates</h3>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("seasonalRates", {
                            name: "",
                            startDate: "",
                            endDate: "",
                            nightlyRate: "",
                          })
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        + Add season
                      </button>
                    </div>

                    {pricing.seasonalRates.map((rate, index) => (
                      <div key={index} className="mb-3 grid gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-2">
                        <TextField label="Season name" value={rate.name} required onChange={(value) => updateArrayItem("seasonalRates", index, "name", value)} />
                        <NumberField label="Nightly rate" value={rate.nightlyRate} min={0.01} required onChange={(value) => updateArrayItem("seasonalRates", index, "nightlyRate", value)} />
                        <TextField label="Start date" type="date" value={rate.startDate} required onChange={(value) => updateArrayItem("seasonalRates", index, "startDate", value)} />
                        <TextField label="End date" type="date" value={rate.endDate} required onChange={(value) => updateArrayItem("seasonalRates", index, "endDate", value)} />
                        <button type="button" onClick={() => removeArrayItem("seasonalRates", index)} className="text-left text-sm font-medium text-red-600 sm:col-span-2">
                          Remove season
                        </button>
                      </div>
                    ))}

                    {pricing.seasonalRates.length === 0 && (
                      <p className="text-sm text-gray-500">No seasonal rates.</p>
                    )}
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900">Taxes</h3>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("taxes", {
                            name: "",
                            rate: "",
                            appliesTo: ["accommodation"],
                          })
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        + Add tax
                      </button>
                    </div>

                    {pricing.taxes.map((tax, index) => (
                      <div key={index} className="mb-3 space-y-3 rounded-lg border border-gray-200 p-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <TextField label="Tax name" value={tax.name} required onChange={(value) => updateArrayItem("taxes", index, "name", value)} />
                          <NumberField label="Rate (%)" value={tax.rate} min={0} required onChange={(value) => updateArrayItem("taxes", index, "rate", value)} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Apply tax to</p>
                        <div className="flex flex-wrap gap-4">
                          {[
                            ["accommodation", "Accommodation"],
                            ["cleaning", "Cleaning"],
                            ["additional_fees", "Additional fees"],
                          ].map(([value, label]) => (
                            <label key={value} className="flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={tax.appliesTo.includes(value)}
                                onChange={(event) => {
                                  const next = event.target.checked
                                    ? [...tax.appliesTo, value]
                                    : tax.appliesTo.filter((item) => item !== value);
                                  updateArrayItem("taxes", index, "appliesTo", next);
                                }}
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                        <button type="button" onClick={() => removeArrayItem("taxes", index)} className="text-sm font-medium text-red-600">
                          Remove tax
                        </button>
                      </div>
                    ))}

                    {pricing.taxes.length === 0 && (
                      <p className="text-sm text-gray-500">No taxes configured.</p>
                    )}
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900">Additional fees</h3>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("additionalFees", {
                            name: "",
                            amount: "",
                            calculation: "fixed_per_booking",
                            taxable: false,
                          })
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        + Add fee
                      </button>
                    </div>

                    {pricing.additionalFees.map((fee, index) => (
                      <div key={index} className="mb-3 grid gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-2">
                        <TextField label="Fee name" value={fee.name} required onChange={(value) => updateArrayItem("additionalFees", index, "name", value)} />
                        <NumberField label="Amount" value={fee.amount} min={0} required onChange={(value) => updateArrayItem("additionalFees", index, "amount", value)} />
                        <label className="block">
                          <span className="mb-1.5 block text-sm font-medium text-gray-700">Calculation</span>
                          <select value={fee.calculation} onChange={(event) => updateArrayItem("additionalFees", index, "calculation", event.target.value)} className={inputClass}>
                            <option value="fixed_per_booking">Fixed per booking</option>
                            <option value="per_night">Per night</option>
                            <option value="per_guest_per_night">Per guest per night</option>
                          </select>
                        </label>
                        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
                          <input type="checkbox" checked={fee.taxable} onChange={(event) => updateArrayItem("additionalFees", index, "taxable", event.target.checked)} />
                          Taxable fee
                        </label>
                        <button type="button" onClick={() => removeArrayItem("additionalFees", index)} className="text-left text-sm font-medium text-red-600 sm:col-span-2">
                          Remove fee
                        </button>
                      </div>
                    ))}

                    {pricing.additionalFees.length === 0 && (
                      <p className="text-sm text-gray-500">No additional fees.</p>
                    )}
                  </section>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
                    <p className="text-sm text-gray-500">
                      All pricing values use {pricing.currency}.
                    </p>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Saving pricing..." : "Save pricing"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
