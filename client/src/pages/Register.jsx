import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDashboardRoute } from "../utils/getDashboardRoute";
import { getRequestErrorMessage } from "../utils/getRequestErrorMessage";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  location: "",
  role: "consumer",
};

function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { loading, register } = useAuth();
  const navigate = useNavigate();

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
      const data = await register(form);
      navigate(getDashboardRoute(data.user?.role), { replace: true });
    } catch (requestError) {
      setError(
        getRequestErrorMessage(requestError, "Unable to register right now.")
      );
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <div className="surface-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Onboarding</p>
          <h1 className="heading-font text-3xl font-bold text-slate-950">Create your AgroConnect account</h1>
          <p className="text-sm leading-6 text-slate-600">
            Keep sign-up lightweight while still capturing enough information for role-based marketplace access.
          </p>
        </div>

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Full name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
              placeholder="Lakshmi Reddy"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
              placeholder="farmer@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
              placeholder="+91 98765 43210"
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
              minLength={6}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
              placeholder="At least 6 characters"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="consumer">Consumer</option>
              <option value="farmer">Farmer</option>
            </select>
          </label>

          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Location</span>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
              placeholder="Nellore, Andhra Pradesh"
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 w-full rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-[var(--color-primary)]">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
