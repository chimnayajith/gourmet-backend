const Order = require("../../models/orderModel");
const Product = require("../../models/productsModel");

const addOrders = async (itemsByShop, user) => {
  const orders = [];

  for (const [shopId, items] of itemsByShop.entries()) {
    const orderItems = items.map((item) => ({
      productId: item.productId,
      count: item.count,
    }));
    const amount = await calculateAmount(orderItems);

    const newOrder = new Order({
      userId: user._id,
      shopId: shopId,
      orderDate: Date.now(),
      items: orderItems,
      totalAmount: amount,
      shippingAddress: user.address,
    });

    orders.push(await newOrder.save());
  }

  return orders;
};

const calculateAmount = async (orderItems) => {
  const amount = 0;
  orderItems.forEach(async (item) => {
    const product = await Product.findById(item.productId);
    amount += product.price * ((100 - discount) / 100) * item.count;
  });
};
module.exports = addOrders;
