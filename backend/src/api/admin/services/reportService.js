const { Report, Review, Product, Seller, Buyer } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');
const { recalculateAggregateRatings } = require('../../shared/services/ratingAggregationService');

async function listReports({ page = 1, limit = 20, status, targetType } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (targetType) filter.targetType = targetType;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Report.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function getReportDetail(reportId) {
  const report = await Report.findById(reportId);
  if (!report) throw ApiError.notFound('Report not found');
  return report;
}

/** 4.8/4.11 — mark a report reviewed with a resolution outcome, optionally
 * actioning the underlying target (e.g. removing a review). */
async function resolveReport(reportId, adminId, { outcome, resolutionNote, actionTarget }) {
  const report = await Report.findById(reportId);
  if (!report) throw ApiError.notFound('Report not found');

  report.status = outcome; // 'reviewed' | 'dismissed' | 'actioned'
  report.reviewedBy = adminId;
  report.resolutionNote = resolutionNote;
  await report.save();

  if (outcome === 'actioned' && actionTarget !== false) {
    await actionTargetEntity(report);
  }
  return report;
}

async function actionTargetEntity(report) {
  if (report.targetType === 'review') {
    const review = await Review.findById(report.targetId);
    if (review) {
      review.moderationStatus = 'removed';
      await review.save();
      await recalculateAggregateRatings(review.sellerId, review.productId);
    }
  } else if (report.targetType === 'product') {
    await Product.deleteOne({ _id: report.targetId });
  } else if (report.targetType === 'user') {
    // targetId could be either a seller or a buyer — try both.
    const seller = await Seller.findById(report.targetId);
    if (seller) {
      seller.accountStatus = 'suspended';
      await seller.save();
      return;
    }
    const buyer = await Buyer.findById(report.targetId);
    if (buyer) {
      buyer.accountStatus = 'suspended';
      await buyer.save();
    }
  }
  // 'message' targets have no direct moderation action beyond the report record itself at MVP.
}

module.exports = { listReports, getReportDetail, resolveReport };
