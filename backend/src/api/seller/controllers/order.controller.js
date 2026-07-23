const orderService = require('../services/orderService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const { items, meta } = await orderService.listMyOrders(req.auth.id, { page, limit, status });
  return sendSuccess(res, { message: 'Orders fetched', data: items, meta });
});

const getMyOrderDetail = asyncHandler(async (req, res) => {
  const result = await orderService.getMyOrderDetail(req.auth.id, req.params.orderId);
  return sendSuccess(res, { message: 'Order fetched', data: result });
});

const acceptOrder = asyncHandler(async (req, res) => {
  const order = await orderService.acceptOrder(req.auth.id, req.params.orderId);
  return sendSuccess(res, { message: 'Order accepted', data: order });
});

const rejectOrder = asyncHandler(async (req, res) => {
  const order = await orderService.rejectOrder(req.auth.id, req.params.orderId, req.body.reason);
  return sendSuccess(res, { message: 'Order rejected', data: order });
});

const advanceStatus = asyncHandler(async (req, res) => {
  const { nextStatus, note, courierName, trackingReference } = req.body;
  const order = await orderService.advanceStatus(req.auth.id, req.params.orderId, nextStatus, {
    note,
    courierName,
    trackingReference,
  });
  return sendSuccess(res, { message: `Order marked as ${nextStatus}`, data: order });
});

module.exports = { listMyOrders, getMyOrderDetail, acceptOrder, rejectOrder, advanceStatus };
