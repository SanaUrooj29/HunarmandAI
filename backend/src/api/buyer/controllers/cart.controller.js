const cartService = require('../services/cartService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const getMyCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getMyCart(req.auth.id);
  return sendSuccess(res, { message: 'Cart fetched', data: cart });
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.auth.id, req.body);
  return sendSuccess(res, { message: 'Item added to cart', data: cart });
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(req.auth.id, req.params.productId, req.body.quantity);
  return sendSuccess(res, { message: 'Cart updated', data: cart });
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.auth.id, req.params.productId);
  return sendSuccess(res, { message: 'Item removed from cart', data: cart });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.auth.id);
  return sendSuccess(res, { message: 'Cart cleared', data: cart });
});

module.exports = { getMyCart, addItem, updateItemQuantity, removeItem, clearCart };
