const { Product } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');
const notificationService = require('../../shared/services/notificationService');

async function listProducts({ page = 1, limit = 20, approvalStatus, categoryId, search } = {}) {
  const filter = {};
  if (approvalStatus) filter.approvalStatus = approvalStatus;
  if (categoryId) filter.categoryId = categoryId;
  if (search) filter.title = new RegExp(search, 'i');

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function getProductDetail(productId) {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

/** FR-8-02/03 — approve a pending listing, making it live on the buyer marketplace. */
async function approveProduct(productId) {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  product.approvalStatus = 'approved';
  product.rejectionReason = undefined;
  await product.save();

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: product.sellerId,
    type: 'product_approved',
    title: `Your listing "${product.title}" was approved`,
    relatedEntity: { type: 'product', id: product._id },
  });
  return product;
}

async function rejectProduct(productId, reason) {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  product.approvalStatus = 'rejected';
  product.rejectionReason = reason;
  await product.save();

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: product.sellerId,
    type: 'product_rejected',
    title: `Your listing "${product.title}" was rejected`,
    body: reason,
    relatedEntity: { type: 'product', id: product._id },
  });
  return product;
}

/** 4.4 — remove an inappropriate product (e.g. after a report is actioned). */
async function removeProduct(productId, reason) {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: product.sellerId,
    type: 'product_removed',
    title: `Your listing "${product.title}" was removed`,
    body: reason,
    relatedEntity: { type: 'product', id: product._id },
  });
  await Product.deleteOne({ _id: productId });
}

async function editProductCategory(productId, categoryId) {
  const { Category } = require('../../shared/models');
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');
  const category = await Category.findById(categoryId);
  if (!category) throw ApiError.notFound('Category not found');

  product.categoryId = categoryId;
  product.categoryNameSnapshot = category.name;
  await product.save();
  return product;
}

module.exports = { listProducts, getProductDetail, approveProduct, rejectProduct, removeProduct, editProductCategory };
