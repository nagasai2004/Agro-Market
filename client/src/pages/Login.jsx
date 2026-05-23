import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDashboardRoute } from "../utils/getDashboardRoute";
import { getRequestErrorMessage } from "../utils/getRequestErrorMessage";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await login(form);
      const fallback = getDashboardRoute(data.user?.role);
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (requestError) {
      setError(
        getRequestErrorMessage(requestError, "Unable to login right now.")
      );
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="surface-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Welcome back</p>
          <h1 className="heading-font text-3xl font-bold text-slate-950">Login to AgroConnect</h1>
          <p className="text-sm leading-6 text-slate-600">
            Sign in to continue managing marketplace orders, products, and analytics.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
              placeholder="Enter your password"
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New to AgroConnect?{" "}
          <Link to="/register" className="font-semibold text-[var(--color-primary)]">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
