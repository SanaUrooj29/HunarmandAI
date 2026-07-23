const walletManagementService = require('../services/walletManagementService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type, sellerId } = req.query;
  const { items, meta } = await walletManagementService.listTransactions({ page, limit, status, type, sellerId });
  return sendSuccess(res, { message: 'Transactions fetched', data: items, meta });
});

const listPendingWithdrawals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { items, meta } = await walletManagementService.listPendingWithdrawals({ page, limit });
  return sendSuccess(res, { message: 'Pending withdrawals fetched', data: items, meta });
});

const approveWithdrawal = asyncHandler(async (req, res) => {
  const transaction = await walletManagementService.approveWithdrawal(req.params.transactionId, req.auth.id);
  return sendSuccess(res, { message: 'Withdrawal approved', data: transaction });
});

const rejectWithdrawal = asyncHandler(async (req, res) => {
  const transaction = await walletManagementService.rejectWithdrawal(req.params.transactionId, req.auth.id, req.body?.reason);
  return sendSuccess(res, { message: 'Withdrawal rejected', data: transaction });
});

module.exports = { listTransactions, listPendingWithdrawals, approveWithdrawal, rejectWithdrawal };
