const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const {
  formatOrderStatus,
  getNextOrderActionLabel,
  getNextOrderStatus,
} = require("../utils/orderHelpers");

function getLocationTokens(location = "") {
  return location
    .toLowerCase()
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function getLocationMatchScore(userLocation, farmerLocation) {
  const userTokens = new Set(getLocationTokens(userLocation));
  const farmerTokens = getLocationTokens(farmerLocation);

  if (!userTokens.size || !farmerTokens.length) {
    return 0;
  }

  return farmerTokens.reduce(
    (count, token) => (userTokens.has(token) ? count + 1 : count),
    0
  );
}

function getDeliveryLabel(score, hasUserLocation) {
  if (!hasUserLocation) {
    return "Open delivery zone";
  }

  if (score >= 2) {
    return "Same area";
  }

  if (score === 1) {
    return "Nearby district";
  }

  return "Regional delivery";
}

function buildProductBadge(product) {
  if (product.isFeatured) {
    return "Featured";
  }

  if (product.quantity <= 20) {
    return "Limited stock";
  }

  if (product.category.toLowerCase().includes("dairy")) {
    return "Fast delivery";
  }

  return "Fresh today";
}

function buildRevenueTrend(orders) {
  const today = new Date();
  const trend = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);

    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);

    const amount = orders
      .filter((order) => order.createdAt >= start && order.createdAt < end)
      .reduce((sum, order) => sum + order.totalPrice, 0);

    trend.push({
      label: start.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      amount,
    });
  }

  const maxAmount = Math.max(...trend.map((item) => item.amount), 1);

  return trend.map((item) => ({
    ...item,
    height: Math.max(18, Math.round((item.amount / maxAmount) * 100)),
  }));
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function getInventoryState(quantity) {
  if (quantity <= 10) {
    return {
      stock: "Critical",
      urgency: "Pause bulk orders or replenish within 24 hours",
    };
  }

  if (quantity <= 25) {
    return {
      stock: "Low stock",
      urgency: "Restock soon to avoid missed demand",
    };
  }

  return {
    stock: "Healthy",
    urgency: "Inventory is stable for current demand",
  };
}

exports.getConsumerDashboard = async (req, res, next) => {
  try {
    const consumer = await User.findById(req.user.id).select("name location");

    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found." });
    }

    const [recentOrders, activeOrdersCount, monthlySpendAgg, allProducts] = await Promise.all([
      Order.find({ consumerId: req.user.id })
        .populate("farmerId", "name location")
        .sort({ createdAt: -1 })
        .limit(3),
      Order.countDocuments({
        consumerId: req.user.id,
        orderStatus: { $in: ["placed", "packed", "out_for_delivery"] },
      }),
      Order.aggregate([
        {
          $match: {
            consumerId: new mongoose.Types.ObjectId(req.user.id),
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]),
      Product.find({})
        .populate("farmerId", "name location verificationStatus")
        .sort({ isFeatured: -1, createdAt: -1 }),
    ]);

    const availableProducts = allProducts.length;
    const userHasLocation = Boolean(consumer.location);

    const recommendedProducts = allProducts
      .map((product) => {
        const matchScore = getLocationMatchScore(consumer.location, product.farmerId?.location);

        return {
          id: product._id,
          name: product.name,
          farmer: product.farmerId?.name || "Local farmer",
          price: product.price,
          unit: product.unit,
          deliveryLabel: getDeliveryLabel(matchScore, userHasLocation),
          badge: buildProductBadge(product),
          ratingAverage: product.ratingAverage,
          category: product.category,
          matchScore,
        };
      })
      .sort((left, right) => {
        if (right.matchScore !== left.matchScore) {
          return right.matchScore - left.matchScore;
        }

        if (right.ratingAverage !== left.ratingAverage) {
          return right.ratingAverage - left.ratingAverage;
        }

        return left.price - right.price;
      })
      .slice(0, 3);

    const farmerMap = new Map();

    allProducts.forEach((product) => {
      const farmer = product.farmerId;

      if (!farmer?._id) {
        return;
      }

      const key = String(farmer._id);
      const existing = farmerMap.get(key);
      const matchScore = getLocationMatchScore(consumer.location, farmer.location);

      if (!existing) {
        farmerMap.set(key, {
          id: farmer._id,
          name: farmer.name,
          specialty: product.category,
          location: farmer.location || "Delivery region not set",
          ratingAverage: product.ratingAverage,
          productCount: 1,
          deliveryLabel: getDeliveryLabel(matchScore, userHasLocation),
          matchScore,
        });
        return;
      }

      existing.productCount += 1;
      existing.ratingAverage = Number(
        ((existing.ratingAverage + product.ratingAverage) / 2).toFixed(1)
      );

      if (!existing.specialty.toLowerCase().includes(product.category.toLowerCase())) {
        existing.specialty = `${existing.specialty}, ${product.category}`;
      }
    });

    const nearbyFarmers = Array.from(farmerMap.values())
      .sort((left, right) => {
        if (right.matchScore !== left.matchScore) {
          return right.matchScore - left.matchScore;
        }

        return right.productCount - left.productCount;
      })
      .slice(0, 3);

    const verifiedRecommendations = recommendedProducts.filter((product) =>
      allProducts.find(
        (candidate) =>
          String(candidate._id) === String(product.id) &&
          candidate.farmerId?.verificationStatus === "approved"
      )
    ).length;

    const firstRecommendation = recommendedProducts[0];
    const monthlySpend = monthlySpendAgg[0]?.total || 0;

    const smartInsights = [
      firstRecommendation
        ? {
            label: "Seasonal pick",
            value: `${firstRecommendation.name} is trending with local buyers`,
            helper: `${firstRecommendation.deliveryLabel} and strong freshness rating this week`,
          }
        : {
            label: "Seasonal pick",
            value: "Fresh produce recommendations will appear here",
            helper: "Add more marketplace data to unlock product intelligence",
          },
      {
        label: "AI recommendation",
        value:
          recommendedProducts.length >= 2
            ? `Consider buying ${recommendedProducts[0].name} with ${recommendedProducts[1].name}`
            : "Recommendations get smarter as more farm listings go live",
        helper: "Built from live marketplace inventory and local availability",
      },
      {
        label: "Delivery tip",
        value: userHasLocation
          ? "Keep your location updated for better nearby farmer matching"
          : "Add your location to unlock local farmer discovery",
        helper: "Location-aware discovery is the base for same-day and low-distance delivery",
      },
    ];

    return res.status(200).json({
      summary: {
        activeOrders: activeOrdersCount,
        availableProducts,
        nearbyFarmers: nearbyFarmers.length,
        monthlySpend,
        verifiedFarmerShare: recommendedProducts.length
          ? Math.round((verifiedRecommendations / recommendedProducts.length) * 100)
          : 0,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order._id,
        orderCode: `#AG-${String(order._id).slice(-4).toUpperCase()}`,
        summary: order.items.map((item) => item.name).join(", "),
        amount: order.totalPrice,
        status: formatOrderStatus(order.orderStatus),
        farmer: order.farmerId?.name || "Farmer",
      })),
      recommendedProducts,
      nearbyFarmers,
      smartInsights,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getFarmerDashboard = async (req, res, next) => {
  try {
    const farmer = await User.findById(req.user.id).select(
      "name location verificationStatus"
    );

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found." });
    }

    const [products, orders] = await Promise.all([
      Product.find({ farmerId: req.user.id }).sort({ createdAt: -1 }),
      Order.find({ farmerId: req.user.id })
        .populate("consumerId", "name location")
        .sort({ createdAt: -1 }),
    ]);

    const openStatuses = ["placed", "packed", "out_for_delivery"];
    const openOrders = orders.filter((order) => openStatuses.includes(order.orderStatus));
    const weeklyStart = new Date();
    weeklyStart.setDate(weeklyStart.getDate() - 6);
    weeklyStart.setHours(0, 0, 0, 0);

    const weeklyRevenue = orders
      .filter((order) => order.createdAt >= weeklyStart && order.orderStatus !== "cancelled")
      .reduce((sum, order) => sum + order.totalPrice, 0);

    const averageRating = average(products.map((product) => product.ratingAverage || 0));
    const pipeline = {
      placed: orders.filter((order) => order.orderStatus === "placed").length,
      packed: orders.filter((order) => order.orderStatus === "packed").length,
      outForDelivery: orders.filter((order) => order.orderStatus === "out_for_delivery").length,
      delivered: orders.filter((order) => order.orderStatus === "delivered").length,
    };

    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: order._id,
      orderCode: `#AG-${String(order._id).slice(-4).toUpperCase()}`,
      buyer: order.consumerId?.name || "Consumer",
      items: order.items.map((item) => item.name).join(", "),
      amount: order.totalPrice,
      status: formatOrderStatus(order.orderStatus),
      rawStatus: order.orderStatus,
      nextStatus: getNextOrderStatus(order.orderStatus),
      nextActionLabel: getNextOrderActionLabel(order.orderStatus),
    }));

    const inventoryAlerts = products
      .slice()
      .sort((left, right) => left.quantity - right.quantity)
      .slice(0, 3)
      .map((product) => {
        const state = getInventoryState(product.quantity);

        return {
          id: product._id,
          product: product.name,
          stock: state.stock,
          quantity: `${product.quantity} ${product.unit} left`,
          urgency: state.urgency,
        };
      });

    const topCategory = products[0]?.category || "Vegetables";
    const demandSignals = [
      {
        label: "Order pressure",
        value:
          openOrders.length > 0
            ? `${openOrders.length} orders currently need action`
            : "No pending orders right now",
        helper: "Realtime order movement keeps both dashboards aligned instantly",
      },
      {
        label: "Category focus",
        value: `${topCategory} is your strongest live category`,
        helper: "Use featured stock and quick dispatch to improve repeat purchases",
      },
      {
        label: "Marketplace signal",
        value:
          farmer.verificationStatus === "approved"
            ? "Verified status is helping conversion"
            : "Complete verification for stronger buyer trust",
        helper: "Trust and responsiveness are now visible in real time",
      },
    ];

    return res.status(200).json({
      summary: {
        activeListings: products.length,
        openOrders: openOrders.length,
        weeklyRevenue,
        averageRating,
      },
      verificationStatus: farmer.verificationStatus,
      orderPipeline: pipeline,
      recentOrders,
      inventoryAlerts,
      demandSignals,
      revenueTrend: buildRevenueTrend(
        orders.filter((order) => order.orderStatus !== "cancelled")
      ),
    });
  } catch (error) {
    return next(error);
  }
};
