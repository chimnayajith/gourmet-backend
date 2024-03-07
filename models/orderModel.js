const mongoose = require("mongoose");
const db = require("../config/dbConnection");
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  shopId: { type: Schema.Types.ObjectId, ref: "Users" },
  orderDate: { type: Schema.Types.Date, required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      count: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
    default: "pending",
  },
  shippingAddress: { type: String, required: true },
  notes: { types: String },
  cancellationReason: { type: String },
  refundDate: { type: Date },
});

orderSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = db.model("Order", orderSchema);
