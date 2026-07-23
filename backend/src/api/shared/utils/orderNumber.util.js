const crypto = require('crypto');

/**
 * Human-readable, sortable order number: HMD-YYMMDD-XXXXXX
 * Not used as the primary key (Order._id remains the ObjectId) — purely a
 * customer-facing reference for receipts and support tickets.
 */
function generateOrderNumber() {
  const now = new Date();
  const datePart = [
    String(now.getUTCFullYear()).slice(2),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `HMD-${datePart}-${randomPart}`;
}

module.exports = { generateOrderNumber };
