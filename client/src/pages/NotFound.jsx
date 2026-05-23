import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-lg shadow-slate-200/50">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="heading-font mt-3 text-3xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        The page you are looking for does not exist yet or may have moved during the build process.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Go home
      </Link>
    </section>
  );
}

export default NotFound;

