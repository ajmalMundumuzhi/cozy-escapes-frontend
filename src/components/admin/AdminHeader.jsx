
import { useLocation } from "react-router-dom";

const pageTitles = [
  { path: "/admin/dashboard", title: "Dashboard" },
  { path: "/admin/properties", title: "Properties" },
  { path: "/admin/bookings", title: "Bookings" },
  { path: "/admin/availability", title: "Availability" },
  { path: "/admin/pricing", title: "Pricing" },
  { path: "/admin/inquiries", title: "Inquiries" },
  { path: "/admin/settings", title: "Settings" },
];

export default function AdminHeader() {
  const location = useLocation();

  const currentPage = [...pageTitles]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (page) =>
        location.pathname === page.path ||
        location.pathname.startsWith(`${page.path}/`)
    );

  const title = currentPage?.title || "Administration";

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7842]">
            Avanta Living / Admin
          </p>

          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-[#17352B] sm:text-2xl">
            {title}
          </h1>
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-stone-500">
            Admin Panel
          </span>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9AA70]/50 bg-[#F5EFE3] text-sm font-semibold text-[#17352B]">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
