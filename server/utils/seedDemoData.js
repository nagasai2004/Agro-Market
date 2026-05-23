const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const demoFarmers = [
  {
    name: "Lakshmi Farms",
    email: "demo.farmer.lakshmi@agroconnect.local",
    password: "secret123",
    role: "farmer",
    phone: "9000000001",
    location: "Guntur, Andhra Pradesh",
    verificationStatus: "approved",
  },
  {
    name: "Srinivas Dairy",
    email: "demo.farmer.srinivas@agroconnect.local",
    password: "secret123",
    role: "farmer",
    phone: "9000000002",
    location: "Vijayawada, Andhra Pradesh",
    verificationStatus: "approved",
  },
  {
    name: "Green Basket Fields",
    email: "demo.farmer.greenbasket@agroconnect.local",
    password: "secret123",
    role: "farmer",
    phone: "9000000003",
    location: "Guntur, Andhra Pradesh",
    verificationStatus: "pending",
  },
];

const demoConsumer = {
  name: "Demo Consumer",
  email: "demo.consumer@agroconnect.local",
  password: "secret123",
  role: "consumer",
  phone: "9000000010",
  location: "Guntur, Andhra Pradesh",
};

async function ensureUser(userData) {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    return existingUser;
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return User.create({
    ...userData,
    password: hashedPassword,
  });
}

async function seedDemoData() {
  const [farmerUsers, consumerUser] = await Promise.all([
    Promise.all(demoFarmers.map((farmer) => ensureUser(farmer))),
    ensureUser(demoConsumer),
  ]);

  const demoProductSets = [
    [
      {
        name: "Fresh tomatoes",
        category: "Vegetables",
        price: 38,
        quantity: 64,
        unit: "kg",
        description: "Early morning harvest with strong color and shelf life.",
        isFeatured: true,
        ratingAverage: 4.8,
        reviewCount: 32,
      },
      {
        name: "Tender okra",
        category: "Vegetables",
        price: 42,
        quantity: 36,
        unit: "kg",
        description: "Clean, soft pods ideal for same-day cooking.",
        ratingAverage: 4.6,
        reviewCount: 18,
      },
    ],
    [
      {
        name: "Farm milk",
        category: "Dairy",
        price: 54,
        quantity: 28,
        unit: "liter",
        description: "Morning dairy supply with quick local delivery.",
        isFeatured: true,
        ratingAverage: 4.9,
        reviewCount: 44,
      },
      {
        name: "Fresh curd",
        category: "Dairy",
        price: 68,
        quantity: 16,
        unit: "box",
        description: "Thick curd prepared from same-day milk.",
        ratingAverage: 4.7,
        reviewCount: 21,
      },
    ],
    [
      {
        name: "Leafy spinach",
        category: "Greens",
        price: 18,
        quantity: 72,
        unit: "bundle",
        description: "Soft leafy greens sourced for quick urban delivery.",
        isFeatured: true,
        ratingAverage: 4.7,
        reviewCount: 27,
      },
      {
        name: "Green chilies",
        category: "Vegetables",
        price: 30,
        quantity: 24,
        unit: "kg",
        description: "Flavor-rich chilies with limited same-day stock.",
        ratingAverage: 4.5,
        reviewCount: 12,
      },
    ],
  ];

  await Promise.all(
    farmerUsers.map(async (farmerUser, index) => {
      const existingCount = await Product.countDocuments({ farmerId: farmerUser._id });

      if (existingCount > 0) {
        return;
      }

      await Product.insertMany(
        demoProductSets[index].map((product) => ({
          ...product,
          farmerId: farmerUser._id,
        }))
      );
    })
  );

  const primaryFarmerProducts = await Product.find({ farmerId: farmerUsers[0]._id })
    .sort({ createdAt: 1 })
    .limit(2);
  const dairyFarmerProducts = await Product.find({ farmerId: farmerUsers[1]._id })
    .sort({ createdAt: 1 })
    .limit(1);

  const existingPrimaryOrder = await Order.findOne({
    consumerId: consumerUser._id,
    farmerId: farmerUsers[0]._id,
  });
  const existingDairyOrder = await Order.findOne({
    consumerId: consumerUser._id,
    farmerId: farmerUsers[1]._id,
  });

  if (!existingPrimaryOrder && primaryFarmerProducts.length >= 2) {
    await Order.create({
      consumerId: consumerUser._id,
      farmerId: farmerUsers[0]._id,
      items: [
        {
          productId: primaryFarmerProducts[0]._id,
          name: primaryFarmerProducts[0].name,
          quantity: 2,
          unit: primaryFarmerProducts[0].unit,
          unitPrice: primaryFarmerProducts[0].price,
        },
        {
          productId: primaryFarmerProducts[1]._id,
          name: primaryFarmerProducts[1].name,
          quantity: 1,
          unit: primaryFarmerProducts[1].unit,
          unitPrice: primaryFarmerProducts[1].price,
        },
      ],
      totalPrice:
        primaryFarmerProducts[0].price * 2 + primaryFarmerProducts[1].price,
      paymentStatus: "paid",
      orderStatus: "out_for_delivery",
      deliverySlot: "10:00 AM - 12:00 PM",
    });
  }

  if (!existingDairyOrder && dairyFarmerProducts.length >= 1) {
    await Order.create({
      consumerId: consumerUser._id,
      farmerId: farmerUsers[1]._id,
      items: [
        {
          productId: dairyFarmerProducts[0]._id,
          name: dairyFarmerProducts[0].name,
          quantity: 3,
          unit: dairyFarmerProducts[0].unit,
          unitPrice: dairyFarmerProducts[0].price,
        },
      ],
      totalPrice: dairyFarmerProducts[0].price * 3,
      paymentStatus: "paid",
      orderStatus: "packed",
      deliverySlot: "4:00 PM - 6:00 PM",
    });
  }
}

module.exports = seedDemoData;
