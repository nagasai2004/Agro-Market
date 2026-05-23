const Order = require("../models/Order");
const { emitDashboardRefresh, emitOrderStatusUpdated } = require("../utils/realtimeEmitter");
const {
  formatOrderStatus,
  getNextOrderActionLabel,
  getNextOrderStatus,
} = require("../utils/orderHelpers");

function mapOrderResponse(order) {
  const nextStatus = getNextOrderStatus(order.orderStatus);

  return {
    id: order._id,
    orderCode: `#AG-${String(order._id).slice(-4).toUpperCase()}`,
    consumerName: order.consumerId?.name || "Consumer",
    farmerName: order.farmerId?.name || "Farmer",
    itemsSummary: order.items.map((item) => item.name).join(", "),
    amount: order.totalPrice,
    status: formatOrderStatus(order.orderStatus),
    rawStatus: order.orderStatus,
    nextStatus,
    nextActionLabel: getNextOrderActionLabel(order.orderStatus),
  };
}

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ consumerId: req.user.id })
      .populate("farmerId", "name location")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    return next(error);
  }
};

exports.getFarmerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ farmerId: req.user.id })
      .populate("consumerId", "name location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders: orders.map(mapOrderResponse),
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["placed", "packed", "out_for_delivery", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findById(req.params.id)
      .populate("consumerId", "name")
      .populate("farmerId", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (req.user.role === "farmer" && String(order.farmerId?._id) !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own orders." });
    }

    order.orderStatus = status;
    await order.save();

    const mappedOrder = mapOrderResponse(order);

    emitOrderStatusUpdated({
      consumerId: order.consumerId?._id,
      farmerId: order.farmerId?._id,
      orderCode: mappedOrder.orderCode,
      status: mappedOrder.status,
      actorRole: req.user.role,
    });

    emitDashboardRefresh({
      consumerId: order.consumerId?._id,
      farmerId: order.farmerId?._id,
      reason: `${mappedOrder.orderCode} changed to ${mappedOrder.status}.`,
      orderId: order._id,
    });

    return res.status(200).json({
      message: "Order status updated successfully.",
      order: mappedOrder,
    });
  } catch (error) {
    return next(error);
  }
};
