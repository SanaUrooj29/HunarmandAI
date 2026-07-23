const orderService = require('../services/orderService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const { items, meta } = await orderService.listMyOrders(req.auth.id, { page, limit, status });
  return sendSuccess(res, { message: 'Orders fetched', data: items, meta });
});

const getMyOrderDetail = asyncHandler(async (req, res) => {
  const order = await orderService.getMyOrderDetail(req.auth.id, req.params.orderId);
  return sendSuccess(res, { message: 'Order fetched', data: order });
});

const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelMyOrder(req.auth.id, req.params.orderId, req.body?.reason);
  return sendSuccess(res, { message: 'Order cancelled', data: order });
});

module.exports = { listMyOrders, getMyOrderDetail, cancelMyOrder };
