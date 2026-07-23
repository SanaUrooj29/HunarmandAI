const browseService = require('../services/browseService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const searchProducts = asyncHandler(async (req, res) => {
  const { q, categoryId, minPrice, maxPrice, city, minRating, stockStatus, page = 1, limit = 20 } = req.query;
  const { items, meta } = await browseService.searchProducts({
    q,
    categoryId,
    minPrice,
    maxPrice,
    city,
    minRating,
    stockStatus,
    page,
    limit,
  });
  return sendSuccess(res, { message: 'Products fetched', data: items, meta });
});

const getFeatured = asyncHandler(async (req, res) => {
  const items = await browseService.getFeatured({ limit: req.query.limit });
  return sendSuccess(res, { message: 'Featured products fetched', data: items });
});

const getLatest = asyncHandler(async (req, res) => {
  const items = await browseService.getLatest({ limit: req.query.limit });
  return sendSuccess(res, { message: 'Latest products fetched', data: items });
});

const getPopular = asyncHandler(async (req, res) => {
  const items = await browseService.getPopular({ limit: req.query.limit });
  return sendSuccess(res, { message: 'Popular products fetched', data: items });
});

const getRecommended = asyncHandler(async (req, res) => {
  const items = await browseService.getRecommended({ limit: req.query.limit });
  return sendSuccess(res, { message: 'Recommended products fetched', data: items });
});

const getProductDetail = asyncHandler(async (req, res) => {
  const result = await browseService.getProductDetail(req.params.productId);
  return sendSuccess(res, { message: 'Product fetched', data: result });
});

const getSellerStorefront = asyncHandler(async (req, res) => {
  const result = await browseService.getSellerStorefront(req.params.sellerId);
  return sendSuccess(res, { message: 'Storefront fetched', data: result });
});

module.exports = {
  searchProducts,
  getFeatured,
  getLatest,
  getPopular,
  getRecommended,
  getProductDetail,
  getSellerStorefront,
};
