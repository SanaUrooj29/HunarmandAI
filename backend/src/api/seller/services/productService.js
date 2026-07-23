const { Product, Order, Seller } = require('../../shared/models');
const categoryService = require('../../shared/services/categoryService');
const uploadService = require('../../shared/services/uploadService');
const aiVisionService = require('../../shared/services/aiVisionService');
const learningService = require('./learningService');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');

/** Fields whose edit is material enough to require re-approval (UC-04 Exception E2). */
const RE_REVIEW_TRIGGER_FIELDS = ['title', 'description', 'categoryId', 'images'];

async function assertProfileComplete(sellerId) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');
  if (!seller.profileComplete) {
    throw ApiError.forbidden('Please complete your seller profile before listing products', {
      code: 'PROFILE_INCOMPLETE',
    });
  }
}

/**
 * UC-03 Main Flow steps 1-5 — uploads the photo and returns an AI-generated
 * listing suggestion for the seller to review/edit. Does NOT create a
 * product yet; that happens via createProduct() once the seller confirms
 * (Main Flow steps 6-8).
 */
async function generateAiListing(sellerId, file) {
  await assertProfileComplete(sellerId);

  console.log('[productService] generateAiListing: sellerId=', sellerId, 'file present=', Boolean(file));
  if (file) console.log('[productService] file size bytes=', file.size, 'mimetype=', file.mimetype);

  const { url } = await uploadService.uploadImage(file, 'products');

  try {
    const suggestion = await aiVisionService.generateListingFromImage(file.buffer);
    console.log('[productService] aiVisionService returned suggestion');
    return { imageUrl: url, suggestion };
  } catch (err) {
    console.error('[productService] aiVisionService error:', err.message || err);
    // UC-03 Exception E1 — AI failure falls back to manual entry; the
    // image is still usable, just without AI-generated fields.
    return { imageUrl: url, suggestion: null, aiError: err.message };
  }
}

function toPublicShape(product) {
  return product;
}

/**
 * UC-03 Main Flow steps 6-8 — creates the actual product listing, always
 * starting at approvalStatus 'pending' (FR-2-06). Triggers the first-
 * product micro-learning lesson and the underpricing check (FR-5).
 */
async function createProduct(sellerId, data) {
  await assertProfileComplete(sellerId);
  const category = await categoryService.assertExistsAndActive(data.categoryId);
  const seller = await Seller.findById(sellerId);

  const product = await Product.create({
    sellerId,
    categoryId: data.categoryId,
    categoryNameSnapshot: category.name,
    sellerCitySnapshot: seller.city,
    title: data.title,
    description: data.description,
    isAiGenerated: Boolean(data.isAiGenerated),
    images: data.images,
    videoUrl: data.videoUrl,
    price: data.price,
    quantity: data.quantity ?? 0,
    stockStatus: data.stockStatus || 'in_stock',
    tags: data.tags || [],
    approvalStatus: 'pending',
  });

  await learningService.triggerFirstProductLessonIfApplicable(sellerId);
  await learningService.checkUnderpricingAndTrigger(sellerId, data.categoryId, data.price);

  return toPublicShape(product);
}

async function listMyProducts(sellerId, { page = 1, limit = 20, stockStatus, approvalStatus } = {}) {
  const filter = { sellerId };
  if (stockStatus) filter.stockStatus = stockStatus;
  if (approvalStatus) filter.approvalStatus = approvalStatus;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function getMyProduct(sellerId, productId) {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

async function updateMyProduct(sellerId, productId, updates) {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw ApiError.notFound('Product not found');

  if (updates.categoryId) {
    const category = await categoryService.assertExistsAndActive(updates.categoryId);
    product.categoryId = updates.categoryId;
    product.categoryNameSnapshot = category.name;
  }

  const editableFields = ['title', 'description', 'images', 'videoUrl', 'price', 'quantity', 'tags'];
  let materialChange = false;
  editableFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (RE_REVIEW_TRIGGER_FIELDS.includes(field) && JSON.stringify(product[field]) !== JSON.stringify(updates[field])) {
        materialChange = true;
      }
      product[field] = updates[field];
    }
  });

  // UC-04 Exception E2 — a materially edited, previously-approved listing
  // is flagged for re-review rather than silently staying live with
  // unreviewed content.
  if (materialChange && product.approvalStatus === 'approved') {
    product.approvalStatus = 'pending';
  }

  await product.save();
  return product;
}

async function setStockStatus(sellerId, productId, stockStatus) {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw ApiError.notFound('Product not found');
  product.stockStatus = stockStatus;
  await product.save();
  return product;
}

/** UC-04 Alt Flow A1 — bulk stock update, e.g. before travel. */
async function bulkSetStockStatus(sellerId, productIds, stockStatus) {
  await Product.updateMany({ _id: { $in: productIds }, sellerId }, { stockStatus });
  return Product.find({ _id: { $in: productIds }, sellerId }).lean();
}

/** UC-04 Exception E1 — deletion is blocked while the product has open orders. */
async function deleteMyProduct(sellerId, productId) {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw ApiError.notFound('Product not found');

  const openOrder = await Order.findOne({
    sellerId,
    'items.productId': productId,
    status: { $nin: ['delivered', 'cancelled'] },
  });
  if (openOrder) {
    throw ApiError.conflict('Cannot delete a product with open orders. Resolve open orders first.', {
      code: 'PRODUCT_HAS_OPEN_ORDERS',
    });
  }

  await Product.deleteOne({ _id: productId, sellerId });
}

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
