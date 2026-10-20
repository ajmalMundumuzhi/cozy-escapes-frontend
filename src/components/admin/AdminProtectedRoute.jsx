
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import adminApi, { clearAdminToken, getAdminToken } from "../../services/adminApi";

export default function AdminProtectedRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    if (!getAdminToken()) {
      setStatus("unauthenticated");
      return;
    }

    adminApi
      .me()
      .then(() => {
        if (active) setStatus("authenticated");
      })
      .catch(() => {
        clearAdminToken();
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-600">
        Checking admin session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
