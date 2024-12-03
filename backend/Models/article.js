const mongoose = require("mongoose");
const { Schema } = mongoose;

const articleSchema = new Schema({
  linkUrl: String,
  imgUrl: String,
  title: String,
  date: String,
  author: String,
  excerpt: String,
  category: String,
});
const article = mongoose.model("articles", articleSchema);
module.exports = article;
