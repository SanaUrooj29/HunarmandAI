const { Notification } = require('../models');
const { NOTIFICATION_RECIPIENT_TYPE } = require('../constants/enums');
const { ApiError } = require('../utils/apiError.util');

/**
 * Thin wrapper over the polymorphic Notification collection. Every panel
 * service (order, wallet, moderation, etc.) calls notify() rather than
 * touching the Notification model directly, keeping the polymorphic
 * recipientType/relatedEntity shape in one place.
 */
async function notify({ recipientType, recipientId, type, title, body, relatedEntity, isBroadcast = false }) {
  if (!NOTIFICATION_RECIPIENT_TYPE.includes(recipientType)) {
    throw ApiError.badRequest(`Invalid recipientType "${recipientType}"`);
  }
  return Notification.create({
    recipientType,
    recipientId,
    type,
    title,
    body,
    relatedEntity,
    isBroadcast,
  });
}

/** Fan-out helper for admin broadcasts (FR-8 / SRS 4.10 Notifications Management). */
async function broadcast({ recipientType, recipientIds, type, title, body }) {
  const docs = recipientIds.map((recipientId) => ({
    recipientType,
    recipientId,
    type,
    title,
    body,
    isBroadcast: true,
  }));
  return Notification.insertMany(docs);
}

async function listForRecipient({ recipientType, recipientId, page = 1, limit = 20, unreadOnly = false }) {
  const filter = { recipientType, recipientId };
  if (unreadOnly) filter.isRead = false;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(filter),
  ]);
  return { items, total };
}

async function markRead({ notificationId, recipientId }) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipientId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw ApiError.notFound('Notification not found');
  return notification;
}

async function markAllRead({ recipientType, recipientId }) {
  await Notification.updateMany({ recipientType, recipientId, isRead: false }, { isRead: true });
}

module.exports = { notify, broadcast, listForRecipient, markRead, markAllRead };
