const productService = require('../services/productService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const generateAiListing = asyncHandler(async (req, res) => {
  console.log('[product.controller] generateAiListing called for user:', req.auth?.id, 'file present:', Boolean(req.file));
  if (req.file) console.log('[product.controller] uploaded file size (bytes):', req.file.size, 'mimetype:', req.file.mimetype);
  const result = await productService.generateAiListing(req.auth.id, req.file);
  return sendSuccess(res, { message: 'AI listing suggestion generated', data: result });
});

const createProduct = asyncHandler(async (req, res) => {
  console.log('[product.controller] createProduct called for user:', req.auth?.id);
  console.log('[product.controller] Request body:', JSON.stringify(req.body, null, 2));
  console.log('[product.controller] Request body keys:', Object.keys(req.body));
  console.log('[product.controller] images:', req.body.images, 'Type:', Array.isArray(req.body.images) ? 'array' : typeof req.body.images);
  if (Array.isArray(req.body.images)) {
    console.log('[product.controller] images length:', req.body.images.length);
    req.body.images.forEach((img, idx) => {
      console.log(`[product.controller] images[${idx}]:`, img, 'Type:', typeof img);
    });
  }
  const product = await productService.createProduct(req.auth.id, req.body);
  console.log('[product.controller] Product created successfully:', product._id);
  return sendSuccess(res, { statusCode: 201, message: 'Product created and pending review', data: product });
});

const listMyProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, stockStatus, approvalStatus } = req.query;
  const { items, meta } = await productService.listMyProducts(req.auth.id, { page, limit, stockStatus, approvalStatus });
  return sendSuccess(res, { message: 'Products fetched', data: items, meta });
});

const getMyProduct = asyncHandler(async (req, res) => {
  const product = await productService.getMyProduct(req.auth.id, req.params.productId);
  return sendSuccess(res, { message: 'Product fetched', data: product });
});

const updateMyProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateMyProduct(req.auth.id, req.params.productId, req.body);
  return sendSuccess(res, { message: 'Product updated', data: product });
});

const setStockStatus = asyncHandler(async (req, res) => {
  const product = await productService.setStockStatus(req.auth.id, req.params.productId, req.body.stockStatus);
  return sendSuccess(res, { message: 'Stock status updated', data: product });
});

const bulkSetStockStatus = asyncHandler(async (req, res) => {
  const products = await productService.bulkSetStockStatus(req.auth.id, req.body.productIds, req.body.stockStatus);
  return sendSuccess(res, { message: 'Stock status updated in bulk', data: products });
});

const deleteMyProduct = asyncHandler(async (req, res) => {
  await productService.deleteMyProduct(req.auth.id, req.params.productId);
  return sendSuccess(res, { message: 'Product deleted' });
});

module.exports = {
  generateAiListing,
  createProduct,
  listMyProducts,
  getMyProduct,
  updateMyProduct,
  setStockStatus,
  bulkSetStockStatus,
  deleteMyProduct,
};
