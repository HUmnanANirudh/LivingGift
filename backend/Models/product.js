const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  imgUrl: String,
  price: Number,
  description: String,
  category: String,
});

const plants = mongoose.model("plants", productSchema);

module.exports = plants;
