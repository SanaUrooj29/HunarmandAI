const mongoose = require('mongoose');
const { NOTIFICATION_RECIPIENT_TYPE, NOTIFICATION_RELATED_ENTITY_TYPE } = require('../constants/enums');

const { Schema } = mongoose;

// 1:1 with notification — a small tag/pointer pair, embedded rather than referenced.
const relatedEntitySchema = new Schema(
  {
    type: { type: String, enum: NOTIFICATION_RELATED_ENTITY_TYPE },
    id: { type: Schema.Types.ObjectId },
  },
  { _id: false }
);

const notificationSchema = new Schema(
  {
    // Polymorphic pointer — recipientId's collection depends on recipientType.
    // No fixed `ref`, resolved at read-time by notificationService.
    recipientType: { type: String, enum: NOTIFICATION_RECIPIENT_TYPE, required: true },
    recipientId: { type: Schema.Types.ObjectId, required: true },

    type: { type: String, required: true }, // e.g. 'new_order', 'low_stock', 'payment_received'
    title: { type: String, required: true },
    body: { type: String },

    relatedEntity: { type: relatedEntitySchema },

    isRead: { type: Boolean, default: false },
    isBroadcast: { type: Boolean, default: false }, // true for admin-originated announcements
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ recipientType: 1, recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
