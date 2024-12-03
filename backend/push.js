const mongoose = require("mongoose");
const fs = require("fs");
const article = require('./Models/article');
const product = require("./Models/product");
mongoose.connect(
  Mongo_uri
);

const importArticles = async () => {
  try {
    const data = fs.readFileSync("../Data/articles.json", "utf-8");
    const articles = JSON.parse(data);
    await article.insertMany(articles);
    console.log("Data import succesful");
  } catch (err) {
    console.log("Error while importing data", err);
  }
};

importArticles();

const importProducts = async () => {
  try {
    const data = fs.readFileSync("../Data/products.json", "utf-8");
    const products = JSON.parse(data);
    await product.insertMany(products);
    console.log("Data import succesfull");
  } catch (err) {
    console.log("Error while importing", err);
  }
};
importProducts();
