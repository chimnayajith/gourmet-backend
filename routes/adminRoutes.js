const express = require("express");
const router = express.Router();
const Products = require("../models/productsModel");
const verifyAdmin = require("../middleware/auth");

router.post("/products/create", verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      discount,
      quantity,
      stock,
      variations,
      media,
    } = req.body;

    if (
      !(
        name &&
        brand &&
        category &&
        description &&
        price &&
        discount &&
        quantity &&
        stock &&
        variations &&
        media
      )
    ) {
      throw Error("ERR_EMPTY_FIELDS");
    }

    const newProduct = new Products({
      name,
      brand,
      category,
      description,
      price,
      discount,
      quantity,
      stock,
      variations,
      media,
    });

    const createdProduct = newProduct.save();
    l;
    res.status(200).json(createdProduct);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/products/:id/update", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    const {
      name,
      brand,
      category,
      description,
      price,
      discount,
      quantity,
      stock,
      variations,
      media,
    } = req.body;

    const updatedFields = {
      ...(name && { name }),
      ...(brand && { brand }),
      ...(category && { category }),
      ...(description && { description }),
      ...(price && { price }),
      ...(discount && { discount }),
      ...(quantity && { quantity }),
      ...(stock && { stock }),
      ...(variations && { variations }),
      ...(media && { media }),
    };

    const updatedProduct = await Products.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: updatedFields,
      }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(200).json(error);
  }
});

router.delete("/products/:id/delete", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Products.findOneAndDelete({
      _id: id,
    });

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
