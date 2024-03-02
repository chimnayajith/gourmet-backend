const mongoose = require("mongoose");
const db = require("../config/dbConnection");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  quantity: { type: String, required: true },
  stock: { type: Number, required: true },
  variations: { type: Array, required: true },
  media: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = db.model("Product", productSchema);
