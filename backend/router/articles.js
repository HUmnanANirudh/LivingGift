const express = require("express");
const router = express.Router();
const articles = require('../Models/article')
router.get("/all", async (req, res) => {
    try {
      const data = await articles.find();
      res.json( data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
});
module.exports = router