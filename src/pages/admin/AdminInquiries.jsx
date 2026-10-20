
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";

const STATUSES = ["new", "contacted", "converted", "closed"];

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function errorMessage(error) {
  return (
    error?.response?.data?.error?.message ||
    error?.message ||
    "Something went wrong."
  );
}

function formatDate(value) {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function fullName(guest) {
  return [guest?.firstName, guest?.lastName].filter(Boolean).join(" ") || "Guest";
}

function statusStyle(status) {
  const styles = {
    new: "bg-blue-50 text-blue-700",
    contacted: "bg-amber-50 text-amber-700",
    converted: "bg-green-50 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };

  return styles[status] || styles.new;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.inquiries({
        page: String(pagination.page),
        limit: String(pagination.limit),
        status: statusFilter,
        search,
      });

      const result = unwrap(response);

      setInquiries(result.inquiries || []);
      setPagination((current) => ({
        ...current,
        ...(result.pagination || {}),
      }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  function applySearch(event) {
    event.preventDefault();
    setPagination((current) => ({ ...current, page: 1 }));
    setSearch(searchInput.trim());
  }

  async function openInquiry(inquiry) {
    setError("");
    setSuccess("");

    try {
      const response = await adminApi.inquiry(inquiry._id);
      const result = unwrap(response);
      const detail = result.inquiry || result;

      setSelected(detail);
      setNotes(detail.notes || "");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function saveChanges(event) {
    event.preventDefault();

    if (!selected) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await adminApi.updateInquiry(selected._id, {
        status: selected.status,
        notes,
      });

      const result = unwrap(response);
      const updated = result.inquiry || result;

      setSelected(updated);
      setNotes(updated.notes || "");

      setInquiries((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );

      setSuccess("Inquiry updated successfully.");
      await loadInquiries();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900";

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-gray-900">
              Inquiries
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer enquiries and follow-up status.
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

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <form onSubmit={applySearch} className="grid gap-3 sm:grid-cols-[1fr_220px_auto]">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search guest, email, phone, property ID..."
                className={inputClass}
              />

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPagination((current) => ({ ...current, page: 1 }));
                }}
                className={inputClass}
              >
                <option value="all">All statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <button type="submit" className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
                Search
              </button>
            </form>

            <p className="mt-3 text-sm text-gray-500">
              {pagination.total} total inquiries
            </p>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <p className="p-10 text-center text-sm text-gray-500">
                Loading inquiries...
              </p>
            ) : inquiries.length === 0 ? (
              <p className="p-10 text-center text-sm text-gray-500">
                No inquiries found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Guest</th>
                      <th className="px-4 py-3 font-medium">Property</th>
                      <th className="px-4 py-3 font-medium">Dates</th>
                      <th className="px-4 py-3 font-medium">Guests</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Received</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {fullName(inquiry.guest)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {inquiry.guest?.email}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {inquiry.guest?.dialCode} {inquiry.guest?.phone}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">
                            {inquiry.property?.title || "Property"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            ID: {inquiry.propertyId}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {inquiry.checkin
                            ? formatDate(inquiry.checkin).split(",")[0]
                            : "Flexible"}
                          {" — "}
                          {inquiry.checkout
                            ? formatDate(inquiry.checkout).split(",")[0]
                            : "Flexible"}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {inquiry.guests}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(inquiry.createdAt)}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openInquiry(inquiry)}
                            className="font-medium text-blue-700 hover:text-blue-900"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {Math.max(1, pagination.pages)}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() =>
                    setPagination((current) => ({
                      ...current,
                      page: current.page - 1,
                    }))
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    loading ||
                    pagination.page >= pagination.pages ||
                    pagination.pages === 0
                  }
                  onClick={() =>
                    setPagination((current) => ({
                      ...current,
                      page: current.page + 1,
                    }))
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          {selected && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="inquiry-detail-title"
                className="my-auto w-full max-w-3xl rounded-xl bg-white shadow-xl"
              >
                <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
                  <div>
                    <h2 id="inquiry-detail-title" className="text-xl font-semibold text-gray-900">
                      Inquiry details
                    </h2>
                    <p className="mt-1 break-all text-xs text-gray-500">
                      {selected._id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={saveChanges} className="space-y-5 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Guest", fullName(selected.guest)],
                      ["Email", selected.guest?.email],
                      ["Phone", `${selected.guest?.dialCode || ""} ${selected.guest?.phone || ""}`],
                      ["Property", selected.property?.title || selected.propertyId],
                      ["Check-in", formatDate(selected.checkin)],
                      ["Check-out", formatDate(selected.checkout)],
                      ["Guests", selected.guests],
                      ["Email delivery", selected.emailStatus],
                      ["Received", formatDate(selected.createdAt)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-500">{label}</p>
                        <p className="mt-1 break-words text-sm text-gray-900">
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900">Guest message</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                      {selected.guest?.message || "No message provided."}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900">Guest address</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                      {[
                        selected.guest?.address,
                        selected.guest?.address2,
                        selected.guest?.city,
                        selected.guest?.state,
                        selected.guest?.zip,
                        selected.guest?.country,
                      ].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Inquiry status
                    </label>
                    <select
                      value={selected.status}
                      onChange={(event) =>
                        setSelected((current) => ({
                          ...current,
                          status: event.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Internal notes
                    </label>
                    <textarea
                      rows={5}
                      maxLength={5000}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Add follow-up notes for your team..."
                      className={inputClass}
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {notes.length}/5000
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
