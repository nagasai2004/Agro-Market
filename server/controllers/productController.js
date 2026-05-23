const Product = require("../models/Product");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.getProducts = async (req, res, next) => {
  try {
    const { category, featured, limit = 12, search } = req.query;
    const query = {};

    if (category) {
      query.category = new RegExp(`^${escapeRegex(category)}$`, "i");
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (search) {
      query.name = new RegExp(escapeRegex(search), "i");
    }

    const products = await Product.find(query)
      .populate("farmerId", "name location verificationStatus")
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmerId",
      "name location verificationStatus"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

