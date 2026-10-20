
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import adminApi from "../../services/adminApi";

const initialSettings = {
  siteName: "Avanta Living",
  contactEmail: "Hello.avantaliving@gmail.com",
  contactPhone: "",
  address: "",
  currency: "AUD",
  timezone: "Australia/Sydney",
  checkInTime: "15:00",
  checkOutTime: "10:00",
  defaultMinNights: 1,
  cancellationPolicyNotes: "",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100";

const labelClass = "block text-sm font-medium text-gray-700";

function Field({ label, name, value, onChange, ...props }) {
  return (
    <label className={labelClass}>
      {label}
      <input
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={inputClass}
        {...props}
      />
    </label>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await adminApi.settings();
        const data = response?.data?.data ?? response?.data ?? response;

        if (active) {
          setSettings({ ...initialSettings, ...data });
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load settings.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: name === "defaultMinNights" ? value : value,
    }));
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...settings,
      defaultMinNights: Number(settings.defaultMinNights),
    };

    try {
      const response = await adminApi.updateSettings(payload);
      const data = response?.data?.data ?? response?.data ?? response;

      setSettings({ ...initialSettings, ...data });
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Administration
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              Settings
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage website details and default booking information.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border bg-white p-8 text-sm text-gray-500">
              Loading settings...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
                <h2 className="text-lg font-semibold text-gray-900">
                  Website information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Basic business and contact details.
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Website name"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    required
                    maxLength={150}
                  />

                  <Field
                    label="Contact email"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    required
                    maxLength={254}
                  />

                  <Field
                    label="Contact phone"
                    name="contactPhone"
                    type="tel"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    maxLength={30}
                  />

                  <Field
                    label="Business address"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    maxLength={500}
                  />
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
                <h2 className="text-lg font-semibold text-gray-900">
                  Booking defaults
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Default values for the booking experience. Property-specific
                  pricing and rules remain managed in their respective pages.
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Default currency
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {["AUD", "USD", "INR", "GBP", "EUR", "NZD"].map(
                        (currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  <Field
                    label="Timezone"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />

                  <Field
                    label="Default check-in time"
                    name="checkInTime"
                    type="time"
                    value={settings.checkInTime}
                    onChange={handleChange}
                    required
                  />

                  <Field
                    label="Default check-out time"
                    name="checkOutTime"
                    type="time"
                    value={settings.checkOutTime}
                    onChange={handleChange}
                    required
                  />

                  <Field
                    label="Default minimum nights"
                    name="defaultMinNights"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.defaultMinNights}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label className={`${labelClass} mt-5`}>
                  General cancellation policy notes
                  <textarea
                    name="cancellationPolicyNotes"
                    value={settings.cancellationPolicyNotes}
                    onChange={handleChange}
                    rows={5}
                    maxLength={5000}
                    className={inputClass}
                    placeholder="Enter the general policy information..."
                  />
                </label>

                <p className="mt-2 text-xs text-gray-500">
                  These notes are stored for administration; they will not
                  automatically override individual property policies or
                  change the checkout calculation.
                </p>
              </section>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  role="status"
                  className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                >
                  {message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
