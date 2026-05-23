import { useEffect, useEffectEvent, useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiPackage,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useRealtimeUpdates } from "../hooks/useRealtimeUpdates";
import { getConsumerDashboard } from "../services/dashboardService";

const shoppingActions = [
  {
    title: "Browse local produce",
    description: "Find fresh fruits, vegetables, grains, and dairy from nearby farms.",
    icon: FiShoppingBag,
  },
  {
    title: "Track open orders",
    description: "See packing, dispatch, and delivery updates in one place.",
    icon: FiPackage,
  },
  {
    title: "Reorder essentials",
    description: "Quickly repurchase the items you buy every week.",
    icon: FiClock,
  },
];

const weeklySavings = [28, 33, 31, 44, 39, 52, 57];

const initialDashboard = {
  summary: {
    activeOrders: 0,
    availableProducts: 0,
    nearbyFarmers: 0,
    monthlySpend: 0,
    verifiedFarmerShare: 0,
  },
  recentOrders: [],
  recommendedProducts: [],
  nearbyFarmers: [],
  smartInsights: [],
};

function formatCurrency(amount) {
  return `Rs ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount || 0)}`;
}

function ConsumerDashboard() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const firstName = user?.name?.split(" ")[0] || "Shopper";
  const location = user?.location || "Add your delivery location";

  const loadDashboard = useEffectEvent(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getConsumerDashboard();
      setDashboard(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load consumer dashboard data right now."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const { isConnected, liveEvents } = useRealtimeUpdates({
    token,
    onConsumerRefresh: () => loadDashboard(true),
    onOrderStatusUpdated: () => loadDashboard(true),
  });

  const overviewStats = [
    {
      label: "Active orders",
      value: String(dashboard.summary.activeOrders),
      helper:
        dashboard.summary.activeOrders > 0
          ? "Tracking live packing, dispatch, and delivery changes"
          : "Your next order will appear here",
      icon: FiTruck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Nearby farmers",
      value: String(dashboard.summary.nearbyFarmers),
      helper:
        dashboard.summary.nearbyFarmers > 0
          ? "Updated from current marketplace inventory"
          : "More local sellers will appear as listings grow",
      icon: FiHeart,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      label: "This month spend",
      value: formatCurrency(dashboard.summary.monthlySpend),
      helper: "Calculated from your actual AgroConnect orders",
      icon: FiTrendingUp,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Verified freshness",
      value: `${dashboard.summary.verifiedFarmerShare}%`,
      helper: "Share of recommendations from verified farmers",
      icon: FiShield,
      tone: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="surface-card overflow-hidden rounded-[2rem] border border-white/70">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--color-bg)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Consumer home
              </span>
              <span
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  isConnected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {isConnected ? "Live sync active" : "Realtime reconnecting"}
              </span>
              {refreshing && (
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                  Refreshing data
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="heading-font text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                Welcome back, {firstName}. Fresh local produce is updating live near you.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                This dashboard now reacts to realtime marketplace events, live order updates, and
                fresh farmer inventory without requiring a manual reload.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <FiMapPin className="text-[var(--color-primary)]" />
                {location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <FiClock className="text-[var(--color-primary)]" />
                Best delivery window: morning harvest to noon dispatch
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
            <p className="text-sm font-medium text-emerald-100">Shopping pulse</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Products live</p>
                <p className="mt-2 text-3xl font-bold">{dashboard.summary.availableProducts}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Nearby farmers</p>
                <p className="mt-2 text-3xl font-bold">{dashboard.summary.nearbyFarmers}</p>
              </div>
            </div>
            <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-semibold">Best next action</p>
              <p className="mt-1 text-sm text-slate-300">
                {dashboard.recommendedProducts[0]
                  ? `Watch ${dashboard.recommendedProducts[0].name} before midday stock changes.`
                  : "Browse local produce to unlock personalized suggestions."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map(({ label, value, helper, icon: Icon, tone }) => (
          <article
            key={label}
            className="surface-card rounded-[1.75rem] border border-white/70 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
              </div>
              <span className={`inline-flex rounded-2xl p-3 ${tone}`}>
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{helper}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Quick actions
              </p>
              <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                Shop faster with less effort
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {shoppingActions.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-slate-100 bg-[var(--color-bg)]/80 p-4"
                >
                  <span className="inline-flex rounded-2xl bg-white p-3 text-[var(--color-primary)] shadow-sm">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-dark)]"
                  >
                    Open
                    <FiArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Recommended for you
                </p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                  Local picks with live availability
                </h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Personalized
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {dashboard.recommendedProducts.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 md:col-span-3">
                  No live recommendations yet. Add products on the farmer side and they will appear here automatically.
                </div>
              )}
              {dashboard.recommendedProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-4"
                >
                  <div className="rounded-[1.25rem] bg-gradient-to-br from-emerald-100 via-lime-50 to-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
                      {product.badge}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{product.farmer}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {formatCurrency(product.price)} / {product.unit}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{product.deliveryLabel}</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Order tracker
                </p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                  Recent orders and live delivery progress
                </h2>
              </div>
              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                {dashboard.summary.activeOrders} active
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {dashboard.recentOrders.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                  You do not have any orders yet. Once you place one, live packing and delivery updates will appear here.
                </div>
              )}
              {dashboard.recentOrders.map((order) => (
                <article
                  key={order.orderCode}
                  className="grid gap-3 rounded-[1.5rem] border border-slate-100 bg-white p-4 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-950">{order.orderCode}</h3>
                      <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {order.summary} • Seller: {order.farmer}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500">Order value</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Live activity
              </p>
              <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                Realtime marketplace feed
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {liveEvents.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Waiting for live events. When order or dashboard changes arrive, they will appear here instantly.
                </div>
              )}
              {liveEvents.map((event) => (
                <article key={event.id} className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{event.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">{event.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(event.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nearby farmers
              </p>
              <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                Trusted sellers around your location
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {dashboard.nearbyFarmers.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Nearby farmer discovery will appear once seller listings are available.
                </div>
              )}
              {dashboard.nearbyFarmers.map((farmer) => (
                <article
                  key={farmer.id}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex rounded-2xl bg-[var(--color-bg)] p-3 text-[var(--color-primary)]">
                        <FiUser size={18} />
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-slate-950">{farmer.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{farmer.specialty}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {farmer.deliveryLabel}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <FiStar className="text-amber-500" />
                      {farmer.ratingAverage?.toFixed?.(1) || farmer.ratingAverage} rating
                    </span>
                    <button
                      type="button"
                      className="text-sm font-semibold text-[var(--color-primary-dark)]"
                    >
                      View store
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Smart insights
            </p>
            <div className="mt-4 space-y-3">
              {dashboard.smartInsights.map((item) => (
                <article key={item.label} className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.value}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.helper}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Savings trend
                </p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                  Weekly local savings
                </h2>
              </div>
              <FiTrendingUp className="text-[var(--color-primary)]" size={20} />
            </div>

            <div className="mt-6 flex h-40 items-end justify-between gap-3">
              {weeklySavings.map((value, index) => (
                <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-[1rem] bg-gradient-to-t from-[var(--color-accent)] to-amber-300"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs font-medium text-slate-500">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsumerDashboard;
