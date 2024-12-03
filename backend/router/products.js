const express = require("express");
const router = express.Router();
const plants = require('../Models/product')
router.get("/all", async (req, res) => {
    try {
      const products = await plants.find().limit(32);
      res.json( products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});
router.get("/filter", async (req, res) => {
  try {
    const {
      category,
      minPrice = 150,
      maxPrice = 5000,
      sort = "name",
      page = 1,
      limit = 32,
    } = req.query;
    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }
    query.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
    const sortOption = {};
    switch (sort) {
      case "price-low":
        sortOption.price = 1;
        break;
      case "price-high":
        sortOption.price = -1;
        break;
      case "alphabet":
      default:
        sortOption.name = 1;
    }
    const skip = (Number(page) - 1) * Number(limit);

    const products = await plants.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await products.countDocuments(query);

    res.json({
      products,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      categories: await products.distinct("category"),
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
