
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
  const navigate = useNavigate();

  function logout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-stone-950 px-5 py-7 text-white">
      <div className="mb-10">
        <h2 className="text-xl font-bold tracking-wide">AVANTA LIVING</h2>
        <p className="mt-1 text-xs text-stone-400">Administration</p>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-white font-semibold text-stone-950"
                  : "text-stone-300 hover:bg-stone-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-6 rounded-lg border border-stone-700 px-4 py-3 text-left text-sm text-stone-300 hover:bg-stone-800 hover:text-white"
      >
        Sign out
      </button>
    </aside>
  );
}
