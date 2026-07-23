/**
 * Centralized enums used across models, validators, and services.
 * Keeping these in one place avoids magic strings drifting between
 * schema definitions and business logic (see SRS FR-3, FR-4, FR-8).
 */

const ROLES = Object.freeze({
  SELLER: 'seller',
  BUYER: 'buyer',
  ADMIN: 'admin',
});

const GENDER = Object.freeze(['male', 'female', 'other', 'prefer_not_to_say']);

const VERIFICATION_STATUS = Object.freeze(['pending', 'verified', 'suspended']);

const ACCOUNT_STATUS = Object.freeze(['active', 'suspended', 'deleted']);

const WALLET_TRANSACTION_TYPE = Object.freeze(['credit_sale', 'withdrawal', 'deposit', 'adjustment']);

const WALLET_TRANSACTION_STATUS = Object.freeze(['pending', 'completed', 'rejected']);

const PRODUCT_APPROVAL_STATUS = Object.freeze(['pending', 'approved', 'rejected']);

const STOCK_STATUS = Object.freeze(['in_stock', 'out_of_stock']);

// FR-6-03 — full confirmed category taxonomy (top-level; subcategories reference parentCategory)
const TOP_LEVEL_CATEGORIES = Object.freeze([
  'Jewellery',
  'Handicrafts',
  'Food Items (Preservable)',
  'Food Items (Instant Delivery)',
  'Seeds',
  'Vegetables',
  'Fruits',
  'Fragrances',
  'Flowers',
  'Clothing',
  'Stones',
]);

const CLOTHING_SUBCATEGORIES = Object.freeze(['Shawls', 'Kurtas', 'Dresses']);

// FR-3-01 — order status lifecycle
const ORDER_STATUS = Object.freeze([
  'pending',
  'accepted',
  'preparing',
  'shipped',
  'delivered',
  'cancelled',
]);

// Statuses a buyer is permitted to cancel from (FR-3-05: only before seller accepts)
const BUYER_CANCELLABLE_STATUSES = Object.freeze(['pending']);

const PAYMENT_METHOD = Object.freeze(['credit_card', 'jazzcash', 'easypaisa']);

const PAYMENT_STATUS = Object.freeze(['pending', 'paid', 'failed', 'refunded']);

const CANCELLED_BY = Object.freeze(['buyer', 'seller', 'system']);

const SENDER_TYPE = Object.freeze(['buyer', 'seller']);

const REVIEW_MODERATION_STATUS = Object.freeze(['visible', 'hidden', 'removed']);

const NOTIFICATION_RECIPIENT_TYPE = Object.freeze(['buyer', 'seller', 'admin']);

const NOTIFICATION_RELATED_ENTITY_TYPE = Object.freeze([
  'order', 'product', 'review', 'message', 'withdrawal', 'report', 'support_ticket',
]);

const REPORT_TARGET_TYPE = Object.freeze(['product', 'user', 'review', 'message']);

const REPORT_STATUS = Object.freeze(['open', 'reviewed', 'dismissed', 'actioned']);

const SUPPORT_TICKET_STATUS = Object.freeze(['open', 'in_progress', 'resolved', 'closed']);

// FR-5 — micro-learning
const LESSON_TRIGGER_TYPE = Object.freeze(['first_product_published', 'underpricing_detected']);
const LESSON_STATUS = Object.freeze(['queued', 'viewed', 'completed', 'dismissed']);

const ADMIN_ROLE = Object.freeze(['super_admin', 'admin', 'moderator']);

module.exports = {
  ROLES,
  GENDER,
  VERIFICATION_STATUS,
  ACCOUNT_STATUS,
  WALLET_TRANSACTION_TYPE,
  WALLET_TRANSACTION_STATUS,
  PRODUCT_APPROVAL_STATUS,
  STOCK_STATUS,
  TOP_LEVEL_CATEGORIES,
  CLOTHING_SUBCATEGORIES,
  ORDER_STATUS,
  BUYER_CANCELLABLE_STATUSES,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  CANCELLED_BY,
  SENDER_TYPE,
  REVIEW_MODERATION_STATUS,
  NOTIFICATION_RECIPIENT_TYPE,
  NOTIFICATION_RELATED_ENTITY_TYPE,
  REPORT_TARGET_TYPE,
  REPORT_STATUS,
  SUPPORT_TICKET_STATUS,
  LESSON_TRIGGER_TYPE,
  LESSON_STATUS,
  ADMIN_ROLE,
};
