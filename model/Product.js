const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  categories: { type: Array },
  size: String,
  color: String,
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);