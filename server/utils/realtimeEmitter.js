const { emitToRole, emitToUser } = require("./socketServer");

function createPayload(type, title, message, extra = {}) {
  return {
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

function emitDashboardRefresh({ consumerId, farmerId, reason, orderId }) {
  const payload = createPayload(
    "dashboard_refresh",
    "Dashboard updated",
    reason,
    { orderId }
  );

  if (consumerId) {
    emitToUser(consumerId, "dashboard:consumer:refresh", payload);
  }

  if (farmerId) {
    emitToUser(farmerId, "dashboard:farmer:refresh", payload);
  }
}

function emitOrderStatusUpdated({ consumerId, farmerId, orderCode, status, actorRole }) {
  const payload = createPayload(
    "order_status_updated",
    "Order status changed",
    `${orderCode} is now ${status}.`,
    { actorRole, orderCode, status }
  );

  if (consumerId) {
    emitToUser(consumerId, "order:status-updated", payload);
  }

  if (farmerId) {
    emitToUser(farmerId, "order:status-updated", payload);
  }

  emitToRole("admin", "order:status-updated", payload);
}

module.exports = {
  emitDashboardRefresh,
  emitOrderStatusUpdated,
};
