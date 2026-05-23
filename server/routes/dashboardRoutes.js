const express = require("express");
const {
  getConsumerDashboard,
  getFarmerDashboard,
} = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/consumer", authMiddleware, roleMiddleware("consumer"), getConsumerDashboard);
router.get("/farmer", authMiddleware, roleMiddleware("farmer", "admin"), getFarmerDashboard);

module.exports = router;
