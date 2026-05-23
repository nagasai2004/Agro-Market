function formatOrderStatus(status) {
  switch (status) {
    case "out_for_delivery":
      return "Out for delivery";
    case "placed":
      return "Placed";
    case "packed":
      return "Packed";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function getNextOrderStatus(status) {
  switch (status) {
    case "placed":
      return "packed";
    case "packed":
      return "out_for_delivery";
    case "out_for_delivery":
      return "delivered";
    default:
      return null;
  }
}

function getNextOrderActionLabel(status) {
  switch (status) {
    case "placed":
      return "Mark packed";
    case "packed":
      return "Start delivery";
    case "out_for_delivery":
      return "Mark delivered";
    default:
      return null;
  }
}

module.exports = {
  formatOrderStatus,
  getNextOrderActionLabel,
  getNextOrderStatus,
};

