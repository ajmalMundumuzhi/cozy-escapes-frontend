
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import adminApi from "../../services/adminApi";

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
        `Deactivate "${ property.title || "this property"}"?`
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

  return (
    <div className="flex min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Management</p>
            <h1 className="mt-1 text-3xl font-bold text-stone-900">
              Properties
            </h1>
            <p className="mt-2 text-stone-600">
              Manage your Avanta Living listings.
            </p>
          </div>

          <Link
            to="/admin/properties/new"
            className="rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700"
          >
            + Add property
          </Link>
        </div>

        <div className="mb-5 rounded-xl border border-stone-200 bg-white p-4">
          <label htmlFor="property-search" className="mb-2 block text-sm font-medium">
            Search properties
          </label>
          <input
            id="property-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by property name or ID..."
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-700"
          />
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
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
              {!loading && properties.map((property) => (
                <tr key={property._id}>
                  <td className="px-5 py-4 font-medium text-stone-900">
                    { property.title || "Untitled property"}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {property.propertyId || property._id}
                  </td>
                  <td className="px-5 py-4 text-stone-700">
                    {property.pricing?.nightlyRate != null
                      ? `${property.currency || "AUD"} ${property.pricing?.nightlyRate}`
                      : "Not set"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      property.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-stone-100 text-stone-600"
                    }`}>
                      {property.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/properties/${property._id}/edit`}
                        className="font-medium text-blue-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        disabled={busyId === property._id}
                        onClick={() => toggleStatus(property)}
                        className="font-medium text-stone-700 hover:underline disabled:opacity-50"
                      >
                        {property.isActive ? "Deactivate" : "Activate"}
                      </button>
                      {property.isActive && (
                        <button
                          disabled={busyId === property._id}
                          onClick={() => deactivateProperty(property)}
                          className="font-medium text-red-700 hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && properties.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-stone-500">
                    No properties found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-stone-500">
                    Loading properties...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-stone-500">
          Showing {properties.length} properties.
        </p>
      </main>
    </div>
  );
}
