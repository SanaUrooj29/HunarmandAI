const { Seller, Buyer } = require('../../shared/models');
const notificationService = require('../../shared/services/notificationService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

/** 4.10 — broadcast to all / sellers only / buyers only. */
const broadcast = asyncHandler(async (req, res) => {
  const { audience, title, body } = req.body; // audience: 'all' | 'sellers' | 'buyers'

  let recipientIds = [];
  if (audience === 'sellers' || audience === 'all') {
    const sellers = await Seller.find({ accountStatus: 'active' }).select('_id').lean();
    const sent = await notificationService.broadcast({
      recipientType: 'seller',
      recipientIds: sellers.map((s) => s._id),
      type: 'admin_announcement',
      title,
      body,
    });
    recipientIds = recipientIds.concat(sent.map((n) => n._id));
  }
  if (audience === 'buyers' || audience === 'all') {
    const buyers = await Buyer.find({ accountStatus: 'active' }).select('_id').lean();
    const sent = await notificationService.broadcast({
      recipientType: 'buyer',
      recipientIds: buyers.map((b) => b._id),
      type: 'admin_announcement',
      title,
      body,
    });
    recipientIds = recipientIds.concat(sent.map((n) => n._id));
  }

  return sendSuccess(res, { statusCode: 201, message: `Broadcast sent to ${recipientIds.length} recipient(s)`, data: { count: recipientIds.length } });
});

module.exports = { broadcast };
