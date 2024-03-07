const mongoose = require("mongoose");
const db = require("../config/dbConnection");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
  price: { type: Number, required: true },
  shops: [
    {
      shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      discount: { type: Number, default: 0 },
      stock: { type: Number, required: true },
    },
  ],
  quantity: { type: String, required: true },
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
