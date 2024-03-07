const groupShops = async (items) => {
  const itemsByShop = new Map();
  for (const item of items) {
    const shopId = item.productId.shop.toString();
    if (!itemsByShop.has(shopId)) {
      itemsByShop.set(shopId, []);
    }
    itemsByShop.get(shopId).push(item);
  }

  return itemsByShop;
};

module.exports = groupShops;
