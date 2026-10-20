
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../../services/adminApi";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", end: true },
  { to: "/admin/properties", label: "Properties" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/availability", label: "Availability" },
  { to: "/admin/pricing", label: "Pricing" },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function logout() {
    clearAdminToken();
    setOpen(false);
    navigate("/admin/login", { replace: true });
  }

  const navLinks = (
    <nav className="flex-1 space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#C9AA70] text-[#17352B]"
                : "text-stone-300 hover:bg-white/10 hover:text-[#D9BB83]"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#C9AA70]/30 bg-[#17352B] px-4 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <span className="text-sm font-semibold tracking-wide">
          AVANTA LIVING
        </span>

        <span className="text-xs text-[#D9BB83]">ADMIN</span>
      </div>

      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar drawer on mobile, fixed sidebar on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[#C9AA70]/20 bg-[#17352B] px-5 py-6 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:w-64 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-wide text-[#D9BB83]">
              AVANTA LIVING
            </h2>
            <p className="mt-1 text-xs text-stone-300">
              Administration
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {navLinks}

        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-lg border border-white/20 px-4 py-3 text-left text-sm text-stone-200 transition-colors hover:border-[#C9AA70] hover:bg-white/10 hover:text-[#D9BB83]"
        >
          Sign out
        </button>
      </aside>
    </>
  );
}
