
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import adminApi from "../../services/adminApi";

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-100 text-emerald-800"
          : "bg-stone-100 text-stone-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminApi.properties({
        search: search.trim(),
        limit: "100",
      });

      setProperties(result.properties || []);
    } catch (err) {
      setError(err.message || "Could not load properties.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  async function toggleStatus(property) {
    const id = property._id;
    setBusyId(id);
    setError("");

    try {
      await adminApi.toggleProperty(id, !property.isActive);
      await loadProperties();
    } catch (err) {
      setError(err.message || "Could not update property.");
    } finally {
      setBusyId("");
    }
  }

  async function deactivateProperty(property) {
    if (
      !window.confirm(
        `Deactivate "${property.title || "this property"}"?`
      )
    ) {
      return;
    }

    setBusyId(property._id);
    setError("");

    try {
      await adminApi.deleteProperty(property._id);
      await loadProperties();
    } catch (err) {
      setError(err.message || "Could not deactivate property.");
    } finally {
      setBusyId("");
    }
  }

  function PropertyActions({ property }) {
    const busy = busyId === property._id;

    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to={`/admin/properties/${property._id}/edit`}
          className="rounded-lg border border-[#17352B]/20 px-3 py-2 text-sm font-medium text-[#17352B] transition hover:bg-[#17352B]/5"
        >
          Edit
        </Link>

        <button
          type="button"
          disabled={busy}
          onClick={() => toggleStatus(property)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
        >
          {busy
            ? "Updating..."
            : property.isActive
              ? "Deactivate"
              : "Activate"}
        </button>

        {property.isActive && (
          <button
            type="button"
            disabled={busy}
            onClick={() => deactivateProperty(property)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        {/* Page heading */}
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7842]">
              Management
            </p>

            <h1 className="mt-2 text-2xl font-bold text-[#17352B] sm:text-3xl">
              Properties
            </h1>

            <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
              Manage your Avanta Living listings.
            </p>
          </div>

          <Link
            to="/admin/properties/new"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#17352B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244A3D] sm:w-auto"
          >
            + Add property
          </Link>
        </header>

        {/* Search */}
        <section className="mb-5 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
          <label
            htmlFor="property-search"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            Search properties
          </label>

          <input
            id="property-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by property name or ID..."
            className="min-h-11 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-[#9A7842] focus:ring-2 focus:ring-[#C9AA70]/20"
          />
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 break-words rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            role="status"
            className="rounded-xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-600"
          >
            Loading properties...
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-12 text-center">
            <h2 className="font-semibold text-[#17352B]">
              No properties found
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Try another search term or add a new property.
            </p>
          </div>
        )}

        {/* Mobile property cards */}
        {!loading && properties.length > 0 && (
          <section className="grid grid-cols-1 gap-4 lg:hidden">
            {properties.map((property) => (
              <article
                key={property._id}
                className="min-w-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="min-w-0 break-words font-semibold text-[#17352B]">
                    {property.title || "Untitled property"}
                  </h2>

                  <div className="shrink-0">
                    <StatusBadge active={property.isActive} />
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-stone-500">Property ID</p>
                    <p className="mt-1 break-all text-stone-700">
                      {property.propertyId || property._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-stone-500">Nightly rate</p>
                    <p className="mt-1 font-medium text-stone-800">
                      {property.pricing?.nightlyRate != null
                        ? `${property.currency || "AUD"} ${property.pricing.nightlyRate}`
                        : "Not set"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-stone-100 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Actions
                  </p>
                  <PropertyActions property={property} />
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Desktop/tablet table */}
        {!loading && properties.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b bg-stone-50 text-stone-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Property</th>
                    <th className="px-5 py-4 font-medium">Property ID</th>
                    <th className="px-5 py-4 font-medium">Nightly rate</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {properties.map((property) => (
                    <tr key={property._id} className="hover:bg-stone-50/70">
                      <td className="max-w-64 break-words px-5 py-4 font-medium text-stone-900">
                        {property.title || "Untitled property"}
                      </td>

                      <td className="max-w-52 break-all px-5 py-4 text-stone-600">
                        {property.propertyId || property._id}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-stone-700">
                        {property.pricing?.nightlyRate != null
                          ? `${property.currency || "AUD"} ${property.pricing.nightlyRate}`
                          : "Not set"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge active={property.isActive} />
                      </td>

                      <td className="px-5 py-4">
                        <PropertyActions property={property} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-stone-500">
          Showing {properties.length} properties.
        </p>
      </main>
    </div>
  );
}
