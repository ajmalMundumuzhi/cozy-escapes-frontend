
import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";

function StatCard({ title, value, detail }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-stone-900">{value}</p>
      {detail && <p className="mt-2 text-xs text-stone-500">{detail}</p>}
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
        if (active) setError(err.message || "Failed to load dashboard.");
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
    <div className="flex min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <header className="mb-8">
          <p className="text-sm text-stone-500">Overview</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">
            Dashboard
          </h1>
          <p className="mt-2 text-stone-600">
            Manage your properties, bookings and customer inquiries.
          </p>
        </header>

        {loading && (
          <p className="rounded-xl bg-white p-5 text-stone-600">
            Loading dashboard statistics...
          </p>
        )}

        {error && (
          <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                value={money(data.revenue?.amount, data.revenue?.currency)}
                detail="Based on the dashboard API response"
              />
            </section>

            <section className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Customer inquiries
              </h2>
              <div className="mt-4 flex flex-wrap gap-10">
                <div>
                  <p className="text-sm text-stone-500">Total inquiries</p>
                  <p className="mt-1 text-2xl font-bold">
                    {data.inquiries?.total ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Pending inquiries</p>
                  <p className="mt-1 text-2xl font-bold">
                    {data.inquiries?.pending ?? 0}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
