const { WalletTransaction, Seller } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');
const notificationService = require('../../shared/services/notificationService');

async function listTransactions({ page = 1, limit = 20, status, type, sellerId } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (sellerId) filter.sellerId = sellerId;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    WalletTransaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    WalletTransaction.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function listPendingWithdrawals({ page = 1, limit = 20 } = {}) {
  return listTransactions({ page, limit, status: 'pending', type: 'withdrawal' });
}

/**
 * FR-4-03 / Phase 6 walletService — funds were already reserved (deducted
 * from availableBalance) at request time when manualApprovalRequired is
 * on. Approval here just finalizes the transaction; the money has nowhere
 * else to go.
 */
async function approveWithdrawal(transactionId, adminId) {
  const transaction = await WalletTransaction.findOne({ _id: transactionId, type: 'withdrawal', status: 'pending' });
  if (!transaction) throw ApiError.notFound('Pending withdrawal request not found');

  transaction.status = 'completed';
  transaction.paymentDate = new Date();
  transaction.adminApprovedBy = adminId;
  await transaction.save();

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: transaction.sellerId,
    type: 'wallet_withdrawal_completed',
    title: 'Withdrawal approved',
    body: `Your withdrawal of PKR ${transaction.amount} has been approved and sent.`,
    relatedEntity: { type: 'withdrawal', id: transaction._id },
  });
  return transaction;
}

/** Rejecting a withdrawal must return the reserved funds to the seller's available balance. */
async function rejectWithdrawal(transactionId, adminId, reason) {
  const transaction = await WalletTransaction.findOne({ _id: transactionId, type: 'withdrawal', status: 'pending' });
  if (!transaction) throw ApiError.notFound('Pending withdrawal request not found');

  transaction.status = 'rejected';
  transaction.adminApprovedBy = adminId;
  await transaction.save();

  const seller = await Seller.findById(transaction.sellerId);
  if (seller) {
    seller.wallet.availableBalance += transaction.amount;
    await seller.save();
  }

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: transaction.sellerId,
    type: 'wallet_withdrawal_rejected',
    title: 'Withdrawal request rejected',
    body: reason || 'Your withdrawal request could not be processed. Funds have been returned to your balance.',
    relatedEntity: { type: 'withdrawal', id: transaction._id },
  });
  return transaction;
}

module.exports = { listTransactions, listPendingWithdrawals, approveWithdrawal, rejectWithdrawal };
