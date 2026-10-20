import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import adminApi from "../../services/adminApi";

const initialForm = {
  title: "",
  location: "",
  address: "",
  city: "Sydney",
  state: "NSW",
  country: "Australia",
  description: [""],
  images: [],
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  amenities: [],
  amenityGroups: [],
  pricing: {
    nightlyRate: "",
    cleaningFee: 0,
    minNights: 1,
    currency: "AUD",
    weekendRates: [],
    seasonalRates: [],
    taxes: [],
    additionalFees: [],
    pricingNotes: "",
  },
  cancellationPolicy: {
    rules: [
      { daysBeforeArrival: 14, refundPercentage: 100 },
      { daysBeforeArrival: 7, refundPercentage: 50 },
    ],
    notes: "",
  },
  houseRules: [""],
  checkInTime: "15:00",
  checkOutTime: "10:00",
  timezone: "Australia/Sydney",
  isActive: true,
  isFeatured: false,
  isPlaceholder: false,
  sortOrder: 0,
  pricingConfigured: false,
};

const inputClass =
  "w-full min-w-0 rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-700";
const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="min-w-0 space-y-4 border-b border-stone-200 pb-6 sm:space-y-5 sm:pb-7">
      <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

function ListEditor({ title, items, onChange, placeholder = "Enter value" }) {
  const values = items?.length ? items : [""];

  return (
    <div className="min-w-0 space-y-2 sm:col-span-2 xl:col-span-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{title}</p>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="text-sm font-semibold text-blue-700"
        >
          + Add
        </button>
      </div>
      {values.map((value, index) => (
        <div key={index} className="flex min-w-0 gap-2">
          <input
            className={inputClass}
            value={value}
            placeholder={placeholder}
            onChange={(event) =>
              onChange(
                values.map((item, i) =>
                  i === index ? event.target.value : item
                )
              )
            }
          />
          <button
            type="button"
            aria-label={`Remove ${title} ${index + 1}`}
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="rounded-lg border px-3 text-red-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminPropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [propertyId, setPropertyId] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;

    let active = true;

    adminApi
      .property(id)
      .then(({ property }) => {
        if (!active) return;

        setPropertyId(property.propertyId || property.id || "");
        setForm({
          ...initialForm,
          ...property,
          description: property.description?.length
            ? property.description
            : [""],
          images: property.images || [],
          amenities: property.amenities || [],
          amenityGroups: property.amenityGroups || [],
          houseRules: property.houseRules?.length
            ? property.houseRules
            : [""],
          pricing: {
            ...initialForm.pricing,
            ...(property.pricing || {}),
          },
          cancellationPolicy: {
            ...initialForm.cancellationPolicy,
            ...(property.cancellationPolicy || {}),
          },
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [editing, id]);

  function setValue(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleImageSelection(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setUploadError(
        "Some files were skipped. Select image files smaller than 10 MB each."
      );
    } else {
      setUploadError("");
    }

    if (!validFiles.length) return;

    setUploadingImages(true);

    try {
      const uploadedImages = [];

      // Sequential uploads preserve the order in which files were selected.
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await adminApi.uploadImage(formData);
        const result = response?.data?.data ?? response?.data ?? response;
        const uploaded = result?.data ?? result;

        if (!uploaded?.url) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        uploadedImages.push({
          url: uploaded.url,
          publicId: uploaded.publicId || null,
          alt: file.name.replace(/\.[^/.]+$/, ""),
          order: 0,
        });
      }

      setForm((current) => {
        const images = [...(current.images || []), ...uploadedImages];

        return {
          ...current,
          images: images.map((image, order) => ({ ...image, order })),
        };
      });

      setUploadError("");
    } catch (err) {
      setUploadError(
        err.message || "Image upload failed. Please try again."
      );
    } finally {
      setUploadingImages(false);
    }
  }

  function removeImage(indexToRemove) {
    setForm((current) => ({
      ...current,
      images: current.images
        .filter((_, index) => index !== indexToRemove)
        .map((image, order) => ({ ...image, order })),
    }));
  }

  function moveImage(index, direction) {
    setForm((current) => {
      const images = [...current.images];
      const target = index + direction;

      if (target < 0 || target >= images.length) return current;

      [images[index], images[target]] = [images[target], images[index]];

      return {
        ...current,
        images: images.map((image, order) => ({ ...image, order })),
      };
    });
  }

  function setPricing(name, value) {
    setForm((current) => ({
      ...current,
      pricing: { ...current.pricing, [name]: value },
    }));
  }

  function setPolicy(name, value) {
    setForm((current) => ({
      ...current,
      cancellationPolicy: {
        ...current.cancellationPolicy,
        [name]: value,
      },
    }));
  }

  function setArrayItem(arrayName, index, key, value) {
    const items = [...form[arrayName]];
    items[index] = { ...items[index], [key]: value };
    setValue(arrayName, items);
  }

  function setPricingArray(arrayName, index, key, value) {
    const items = [...form.pricing[arrayName]];
    items[index] = { ...items[index], [key]: value };
    setPricing(arrayName, items);
  }

  function addPricingItem(arrayName, item) {
    setPricing(arrayName, [...form.pricing[arrayName], item]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Property title is required.");
      return;
    }

    if (
      !Number.isFinite(Number(form.guests)) ||
      Number(form.guests) < 1 ||
      !Number.isFinite(Number(form.bedrooms)) ||
      Number(form.bedrooms) < 0 ||
      !Number.isFinite(Number(form.bathrooms)) ||
      Number(form.bathrooms) < 0
    ) {
      setError("Enter valid guest, bedroom and bathroom counts.");
      return;
    }

    if (
      form.pricing.nightlyRate !== "" &&
      (!Number.isFinite(Number(form.pricing.nightlyRate)) ||
        Number(form.pricing.nightlyRate) < 0)
    ) {
      setError("Nightly rate must be zero or greater.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      guests: Number(form.guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sortOrder: Number(form.sortOrder) || 0,
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
      description: form.description.map((v) => v.trim()).filter(Boolean),
      amenities: form.amenities.map((v) => v.trim()).filter(Boolean),
      houseRules: form.houseRules.map((v) => v.trim()).filter(Boolean),
      images: form.images.filter((image) => image.url?.trim()),
      pricing: {
        ...form.pricing,
        nightlyRate:
          form.pricing.nightlyRate === ""
            ? null
            : Number(form.pricing.nightlyRate),
        cleaningFee: Number(form.pricing.cleaningFee) || 0,
        minNights: Number(form.pricing.minNights) || 1,
        weekendRates: form.pricing.weekendRates.map((v) => ({
          dayOfWeek: Number(v.dayOfWeek),
          nightlyRate: Number(v.nightlyRate),
        })),
        seasonalRates: form.pricing.seasonalRates.map((v) => ({
          ...v,
          nightlyRate: Number(v.nightlyRate),
        })),
        taxes: form.pricing.taxes.map((v) => ({
          ...v,
          rate: Number(v.rate),
        })),
        additionalFees: form.pricing.additionalFees.map((v) => ({
          ...v,
          amount: Number(v.amount),
        })),
      },
      cancellationPolicy: {
        ...form.cancellationPolicy,
        rules: form.cancellationPolicy.rules.map((v) => ({
          daysBeforeArrival: Number(v.daysBeforeArrival),
          refundPercentage: Number(v.refundPercentage),
        })),
      },
    };

    setSaving(true);

    try {
      if (editing) {
        await adminApi.updateProperty(id, payload);
      } else {
        await adminApi.createProperty(payload);
      }

      navigate("/admin/properties");
    } catch (err) {
      setError(err.message || "Could not save property.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-10">Loading property...</div>;
  }

  return (
    <div className="min-h-screen min-w-0 bg-stone-100 md:flex">
      <AdminSidebar />
      <main className="min-w-0 w-full flex-1 p-3 sm:p-5 lg:p-8 xl:p-10">
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <Link
            to="/admin/properties"
            className="text-sm text-stone-600 hover:underline"
          >
            ← Back to properties
          </Link>

          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            {editing ? "Edit property" : "Add property"}
          </h1>

          <p className="mb-6 mt-2 break-words text-sm text-stone-600 sm:mb-8 sm:text-base">
            Configure property information, images, pricing and policies.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-6 break-words rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:p-4"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="min-w-0 space-y-6 rounded-xl border border-stone-200 bg-white p-3 sm:space-y-8 sm:p-6 lg:p-8"
          >
            <Section title="Basic information">
              {editing && (
                <Field label="Property ID">
                  <input
                    className={`${inputClass} bg-stone-100`}
                    value={propertyId}
                    readOnly
                  />
                </Field>
              )}

              <Field label="Property title">
                <input
                  className={inputClass}
                  required
                  value={form.title}
                  onChange={(e) => setValue("title", e.target.value)}
                />
              </Field>

              <Field label="Location / area">
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => setValue("location", e.target.value)}
                />
              </Field>

              <Field label="Address">
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => setValue("address", e.target.value)}
                />
              </Field>

              <Field label="City">
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => setValue("city", e.target.value)}
                />
              </Field>

              <Field label="State">
                <input
                  className={inputClass}
                  value={form.state}
                  onChange={(e) => setValue("state", e.target.value)}
                />
              </Field>

              <Field label="Country">
                <input
                  className={inputClass}
                  value={form.country}
                  onChange={(e) => setValue("country", e.target.value)}
                />
              </Field>

              <Field label="Timezone">
                <input
                  className={inputClass}
                  value={form.timezone}
                  onChange={(e) => setValue("timezone", e.target.value)}
                />
              </Field>

              <Field label="Sort order">
                <input
                  type="number"
                  className={inputClass}
                  value={form.sortOrder}
                  onChange={(e) => setValue("sortOrder", e.target.value)}
                />
              </Field>

              <ListEditor
                title="Description paragraphs"
                items={form.description}
                onChange={(v) => setValue("description", v)}
                placeholder="Write a description..."
              />
            </Section>

            <Section title="Capacity and details">
              {[
                ["guests", "Maximum guests", 1],
                ["bedrooms", "Bedrooms", 0],
                ["bathrooms", "Bathrooms", 0],
                ["rating", "Rating (0–5)", 0],
                ["reviewCount", "Review count", 0],
              ].map(([name, label, min]) => (
                <Field key={name} label={label}>
                  <input
                    type="number"
                    min={min}
                    step="any"
                    className={inputClass}
                    value={form[name] ?? 0}
                    onChange={(e) => setValue(name, e.target.value)}
                  />
                </Field>
              ))}

              <ListEditor
                title="Amenities"
                items={form.amenities}
                onChange={(v) => setValue("amenities", v)}
                placeholder="e.g. Wi-Fi"
              />

              <ListEditor
                title="House rules"
                items={form.houseRules}
                onChange={(v) => setValue("houseRules", v)}
                placeholder="Enter a house rule"
              />

              <div className="min-w-0 space-y-3 sm:col-span-2 xl:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium">Amenity groups</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setValue("amenityGroups", [
                        ...form.amenityGroups,
                        { title: "", items: [] },
                      ])
                    }
                    className="text-sm font-semibold text-blue-700"
                  >
                    + Add group
                  </button>
                </div>

                {form.amenityGroups.map((group, i) => (
                  <div
                    key={i}
                    className="grid min-w-0 gap-3 rounded-lg border p-3 sm:grid-cols-2"
                  >
                    <input
                      className={inputClass}
                      placeholder="Group title"
                      value={group.title}
                      onChange={(e) =>
                        setArrayItem("amenityGroups", i, "title", e.target.value)
                      }
                    />

                    <input
                      className={inputClass}
                      placeholder="Items, separated by commas"
                      value={group.items.join(", ")}
                      onChange={(e) =>
                        setArrayItem(
                          "amenityGroups",
                          i,
                          "items",
                          e.target.value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean)
                        )
                      }
                    />

                    <button
                      type="button"
                      className="text-left text-sm text-red-600"
                      onClick={() =>
                        setValue(
                          "amenityGroups",
                          form.amenityGroups.filter((_, j) => i !== j)
                        )
                      }
                    >
                      Remove group
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Property images">
              <div className="min-w-0 space-y-4 sm:col-span-2 xl:col-span-3">
                <div>
                  <h3 className="font-medium">Image gallery</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    Select multiple images. The first image is the primary
                    image. Use the arrows to change the order.
                  </p>
                </div>

                <label
                  className={`inline-flex cursor-pointer items-center rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700 ${
                    uploadingImages ? "cursor-wait opacity-60" : ""
                  }`}
                >
                  {uploadingImages ? "Uploading images..." : "Choose images"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingImages}
                    onChange={handleImageSelection}
                    className="hidden"
                  />
                </label>

                {uploadError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    {uploadError}
                  </p>
                )}

                {form.images.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-stone-300 p-5 text-center text-sm text-stone-500 sm:p-8">
                    No images uploaded yet.
                  </div>
                ) : (
                  <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {form.images.map((image, i) => (
                      <div
                        key={image.publicId || `${image.url}-${i}`}
                        className="overflow-hidden rounded-lg border border-stone-200 bg-white"
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `Property image ${i + 1}`}
                          className="h-36 w-full object-cover"
                        />

                        <div className="space-y-3 p-3">
                          <p className="truncate text-xs font-medium text-stone-600">
                            {i === 0 ? "Primary image" : `Image ${i + 1}`}
                          </p>

                          <label className="block text-xs text-stone-600">
                            Alt text
                            <input
                              className={`${inputClass} mt-1 text-sm`}
                              value={image.alt || ""}
                              onChange={(e) =>
                                setArrayItem("images", i, "alt", e.target.value)
                              }
                              maxLength={200}
                            />
                          </label>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              disabled={i === 0}
                              onClick={() => moveImage(i, -1)}
                              aria-label={`Move image ${i + 1} earlier`}
                              className="rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              ←
                            </button>

                            <button
                              type="button"
                              disabled={i === form.images.length - 1}
                              onClick={() => moveImage(i, 1)}
                              aria-label={`Move image ${i + 1} later`}
                              className="rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              →
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="ml-auto text-xs font-medium text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            <Section title="Base pricing">
              <Field label="Nightly rate">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.pricing.nightlyRate ?? ""}
                  onChange={(e) => setPricing("nightlyRate", e.target.value)}
                />
              </Field>

              <Field label="Cleaning fee">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.pricing.cleaningFee}
                  onChange={(e) => setPricing("cleaningFee", e.target.value)}
                />
              </Field>

              <Field label="Minimum nights">
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.pricing.minNights}
                  onChange={(e) => setPricing("minNights", e.target.value)}
                />
              </Field>

              <Field label="Currency">
                <select
                  className={inputClass}
                  value={form.pricing.currency}
                  onChange={(e) => setPricing("currency", e.target.value)}
                >
                  {["AUD", "USD", "NZD", "GBP", "EUR"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Pricing notes">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.pricing.pricingNotes}
                  onChange={(e) => setPricing("pricingNotes", e.target.value)}
                />
              </Field>
            </Section>

            <Section title="Weekend rates">
              <div className="min-w-0 space-y-3 sm:col-span-2 xl:col-span-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-700"
                  onClick={() =>
                    addPricingItem("weekendRates", {
                      dayOfWeek: 6,
                      nightlyRate: 0,
                    })
                  }
                >
                  + Add weekend rate
                </button>

                {form.pricing.weekendRates.map((rate, i) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-2">
                    <Field label="Day">
                      <select
                        className={inputClass}
                        value={rate.dayOfWeek}
                        onChange={(e) =>
                          setPricingArray(
                            "weekendRates",
                            i,
                            "dayOfWeek",
                            Number(e.target.value)
                          )
                        }
                      >
                        {[
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ].map((day, d) => (
                          <option key={day} value={d}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Nightly rate">
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={rate.nightlyRate}
                        onChange={(e) =>
                          setPricingArray(
                            "weekendRates",
                            i,
                            "nightlyRate",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() =>
                        setPricing(
                          "weekendRates",
                          form.pricing.weekendRates.filter((_, j) => i !== j)
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Seasonal rates">
              <div className="min-w-0 space-y-4 sm:col-span-2 xl:col-span-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-700"
                  onClick={() =>
                    addPricingItem("seasonalRates", {
                      name: "",
                      startDate: "",
                      endDate: "",
                      nightlyRate: 0,
                    })
                  }
                >
                  + Add seasonal rate
                </button>

                {form.pricing.seasonalRates.map((rate, i) => (
                  <div
                    key={i}
                    className="grid min-w-0 gap-3 rounded-lg border p-3 sm:grid-cols-2 xl:grid-cols-4"
                  >
                    <Field label="Season name">
                      <input
                        className={inputClass}
                        value={rate.name}
                        onChange={(e) =>
                          setPricingArray(
                            "seasonalRates",
                            i,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Start date">
                      <input
                        type="date"
                        className={inputClass}
                        value={rate.startDate?.slice(0, 10) || ""}
                        onChange={(e) =>
                          setPricingArray(
                            "seasonalRates",
                            i,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="End date">
                      <input
                        type="date"
                        className={inputClass}
                        value={rate.endDate?.slice(0, 10) || ""}
                        onChange={(e) =>
                          setPricingArray(
                            "seasonalRates",
                            i,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Nightly rate">
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={rate.nightlyRate}
                        onChange={(e) =>
                          setPricingArray(
                            "seasonalRates",
                            i,
                            "nightlyRate",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() =>
                        setPricing(
                          "seasonalRates",
                          form.pricing.seasonalRates.filter((_, j) => i !== j)
                        )
                      }
                    >
                      Remove season
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Additional fees">
              <div className="min-w-0 space-y-4 sm:col-span-2 xl:col-span-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-700"
                  onClick={() =>
                    addPricingItem("additionalFees", {
                      name: "",
                      amount: 0,
                      calculation: "fixed_per_booking",
                      taxable: false,
                    })
                  }
                >
                  + Add fee
                </button>

                {form.pricing.additionalFees.map((fee, i) => (
                  <div
                    key={i}
                    className="grid min-w-0 gap-3 rounded-lg border p-3 sm:grid-cols-2 xl:grid-cols-4"
                  >
                    <Field label="Fee name">
                      <input
                        className={inputClass}
                        value={fee.name}
                        onChange={(e) =>
                          setPricingArray(
                            "additionalFees",
                            i,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Amount">
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={fee.amount}
                        onChange={(e) =>
                          setPricingArray(
                            "additionalFees",
                            i,
                            "amount",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Calculation">
                      <select
                        className={inputClass}
                        value={fee.calculation}
                        onChange={(e) =>
                          setPricingArray(
                            "additionalFees",
                            i,
                            "calculation",
                            e.target.value
                          )
                        }
                      >
                        <option value="fixed_per_booking">
                          Fixed per booking
                        </option>
                        <option value="per_night">Per night</option>
                        <option value="per_guest_per_night">
                          Per guest per night
                        </option>
                      </select>
                    </Field>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={fee.taxable}
                        onChange={(e) =>
                          setPricingArray(
                            "additionalFees",
                            i,
                            "taxable",
                            e.target.checked
                          )
                        }
                      />
                      Taxable
                    </label>

                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() =>
                        setPricing(
                          "additionalFees",
                          form.pricing.additionalFees.filter((_, j) => i !== j)
                        )
                      }
                    >
                      Remove fee
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Taxes">
              <div className="min-w-0 space-y-4 sm:col-span-2 xl:col-span-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-700"
                  onClick={() =>
                    addPricingItem("taxes", {
                      name: "",
                      rate: 0,
                      appliesTo: ["accommodation"],
                    })
                  }
                >
                  + Add tax
                </button>

                {form.pricing.taxes.map((tax, i) => (
                  <div
                    key={i}
                    className="grid min-w-0 gap-3 rounded-lg border p-3 sm:grid-cols-2"
                  >
                    <Field label="Tax name">
                      <input
                        className={inputClass}
                        value={tax.name}
                        onChange={(e) =>
                          setPricingArray("taxes", i, "name", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Rate (%)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className={inputClass}
                        value={tax.rate}
                        onChange={(e) =>
                          setPricingArray("taxes", i, "rate", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Applies to">
                      <select
                        multiple
                        className={inputClass}
                        value={tax.appliesTo}
                        onChange={(e) =>
                          setPricingArray(
                            "taxes",
                            i,
                            "appliesTo",
                            Array.from(
                              e.target.selectedOptions,
                              (o) => o.value
                            )
                          )
                        }
                      >
                        <option value="accommodation">Accommodation</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="additional_fees">Additional fees</option>
                      </select>
                    </Field>

                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() =>
                        setPricing(
                          "taxes",
                          form.pricing.taxes.filter((_, j) => i !== j)
                        )
                      }
                    >
                      Remove tax
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Cancellation policy">
              <div className="min-w-0 space-y-4 sm:col-span-2 xl:col-span-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-700"
                  onClick={() =>
                    setPolicy("rules", [
                      ...form.cancellationPolicy.rules,
                      { daysBeforeArrival: 0, refundPercentage: 0 },
                    ])
                  }
                >
                  + Add cancellation rule
                </button>

                {form.cancellationPolicy.rules.map((rule, i) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-2">
                    <Field label="Days before arrival">
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={rule.daysBeforeArrival}
                        onChange={(e) => {
                          const rules = [...form.cancellationPolicy.rules];
                          rules[i] = {
                            ...rule,
                            daysBeforeArrival: e.target.value,
                          };
                          setPolicy("rules", rules);
                        }}
                      />
                    </Field>

                    <Field label="Refund percentage">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className={inputClass}
                        value={rule.refundPercentage}
                        onChange={(e) => {
                          const rules = [...form.cancellationPolicy.rules];
                          rules[i] = {
                            ...rule,
                            refundPercentage: e.target.value,
                          };
                          setPolicy("rules", rules);
                        }}
                      />
                    </Field>

                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() =>
                        setPolicy(
                          "rules",
                          form.cancellationPolicy.rules.filter(
                            (_, j) => i !== j
                          )
                        )
                      }
                    >
                      Remove rule
                    </button>
                  </div>
                ))}

                <Field label="Cancellation policy notes">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={form.cancellationPolicy.notes}
                    onChange={(e) => setPolicy("notes", e.target.value)}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Check-in and check-out">
              <Field label="Check-in time">
                <input
                  type="time"
                  className={inputClass}
                  value={form.checkInTime}
                  onChange={(e) => setValue("checkInTime", e.target.value)}
                />
              </Field>

              <Field label="Check-out time">
                <input
                  type="time"
                  className={inputClass}
                  value={form.checkOutTime}
                  onChange={(e) => setValue("checkOutTime", e.target.value)}
                />
              </Field>
            </Section>

            <Section title="Listing settings">
              {[
                ["isActive", "Active listing"],
                ["isFeatured", "Featured property"],
                ["isPlaceholder", "Placeholder property"],
                ["pricingConfigured", "Pricing configured"],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(form[name])}
                    onChange={(e) => setValue(name, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </Section>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Create property"}
              </button>

              <Link
                to="/admin/properties"
                className="inline-flex w-full items-center justify-center rounded-lg border border-stone-300 px-5 py-3 text-sm font-medium sm:w-auto sm:px-6"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}