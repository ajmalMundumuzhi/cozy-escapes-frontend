
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import adminApi, {
  getAdminToken,
  setAdminToken,
} from "../../services/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (getAdminToken()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await adminApi.login(email, password);
      const token = result.token;

      if (!token) throw new Error("Login response did not include a token.");

      setAdminToken(token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Avanta Living
        </p>
        <h1 className="mb-2 text-3xl font-bold text-stone-900">
          Admin login
        </h1>
        <p className="mb-8 text-sm text-stone-500">
          Sign in to manage your properties and bookings.
        </p>

        <label className="mb-2 block text-sm font-medium" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-700"
          placeholder="admin@example.com"
        />

        <label className="mb-2 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-700"
          placeholder="Enter your password"
        />

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-stone-900 px-4 py-3 font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
