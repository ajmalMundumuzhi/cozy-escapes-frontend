
import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import adminApi from "../../services/adminApi";

const statuses = ["all", "pending", "confirmed", "cancelled", "expired", "completed"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { limit: "100" };
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();

      const result = await adminApi.bookings(params);
      setBookings(result.bookings || []);
    } catch (err) {
      setError(err.message || "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function changeStatus(booking, nextStatus) {
    const reference = booking.reference || booking._id;

    if (!window.confirm(`Change booking ${reference} to ${nextStatus}?`)) return;

    setBusyId(booking._id);
    setError("");

    try {
      await adminApi.updateBookingStatus(booking._id, nextStatus);
      await loadBookings();
    } catch (err) {
      setError(err.message || "Could not update booking.");
    } finally {
      setBusyId("");
    }
  }

  function money(booking) {
    const amount = booking.priceBreakdown?.total ?? 0;
    const currency = booking.priceBreakdown?.currency || "AUD";

    try {
      return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency,
      }).format(Number(amount) || 0);
    } catch {
      return `${currency} ${amount}`;
    }
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <header className="mb-8">
          <p className="text-sm text-stone-500">Management</p>
          <h1 className="mt-1 text-3xl font-bold">Bookings</h1>
          <p className="mt-2 text-stone-600">
            Review reservations, guest details, payments and booking statuses.
          </p>
        </header>

        <div className="mb-5 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference, guest or email..."
            className="w-full rounded-lg border px-4 py-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border px-4 py-3"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All statuses" : item}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-4">Reference</th>
                <th className="px-4 py-4">Guest</th>
                <th className="px-4 py-4">Dates</th>
                <th className="px-4 py-4">Guests</th>
                <th className="px-4 py-4">Total</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {!loading && bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-4 py-4 font-medium">
                    {booking.reference || booking._id}
                  </td>
                  <td className="px-4 py-4">
                    <div>{booking.guest?.name || "—"}</div>
                    <div className="mt-1 text-xs text-stone-500">
                      {booking.guest?.email || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {booking.checkin
                      ? new Date(booking.checkin).toLocaleDateString()
                      : "—"}
                    {" – "}
                    {booking.checkout
                      ? new Date(booking.checkout).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-4">{booking.guests ?? "—"}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{money(booking)}</td>
                  <td className="px-4 py-4">{booking.payment?.status || "unpaid"}</td>
                  <td className="px-4 py-4">{booking.status}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      {booking.status === "confirmed" && (
                        <button
                          disabled={busyId === booking._id}
                          onClick={() => changeStatus(booking, "completed")}
                          className="text-blue-700 hover:underline disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                      {["pending", "confirmed"].includes(booking.status) &&
                        booking.payment?.status !== "paid" && (
                          <button
                            disabled={busyId === booking._id}
                            onClick={() => changeStatus(booking, "cancelled")}
                            className="text-red-700 hover:underline disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-stone-500">
                    No bookings found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-stone-500">
                    Loading bookings...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
