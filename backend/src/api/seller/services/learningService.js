const { LessonCompletion, Product } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const notificationService = require('../../shared/services/notificationService');

const LESSON_LIBRARY = Object.freeze({
  'introduction-to-selling': {
    titleEnglish: 'Introduction to Selling',
    titleUrdu: 'فروخت کا تعارف',
    triggerType: 'first_product_published',
  },
  'pricing-basics': {
    titleEnglish: 'Pricing Basics',
    titleUrdu: 'قیمت کے بنیادی اصول',
    triggerType: 'underpricing_detected',
  },
});

/**
 * FR-5-01/02, UC-07 Alt Flow A1 — a dismissed lesson is not re-triggered
 * for 30 days. Re-queuing an already-queued/viewed lesson is a no-op
 * (unique index on sellerId+lessonId means this is an upsert).
 */
async function triggerLesson(sellerId, lessonId) {
  const meta = LESSON_LIBRARY[lessonId];
  if (!meta) throw ApiError.badRequest(`Unknown lesson "${lessonId}"`);

  const existing = await LessonCompletion.findOne({ sellerId, lessonId });
  if (existing) {
    if (existing.status === 'dismissed') {
      const daysSinceDismissed = (Date.now() - existing.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 30) return existing; // still within the 30-day cooldown
      existing.status = 'queued';
      await existing.save();
    }
    return existing;
  }

  const completion = await LessonCompletion.create({
    sellerId,
    lessonId,
    triggerType: meta.triggerType,
    status: 'queued',
  });

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: sellerId,
    type: 'lesson_available',
    title: `New lesson: ${meta.titleEnglish}`,
    relatedEntity: { type: 'product', id: null },
  });

  return completion;
}

/** FR-5-01 — fired the moment a seller's first product is published. */
async function triggerFirstProductLessonIfApplicable(sellerId) {
  const publishedCount = await Product.countDocuments({ sellerId });
  if (publishedCount === 1) {
    await triggerLesson(sellerId, 'introduction-to-selling');
  }
}

/**
 * FR-5-02 — triggered when a seller's price is materially below the
 * category median for comparable listings. "Materially" defined as more
 * than 30% below median, a tunable threshold.
 */
const UNDERPRICING_THRESHOLD_RATIO = 0.7;

async function checkUnderpricingAndTrigger(sellerId, categoryId, price) {
  const comparable = await Product.find({ categoryId, approvalStatus: 'approved' }).select('price').lean();
  if (comparable.length < 3) return; // not enough data for a meaningful median

  const prices = comparable.map((p) => p.price).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];

  if (price < median * UNDERPRICING_THRESHOLD_RATIO) {
    await triggerLesson(sellerId, 'pricing-basics');
  }
}

async function listMyLessons(sellerId) {
  return LessonCompletion.find({ sellerId }).sort({ createdAt: -1 }).lean();
}

async function updateLessonStatus(sellerId, lessonId, status) {
  const completion = await LessonCompletion.findOne({ sellerId, lessonId });
  if (!completion) throw ApiError.notFound('Lesson not found for this seller');

  completion.status = status;
  if (status === 'completed') completion.completedAt = new Date();
  await completion.save();
  return completion;
}

module.exports = {
  LESSON_LIBRARY,
  triggerLesson,
  triggerFirstProductLessonIfApplicable,
  checkUnderpricingAndTrigger,
  listMyLessons,
  updateLessonStatus,
};
