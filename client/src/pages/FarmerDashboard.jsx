import { useEffect, useEffectEvent, useState } from "react";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiDroplet,
  FiMapPin,
  FiPackage,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiTruck,
  FiUserCheck,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useRealtimeUpdates } from "../hooks/useRealtimeUpdates";
import { getFarmerDashboard } from "../services/dashboardService";
import { updateOrderStatus } from "../services/orderService";
import { getRequestErrorMessage } from "../utils/getRequestErrorMessage";

const actionCards = [
  {
    title: "Add fresh stock",
    description: "Publish newly harvested produce and keep search rankings healthy.",
    icon: FiPackage,
  },
  {
    title: "Complete verification",
    description: "Upload farm proof to unlock trusted farmer badge and higher conversion.",
    icon: FiUserCheck,
  },
  {
    title: "Review payouts",
    description: "Track settlements, payment delays, and margin by product category.",
    icon: FiArrowUpRight,
  },
];

const initialDashboard = {
  summary: {
    activeListings: 0,
    openOrders: 0,
    weeklyRevenue: 0,
    averageRating: 0,
  },
  verificationStatus: "pending",
  orderPipeline: {
    placed: 0,
    packed: 0,
    outForDelivery: 0,
    delivered: 0,
  },
  recentOrders: [],
  inventoryAlerts: [],
  demandSignals: [],
  revenueTrend: [],
};

function formatCurrency(amount) {
  return `Rs ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount || 0)}`;
}

function getVerificationCopy(status) {
  switch (status) {
    case "approved":
      return {
        label: "Verified farmer",
        description: "Your farm profile is approved and visible with a trust badge.",
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "rejected":
      return {
        label: "Verification needs revision",
        description: "Update your farm documents to restore trust signals and admin approval.",
        tone: "bg-red-50 text-red-700 border-red-200",
      };
    case "pending":
    default:
      return {
        label: "Verification pending",
        description: "Complete your KYC and farm details to unlock verified seller trust.",
        tone: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
}

function FarmerDashboard() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const firstName = user?.name?.split(" ")[0] || "Farmer";
  const location = user?.location || "Set your farm location";
  const verification = getVerificationCopy(
    dashboard.verificationStatus || user?.verificationStatus
  );

  const loadDashboard = useEffectEvent(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getFarmerDashboard();
      setDashboard(data);
    } catch (requestError) {
      setError(
        getRequestErrorMessage(
          requestError,
          "Unable to load farmer dashboard data right now."
        )
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
    onFarmerRefresh: () => loadDashboard(true),
    onOrderStatusUpdated: () => loadDashboard(true),
  });

  const handleAdvanceOrder = async (orderId, nextStatus) => {
    if (!nextStatus) {
      return;
    }

    setUpdatingOrderId(orderId);
    setError("");

    try {
      await updateOrderStatus(orderId, nextStatus);
      await loadDashboard(true);
    } catch (requestError) {
      setError(
        getRequestErrorMessage(
          requestError,
          "Unable to update the order status right now."
        )
      );
    } finally {
      setUpdatingOrderId("");
    }
  };

  const overviewStats = [
    {
      label: "Active listings",
      value: String(dashboard.summary.activeListings),
      delta: "Live inventory count from your farm catalog",
      icon: FiPackage,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Open orders",
      value: String(dashboard.summary.openOrders),
      delta: "Realtime updates flow to both farmer and consumer views",
      icon: FiShoppingBag,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Weekly revenue",
      value: formatCurrency(dashboard.summary.weeklyRevenue),
      delta: "Calculated from current live order data",
      icon: FiTrendingUp,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Customer rating",
      value: dashboard.summary.averageRating
        ? dashboard.summary.averageRating.toFixed(1)
        : "0.0",
      delta: "Averaged from your active product listings",
      icon: FiStar,
      tone: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="surface-card overflow-hidden rounded-[2rem] border border-white/70">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--color-bg)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Farmer command center
              </span>
              <span
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${verification.tone}`}
              >
                <span className="inline-flex items-center gap-2">
                  <FiShield />
                  {verification.label}
                </span>
              </span>
              <span
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  isConnected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {isConnected ? "Realtime connected" : "Realtime reconnecting"}
              </span>
              {refreshing && (
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                  Syncing updates
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="heading-font text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                Welcome back, {firstName}. Your farm operations are now live.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Order status actions now propagate instantly, your dashboard refreshes through
                websocket events, and marketplace activity can be tracked without reloading.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <FiMapPin className="text-[var(--color-primary)]" />
                {location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <FiClock className="text-[var(--color-primary)]" />
                Best dispatch window: 6:00 AM - 9:00 AM
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
            <p className="text-sm font-medium text-emerald-100">Daily operations pulse</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Open orders</p>
                <p className="mt-2 text-3xl font-bold">{dashboard.summary.openOrders}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Dispatch SLA</p>
                <p className="mt-2 text-3xl font-bold">
                  {dashboard.summary.openOrders > 0 ? "Live" : "Ready"}
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Next priority</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {dashboard.recentOrders[0]?.nextActionLabel
                      ? `${dashboard.recentOrders[0].nextActionLabel} for ${dashboard.recentOrders[0].orderCode} to keep delivery flow moving.`
                      : "No urgent order actions right now."}
                  </p>
                </div>
                <FiAlertCircle className="mt-1 text-amber-300" size={18} />
              </div>
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
        {overviewStats.map(({ label, value, delta, icon: Icon, tone }) => (
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
            <p className="mt-4 text-sm text-slate-600">{delta}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Quick actions
                </p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                  Keep the farm storefront moving
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {actionCards.map(({ title, description, icon: Icon }) => (
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
                    Open workflow
                    <FiArrowUpRight />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Order flow
                </p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                  Realtime orders and delivery pipeline
                </h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {dashboard.summary.openOrders} actions open
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {dashboard.recentOrders.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                  No farmer orders yet. Once consumer orders arrive, you can progress them here in realtime.
                </div>
              )}
              {dashboard.recentOrders.map((order) => (
                <article
                  key={order.id}
                  className="grid gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-semibold text-slate-950">{order.orderCode}</h3>
                        <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Buyer: {order.buyer} • Items: {order.items}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-500">Order value</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">
                        {formatCurrency(order.amount)}
                      </p>
                    </div>
                  </div>

                  {order.nextStatus && (
                    <div className="flex justify-start">
                      <button
                        type="button"
                        onClick={() => handleAdvanceOrder(order.id, order.nextStatus)}
                        disabled={updatingOrderId === order.id}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {updatingOrderId === order.id
                          ? "Updating..."
                          : order.nextActionLabel || "Advance status"}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                { label: "Placed", count: dashboard.orderPipeline.placed, icon: FiShoppingBag },
                { label: "Packed", count: dashboard.orderPipeline.packed, icon: FiPackage },
                {
                  label: "Shipped",
                  count: dashboard.orderPipeline.outForDelivery,
                  icon: FiTruck,
                },
                { label: "Delivered", count: dashboard.orderPipeline.delivered, icon: FiCheckCircle },
              ].map(({ label, count, icon: Icon }) => (
                <div key={label} className="rounded-[1.25rem] bg-[var(--color-bg)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{label}</span>
                    <Icon className="text-[var(--color-primary)]" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-950">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Live activity
            </p>
            <div className="mt-4 space-y-3">
              {liveEvents.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Waiting for live events. Order progress and dashboard refreshes will appear here instantly.
                </div>
              )}
              {liveEvents.map((event) => (
                <article key={event.id} className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{event.title}</p>
                  <p className="mt-2 text-sm text-slate-100">{event.message}</p>
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Verification</p>
            <div className="mt-3 rounded-[1.5rem] border border-dashed border-slate-200 bg-[var(--color-bg)] p-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex rounded-2xl bg-white p-3 text-[var(--color-accent)] shadow-sm">
                  <FiUserCheck size={18} />
                </span>
                <div>
                  <h2 className="heading-font text-xl font-semibold text-slate-950">
                    Build trust faster with verified status
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{verification.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Inventory watch
                </p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                  Live stock pressure and restock alerts
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {dashboard.inventoryAlerts.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Add products to start receiving inventory alerts and health signals.
                </div>
              )}
              {dashboard.inventoryAlerts.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">{item.product}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.quantity}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {item.stock}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--color-accent)]">{item.urgency}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Smart insights</p>
            <div className="mt-4 space-y-3">
              {dashboard.demandSignals.map((signal) => (
                <article key={signal.label} className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{signal.label}</p>
                  <h3 className="mt-2 text-lg font-semibold">{signal.value}</h3>
                  <p className="mt-2 text-sm text-slate-300">{signal.helper}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Weekly trend</p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-slate-950">
                  Revenue momentum
                </h2>
              </div>
              <FiDroplet className="text-[var(--color-primary)]" size={20} />
            </div>

            <div className="mt-6 flex h-40 items-end justify-between gap-3">
              {dashboard.revenueTrend.map((value, index) => (
                <div key={`${value.label}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-[1rem] bg-gradient-to-t from-[var(--color-primary)] to-emerald-300"
                    style={{ height: `${value.height}%` }}
                  />
                  <span className="text-xs font-medium text-slate-500">{value.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FarmerDashboard;
