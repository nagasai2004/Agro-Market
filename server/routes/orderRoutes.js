const express = require("express");
const {
  getFarmerOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/my-orders", authMiddleware, roleMiddleware("consumer"), getMyOrders);
router.get("/farmer", authMiddleware, roleMiddleware("farmer", "admin"), getFarmerOrders);
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("farmer", "admin"),
  updateOrderStatus
);

module.exports = router;
