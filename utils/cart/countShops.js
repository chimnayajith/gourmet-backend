const Product = require("../../models/productsModel");

const countShops = async (items) => {
  const uniqueShops = new Set();

  items.forEach(async (item) => {
    const product = await Product.findOne({
      _id: item.productId,
    });

    if (product) {
      uniqueShops.add(product.shop);
    }
  });

  return uniqueShops.size;
};

module.exports = countShops;
