const mongoose = require('mongoose');
const { SENDER_TYPE } = require('../constants/enums');

const { Schema } = mongoose;

/**
 * Separate from Conversation deliberately — unbounded growth per thread
 * would risk the 16MB embedded-document limit and blocks efficient
 * infinite-scroll pagination if embedded (ERD §5.2).
 */
const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderType: { type: String, enum: SENDER_TYPE, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true },

    text: { type: String, maxlength: 2000 },
    imageUrl: { type: String },

    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.pre('validate', function guardAtLeastOnePayload(next) {
  if (!this.text && !this.imageUrl) {
    return next(new Error('A message must contain text or an image'));
  }
  return next();
});

messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
