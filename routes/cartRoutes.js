const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Cart = require("../models/cartModel");
const Product = require("../models/productsModel");
const countShops = require("../utils/cart/countShops");
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.currentUser.userId;

    const cart = await Cart.find({
      userId: userId,
    });

    if (!cart || cart.items.length === 0) {
      res.status(200).json([]);
    }
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/add", verifyToken, async (req, res) => {
  try {
    const userId = req.currentUser.userId;

    // throws error if any of the fields are empty
    const { productId, count } = req.body;
    if (!(productId && count)) throw Error("ERR_EMPTY_FIELDS");

    // checks if a product exists with the provided id
    const product = await Product.findById(productId);
    if (!product) throw Error("INVALID_PRODUCT");

    // validates the count sent
    if (typeof count !== "number" || count < 1 || !Number.isInteger(count)) {
      throw new Error("INVALID_COUNT");
    }

    const addedItem = {
      productId: productId,
      count: count,
    };

    let cart = await Cart.findOne({ userId });
    if (cart) {
      const newItems = temp.items.push(addedItem);
      const shopCount = await countShops(newItems);
      if (shopCount > 3) {
        throw Error("MAX_SHOP_LIMIT");
      }
    }

    // finds and adds to the cart of the user. if cart doest exist, creates one.
    cart = await Cart.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $push: {
          items: addedItem,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/update", verifyToken, async (req, res) => {
  try {
    const userId = req.currentUser.userId;

    // throws error if any of the fields are empty
    const { productId, count } = req.body;
    if (!(productId && count)) throw Error("ERR_EMPTY_FIELDS");

    // checks if a product exists with the provided id
    const product = await Product.findById(productId);
    if (!product) throw Error("INVALID_PRODUCT");

    // validates the count sent
    if (typeof count !== "number" || count < 1 || !Number.isInteger(count)) {
      throw new Error("INVALID_COUNT");
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) throw Error("CART_NOT_FOUND");

    const itemToUpdate = cart.items.find(
      (item) => item.productId === productId
    );
    if (!itemToUpdate) {
      throw new Error("ITEM_NOT_FOUND");
    }
    itemToUpdate.count = count;
    await cart.save();

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.delete("/remove", verifyToken, async (req, res) => {
  try {
    const userId = req.currentUser.userId;

    // throws error if any of the fields are empty
    const { productId } = req.body;
    if (!productId) throw Error("ERR_EMPTY_FIELD");

    // checks if a product exists with the provided id
    const product = await Product.findById(productId);
    if (!product) throw Error("INVALID_PRODUCT");

    const cart = await Cart.findOne({ userId });
    if (!cart) throw Error("CART_NOT_FOUND");

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex == -1) {
      throw new Error("ITEM_NOT_FOUND");
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(400).json(error.message);
  }
});


module.exports = router;
