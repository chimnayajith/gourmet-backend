const Product = require("../../models/productsModel");

const restockCancelled = async (order) => {
  try {
    const itemsToRestock = order.items.map((item) => ({
      productId: item.productId,
      shopId: order.shopId,
      count: item.count,
    }));

    const bulkUpdateResults = await Product.bulkWrite(
      itemsToRestock.map((item) => ({
        updateOne: {
          filter: { _id: item.productId, "shops.shopId": item.shopId },
          update: { $inc: { "shops.$.stock": item.count } },
        },
      }))
    );
  } catch (error) {
    throw Error(error.message);
  }
};

module.exports = restockCancelled;
