const express = require("express");
const router = express.Router();
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { verifyToken } = require("../middleware/auth");
const countShops = require("../utils/cart/countShops");
const groupShops = require("../utils/orders/groupShops");
const addOrders = require("../utils/orders/addOrders");
const restockCancelled = require("../utils/orders/restockCancelled");

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.currentUser.userId;

    const orders = await Order.find({
      userId: userId,
    });

    if (!orders) return res.status(200).json([]);

    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.currentUser.userId;
    const orderId = req.body.orderId;

    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
    });

    if (!order) {
      throw Error("ORDER_NOT_FOUND");
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/create", verifyToken, async (req, res) => {
  try {
    const userId = req.currentUser.userId;

    const cart = await Cart.findOne({ userId });

    const user = await User.findById(userId);

    // fields such as address pincode are not completed
    if (!user.isCompleted) {
      throw Error("ERR_INCOMPLETE_PROFILE");
    }

    // cart is not found or no items in the cart
    if (!cart || cart.items.length === 0) {
      throw Error("ERR_EMPTY_CART");
    }

    // max shop limit set as 3 (could make it through the admin page later)
    if (countShops(cart.items) > 3) {
      throw Error("MAX_SHOP_LIMIT");
    }

    // functions to group products by their shops to seprate orders
    const itemsByShop = await groupShops(cart.items);

    const orders = await addOrders(itemsByShop, user);

    res.status(200).json({
      shopCount: countShops(cart.items),
      message: "Order Placed",
      orders: orders,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { cancellationReason } = req.body;

    if (order.status != "pending") {
      throw Error("ERR_CANNOT_CANCEL");
    }

    // updates the order status to cancelled.
    const order = await Order.findByIdAndUpdate(
      {
        _id: orderId,
      },
      {
        status: "cancelled",
        cancellationReason: cancellationReason,
      }
    );

    // function to restock the products
    await restockCancelled(order);
    res.status(200).json({
      message: "Ordered Cancelled",
      order: order,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
