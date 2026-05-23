import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin, FiShield, FiShoppingBag } from "react-icons/fi";

const highlights = [
  {
    icon: FiShoppingBag,
    title: "Direct marketplace",
    description: "Buy fruits, vegetables, grains, and dairy products straight from verified farmers.",
  },
  {
    icon: FiShield,
    title: "Trust first",
    description: "Verification, reviews, and transparent order flows help rural commerce feel dependable.",
  },
  {
    icon: FiMapPin,
    title: "Nearby discovery",
    description: "Local sourcing reduces travel time, improves freshness, and supports regional producers.",
  },
];

function Home() {
  return (
    <section className="space-y-8">
      <div className="surface-card overflow-hidden rounded-[2rem] border border-white/60 p-6 sm:p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-[var(--color-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-dark)]">
              Startup-grade agri-commerce foundation
            </span>
            <div className="space-y-4">
              <h1 className="heading-font text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
                Fresh produce, trusted farmers, and cleaner farm-to-home logistics.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                AgroConnect helps consumers discover local produce while giving farmers modern tools for selling,
                payments, analytics, and verified growth.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Start selling
                <FiArrowRight />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Access dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] bg-[#eef4e6] p-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-sm text-slate-500">Orders routed</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">2.4k</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#2f7d32] p-5 text-white">
              <p className="text-sm text-emerald-100">Farmer growth</p>
              <p className="mt-2 text-3xl font-bold">+38%</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#8d5b2f] p-5 text-white sm:col-span-2">
              <p className="text-sm text-amber-100">Avg local delivery radius</p>
              <p className="mt-2 text-3xl font-bold">18 km</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="surface-card rounded-[1.75rem] border border-white/70 p-6"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-[var(--color-bg)] p-3 text-[var(--color-primary)]">
              <Icon size={22} />
            </div>
            <h2 className="heading-font text-xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Home;

