const { Report } = require('../models');
const { ApiError } = require('../utils/apiError.util');

/**
 * Single entry point for filing a report, used by both buyer and seller
 * panels. A report only ever *queues* something for admin review (4.8/4.11)
 * — it never unilaterally hides or removes content itself, since that
 * would let any user censor content just by reporting it.
 */
async function fileReport({ reporterType, reporterId, targetType, targetId, reason }) {
  const existing = await Report.findOne({ reporterType, reporterId, targetType, targetId, status: 'open' });
  if (existing) {
    throw ApiError.conflict('You have already reported this item and it is pending review');
  }
  return Report.create({ reporterType, reporterId, targetType, targetId, reason });
}

module.exports = { fileReport };
