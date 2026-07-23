/**
 * Central export point for every Mongoose model in the system.
 * Import from here (e.g. `const { Product, Order } = require('.../shared/models');`)
 * rather than reaching into individual files, so registration order is
 * always consistent and circular-ref issues (e.g. Product <-> Category)
 * are avoided.
 */

module.exports = {
  Seller: require('./Seller.model'),
  Buyer: require('./Buyer.model'),
  Admin: require('./Admin.model'),
  Category: require('./Category.model'),
  Product: require('./Product.model'),
  Cart: require('./Cart.model'),
  Order: require('./Order.model'),
  WalletTransaction: require('./WalletTransaction.model'),
  Conversation: require('./Conversation.model'),
  Message: require('./Message.model'),
  Review: require('./Review.model'),
  Notification: require('./Notification.model'),
  Report: require('./Report.model'),
  SupportTicket: require('./SupportTicket.model'),
  LessonCompletion: require('./LessonCompletion.model'),
  PlatformSettings: require('./PlatformSettings.model'),
};
