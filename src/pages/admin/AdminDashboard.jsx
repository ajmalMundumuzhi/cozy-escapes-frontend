
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../services/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";

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
                  value={data.properties?.total ?? 0}
                  detail={`${data.properties?.active ?? 0} active listings`}
                />

                <StatCard
                  title="Total bookings"
                  value={data.bookings?.total ?? 0}
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
        </main>
      </div>
    </div>
  );
}