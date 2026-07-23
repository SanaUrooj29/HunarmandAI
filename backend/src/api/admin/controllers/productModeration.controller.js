const productModerationService = require('../services/productModerationService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, approvalStatus, categoryId, search } = req.query;
  const { items, meta } = await productModerationService.listProducts({ page, limit, approvalStatus, categoryId, search });
  return sendSuccess(res, { message: 'Products fetched', data: items, meta });
});

const getProductDetail = asyncHandler(async (req, res) => {
  const product = await productModerationService.getProductDetail(req.params.productId);
  return sendSuccess(res, { message: 'Product fetched', data: product });
});

const approveProduct = asyncHandler(async (req, res) => {
  const product = await productModerationService.approveProduct(req.params.productId);
  return sendSuccess(res, { message: 'Product approved', data: product });
});

const rejectProduct = asyncHandler(async (req, res) => {
  const product = await productModerationService.rejectProduct(req.params.productId, req.body?.reason);
  return sendSuccess(res, { message: 'Product rejected', data: product });
});

const removeProduct = asyncHandler(async (req, res) => {
  await productModerationService.removeProduct(req.params.productId, req.body?.reason);
  return sendSuccess(res, { message: 'Product removed' });
});

const editProductCategory = asyncHandler(async (req, res) => {
  const product = await productModerationService.editProductCategory(req.params.productId, req.body.categoryId);
  return sendSuccess(res, { message: 'Product category updated', data: product });
});

module.exports = { listProducts, getProductDetail, approveProduct, rejectProduct, removeProduct, editProductCategory };
