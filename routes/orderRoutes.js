const express = require("express");
const router = express.Router();
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const { verifyToken } = require("../middleware/auth");

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

router.post("/:id"  , verifyToken , async (req , res) => {
  try {
    
  } catch (error) {
    
  }
});
