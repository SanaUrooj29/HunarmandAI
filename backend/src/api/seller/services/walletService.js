const { Seller, WalletTransaction, PlatformSettings } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');
const notificationService = require('../../shared/services/notificationService');

async function getPlatformWalletSettings() {
  const settings = await PlatformSettings.findOne().lean();
  return (
    settings?.walletSettings || {
      minWithdrawalAmount: 500,
      requiredSuccessfulSalesForWithdrawal: 2,
      manualApprovalRequired: false,
    }
  );
}

async function getMyWallet(sellerId) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');
  return seller.wallet;
}

async function listMyTransactions(sellerId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    WalletTransaction.find({ sellerId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    WalletTransaction.countDocuments({ sellerId }),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

/**
 * FR-4-04 / UC-02 Exception E1 — withdrawal is only permitted once the
 * seller has completed at least two successful (delivered) sales. Funds
 * are reserved immediately on request; if manual approval is required
 * (platformSettings.walletSettings.manualApprovalRequired), the admin
 * approval/rejection flow (Phase 8) finalizes or reverses the reservation.
 */
async function requestWithdrawal(sellerId, amount) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');

  const walletSettings = await getPlatformWalletSettings();

  if (!seller.wallet.withdrawalEnabled || seller.wallet.completedSalesCount < walletSettings.requiredSuccessfulSalesForWithdrawal) {
    const remaining = Math.max(0, walletSettings.requiredSuccessfulSalesForWithdrawal - seller.wallet.completedSalesCount);
    throw ApiError.forbidden(
      `Withdrawals are enabled after ${walletSettings.requiredSuccessfulSalesForWithdrawal} successful sales. You need ${remaining} more.`,
      { code: 'WITHDRAWAL_NOT_ELIGIBLE' }
    );
  }

  if (amount < walletSettings.minWithdrawalAmount) {
    throw ApiError.badRequest(`Minimum withdrawal amount is PKR ${walletSettings.minWithdrawalAmount}`);
  }

  if (amount > seller.wallet.availableBalance) {
    throw ApiError.badRequest('Requested withdrawal amount exceeds available balance');
  }

  // Reserve funds immediately — moved out of availableBalance so the same
  // funds can't be withdrawn twice while a request is pending approval.
  seller.wallet.availableBalance -= amount;
  await seller.save();

  const status = walletSettings.manualApprovalRequired ? 'pending' : 'completed';
  const transaction = await WalletTransaction.create({
    sellerId,
    type: 'withdrawal',
    amount,
    status,
    paymentDate: status === 'completed' ? new Date() : undefined,
  });

  if (walletSettings.manualApprovalRequired) {
    await notificationService.notify({
      recipientType: 'seller',
      recipientId: sellerId,
      type: 'withdrawal_requested',
      title: 'Withdrawal request submitted',
      body: `Your request for PKR ${amount} is pending admin approval.`,
      relatedEntity: { type: 'withdrawal', id: transaction._id },
    });
  } else {
    await notificationService.notify({
      recipientType: 'seller',
      recipientId: sellerId,
      type: 'wallet_withdrawal_completed',
      title: 'Withdrawal completed',
      body: `PKR ${amount} has been sent to your linked account.`,
      relatedEntity: { type: 'withdrawal', id: transaction._id },
    });
  }

  return transaction;
}

module.exports = { getMyWallet, listMyTransactions, requestWithdrawal };
