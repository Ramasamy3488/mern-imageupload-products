const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  price: { type: Number },
  image: { type: String } // filename of uploaded image
       },
  { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
