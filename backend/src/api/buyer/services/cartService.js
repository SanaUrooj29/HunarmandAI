const { Cart, Product } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');

async function getOrCreateCart(buyerId) {
  let cart = await Cart.findOne({ buyerId });
  if (!cart) {
    cart = await Cart.create({ buyerId, items: [] });
  }
  return cart;
}

async function getMyCart(buyerId) {
  return getOrCreateCart(buyerId);
}

async function addItem(buyerId, { productId, quantity = 1 }) {
  const product = await Product.findOne({ _id: productId, approvalStatus: 'approved' });
  if (!product) throw ApiError.notFound('Product not found');
  if (product.stockStatus === 'out_of_stock') {
    throw ApiError.badRequest('This product is currently out of stock');
  }

  const cart = await getOrCreateCart(buyerId);
  const existingItem = cart.items.find((item) => String(item.productId) === String(productId));

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: product._id,
      sellerId: product.sellerId,
      titleSnapshot: product.title,
      priceSnapshot: product.price,
      quantity,
      imageSnapshot: product.images[0],
    });
  }

  await cart.save();
  return cart;
}

async function updateItemQuantity(buyerId, productId, quantity) {
  const cart = await getOrCreateCart(buyerId);
  const item = cart.items.find((i) => String(i.productId) === String(productId));
  if (!item) throw ApiError.notFound('Item not found in cart');

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => String(i.productId) !== String(productId));
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  return cart;
}

async function removeItem(buyerId, productId) {
  const cart = await getOrCreateCart(buyerId);
  cart.items = cart.items.filter((i) => String(i.productId) !== String(productId));
  await cart.save();
  return cart;
}

async function clearCart(buyerId) {
  const cart = await getOrCreateCart(buyerId);
  cart.items = [];
  await cart.save();
  return cart;
}

module.exports = { getMyCart, addItem, updateItemQuantity, removeItem, clearCart, getOrCreateCart };
