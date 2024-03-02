const mongoose = require("mongoose");
const db = require("../config/dbConnection");
const { Schema } = mongoose;

const cartSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      count: { type: Number, required: true },
    },
  ],
});

cartSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = db.model("Cart", cartSchema);
