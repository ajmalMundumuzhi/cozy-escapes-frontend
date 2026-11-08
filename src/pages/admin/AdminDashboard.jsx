import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../services/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useGuestyProperties from "../../hooks/useGuestyProperties";

function StatCard({ title, value, detail }) {
  return (
    <div className="min-w-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-sm text-stone-500">{title}</p>
      <p className="mt-3 break-words text-2xl font-bold text-[#17352B] sm:text-3xl">
        {value}
      </p>
      {detail && (
        <p className="mt-2 break-words text-xs text-stone-500">
          {detail}
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Guesty has its own loading/error state, so a Guesty problem never blanks the dashboard
  const {
    properties: guestyProperties,
    loading: guestyLoading,
    error: guestyError,
    retry: retryGuesty,
  } = useGuestyProperties();

  useEffect(() => {
    let active = true;

    adminApi
      .dashboard()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load dashboard.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const money = (amount, currency = "AUD") =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  return (
    <div className="min-h-screen bg-stone-100 lg:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        {/* Dashboard header */}
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7842]">
                Avanta Living / Admin
              </p>
              <h1 className="mt-1 text-xl font-bold text-[#17352B] sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <span className="hidden shrink-0 rounded-full border border-[#C9AA70]/40 bg-[#F5EFE3] px-3 py-2 text-xs font-medium text-[#17352B] sm:inline-flex">
              Admin Panel
            </span>
          </div>
        </header>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm text-stone-500">Overview</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Manage your properties, bookings and customer inquiries.
            </p>
          </div>

          {loading && (
            <p className="rounded-xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
              Loading dashboard statistics...
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 break-words rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:p-5"
            >
              {error}
            </div>
          )}

          {data && (
            <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <StatCard
                  title="Total properties"
                  value={guestyLoading ? "…" : guestyError ? "—" : guestyProperties.length}
                  detail={
                    guestyError
                      ? "Couldn’t load properties from Guesty"
                      : "Synced from Guesty"
                  }
                />

                <StatCard
                  title="Total bookings"
                  value={0}
                  detail={`${data.bookings?.pending ?? 0} pending`}
                />

                <StatCard
                  title="Confirmed & paid"
                  value={data.bookings?.confirmedAndPaid ?? 0}
                  detail="Paid bookings currently confirmed"
                />

                <StatCard
                  title="Paid booking revenue"
                  value={money(
                    data.revenue?.amount,
                    data.revenue?.currency
                  )}
                  detail="Based on the dashboard API response"
                />
              </section>

              <section className="mt-5 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[#17352B]">
                    Customer inquiries
                  </h2>

                  <Link
                    to="/admin/inquiries"
                    className="text-sm font-medium text-[#8B6A32] transition-colors hover:text-[#17352B]"
                  >
                    View inquiries →
                  </Link>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-stone-50 p-4">
                    <p className="text-sm text-stone-500">
                      Total inquiries
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#17352B]">
                      {data.inquiries?.total ?? 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-stone-50 p-4">
                    <p className="text-sm text-stone-500">
                      Pending inquiries
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#17352B]">
                      {data.inquiries?.pending ?? 0}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Guesty properties */}
          <section className="mt-5 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#17352B]">
                  Guesty properties
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  Synced from Guesty. Bookings and payments for these
                  properties are managed in Guesty.
                </p>
              </div>

              <Link
                to="/accommodations"
                className="text-sm font-medium text-[#8B6A32] transition-colors hover:text-[#17352B]"
              >
                View on website →
              </Link>
            </div>

            {guestyLoading && (
              <p className="mt-5 text-sm text-stone-600" role="status">
                Loading Guesty properties...
              </p>
            )}

            {guestyError && (
              <div
                role="alert"
                className="mt-5 break-words rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <p>{guestyError}</p>
                <button
                  type="button"
                  onClick={retryGuesty}
                  className="mt-3 text-sm font-medium text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!guestyLoading && !guestyError && (
              <>
                <div className="mt-5 rounded-lg bg-stone-50 p-4">
                  <p className="text-sm text-stone-500">
                    Properties in Guesty
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#17352B]">
                    {guestyProperties.length}
                  </p>
                </div>

                {guestyProperties.length === 0 ? (
                  <p className="mt-5 text-sm text-stone-600">
                    No properties were returned by Guesty.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-stone-200">
                    {guestyProperties.map((property) => {
                      const basePrice = property.prices?.basePrice;

                      return (
                        <li
                          key={property.id}
                          className="flex flex-wrap items-center gap-4 py-4"
                        >
                          {property.image ? (
                            <img
                              src={property.image}
                              alt=""
                              className="h-16 w-24 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-16 w-24 shrink-0 rounded-md bg-stone-200" />
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-[#17352B]">
                              {property.nickname || property.title}
                            </p>
                            <p className="mt-1 truncate text-xs text-stone-500">
                              {property.location || "Location not set"}
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                              {property.guests} guests · {property.bedrooms}{" "}
                              bedrooms · {property.bathrooms} bathrooms
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#17352B]">
                              {basePrice
                                ? money(basePrice, property.prices?.currency)
                                : "—"}
                            </p>
                            <p className="text-xs text-stone-500">
                              Base nightly rate
                            </p>
                          </div>

                          <Link
                            to={`/accommodations/property/${property.id}`}
                            className="text-sm font-medium text-[#8B6A32] transition-colors hover:text-[#17352B]"
                          >
                            View →
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}