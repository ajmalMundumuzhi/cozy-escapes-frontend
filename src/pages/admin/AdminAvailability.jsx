
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLOCK_TYPES = [
  { value: "owner_stay", label: "Owner stay" },
  { value: "maintenance", label: "Maintenance" },
  { value: "external_booking", label: "External booking" },
  { value: "manual", label: "Manual block" },
];

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultEndDate() {
  const date = new Date();
  date.setDate(date.getDate() + 90);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.error?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export default function AdminAvailability() {
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  const [blockStart, setBlockStart] = useState(getToday());
  const [blockEnd, setBlockEnd] = useState("");
  const [type, setType] = useState("manual");
  const [notes, setNotes] = useState("");

  const [availability, setAvailability] = useState({
    bookings: [],
    blockedDates: [],
  });

  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [creatingBlock, setCreatingBlock] = useState(false);
  const [deletingBlockId, setDeletingBlockId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProperties = useCallback(async () => {
    setLoadingProperties(true);
    setError("");

    try {
      const response = await adminApi.properties({ limit: "100" });

      const payload = response?.data?.data ?? response?.data ?? response;

      const list = Array.isArray(payload)
      ? payload
      : payload?.properties || payload?.items || [];

      setProperties(list);

      setPropertyId((current) => {
        if (current && list.some((property) => property._id === current)) {
          return current;
        }

        return list[0]?._id || "";
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const loadAvailability = useCallback(async () => {
    if (!propertyId || !startDate || !endDate) {
      setAvailability({ bookings: [], blockedDates: [] });
      return;
    }

    if (endDate <= startDate) {
      setError("The availability end date must be after the start date.");
      return;
    }

    setLoadingAvailability(true);
    setError("");

    try {
      const response = await adminApi.availability({
        propertyId,
        startDate,
        endDate,
      });

      const result = response?.data || {};

      setAvailability({
        bookings: result.bookings || [],
        blockedDates: result.blockedDates || [],
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingAvailability(false);
    }
  }, [propertyId, startDate, endDate]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  async function handleCreateBlock(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!propertyId) {
      setError("Select a property first.");
      return;
    }

    if (!blockStart || !blockEnd || blockEnd <= blockStart) {
      setError("Choose a valid date range. The end date must be after the start date.");
      return;
    }

    setCreatingBlock(true);

    try {
      await adminApi.createBlock({
        propertyId,
        startDate: blockStart,
        endDate: blockEnd,
        type,
        notes: notes.trim(),
      });

      setSuccess("Dates blocked successfully.");
      setNotes("");
      setBlockStart(getToday());
      setBlockEnd("");

      await loadAvailability();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreatingBlock(false);
    }
  }

  async function handleDeleteBlock(blockId) {
    const confirmed = window.confirm(
      "Remove this blocked date range? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingBlockId(blockId);

    try {
      await adminApi.deleteBlock(blockId);
      setSuccess("Blocked dates removed successfully.");
      await loadAvailability();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingBlockId("");
    }
  }

  const selectedProperty = properties.find(
    (property) => property._id === propertyId
  );

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Availability Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View bookings and block dates for individual properties.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Select property and date range
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label
                  htmlFor="availability-property"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Property
                </label>

                <select
                  id="availability-property"
                  value={propertyId}
                  onChange={(event) => setPropertyId(event.target.value)}
                  disabled={loadingProperties || properties.length === 0}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
                >
                  {properties.length === 0 && (
                    <option value="">
                      {loadingProperties
                        ? "Loading properties..."
                        : "No properties available"}
                    </option>
                  )}

                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.title || property.name || property.propertyId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="availability-start"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  View from
                </label>
                <input
                  id="availability-start"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="availability-end"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  View until
                </label>
                <input
                  id="availability-end"
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            {selectedProperty && (
              <p className="mt-3 text-sm text-gray-500">
                Showing availability for{" "}
                <span className="font-medium text-gray-800">
                  {selectedProperty.title || selectedProperty.name}
                </span>
              </p>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Block dates
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Use this for owner stays, maintenance, external bookings, or
              other unavailable periods.
            </p>

            <form onSubmit={handleCreateBlock} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label
                    htmlFor="block-start"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Start date
                  </label>
                  <input
                    id="block-start"
                    type="date"
                    required
                    value={blockStart}
                    onChange={(event) => setBlockStart(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="block-end"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    End date (exclusive)
                  </label>
                  <input
                    id="block-end"
                    type="date"
                    required
                    min={blockStart}
                    value={blockEnd}
                    onChange={(event) => setBlockEnd(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="block-type"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Block type
                  </label>
                  <select
                    id="block-type"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  >
                    {BLOCK_TYPES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="block-notes"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Notes (optional)
                  </label>
                  <input
                    id="block-notes"
                    type="text"
                    maxLength={1000}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Reason or internal notes"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingBlock || !propertyId}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingBlock ? "Blocking dates..." : "Block dates"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Existing bookings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Confirmed bookings overlapping the selected date range.
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {availability.bookings.length} bookings
              </span>
            </div>

            {loadingAvailability ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Loading availability...
              </p>
            ) : availability.bookings.length === 0 ? (
              <p className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No confirmed bookings found for this date range.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Booking</th>
                      <th className="px-4 py-3 font-medium">Guest</th>
                      <th className="px-4 py-3 font-medium">Check-in</th>
                      <th className="px-4 py-3 font-medium">Check-out</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {availability.bookings.map((booking) => (
                      <tr key={booking._id || booking.reference}>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {booking.reference ||
                            booking.bookingReference ||
                            booking._id}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {booking.guest?.name || "Guest"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDate(booking.checkin)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDate(booking.checkout)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium capitalize text-green-700">
                            {booking.status || "confirmed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Blocked dates
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Remove a block when the property becomes available again.
                </p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                {availability.blockedDates.length} blocks
              </span>
            </div>

            {loadingAvailability ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Loading blocked dates...
              </p>
            ) : availability.blockedDates.length === 0 ? (
              <p className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No blocked dates found for this date range.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Start</th>
                      <th className="px-4 py-3 font-medium">End (exclusive)</th>
                      <th className="px-4 py-3 font-medium">Notes</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {availability.blockedDates.map((block) => (
                      <tr key={block._id}>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium capitalize text-orange-700">
                            {(block.type || "manual").replaceAll("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDate(block.startDate)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDate(block.endDate)}
                        </td>
                        <td className="max-w-xs truncate px-4 py-3 text-gray-600">
                          {block.notes || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(block._id)}
                            disabled={deletingBlockId === block._id}
                            className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {deletingBlockId === block._id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
