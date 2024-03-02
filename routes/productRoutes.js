const express = require("express");
const router = express.Router();
const Products = require("../models/productsModel");

// endpoint to retrieve all products
router.get("/", async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Products.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
