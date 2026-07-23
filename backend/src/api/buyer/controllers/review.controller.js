const reviewService = require('../services/reviewService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.auth.id, req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Review submitted', data: review });
});

const editReview = asyncHandler(async (req, res) => {
  const review = await reviewService.editReview(req.auth.id, req.params.reviewId, req.body);
  return sendSuccess(res, { message: 'Review updated', data: review });
});

const listForProduct = asyncHandler(async (req, res) => {
  const reviews = await reviewService.listForProduct(req.params.productId);
  return sendSuccess(res, { message: 'Reviews fetched', data: reviews });
});

const reportReview = asyncHandler(async (req, res) => {
  const report = await reviewService.reportReview(req.auth.id, req.params.reviewId, req.body?.reason);
  return sendSuccess(res, { statusCode: 201, message: 'Review reported for admin review', data: report });
});

module.exports = { createReview, editReview, listForProduct, reportReview };
