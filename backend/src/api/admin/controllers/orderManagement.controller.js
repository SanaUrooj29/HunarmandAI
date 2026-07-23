const orderManagementService = require('../services/orderManagementService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, buyerId, sellerId, orderNumber } = req.query;
  const { items, meta } = await orderManagementService.listOrders({ page, limit, status, buyerId, sellerId, orderNumber });
  return sendSuccess(res, { message: 'Orders fetched', data: items, meta });
});

const getOrderDetail = asyncHandler(async (req, res) => {
  const order = await orderManagementService.getOrderDetail(req.params.orderId);
  return sendSuccess(res, { message: 'Order fetched', data: order });
});

const resolveDispute = asyncHandler(async (req, res) => {
  const order = await orderManagementService.resolveDisputeByCancelling(req.params.orderId, req.body?.reason);
  return sendSuccess(res, { message: 'Dispute resolved — order cancelled', data: order });
});

const resolveDisputeInSellerFavor = asyncHandler(async (req, res) => {
  const order = await orderManagementService.resolveDisputeByDelivering(req.params.orderId, req.body?.note);
  return sendSuccess(res, { message: 'Dispute resolved — order marked delivered', data: order });
});

module.exports = { listOrders, getOrderDetail, resolveDispute, resolveDisputeInSellerFavor };
