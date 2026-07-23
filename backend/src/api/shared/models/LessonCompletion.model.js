const mongoose = require('mongoose');
const { LESSON_TRIGGER_TYPE, LESSON_STATUS } = require('../constants/enums');

const { Schema } = mongoose;

/**
 * Backs the Contextual Micro-Learning feature (SRS FR-5, UC-07).
 * One document per (seller, lesson) trigger instance.
 */
const lessonCompletionSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    lessonId: { type: String, required: true }, // e.g. 'introduction-to-selling', 'pricing-basics'
    triggerType: { type: String, enum: LESSON_TRIGGER_TYPE, required: true },
    status: { type: String, enum: LESSON_STATUS, default: 'queued', required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// A given lesson should only be actively queued/tracked once per seller at a time.
lessonCompletionSchema.index({ sellerId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('LessonCompletion', lessonCompletionSchema);
