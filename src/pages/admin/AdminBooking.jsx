
import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import adminApi from "../../services/adminApi";

const statuses = [
  "all",
  "pending",
  "confirmed",
  "cancelled",
  "expired",
  "completed",
];

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-stone-100 text-stone-600",
    completed: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-stone-100 text-stone-700"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}

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

    if (
      !window.confirm(
        `Change booking ${reference} to ${nextStatus}?`
      )
    ) {
      return;
    }

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

  function BookingActions({ booking }) {
    const busy = busyId === booking._id;

    return (
      <div className="flex flex-wrap gap-2">
        {booking.status === "confirmed" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => changeStatus(booking, "completed")}
            className="min-h-10 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
          >
            {busy ? "Updating..." : "Complete"}
          </button>
        )}

        {["pending", "confirmed"].includes(booking.status) &&
          booking.payment?.status !== "paid" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatus(booking, "cancelled")}
              className="min-h-10 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              {busy ? "Updating..." : "Cancel"}
            </button>
          )}

        {!["pending", "confirmed"].includes(booking.status) && (
          <span className="text-xs text-stone-400">
            No actions available
          </span>
        )}
      </div>
    );
  }

  function BookingDetails({ booking }) {
    return (
      <>
        <div>
          <p className="text-xs text-stone-500">Reference</p>
          <p className="mt-1 break-all font-semibold text-[#17352B]">
            {booking.reference || booking._id}
          </p>
        </div>

        <div>
          <p className="text-xs text-stone-500">Guest</p>
          <p className="mt-1 break-words font-medium text-stone-800">
            {booking.guest?.name || "—"}
          </p>
          <p className="mt-1 break-all text-sm text-stone-500">
            {booking.guest?.email || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-stone-500">Dates</p>
          <p className="mt-1 text-sm text-stone-800">
            {booking.checkin
              ? new Date(booking.checkin).toLocaleDateString()
              : "—"}
            {" – "}
            {booking.checkout
              ? new Date(booking.checkout).toLocaleDateString()
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-stone-500">Guests</p>
          <p className="mt-1 text-sm text-stone-800">
            {booking.guests ?? "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-stone-500">Total</p>
          <p className="mt-1 font-semibold text-[#17352B]">
            {money(booking)}
          </p>
        </div>

        <div>
          <p className="text-xs text-stone-500">Payment</p>
          <p className="mt-1 text-sm capitalize text-stone-800">
            {booking.payment?.status || "unpaid"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs text-stone-500">Booking status</p>
          <StatusBadge status={booking.status} />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7842]">
            Management
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#17352B] sm:text-3xl">
            Bookings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            Review reservations, guest details, payments and booking statuses.
          </p>
        </header>

        {/* Search and status filters */}
        <section className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:p-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="booking-search"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Search bookings
            </label>

            <input
              id="booking-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Reference, guest or email..."
              className="min-h-11 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#9A7842] focus:ring-2 focus:ring-[#C9AA70]/20"
            />
          </div>

          <div>
            <label
              htmlFor="booking-status"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Filter by status
            </label>

            <select
              id="booking-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm capitalize outline-none focus:border-[#9A7842] focus:ring-2 focus:ring-[#C9AA70]/20"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All statuses"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-5 break-words rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loading && (
          <div
            role="status"
            className="rounded-xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-600"
          >
            Loading bookings...
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-12 text-center">
            <h2 className="font-semibold text-[#17352B]">
              No bookings found
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Try changing the search term or status filter.
            </p>
          </div>
        )}

        {/* Mobile booking cards */}
        {!loading && bookings.length > 0 && (
          <section className="grid grid-cols-1 gap-4 xl:hidden">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="min-w-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-stone-500">Booking reference</p>
                    <p className="mt-1 break-all font-semibold text-[#17352B]">
                      {booking.reference || booking._id}
                    </p>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">
                  <BookingDetails booking={booking} />
                </div>

                <div className="mt-5 border-t border-stone-100 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Actions
                  </p>
                  <BookingActions booking={booking} />
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Desktop bookings table */}
        {!loading && bookings.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="border-b bg-stone-50 text-stone-500">
                  <tr>
                    <th className="px-4 py-4 font-medium">Reference</th>
                    <th className="px-4 py-4 font-medium">Guest</th>
                    <th className="px-4 py-4 font-medium">Dates</th>
                    <th className="px-4 py-4 font-medium">Guests</th>
                    <th className="px-4 py-4 font-medium">Total</th>
                    <th className="px-4 py-4 font-medium">Payment</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-stone-50/70">
                      <td className="max-w-40 break-all px-4 py-4 font-medium text-[#17352B]">
                        {booking.reference || booking._id}
                      </td>

                      <td className="max-w-48 px-4 py-4">
                        <div className="break-words">
                          {booking.guest?.name || "—"}
                        </div>
                        <div className="mt-1 break-all text-xs text-stone-500">
                          {booking.guest?.email || "—"}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        {booking.checkin
                          ? new Date(booking.checkin).toLocaleDateString()
                          : "—"}
                        {" – "}
                        {booking.checkout
                          ? new Date(booking.checkout).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-4 py-4">
                        {booking.guests ?? "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        {money(booking)}
                      </td>

                      <td className="px-4 py-4 capitalize">
                        {booking.payment?.status || "unpaid"}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={booking.status} />
                      </td>

                      <td className="px-4 py-4">
                        <BookingActions booking={booking} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-stone-500">
          Showing {bookings.length} bookings.
        </p>
      </main>
    </div>
  );
}
